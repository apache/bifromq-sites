---
title: "Lua API"
description: "Tenon Lua events, payload access, Builders, routing, timers, and limits."
mdx:
  format: md
---

<!--
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
-->

# Lua API

A Flow embeds UTF-8 Lua 5.5 source in `process.script` and defines `function main(event)`. ASCII identifiers and normal Lua 5.5 declarations are supported; strings and comments may contain Unicode. `specVersion` selects the language/API contract.

## Script lifecycle

1. Tenon Document validation compiles the script without running it.
2. With Source and Sink contracts resolved, each channel runs top-level initialization once.
3. That channel calls `main` for one Source or timer event at a time.

Channels have independent state and can execute concurrently. After initialization, `main` and built-in globals are read-only; your own globals and closure state remain mutable.

## Events and payloads

A Source event has `type = "source"`, a timestamp and `payload`. A timer event has `type = "timer"`, a timestamp and no payload. Events and nested payload values are deeply read-only; modifying them is a sandbox violation.

`event.timestamp` is a monotonic integer millisecond count since Pipeline startup, sampled when the channel dispatches the event. It is not Unix time. Use the wall-clock functions below for a real-world date or timestamp.

The exact Program version's proto3 `SourceRecordPayload` defines the input fields. Field access uses Protobuf JSON names (`device_id` normally becomes `deviceId`).

| Protobuf value | Lua representation |
| --- | --- |
| bool | boolean |
| Signed integers, uint32, fixed32 | integer |
| uint64, fixed64 | Canonical unsigned decimal string |
| float, double | number |
| string | Valid UTF-8 string |
| bytes | Arbitrary binary string |
| enum | Descriptor symbol name |
| message | Read-only nested view; absent message is nil |
| repeated | Read-only sequence indexed from 1 |
| map | Read-only table with keys represented by their declared type |

Ordinary scalar fields expose their proto3 default. Optional fields and unselected oneof alternatives have nil presence. Only fields in the current Contract are exposed; invalid payloads are rejected before `main`.

## Builders and output

The registry contains only Sink contracts bound to the current Flow. A contract id is `programName@exactVersion`; multiple instances of the same Program identity share that contract.

```lua
local builder = registry:getBuilder("com.example.hello-tenon@0.1.0")
function main(event)
  if event.type == "source" then
    builder:setMessage(event.payload.message)
    emit(builder:build())
  end
end
```

Builder methods derive from the original proto field name, not its JSON name: remove underscores and uppercase the first character and each character following an underscore. For field `device_id`, the suffix is `DeviceId`.

| Field kind | Builder operations |
| --- | --- |
| Scalar, string, bytes, enum | `setXxx(value)`, `clearXxx()` |
| Message | `getXxxBuilder()` |
| Repeated scalar/string/bytes/enum | `addXxx(value)` |
| Repeated message | `addXxxBuilder()` |
| Map with scalar values | `putXxx(key, value)` |
| Map with message values | `putXxx(key)` returns the replacement value's Builder |

### Builder state

- Only the root Builder provides `build()`. Nested Builders edit their fields in that root.
- Replacing a map value updates its existing Builders.
- Setting one oneof alternative clears the others and can invalidate a nested Builder.
- Optional scalar fields preserve presence; `clearXxx()` removes it.

### Builder arguments

Use `:` for every method call. The receiver must match the exact registry binding and message type, and the argument count must match the method.

| Value | Required representation |
| --- | --- |
| Enum | Descriptor symbol name |
| String | Valid UTF-8 |
| Bytes | Binary string |
| Float | Finite number |
| Unsigned 64-bit integer | Decimal string in range, without signs, whitespace, or leading zeros except `"0"` |
| Map key | The same rules as its declared type |

The plugin validates business rules, such as allowed characters in a destination topic.

`build()` produces an immutable snapshot. Later Builder changes do not alter it. `emit(snapshot)` sends the value returned by `build()` to every matching Sink instance declared by the Flow.

### Emit behavior

