---
sidebar_position: 2
title: "Linux tuning for MQTT at scale"
description: Diagnose and tune Linux connection tracking, file descriptors, listen queues, ports, and TCP behavior for Apache BifroMQ deployments.
---

Linux defaults are suitable for many Apache BifroMQ (Incubating) deployments. Change them only after measurements show that a host or node limit is constraining a representative workload. A value copied from another environment can waste memory, hide an application bottleneck, or make failure recovery slower.

This guide applies to current Linux hosts and Kubernetes nodes running Apache BifroMQ. Kernel defaults and available parameters vary by kernel and distribution, so record the versions and current values before testing.

## Before changing a limit

Capture a baseline while reproducing the expected connection count, connection rate, MQTT keep-alive interval, QoS, payload size, and network topology. In particular, record whether traffic crosses NAT, a stateful firewall, a Kubernetes Service, or another component that uses Netfilter connection tracking.

```bash
uname -r
sysctl net.netfilter.nf_conntrack_count 2>/dev/null || true
sysctl net.netfilter.nf_conntrack_max 2>/dev/null || true
sysctl net.core.somaxconn net.ipv4.tcp_max_syn_backlog
sysctl net.ipv4.ip_local_port_range
cat /proc/sys/fs/file-nr
```

Also capture CPU, memory, packet loss, retransmissions, listen-queue drops, and Apache BifroMQ's [connection and latency metrics](../observability/metrics/tenantmetrics.md). Change one group of settings at a time and keep the baseline values as the rollback target.

## Netfilter connection tracking

Connection tracking matters only when the traffic path is tracked by Netfilter. A direct broker host with no stateful firewall or NAT may not need a larger table, while a Kubernetes node, NAT gateway, or firewall can track more flows than the broker's MQTT connection count.

The kernel exposes the current number of allocated flows as `nf_conntrack_count` and the limit as `nf_conntrack_max`. The hash table stores each tracked flow in both directions; do not infer capacity from a fixed buckets-to-connections ratio. See the Linux kernel's [Netfilter conntrack sysctl documentation](https://docs.kernel.org/networking/nf_conntrack-sysctl.html) for the definitions and kernel defaults.

### Diagnose a full table

Typical evidence includes failed or delayed new connections, packet loss during reconnect bursts, and the kernel message `nf_conntrack: table full, dropping packet`.

```bash
sysctl net.netfilter.nf_conntrack_count net.netfilter.nf_conntrack_max
cat /sys/module/nf_conntrack/parameters/hashsize 2>/dev/null || true
journalctl -k --grep='nf_conntrack.*table full' --since=-1h
```

Sample `nf_conntrack_count` throughout steady traffic, reconnect storms, rolling deployments, and failover. Compare it with MQTT connection metrics: a large difference usually means other node traffic or short-lived flows are consuming the table.

### Size and test the limit

Use the highest observed count from a representative test, then add headroom for a measured burst and operational overlap. For example, a 25% headroom calculation can be expressed as follows, but 25% is an example rather than a universal recommendation:

```bash
observed_peak=400000       # Replace with the measured peak.
headroom_percent=25        # Replace with a reviewed safety margin.
target_conntrack_max=$((observed_peak * (100 + headroom_percent) / 100))
printf '%s\n' "$target_conntrack_max"
```

Before increasing the limit, verify that the node has enough memory under peak broker, kernel, container, and sidecar load. Conntrack memory cost depends on the kernel build and enabled extensions, so validate it on the target kernel instead of assuming a fixed number of bytes per flow.

Test a temporary change first:

```bash
old_conntrack_max=$(sysctl -n net.netfilter.nf_conntrack_max)
sudo sysctl -w net.netfilter.nf_conntrack_max="$target_conntrack_max"
```

Rollback in the same test session with:

```bash
sudo sysctl -w net.netfilter.nf_conntrack_max="$old_conntrack_max"
```

