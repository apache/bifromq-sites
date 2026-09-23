---
title: "Java SDK Lifecycle"
description: "Tenon Java plugin callbacks, send results, and lifecycle."
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

# Java SDK Lifecycle

## Plugin callbacks and results

The generated `Main` selects `SourceProgram`, `SinkProgram` or `SourceAndSinkProgram`, calls `run`, then `awaitShutdown`. Keep the generated factory registration under `META-INF/services`. Tenon launches the packaged program and provides its configuration.

| Interface | Methods to implement |
| --- | --- |
| `TenonSource` | `start()`, `quiesce()`, `close()` |
| `TenonSink<P>` | `start()`, `write(FlowChannel, List<P>)`, `close()` |
| `TenonSourceAndSink<P>` | All four methods on one shared object; `P` is the Sink payload type |

The SDK calls the factory and `start` once. Lifecycle methods must return promptly and must not throw. Use them to signal your clients or workers; do not wait for network acknowledgements or worker termination. Quiesce stops Source production while pending Source results and any Sink interface remain available. `close` is not guaranteed after a crash, fatal error or forced termination.

A Source factory receives the configuration, effective channel count and a `PayloadSender<P>`. Call `send(channelId, payload)` with a zero-based index below that count and observe the returned `CompletionStage<AckCode>`:

- `OK`: the Flow's [delivery boundary](/tenon/docs/development/user-guide/documents/#completion-and-delivery) was reached; apply your upstream acknowledgement policy.
- `RETRY`: the record did not complete; decide whether and how to replay it.
- `BACKPRESSURE`: the channel has no free pending slot; slow production and retry later.
- `ERROR`: handle a record failure, such as an oversized payload.

An invalid channel throws `IllegalArgumentException`. A closed session completes unfinished sends exceptionally with `SourceSessionClosedException`. The SDK does not resend automatically. Keep synchronous completion callbacks short; use an explicit executor for asynchronous or blocking work.

Sink `write` receives a nonempty, ordered, immutable batch and returns `CompletionStage<Void>`. Calls do not overlap, but returned stages can finish out of order. Return promptly and complete the stage successfully only when every record reaches your downstream delivery guarantee. A failed stage terminates the plugin; a restart can replay unacknowledged batches, including partial external effects. Plan for duplicates.
