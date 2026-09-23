---
title: IPC Integration
sidebar_position: 3
description: Plan IPC work for a Tenon SDK and locate shared formats, implementations, and tests.
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

# Integrate a language with Tenon IPC

IPC carries records between plugin processes and the Runner. A language implementation must agree with its peers on the data format, ordering, notification, and cleanup behavior.

Most plugin developers should use an existing SDK. Work on IPC when adding a language, supporting a platform, or changing the communication layer itself.

## Focus on compatibility

- Consume the shared definitions and test vectors instead of maintaining separate protocol copies.
- Check both language directions: each implementation must work as sender and receiver.
- Exercise process interruption, failure, and cleanup as well as ordinary data flow.
- Run native checks on every OS and CPU combination the contribution claims to support.

## Where to work

| Repository resource | Use it for |
| --- | --- |
| [IPC contract](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/ipc/README.md) | Formats, wait/wake behavior, ownership, errors, and verification commands |
| [Rust IPC implementation](https://github.com/apache/bifromq-tenon/tree/21452dc53be3491567dbe9958294e34bf0fc79f5/ipc/rust/tenon-ipc) | Existing Rust behavior and tests |
| [Java IPC implementation](https://github.com/apache/bifromq-tenon/tree/21452dc53be3491567dbe9958294e34bf0fc79f5/ipc/java/tenon-ipc) | Existing Java behavior and tests |
| [Shared IPC vectors](https://github.com/apache/bifromq-tenon/tree/21452dc53be3491567dbe9958294e34bf0fc79f5/contracts/ipc) | Cross-language format and error cases |
| [SDK contract](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/sdk/SDK-impl-contract.md) | How the SDK uses IPC for plugin lifecycle and records |

After IPC works with the Runner, continue with [SDK Development](/tenon/docs/development/contribute/implementation-contract/) and verify a complete generated plugin.