Persist a validated value through the host's configuration management or a dedicated file under `/etc/sysctl.d/`, then run `sudo sysctl --system`. Keep ownership, review, rollout, and rollback consistent across every broker node.

Do not shorten established, FIN-WAIT, CLOSE-WAIT, or TIME-WAIT conntrack timeouts merely to make the count fall. These values describe network state and changing them can expire valid flows. Tune a timeout only when packet captures and a reproduction demonstrate that stale tracked flows—not live or recoverable connections—cause the pressure.

## File descriptors

Each accepted TCP socket consumes a file descriptor, but Apache BifroMQ also needs descriptors for files, logs, inter-node connections, and other resources. Size the process limit from the measured peak descriptor count, not from MQTT connections alone.

After identifying the exact broker process ID, inspect its current limits and usage:

```bash
BIFROMQ_PID=12345  # Replace with the broker PID from the service or container runtime.
grep -i 'open files' "/proc/$BIFROMQ_PID/limits"
find "/proc/$BIFROMQ_PID/fd" -mindepth 1 -maxdepth 1 -printf '.' | wc -c
cat /proc/sys/fs/file-nr
sysctl fs.file-max fs.nr_open
```

The process soft and hard `RLIMIT_NOFILE` values must cover the observed peak plus reviewed headroom. The system-wide `fs.file-max` and per-process ceiling `fs.nr_open` are separate limits; raise only the limit that measurements reach. The Linux kernel documents these values in [Documentation for `/proc/sys/fs/`](https://docs.kernel.org/admin-guide/sysctl/fs.html).

For a systemd-managed service, use a reviewed unit override with `LimitNOFILE=` and verify the effective value after restart:

```bash
systemctl show YOUR_BIFROMQ_UNIT --property=LimitNOFILE
```

For Docker or another container runtime, configure the runtime's `nofile` limit and confirm `/proc/$BIFROMQ_PID/limits` inside the running container. A host shell's `ulimit` does not retroactively change an existing service or container.

## Listen queues and connection bursts

`net.core.somaxconn` caps the completed connection queue requested by `listen()`. `net.ipv4.tcp_max_syn_backlog` limits remembered connection requests in `SYN_RECV`. Raising either value cannot fix an application that is not accepting connections fast enough, an overloaded CPU, or an upstream load balancer limit.

Check the configured values, socket queues, and cumulative overflow counters during a connection burst:

```bash
sysctl net.core.somaxconn net.ipv4.tcp_max_syn_backlog
ss -lnt
nstat -az TcpExtListenOverflows TcpExtListenDrops
```

If `TcpExtListenOverflows` or `TcpExtListenDrops` increases under valid traffic, first verify CPU saturation, garbage collection, load balancer health, and the broker's accept rate. Increase queue limits only when the application requests a sufficient backlog and memory remains stable. The kernel's [IP sysctl documentation](https://docs.kernel.org/networking/ip-sysctl.html) describes both limits and warns that forcing resets with `tcp_abort_on_overflow` can harm clients.

## Ephemeral ports

Inbound MQTT connections use the clients' ephemeral ports, not a new local ephemeral port on the broker. The broker host can still exhaust its local range when it creates many outbound connections, and load generators, reverse proxies, NAT devices, or sidecars can exhaust their own ranges.

```bash
sysctl net.ipv4.ip_local_port_range net.ipv4.ip_local_reserved_ports
ss -s
```

If the local range is the constraint, inventory reserved listener ports before widening it and confirm there is no overlap with `ip_local_reserved_ports`. Test the component that actually opens the outbound connections rather than changing every broker node.

## TIME-WAIT and TCP keepalive

High TIME-WAIT counts usually reflect a high connection churn rate. Determine which endpoint actively closes the connections and fix unnecessary reconnects before changing TCP behavior.

```bash
ss -ant state time-wait | tail -n +2 | wc -l
sysctl net.ipv4.tcp_max_tw_buckets
```

Do not lower `tcp_max_tw_buckets` to discard state, and do not enable `tcp_tw_reuse` as a generic capacity fix. Either change requires a topology-specific test covering NAT, load balancers, delayed packets, and client compatibility.

MQTT Keep Alive is a protocol-level liveness mechanism and is distinct from Linux TCP keepalive. Kernel settings such as `tcp_keepalive_time`, `tcp_keepalive_intvl`, and `tcp_keepalive_probes` apply only when the socket enables `SO_KEEPALIVE`. Prefer an MQTT keep-alive and reconnect policy that matches the device network; change TCP keepalive only after confirming the broker and intermediaries use it.

## Socket memory and network backlog

Modern Linux kernels automatically tune TCP receive buffers within the `tcp_rmem` bounds. Large fixed `rmem_default`, `wmem_default`, `rmem_max`, `wmem_max`, or `netdev_max_backlog` values are not general Apache BifroMQ requirements and can increase memory use or queueing latency.

Inspect retransmissions, drops, socket memory, interface queues, and CPU before changing buffer limits:

```bash
ss -s
nstat -az TcpRetransSegs TcpExtTCPBacklogDrop
ip -s link
```

Tune buffers only for a reproduced bandwidth-delay or packet-processing bottleneck, and validate latency and memory as well as throughput.

## Kubernetes nodes

Determine whether a parameter belongs to the pod's network namespace or to the node. Kubernetes allows only a limited set of safe namespaced sysctls by default; `net.core.somaxconn` and many other settings are classified as unsafe, while some conntrack behavior depends on the kernel version and namespace. See [Using sysctls in a Kubernetes cluster](https://kubernetes.io/docs/tasks/administer-cluster/sysctl-cluster/) before adding a pod `securityContext` or changing kubelet policy.

For node-level changes:

- apply the same reviewed configuration to a dedicated node pool;
- use taints and tolerations when tuned nodes should run only the intended workload;
- include kube-proxy, ingress, sidecars, and unrelated pod traffic in conntrack measurements;
- roll out to one node first and preserve a tested rollback;
- do not use an unreviewed privileged init container to mutate shared node settings.

Also set realistic pod CPU and memory requests and limits as described in [Run BifroMQ nodes on Kubernetes](../../installation/nodes_on_k8s.md). Kernel tuning cannot compensate for CPU throttling or an undersized JVM/container memory limit.

## Reproducible validation

Record the following with every tuning proposal:

1. Apache BifroMQ release and configuration, Java version, kernel and distribution, CPU, memory, NIC, and container runtime.
2. Network path, NAT/firewall/Kubernetes components, client count and connection rate, MQTT Keep Alive, QoS, payload, subscription shape, and reconnect behavior.
3. Baseline values and time-series evidence for the limit being changed.
4. One change at a time, including the temporary command, persistent configuration, rollout scope, and exact rollback.
5. Results through warm-up, steady state, reconnect burst, broker restart or failover, and recovery.
6. MQTT connection, connect/disconnect, and latency metrics together with CPU, memory, retransmissions, drops, listen overflows, file descriptors, and conntrack usage.

Stop or roll back when packet loss, retransmissions, latency, memory pressure, kernel errors, or recovery time regress—even if the peak connection count increases. Use the project's [benchmark methodology](../../benchmark/intro.md) as a starting point and publish enough environment and workload detail for another contributor to reproduce the result.

## Related documentation

- [Linux installation](../../installation/linux.mdx)
- [Run BifroMQ nodes on Kubernetes](../../installation/nodes_on_k8s.md)
- [Cluster deployment](../../cluster/clustering.mdx)
- [MQTT server load balancing](../../cluster/loadbalance/mqttserver.md)
- [Metrics and observability](../observability/metrics/intro.md)
- [Tenant-level metrics](../observability/metrics/tenantmetrics.md)
- [Benchmark methodology](../../benchmark/intro.md)
