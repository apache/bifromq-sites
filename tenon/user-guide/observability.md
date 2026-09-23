---
title: Metrics & Diagnostics
sidebar_position: 5
description: Check pipeline status, collect metrics, and follow live Lua and plugin output.
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

# Metrics and diagnostics

Use status to check what is running, metrics to follow changes over time, and live diagnostics to inspect Lua or plugin output.

| Question | Where to look |
| --- | --- |
| Has my Tenon Document been applied? | `GET /pipelines/{id}`: compare `documentEtag` and `appliedDocumentEtag` |
| Is a plugin failing or restarting? | Pipeline status and the plugin's diagnostics |
| How is workload changing? | `GET /metrics`, collected periodically |
| Did a message reach its destination? | The destination's own subscriber, database, or service |

## Collect metrics

The default response is Tenon's structured JSON:

```sh
curl --fail http://127.0.0.1:18080/metrics
```

For Prometheus text:

```sh
curl --fail 'http://127.0.0.1:18080/metrics?format=prometheus'
```

`?format=json` explicitly selects JSON; this is not OTLP JSON. Use the [metric catalog](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/contracts/metrics/catalog.json) for names, units, attributes, and temporality, and the [HTTP API](/tenon/docs/development/reference/http-api/) for query filters.

When reading metrics:

- Treat absent data as missing, not zero. Busy, slow, or disconnected pipelines may miss the collection deadline.
- Account for process restarts when calculating rates from cumulative values.
- Calculate percentiles in your monitoring system; Tenon does not calculate them.
- Use catalog names in filters, before any exporter-specific renaming.
- Treat `running` as runtime state, not proof of broker connectivity or delivery.

Runner labels and collection timing are startup settings in the [Runner Configuration Schema](/tenon/docs/development/reference/runner-schema/).

## Follow live diagnostics

Choose one target per request:

| Target | Output |
| --- | --- |
| `plugin:<instanceId>` | One plugin process's `stdout` and `stderr` |
| `flow:<flowId>/channel:<index>` | One channel's `lua-print` and `lua-error` records |

For the `console` plugin in [First Pipeline](/tenon/docs/development/get-started/first-pipeline/):

```sh
curl --fail -N -H 'Accept: text/event-stream' \
  'http://127.0.0.1:18080/pipelines/debug/diagnostics?target=plugin%3Aconsole'
```

For the first channel of its `probe` Flow:

```sh
curl --fail -N -H 'Accept: text/event-stream' \
  'http://127.0.0.1:18080/pipelines/debug/diagnostics?target=flow%3Aprobe%2Fchannel%3A0'
```

Targets are URL-encoded in these commands. The stream can attach before the selected object starts.

| Event | Meaning |
| --- | --- |
| `attached` | The subscription is open |
| `diagnostic` | A Lua or plugin output record |
| `closed`, or end of stream | This subscription has ended |

## Read diagnostic records

- Use process, channel, and VM identities to distinguish restarts.
- Sequences are decimal strings. Gaps can indicate dropped records; plugin stdout and stderr share one process sequence.
- For Lua errors, use stable `phase` and `code` fields. The error text is a human-readable hint.
- Text is limited to 16,384 UTF-8 bytes per record. Truncation and invalid UTF-8 are reported.

Diagnostics are live and best effort. They have no history, replay, or `Last-Event-ID` resume. A slow reader may lose records. Reconnecting creates a new subscription and repeats HTTP authorization.

Keep the Runner's stderr as well: startup, storage, and cleanup failures may occur when the HTTP API is unavailable.
