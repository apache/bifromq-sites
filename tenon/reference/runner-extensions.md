---
title: "Runner Extensions"
description: "Extend Tenon request authorization and Tenon Document storage in a custom Runner."
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

# Runner extensions

Build a custom Rust executable around the `tenon` library to supply these hooks:

| Hook | Controls | Default |
| --- | --- | --- |
| `HttpApiAuthorization` | Access to HTTP requests | `NoHttpAuth` |
| `ExecutionPolicy` | Which Tenon Documents may run and for how long | `AllowAll` |
| `DocumentProtection` | Transformation of complete saved Tenon Document bytes | `Plaintext` |

Implement the policy, credentials, and any encryption in your executable. Tenon does not supply a licensing or billing service.

The [security policy and threat model](/tenon/docs/development/reference/security/#extension-responsibilities) describes the limits of each hook and the responsibilities of a custom distribution. Hook availability alone does not enable access control or turn plugin processes into security sandboxes.

```rust
fn main() -> std::process::ExitCode {
    tenon::run_main_with(|_config| Ok(tenon::RunnerHooks::default()))
}
```

`run_main_with` calls your initializer once with validated `RunnerConfig`, before loading saved Tenon Documents or accepting HTTP requests. It returns `ExitCode`.

Put custom settings in `extra` and sanitize any initialization errors.

`RunnerHooks::new(policy, protection, authorization)` installs concrete implementations. Defaults are `AllowAll`, `Plaintext` and `NoHttpAuth`.

## DocumentProtection

`DocumentProtection: Send + Sync` exposes synchronous `protect(source: &[u8], output: &mut dyn Write)` and `unprotect(stored: &[u8], output: &mut dyn Write)`, both returning `io::Result<()>`. Implement the byte transformation; Tenon handles file storage.

A failed `protect` leaves the previous saved Tenon Document intact. A failed `unprotect` prevents startup and preserves the file. Methods may be called concurrently for different Tenon Documents. Bound their memory and computation costs; cancellation does not roll back a file operation already underway.

ETags, GET responses and plugin configuration always use original plaintext bytes. Randomized protected bytes do not change the ETag. Storage protection is not API authorization, field-level secret expansion or encryption of runtime memory.

## ExecutionPolicy

`authorize(ExecutionScope)` synchronously receives the complete proposed set of admitted, statically verified Tenon Documents and returns `Result<ExecutionPermit, ExecutionDenied>`. Scope references are borrowed for that call and have no ordering guarantee. Quota decisions use the proposed Tenon Document set. Missing-plugin Tenon Documents can still consume admission quota.

Calls happen on the Runner thread; the policy need not be Send/Sync and must return promptly without blocking I/O. Do not maintain an independent quota ledger by counting callbacks. An allowed Tenon Document can still fail to save.

| Operation | Admission behavior |
| --- | --- |
| Startup | Tries saved Tenon Documents in ID byte order |
| PUT | Checks the complete proposed set after validation and write conditions, before persistence |
| Denied PUT | Returns `403` with the hook's sanitized code and message |
| Denied saved Tenon Document | Remains readable and deletable, without an admitted pipeline; an identical PUT retries admission |
| DELETE | Frees desired quota without another policy call |
| Plugin install, automatic restart, reconfiguration | Does not reauthorize unchanged desired configuration |

Both accepted and denied results carry `entitlement_until: Option<Instant>`:

- Every result immediately replaces the deadline; `None` removes it, even if a later file operation fails.
- Expiry starts bounded Runner shutdown, including when there is no API traffic. Process termination is not instantaneous.
- Once shutdown starts, later results cannot reopen admission.

Update policy inputs in your executable. Authorization runs only during startup admission and Tenon Document PUT requests.

## HttpApiAuthorization

`HttpApiAuthorization: Send + Sync` returns a Send future of `Result<(), HttpAuthRejection>`.

| Request information | Available to the hook? |
| --- | --- |
| Original method, URI path, headers | Yes, including unknown methods and routes |
| Query, body, trailers, TLS client identity | No |

Checks run before endpoint body processing. Decode each path segment once when interpreting resource IDs; paths retain percent encoding. Preserve repeated and non-text headers.

`Unauthorized` requires a `WWW-Authenticate` challenge and yields 401; `Forbidden` yields 403 with an optional challenge. Core responses contain stable public messages and do not echo credentials or internal errors. HEAD responses have no body. Denial does not modify execution admission, entitlement deadlines or running Pipelines.

- Await external services without blocking executor threads; implement timeouts and failure handling.
- Release held resources if cancellation drops the future. An abandoned callback may never complete.
- Requests rejected during shutdown receive `503` without invoking the hook.
- With mutual TLS, transport authentication happens first.
- Each new diagnostic stream is authorized. An existing stream is not continuously reauthenticated.
