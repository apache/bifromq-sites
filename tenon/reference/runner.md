---
title: "Runner Configuration"
description: "Configure, deploy, secure, and stop a Tenon Runner."
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

# Runner configuration

Start the Runner with one absolute configuration path:

```sh
tenon --config /absolute/path/runner.jsonc
```

The configuration file uses UTF-8 JSONC. Restart the Runner to apply changes. An unreadable or invalid configuration prevents startup. See the [configuration Schema](/tenon/docs/development/reference/runner-schema/) for all fields and allowed values.

```jsonc
{
  "stateDirectory": "/var/lib/tenon",
  "http": {"listenAddress": "127.0.0.1:8080"},
  "pipeline": {
    "startupTimeoutMs": 30000,
    "reconfigureTimeoutMs": 30000,
    "shutdownTimeoutMs": 30000,
    "retryBackoff": {"initialDelayMs": 100, "maximumDelayMs": 30000}
  },
  "lua": {"cpuTimeLimitMs": 50, "memoryLimitBytes": 16777216}
}
```

| Setting | Requirement or default |
| --- | --- |
| `stateDirectory` | Required; a separate writable directory for this Runner |
| `http.listenAddress` | Required; the management API address |
| `pipeline.retryBackoff` | Required; maximum delay must be at least the initial delay |
| Pipeline startup, reconfiguration, and shutdown deadlines | Each defaults to `30000` ms |
| `lua` CPU and memory limits | Required; applied to each Lua VM |
| `extra` | Optional settings for a custom Runner; does not override core fields |

Pipeline deadlines bound startup, updates, and shutdown. A timed-out update restarts the pipeline with the latest valid saved configuration; submitting another update does not extend the deadline.

Configure external-service timeouts in the plugin itself.

## Files, recovery and stopping

Give each Runner its own writable `stateDirectory`, protected from other writers. The Runner creates its state directories with mode `0700`; existing directories must have that mode and must not be symlinks. Modify Tenon Documents and installed packages through the HTTP API.

| Stored or running state | After restart |
| --- | --- |
| Saved Tenon Documents and installed plugins | Recovered from the state directory |
| Missing or damaged plugin | Dependent pipelines remain `unready`; reinstall the package |
| Invalid or unreadable saved Tenon Document | Runner startup fails |
| In-flight records, Lua state, timers | Lost; provide upstream replay and downstream deduplication as needed |

Back up configuration and installed packages with a consistent filesystem snapshot or while the Runner is stopped.

Use SIGINT or SIGTERM for normal shutdown. Allow enough time for the configured Pipeline shutdown deadline before forcing termination. Storage or installed-package corruption can stop the Runner; retain stderr and the exit status for diagnosis.

## Transport and access

Use the [security policy and threat model](/tenon/docs/development/reference/security/) to define the deployment's management access, trusted workloads, secrets and host isolation before exposing this listener.

Without `http.tls`, the configured port is HTTP. Set `http.tls` to the following object for HTTPS:

```json
{
  "certificateChainFile": "/etc/tenon/server-chain.pem",
  "privateKeyFile": "/etc/tenon/server-key.pem",
  "clientCaFile": "/etc/tenon/client-ca.pem",
  "handshakeTimeoutMs": 10000
}
```

| TLS setting | Accepted value or behavior |
| --- | --- |
| `certificateChainFile` | Absolute path to a PEM chain, server certificate first |
| `privateKeyFile` | Absolute path to an unencrypted PKCS#8, PKCS#1, or SEC1 PEM key |
| `clientCaFile` | Optional; when set, every connection needs a trusted client certificate |
| `handshakeTimeoutMs` | Positive duration; defaults to `10000` ms and is not renewed by partial input |

Enabling TLS creates an HTTPS-only listener. It does not provide a plaintext redirect or fallback.

Certificate rotation requires a restart. The Runner does not reload certificates, check online revocation, or reauthenticate existing connections.

The default Runner has no request authorization and stores Tenon Documents as plaintext. Restrict management access with your network, proxy, client certificates, or a custom [authorization extension](/tenon/docs/development/reference/runner-extensions/). Native plugins run as trusted code.

## CPU and memory

Set CPU and memory limits in each [Tenon Document](/tenon/docs/development/user-guide/documents/). On Linux, enforcement requires kernel 5.14 or newer, cgroup v2, and a dedicated writable cgroup scope with the requested controllers delegated. Tenon prepares the required subgroups automatically.

### Host deployment

Use the supplied [systemd unit](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/deploy/systemd/tenon.service) with systemd 251 or newer:

1. Create the `tenon` user and group.
2. Install the binary and configuration at the paths specified in the unit. Set `stateDirectory` to `/var/lib/tenon`.
3. Install the unit as `/etc/systemd/system/tenon.service` and run:

```sh
sudo systemctl daemon-reload
sudo systemctl enable --now tenon
```

The unit's `Delegate=cpu memory` setting enables Tenon Document resource limits. For an interactive session, use the following when your systemd user manager has those controllers delegated:

```sh
systemd-run --user --scope -p 'Delegate=cpu memory' \
  /absolute/path/tenon --config /absolute/path/runner.jsonc
```

### Container deployment

Use the [Docker Compose configuration or Podman instructions](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/deploy/container/README.md). Give each Runner its own container and state volume. The runtime must supply a private cgroup namespace and permission to manage it. The supplied configurations support a container init with Tenon as its direct child.

### Enforcement and troubleshooting

Limits cover the Pipeline and its plugins. They exclude the Runner and container init. Container or service limits may impose tighter bounds. A cgroup scope must be dedicated to one Runner; shared scopes and competing Runners are rejected at startup.

| Situation | Reported behavior |
| --- | --- |
| Linux without writable delegation | `runner.resource_limits_unavailable`; pipelines without resource limits can still run |
| Requested limits cannot be applied | `resource_limits_apply_failed` for that pipeline |
| macOS | Valid limits are retained but `ignored`, with reason `platform_unsupported`; the pipeline runs |

Check service or container permissions before retrying. Pipeline detail reports enforcement for the applied Tenon Document, which may differ from the latest saved version.

Flow channel counts use the allowed logical CPU count at Runner startup, independently of Tenon Document CPU quotas. Account for plugin processes and one Lua VM per channel when planning memory. Script replacement can temporarily use memory for both old and new VMs.

See [observability](/tenon/docs/development/user-guide/observability/) for metrics settings. Record-size and pending-record limits are configured per Flow.
