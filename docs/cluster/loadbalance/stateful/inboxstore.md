---
sidebar_position: 1
title: "Inbox Store"
---

InboxStore provides persistent offline message queues (write-intensive). It runs as a stateful service on the base-kv overlay cluster; `store_name` for API headers: `InboxStore`.

## Default balancers

| balancerFactory FQN                                                 | Role                                         | Default parameters (load rules)                                                                                                 |
| ------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `org.apache.bifromq.inbox.store.balance.RangeLeaderBalancerFactory` | Spread range leaders evenly                  |                                                                                                                                 |
| `org.apache.bifromq.inbox.store.balance.ReplicaCntBalancerFactory`  | Keep replica count per range to targets      | `votersPerRange: 3`                                                                                                             |
| `org.apache.bifromq.inbox.store.balance.RangeSplitBalancerFactory`  | Split hot/large ranges to sustain throughput | - `maxRangesPerStore: (availableProcessors / 4)`<br/>- `maxCPUUsage: 0.8`<br/>- `maxIODensity: 100`<br/>- `ioNanosLimit: 30000` |

Defaults are set in `inboxStoreConfig.balanceConfig.balancers` in starter config.