| Call or condition | Result |
| --- | --- |
| `emit(snapshot)` | Produces output for matching Sinks |
| `emit()` | Completes pending input without a Sink record |
| `emit(nil)` | Error |
| Output at top level | Not allowed; emit only during `main` or its helpers |
| Output exceeds the record-size limit | Rejected before acceptance with `egress.record_too_large` |
| Sink has no capacity yet | This channel waits; other channels continue |

A `main` call may emit zero or more times. Accepted outputs retain their order.

With at-least-once delivery, the first successful emit completes the pending Source group once all matching Sinks report success. A zero-argument emit completes the group without Sink output. Subsequent emits are separate outputs and cannot bypass, extend or roll back the first group's completion. See [delivery semantics](/tenon/docs/development/user-guide/documents/#completion-and-delivery) and the [SDK contract](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/sdk/SDK-impl-contract.md) for terminal outcomes.

Registry lookup, Builder receiver/argument/type/range errors and timer argument errors are ordinary Lua errors catchable with `pcall`. Resource-limit failures and sandbox violations are not recoverable inside the invalidated VM.

## Timers and state

Each VM has one one-shot timer slot:

```lua
setTimeout(durationMs)
clearTimerTask()
hasTimeout()
```

| Timer operation | Effect |
| --- | --- |
| `setTimeout(durationMs)` | Starts a delay from this call; replaces the pending timer |
| `clearTimerTask()` | Removes the pending timer; succeeds even when none exists |
| `hasTimeout()` | Immediately reports whether a timer is pending |

Use a nonnegative Lua integer delay. The timer slot is removed before its event enters `main`; it stays empty unless you schedule another timer.

These functions are allowed at top level and in `main`. A zero delay schedules eligibility on the next event-loop iteration. Execution may be later because the channel is busy. Periodic behavior explicitly schedules the next one-shot timer from the current timer event. Invalid delays raise `setTimeout delay must be a non-negative integer`.

Lua state, Builders, snapshots and timers count toward the VM's memory allowance. Top-level initialization and each `main` invocation are bounded by the Runner's Lua CPU limit. State lives only in the current VM. A script/resource/sandbox failure invalidates the VM and its timers; rebuilding executes top-level code again. Relevant Tenon Document updates and process restarts also recreate state. Script replacement can briefly hold both old and new VMs, each with its own configured allowance.

## Wall-clock time and dates

`currentTimeMillis()` reads system time as an integer number of milliseconds since 1970-01-01 00:00:00 UTC.

- Call it during initialization or `main`; every call reads the clock again.
- Sub-millisecond fractions are discarded, and extra arguments are ignored.
- Values before the Unix epoch or outside the signed 64-bit range raise the catchable error `currentTimeMillis system time is out of range`.

The read-only `os` namespace exposes only these official Lua 5.5 functions:

| Function | Behavior |
| --- | --- |
| `os.time([date])` | With no argument or nil, returns current Unix **seconds** as an integer on supported Tenon platforms. A date table is interpreted in local time and normalized in place. `year`, `month` and `day` are required; `hour` defaults to 12, `min` and `sec` to 0, and optional `isdst` selects daylight saving time. |
| `os.date([format [, time]])` | Formats Unix **seconds**, defaulting to the current time and format `%c`. A leading `!` selects UTC; otherwise it uses local time. `*t` returns a table with `year`, `month`, `day`, `hour`, `min`, `sec`, `wday` (Sunday = 1), `yday` and `isdst` when available. `!*t` selects UTC fields. Other formats use the host's supported `strftime` conversions and locale. |
| `os.difftime(t2, t1)` | Returns `t2 - t1` in seconds as a Lua number. Both arguments are Unix seconds, not milliseconds. |

Invalid arguments or unrepresentable dates raise ordinary catchable Lua errors. `os.time(date)` needs a mutable date table. Pass Unix seconds to `os.date`; convert milliseconds to seconds first:

```lua
local timestampMs = currentTimeMillis()
local utc = os.date("!%Y-%m-%dT%H:%M:%SZ", timestampMs // 1000)
```

When choosing a clock:

