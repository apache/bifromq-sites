---
title: SDK Development
sidebar_position: 2
description: Plan a Tenon language SDK contribution and find the implementation contracts in the code repository.
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

# Develop a plugin SDK

A language SDK lets plugin authors focus on their external system. It handles communication with Tenon, startup and shutdown, and the results of sending or receiving records.

## Keep responsibilities clear

| Component | Responsibility |
| --- | --- |
| SDK | Tenon communication, lifecycle, bounded submission, and completion results |
| Plugin | External clients, business configuration, payload meaning, and external acknowledgement or replay |
| Scaffold and bundler | A usable starter project and an installable plugin bundle |

Use APIs that fit the language while preserving Tenon's behavior. Different callback or async styles must still agree on ordering, backpressure, completion, and failure outcomes.

## Approach the work

1. Read the shared contract and compare the existing Rust and Java implementations.
2. Establish the [IPC integration](/tenon/docs/development/contribute/ipc/) for the target language.
3. Support Source, Sink, and combined plugins with a clear lifecycle for each.
4. Verify behavior through generated plugins and a real Runner, including failure and shutdown.

## Implementation details

Use the code repository for protocol fields, callback rules, ownership, and compatibility requirements:

- [SDK implementation contract](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/sdk/SDK-impl-contract.md) — shared behavior across languages.
- [Rust SDK](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/sdk/rust/plugin-sdk/README.md) — the Rust API and implementation entry point.
- [Java SDK](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/sdk/java/README.md) — the Java API and implementation entry point.
- [Verification instructions](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/CONTRIBUTING.md) — toolchains and checks for a contribution.
