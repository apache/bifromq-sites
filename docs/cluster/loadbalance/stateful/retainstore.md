---
sidebar_position: 1
title: "Retain Store"
---

RetainStore serves retained messages (read-dominant). It runs as a stateful service on the base-kv overlay cluster; `store_name` for API headers: `RetainStore`.

## Default balancers

| balancerFactory FQN                                                 | Role                                         | Default parameters (load rules)                                                                                               |
| ------------------------------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `org.apache.bifromq.retain.store.balance.ReplicaCntBalancerFactory` | Keep replica count per range to targets      | - `votersPerRange: 3`<br/>- `learnersPerRange: -1`                                                                            |
| `org.apache.bifromq.retain.store.balance.RangeSplitBalancerFactory` | Split hot/large ranges to sustain throughput | - `maxRangesPerStore: (availableProcessors / 4)`<br/>-`maxCPUUsage: 0.8`<br/>-`maxIODensity: 100`<br/>- `ioNanosLimit: 30000` |

Defaults are set in `retainStoreConfig.balanceConfig.balancers` in starter config.