- Use wall time for dates, not unique IDs, elapsed time, or the original Source timestamp. Clock adjustments can repeat or move values backward.
- Capture one reading if several output fields need the same timestamp. Replay and VM restarts may read a different time.
- Timer delays use a monotonic clock; wall-clock functions do not change their scheduling or guarantee exact firing times.

`os` and `currentTimeMillis` are reserved, read-only built-ins.

## Available standard environment

The basic globals are `_G`, `_VERSION`, `assert`, `error`, `ipairs`, `next`, `pairs`, `pcall`, `print`, `select`, `tonumber`, `tostring`, `type` and `xpcall`. `_VERSION` is `Lua 5.5`.

The following standard-library members are available:

| Library | Members |
| --- | --- |
| string | `byte char find format gmatch gsub len lower match pack packsize rep reverse sub unpack upper` |
| table | `concat insert move pack remove sort unpack` |
| math | `abs acos asin atan ceil cos deg exp floor fmod frexp huge ldexp log max min modf pi rad random randomseed sin sqrt tan tointeger type ult maxinteger mininteger` |
| utf8 | `char charpattern codepoint codes len offset` |
| os | `date difftime time` |

All listed members follow official Lua 5.5 semantics. Use `math.randomseed(...)` when a script needs a repeatable random sequence. `string.format` produces ad-hoc text and can expose implementation-specific float text or object identity such as `%p`. Pack formats use the host ABI unless the format specifies endianness, width and alignment. Math results can have host-library low-bit differences. UTF-8 helpers operate on code points. `print` writes to [live diagnostics](/tenon/docs/development/user-guide/observability/).

## JSON

`json.decode(text)` parses strict UTF-8 JSON. Duplicate object keys are rejected at every depth. Integer tokens must fit signed 64-bit; decimal/exponent tokens become finite binary64 floats. Large identifiers outside this range must use strings. `json.encode(value)` serializes representable Lua values to UTF-8 JSON. It preserves integer/float distinctions, including `1`, `1.0` and negative zero.

| Lua value | JSON behavior |
| --- | --- |
| `json.null` | JSON null; decoding null returns this same immutable value |
| `nil` | Absence; cannot be encoded as a value |
| Ordinary empty table | `{}` |
| `json.array()` | Empty array |
| Decoded array with all items removed | Still an array |
| Table with consecutive positive integer keys from 1 | Array |
| Sparse or mixed-key table | Encoding fails |
| Cyclic structure | Encoding fails; shared acyclic values are allowed |

Object keys are emitted in UTF-8 byte order. Arrays preserve element order.

Errors are ordinary catchable Lua errors. Fixed messages are `json.decode input must be a string`, `json.decode input must be valid UTF-8`, `json.decode input must be valid JSON`, `json.decode object field names must be unique`, `json.decode integer must fit signed 64-bit`, `json.decode number must be finite`, and `json.encode value is not representable as JSON`. Encoding rejects nil, nonfinite floats, invalid UTF-8, unsupported values, table shapes and cycles.

## Binary data

The read-only `bytes` namespace operates on Lua strings containing arbitrary bytes. Offsets are positive integer positions starting at 1, lengths are nonnegative integers, and floating-point `1.0` is not an integer offset. An out-of-range read raises an error; a successful read returns exactly the requested region. Required arguments must be present; extra arguments follow ordinary Lua function behavior and are ignored.

