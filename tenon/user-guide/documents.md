---
title: Tenon Documents
sidebar_position: 1
description: Define plugin instances and flows, tune their limits, and apply updates with a Tenon Document.
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

# Tenon Documents

A **Tenon Document** is a JSONC file that describes one pipeline: which plugins to run, how to configure them, and how records move through Lua to their destinations. JSONC allows comments alongside ordinary JSON.

## What goes in a Tenon Document

| Field | What you specify |
| --- | --- |
| `specVersion` | `"1"`, the supported format version |
| `id` | A name for this pipeline |
| `pluginInstances` | The plugins to run, their exact versions, and their configuration |
| `flows` | Connections from a Source instance, through Lua, to one or more Sink instances |
| `resourceLimits` | Optional CPU and memory limits for the pipeline and its plugin processes |

Unknown fields and unsupported format versions are rejected. Use the [Tenon Document Schema](/tenon/docs/development/reference/document-schema/) for every field, type, and allowed value. The Runner also serves it at `GET /document-schema`.

## Configure plugin instances

Each entry in `pluginInstances` gives a local name to a plugin configuration. For example, this entry names a Stdout Sink `console`:

```json
"console": {
  "programName": "org.apache.bifromq.tenon.stdout-sink",
  "exactVersion": "0.1.0",
  "config": {}
}
```

- `programName` and `exactVersion` select an installed plugin Program.
- `config` follows that plugin's configuration schema. The Stdout Sink needs no settings.
- `env` can override environment variables inherited by the plugin process.
- `extraArgs.args` adds command-line arguments as an array, without shell expansion or string splitting.

For extra arguments, `position: "append"` is the default: manifest arguments, extra arguments, then Tenon's startup arguments. `"prepend"` places extra arguments immediately after the executable. Changing effective environment or launch arguments restarts the plugin process.

Configuration values are used as written; Tenon does not expand templates, secret references, or environment variables inside them.

## Connect instances with a Flow

A Flow selects one `source`, lists its `sinks`, and supplies Lua in `process.script`. The names refer to entries in `pluginInstances`.

The following is a **Flow fragment**. It assumes an `idle` Dummy Source and a `console` Stdout Sink. Its timer emits `hello` once, after one second:

```json
"probe": {
  "source": "idle",
  "sinks": ["console"],
  "process": {
    "script": "local b = registry:getBuilder('org.apache.bifromq.tenon.stdout-sink@0.1.0')\nsetTimeout(1000)\nfunction main(event)\n  if event.type == 'timer' then\n    b:setMessage('hello')\n    emit(b:build())\n  end\nend"
  }
}
```

See [First Pipeline](/tenon/docs/development/get-started/first-pipeline/) for the complete Tenon Document and commands to run it.

### Connection rules

- A Source instance belongs to one Flow. A Sink instance can receive from several Flows.
- Each Flow needs at least one Sink, and every instance must be used.
- A plugin that provides both Source and Sink interfaces can be used only as Source, only as Sink, or as both. Flow connections determine which interfaces run; an unconnected interface has no queues or SDK workers. The same instance can be both sides of one Flow.
- Instance and Flow names are their object keys; do not add another `id` inside their values.
- Tenon Document, instance, and Flow names must be 1–128 UTF-8 bytes and contain no C0/C1 control characters.

## Channels and limits

A channel processes events in order, with its own Lua state and timer. Channels run independently; they do not share Lua globals or ordering.

| Flow setting | Default | Use it to |
| --- | --- | --- |
| `parallelism` | One channel | Request a fraction of the Runner's allowed logical CPUs |
| `maxPendingRecords` | `100` per channel | Limit Source submissions still awaiting completion |
| `maxRecordBytes` | `262144` bytes | Limit a complete encoded input or output record, excluding the queue header and padding |
| `delivery` | `at-least-once` | Choose when Source records are completed |

**Omitting `parallelism` differs from setting it to `1`.** Omission creates one channel; an explicit ratio creates `ceil(allowedCpuCount × parallelism)` channels. The Runner takes the CPU count at startup, independently of the Tenon Document's CPU quota.

At the pending-record limit, new submissions wait for capacity. Oversized records are rejected. Raising either limit can increase memory use.

`resourceLimits` covers the pipeline and all its plugin processes. See [CPU and memory](/tenon/docs/development/reference/runner/#cpu-and-memory) for Linux enforcement and macOS behavior.

## Validation, saving and application

| Stage | What it establishes | What to check |
| --- | --- | --- |
| Save | Structure, values, references, and Lua syntax are valid | The response to `PUT /documents/{id}` |
| Apply | Required plugins, platforms, payloads, configuration, and Lua initialization are ready | Matching `documentEtag` and `appliedDocumentEtag` |
| Deliver | The destination received the intended output | Plugin diagnostics and the destination itself |

Saving does not require installed plugins or run Lua initialization. If a saved Tenon Document cannot run, status reports `unready` with `runtimeIssues`. An existing pipeline may keep its previous configuration.

ETags identify the saved bytes. Use the current quoted ETag when replacing or deleting a Tenon Document; see [Run & Manage Tenon](/tenon/docs/development/user-guide/operations/#manage-pipelines).

## Completion and delivery

Choose `at-most-once` for early Source completion or `at-least-once` to wait for the Flow's completion boundary. The [Delivery & Recovery guide](/tenon/docs/development/user-guide/delivery/) explains `emit`, Sink completion, and replay.

## Updates and failure

| Change or failure | Effect |
| --- | --- |
| Lua script changes | Affected channels finish the current event and accepted outputs, then start fresh Lua state and timers. Inputs still waiting for an emit boundary receive `RETRY`. Unchanged Flows continue. |
| New script cannot initialize | The previous configuration stays active. |
| Effective channel count, record limits, or relevant bindings change | Plugin instances may restart and Lua state may reset. |
| Ratio changes but effective channel count stays the same | The corresponding Lua state is preserved. |
| Update times out | The pipeline restarts with the latest valid saved configuration. |
| Script fails | The affected Lua VM resets. |
| Pipeline or Runner restarts | In-memory queues, Lua state, and timers are lost. |

Updates apply asynchronously. If several arrive during an update, the latest pending version is applied next; another PUT does not extend the current deadline. A failure during the switch can restart the pipeline.

Forced shutdown and timed-out updates can lose or repeat in-flight records. Use upstream replay and downstream deduplication where required.
