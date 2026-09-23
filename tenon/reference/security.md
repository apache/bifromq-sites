---
title: "Security"
description: "Tenon trust boundaries, deployment responsibilities, and vulnerability reporting."
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

# Security policy and threat model

Tenon runs operator-supplied plugins and Tenon Documents. Its HTTP API is a management interface with the ability to deploy executable code, configure external connections, and change data processing. **Give management write access only to principals trusted to operate the node and its workloads.** The stock Runner permits all HTTP requests that reach it after any configured TLS handshake. Deployers must establish the access boundary before exposing the listener.

Custom distributions may add access policies or storage protection; consult their documentation. BifroMQ broker authentication does not grant or restrict access to the Tenon API.

## Reporting a vulnerability

Report suspected vulnerabilities privately using the [ASF vulnerability reporting process](https://security.apache.org/report-code/). The [ASF project security directory](https://security.apache.org/projects/) lists `security@apache.org` for Apache BifroMQ. Identify **Apache BifroMQ Tenon** and the affected artifact in the report. Do not disclose an unpatched vulnerability in a public issue or pull request.

Send one plain-text report per issue with a subject beginning `[SECURITY] Apache BifroMQ Tenon`. Include:

- The version or commit, operating system, stock or custom distribution, and relevant configuration with secrets removed.
- The attacker's starting access: network reachability, client certificate or API permission, ability to edit a Tenon Document, upload a package, send source records, or write local files.
- A minimal reproduction, expected boundary, observed result, and confidentiality, integrity or availability impact. Distinguish installation-time behavior from behavior after plugin execution.
- Any gateway, authorization hook or plugin required to reproduce the issue, and evidence showing which component fails.

For dependency findings, follow the [ASF dependency reporting guidance](https://security.apache.org/report-dependency/) and identify the shipped artifact and reachable affected behavior. Test only systems you own or are authorized to assess. If the classification is uncertain, explain the suspected boundary crossing in a private report.

## Assets, actors and trust assumptions

The assets include the host resources available to the Runner, stored Tenon Documents and packages, credentials in configuration or environment variables, data flowing through plugins, and the availability and integrity of connected systems.

| Actor or input | Expected authority and trust |
| --- | --- |
| Host and deployment administrator | Controls the executable, startup configuration, operating-system identity, network access, TLS material and state directory. Tenon cannot protect itself from an administrator who can replace it or inspect its processes. |
| Plugin publisher and installer | Supplies executable code and selects packages trusted to run with the node's workload privileges. Package names and versions are identifiers, not authenticated publisher identities. |
| Tenon Document author or API writer | Controls desired execution, plugin selection and configuration, arguments, environment overrides, Lua logic and routing. This is a privileged operator role, not an untrusted tenant role. |
| Reader or diagnostics consumer | Receives the information allowed by deployment policy. Tenon Documents can contain credentials; diagnostics can contain payloads and plugin output. Read access is sensitive. |
| Network client without granted access | Must be kept outside the management interface by deployment controls. When mTLS or an authorization hook is configured, the corresponding checks must reject requests that do not meet that control. |
| External data producer or service | Can influence records, responses and failures observed by a trusted plugin. Trusting a plugin does not make all data it receives trustworthy. Plugins and core decoders remain responsible for their respective input handling. |

Tenon Documents, Pipelines, Flows, Channels and plugin instances organize work. They are not built-in security tenants. One Runner and its child processes form one operating-system trust domain. Mutually untrusted operators or plugins require isolation supplied by the deployment, such as separate machines or suitably configured OS isolation with separate identities, storage and credentials.

## Management network boundary

The [Runner configuration](/tenon/docs/development/reference/runner/#transport-and-access) supports these modes:

| Configuration | What the stock Runner checks |
| --- | --- |
| No `http.tls` | Plain HTTP; no client authentication or request authorization. |
| TLS certificate and private key, no `clientCaFile` | HTTPS with a server identity; no client authentication or request authorization. |
| TLS with `clientCaFile` | HTTPS requiring a client certificate accepted by the configured CA trust. Every accepted client has the same management access unless another control restricts it. |

TLS configuration makes the listener HTTPS-only. Unreadable or invalid TLS material fails startup; it does not enable a plaintext fallback. mTLS applies to the entire HTTP surface, including schema, OpenAPI, metrics and diagnostic streams. Client software must also verify the Runner's server certificate and expected server identity.

mTLS does not assign roles, resource ownership or per-operation permissions. Trusting a CA means trusting the client certificates it can issue for this purpose. Use a dedicated client trust policy appropriate to the management role. Materials are loaded at startup; rotation requires restarting the Runner. There is no live certificate reload, online revocation check or continuous reauthentication of established connections. A resumed TLS session can reuse its prior authentication. An already-open diagnostic stream is not reauthorized when external credentials change.

Deployers must restrict listener reachability, authenticate callers, authorize their operations, and protect credentials. A gateway can enforce these controls, but the backend listener must be reachable only through the intended trusted path. If a distribution trusts identity headers, the gateway must remove caller-supplied copies and set verified values; direct backend access must not allow header forgery. Loopback binding alone does not distinguish mutually untrusted local users.

Authentication of the management connection does not secure a plugin's connections to external services. Configure each plugin's transport verification, credentials and destination permissions separately.

## Plugin and Tenon Document execution boundary

An installed plugin can execute arbitrary native or managed code. The Runner starts it in a child process with the inherited operating-system identity and environment, overlaid by Tenon Document environment entries. Tenon does not automatically assign a separate user, container, filesystem or network namespace to each plugin. A malicious plugin can therefore access files, credentials and destinations available to that identity and can interfere with other workloads within that trust domain.

Run Tenon under a dedicated, minimally privileged OS identity. Grant only the filesystem, credentials and external-system permissions required by its workloads; inherited credentials and reachable internal services are part of the authority granted to plugins.

The command and additional arguments are passed as an argument vector without implicit shell evaluation. This prevents shell interpretation by the launcher; it does not restrict the executable's capabilities. A package can choose an interpreter, and a Tenon Document's `config`, `extraArgs` and `env` can materially change a trusted program's behavior. Bare command names use the inherited `PATH`. Review the entire package and Tenon Document together.

Install plugins only from publishers you trust and verify their provenance before upload. Package validation checks structure and compatibility, but does not verify signatures or scan for malware. Installing a package can immediately start saved Tenon Documents that reference it.

Tenon Document validation checks structure and supported semantics; it does not establish that a chosen destination, credential, argument or data transformation is authorized for a particular human. An accepted Tenon Document can start or reconfigure plugins, redirect data, emit records or remove processing. Access restricted to Tenon Document writes still requires operator trust even if package upload is disabled.

Protect runtime directories from other users. Local process communication does not isolate a plugin from other processes running under the same OS identity.

See [package rules](/tenon/docs/development/reference/plugin-packages/) for installation requirements. SDK developers should also follow the [SDK implementation contract](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/sdk/SDK-impl-contract.md).

## Lua and resource boundaries

Lua has a restricted language environment inside each Flow Channel. It exposes the documented data-processing APIs rather than host filesystem, process or socket APIs. The `io`, `os`, `package` and `debug` libraries, dynamic module loading and arbitrary native extensions are unavailable. Static validation compiles source without executing top-level initialization. Runtime initialization and invocations use the configured Lua CPU and memory limits; a fatal resource or sandbox fault invalidates that VM. The precise API and failure behavior are in the [Lua guide](/tenon/docs/development/reference/lua/).

Lua scripts can transform or discard data, send to configured Sinks and reveal data through diagnostics. Only trusted operators should be allowed to submit Tenon Documents, which also control native plugin execution.

Linux Tenon Document CPU and memory limits require delegated cgroup v2 support. On macOS, these limits are ignored and execution continues. Per-VM and per-Flow limits do not impose a total node budget. See [resource enforcement](/tenon/docs/development/reference/runner/#cpu-and-memory). The supplied [Docker configuration](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/deploy/container/README.md) grants `CAP_SYS_ADMIN` for cgroup management. That broad capability is inherited by child programs; use trusted plugins and retain container security policies.

The HTTP API has no total Tenon Document or compressed-upload byte limit and no built-in per-principal rate or execution quota policy. Archive extraction has separate fixed bounds, which do not bound aggregate concurrent uploads, retained installations or all management costs. Deployers must set request size, rate, connection, execution, disk and resource budgets appropriate to their environment and protect the listener against network exhaustion. A TLS handshake deadline is not general denial-of-service protection.

## Storage, secrets and observations

The stock Runner stores complete Tenon Documents as plaintext and serves their original bytes through GET. Plugin configuration and environment entries can contain secrets. Tenon does not supply a secret manager or automatically redact arbitrary plugin output, Lua `print` output or user-provided values. Treat state, backups, diagnostic consumers, logs and process inspection as sensitive access paths.

Use a separate state directory for each Runner and prevent access by untrusted writers. Filesystem permissions do not protect state from administrators or plugins with the same OS privileges.

## Extension responsibilities

A custom Runner distribution can provide HTTP authorization, execution admission and Tenon Document storage protection. These features require custom code; they are not enabled by installing a plugin. See the [extension guide](/tenon/docs/development/reference/runner-extensions/).

- HTTP authorization can restrict methods and paths using request headers. The hook does not receive the body, query or TLS client identity. Policies that need those inputs require a gateway or other distribution support.
- Execution admission can restrict the saved Tenon Document set or impose an entitlement deadline. It does not authenticate API callers or inspect plugin uploads.
- Tenon Document protection can encrypt stored Tenon Documents. GET responses, plugin configuration and runtime memory still contain plaintext; protect access to those separately.

Custom distributions must document their policies, key management and failure behavior. The default Runner allows all requests and execution and stores Tenon Documents as plaintext.

## Guidance for security researchers

Include the attacker's starting permissions and the control that failed in your report. Examples include bypassing configured TLS or authorization, archive traversal during installation, prohibited host access from Lua, and native memory corruption caused by external records.

Running an operator-selected plugin or reading secrets through authorized Tenon Document access is an intended capability. A bypass of an enforced restriction is a separate issue. Authenticated reports and denial-of-service findings are assessed against the affected version's controls and documented limits through the ASF process.