| API | Result and constraints |
| --- | --- |
| `bytes.len(data)` | Byte count |
| `bytes.slice(data, offset, length)` | Complete selected region; an empty region permits offsets 1 through `#data + 1` |
| `bytes.byte(data, offset)` | Integer byte in 0–255 |
| `bytes.read_u8(data, offset)`, `bytes.read_i8(data, offset)` | One unsigned or two's-complement signed byte |
| `bytes.read_u16_be/le(data, offset)`, `bytes.read_i16_be/le(data, offset)` | Two-byte unsigned/signed integer, with explicit big/little endian suffix |
| `bytes.read_u32_be/le(data, offset)`, `bytes.read_i32_be/le(data, offset)` | Four-byte unsigned/signed integer |
| `bytes.read_u64_be/le(data, offset)` | Eight-byte unsigned value as a canonical decimal string, directly usable by uint64/fixed64 Builders |
| `bytes.read_i64_be/le(data, offset)` | Eight-byte two's-complement Lua integer |
| `bytes.read_f32_be/le(data, offset)` | IEEE binary32 expanded exactly to binary64; preserves subnormals and negative zero, rejects NaN/infinity |
| `bytes.read_f64_be/le(data, offset)` | IEEE binary64, with the same finite-value requirement |
| `bytes.bcd_to_string(data)` | Each high then low nibble becomes one decimal digit; nibble > 9 fails, including sign/padding nibbles |
| `bytes.to_hex(data)`, `bytes.from_hex(text)` | Lowercase output; input permits either ASCII case, even length, no prefix, whitespace or separators |
| `bytes.to_base64(data)`, `bytes.from_base64(text)` | Canonical padded RFC 4648 standard alphabet with zero unused bits |
| `bytes.crc16(data, polynomial, initial, xorOut, bitOrder)` | All five arguments required; numeric parameters are integers 0–65535 and bitOrder is exactly `"msb"` or `"lsb"` |

In the table, `be/le` denotes two separately named functions, for example `bytes.read_u16_be` and `bytes.read_u16_le`. Hex, Base64 and BCD accept empty input and return empty output. All data/text arguments must be strings, but encoded-input validation operates on ASCII byte syntax without first requiring UTF-8.

For CRC16, supply the polynomial in normal form for `"msb"` or reflected form for `"lsb"`. The result applies `xorOut` after processing all bytes. For CRC-16/MODBUS, use `bytes.crc16(data, 0xA001, 0xFFFF, 0, "lsb")`; for CRC-16/IBM-3740, use `bytes.crc16(data, 0x1021, 0xFFFF, 0, "msb")`.

Binary errors are catchable and have fixed messages: `bytes input must be a string`, `bytes offset must be a positive integer`, `bytes length must be a non-negative integer`, `bytes range is out of bounds`, `bytes floating-point input must be finite`, `bytes BCD input must contain only decimal nibbles`, `bytes hex input must be even-length ASCII hexadecimal`, `bytes base64 input must be canonical padded RFC 4648`, `bytes CRC16 parameters must be integers from 0 to 65535`, and `bytes CRC16 bit order must be "msb" or "lsb"`.

Use Lua's `&`, `|`, `~`, `<<` and `>>` on integer read results for bit fields. `string.pack`, `string.unpack` and `string.packsize` provide general Lua binary handling; for a byte format shared across hosts, specify endianness, width and alignment explicitly. The `bytes` API provides Tenon's fixed-width, explicit-endian binary contract.

## Failed inputs and execution

For `at-least-once` delivery:

| Failure | Pending Source records | Lua state |
| --- | --- | --- |
| Source decode fails with no earlier pending inputs | Current input receives `ERROR` | Existing state and timer survive |
| Source decode fails with earlier pending inputs | Current input receives `ERROR`; earlier inputs receive `RETRY` | VM is rebuilt |
| `main` fails before its first successful emit | Current Source input receives `ERROR`; earlier inputs receive `RETRY` | VM is rebuilt |
| Timer execution fails | Inputs still pending in the VM receive `RETRY` | VM is rebuilt |

Inputs already assigned to an accepted output boundary keep its outcome. Boundaries execute in order; completed ones do not roll back. The Source plugin decides how to replay externally.

CPU/memory exhaustion, writes to read-only inputs or built-ins, replacing frozen `main` and other sandbox violations cannot be caught by nested `pcall`/`xpcall`. They terminate the current execution. An unexpected Source process failure resets its Flow's Lua state, timers and pending inputs. A planned configuration update can preserve compatible Lua state; see [Tenon Document updates](/tenon/docs/development/user-guide/documents/#updates-and-failure). Outputs already sent downstream are not withdrawn.
