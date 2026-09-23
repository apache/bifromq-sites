---
title: Delivery & Recovery
sidebar_position: 3
description: Choose Source completion behavior and understand replay after failures.
---

# Delivery and recovery

A Flow's `delivery` setting controls when Tenon completes Source records. The Source plugin translates that result into its upstream acknowledgement or replay behavior.

## Choose a policy

| Policy | When the Source receives success | What can still fail afterward |
| --- | --- | --- |
| `at-most-once` | The pipeline has read the complete input record | Lua processing and Sink delivery |
| `at-least-once` (default) | An accepted emit boundary completes; a payload emit waits for all matching Sinks | Later outputs from the same Lua call or failures outside the Sink's delivery guarantee |

Each Sink defines what successful delivery means for its external system. Check the destination's observable result as well as pipeline status.

## How `emit` completes inputs

With `at-least-once`, Source records stay pending in input order until an accepted emit takes responsibility for them.

| Lua action | Source completion | Output |
| --- | --- | --- |
| First successful `emit(snapshot)` in a `main` call | Takes all currently pending inputs; waits for every matching Sink to complete | Sent to every Sink instance in the Flow with that payload contract |
| First successful `emit()` | Completes the pending group without waiting for a Sink | None; useful when intentionally filtering records |
| Return without an accepted emit | Inputs remain pending for a later boundary | None |
| Further emits in the same call | Do not change the first group's completion | Additional outputs, accepted in order |

Multiple emits are not a transaction. A later error cannot undo an earlier accepted output or completion boundary.

## Plan for recovery

- **Keep durable input upstream.** Tenon's queues, Lua state, and timers are in memory.
- **Handle duplicates downstream.** A failed or retried delivery can repeat an external side effect; stable event IDs support deduplication.
- **Check plugin replay behavior.** Source SDKs do not automatically resend when they receive `RETRY`; the Source implementation decides what to do.
- **Expect state resets.** Restarts and some updates recreate Lua state and timers. See [Tenon Document updates](/tenon/docs/development/user-guide/documents/#updates-and-failure).

Tenon does not provide a durable retry log, a distributed transaction, or an end-to-end exactly-once guarantee. Plugin developers should map `OK`, `RETRY`, and failures to the guarantees of the upstream and downstream systems.
