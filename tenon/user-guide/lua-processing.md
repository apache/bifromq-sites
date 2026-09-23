---
title: Lua Processing
sidebar_position: 2
description: Filter, transform, route, and schedule Tenon records with Lua.
---

# Lua processing

A Flow uses `function main(event)` to process input or react to a timer. Each channel has its own Lua state.

| Event | Check | Available input |
| --- | --- | --- |
| Source | `event.type == "source"` | Typed fields in `event.payload`, defined by the Source plugin |
| Timer | `event.type == "timer"` | No payload |

## Build an output

Use the Builder for the exact Sink contract bound to the Flow. Method calls use `:`:

```lua
local builder = registry:getBuilder("org.apache.bifromq.tenon.stdout-sink@0.1.0")

function main(event)
  if event.type == "source" then
    builder:setMessage(event.payload.message)
    emit(builder:build())
  end
end
```

This example assumes a Source payload with a string field named `message`. Adapt the input field to your Source plugin's payload.

- `build()` creates an immutable snapshot. The Builder stays mutable; later changes do not alter an earlier snapshot.
- `emit(snapshot)` sends that snapshot to matching Sink instances in the Flow.
- `emit()` without arguments completes pending input without producing output. Use it when intentionally filtering a record.

See [Delivery & Recovery](/tenon/docs/development/user-guide/delivery/) for completion rules and the [Lua API](/tenon/docs/development/reference/lua/) for payload types, JSON, binary fields, and errors.

## Timers

Timers are one-shot. Schedule the next timer from the current timer event:

```lua
local builder = registry:getBuilder("org.apache.bifromq.tenon.stdout-sink@0.1.0")
local count = 0
setTimeout(1000)

function main(event)
  if event.type == "timer" then
    count = count + 1
    builder:setMessage("probe " .. count)
    emit(builder:build())
    setTimeout(1000)
  end
end
```

A timer can generate a local probe while Dummy Source stays idle, as in [First Pipeline](/tenon/docs/development/get-started/first-pipeline/).

- Each channel has one timer slot. Calling `setTimeout` again replaces its pending timer.
- A fired timer is one-shot; schedule the next one explicitly.
- Restarts and applied script changes recreate Lua state and timers.
- Multiple channels have independent counters and timers. They do not provide a shared or durable schedule.
