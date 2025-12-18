---
sidebar_position: 1
title: "Dist Worker"
---

DistWorker handles subscription routing and fan-out (read-heavy). It runs as a stateful service on the base-kv overlay cluster; `store_name` for API headers: `DistWorker`.

## Default balancers

| balancerFactory FQN                                                 | Role                                    | Default parameters (load rules)                    |
| ------------------------------------------------------------------- | --------------------------------------- | -------------------------------------------------- |
| `org.apache.bifromq.dist.worker.balance.RangeLeaderBalancerFactory` | Spread range leaders evenly             |                                                    |
| `org.apache.bifromq.dist.worker.balance.ReplicaCntBalancerFactory`  | Keep replica count per range to targets | - `votersPerRange: 3`<br/>- `learnersPerRange: -1` |

These defaults come from `distWorkerConfig.balanceConfig.balancers` in starter config.
