---
id: "intro"
sidebar_position: 0
title: "Stateful Server Load Balancing"
---

# Stateful Server Load Balancing

All stateful services in BifroMQ are built on top of the **base-kv** distributed storage engine.  
base-kv provides **strong consistency**, **automatic sharding**, and **fault tolerance**, forming the foundation for high availability and elastic scaling of stateful workloads.
Load distribution and availability are jointly managed by **replicated shards** and the **Balancer framework**, which continuously adapts the cluster topology to runtime conditions.

## Core Principles

### Replicated Shards and Quorum

Each stateful service cluster continuously replicates its data across multiple nodes using the Raft protocol.

- As long as a quorum of replicas for a shard (Range) remains alive, the service continues to serve reads and writes.
- Node failures are tolerated transparently without manual intervention.

### Leader-Based Access Model

- Each shard has a designated **leader** responsible for handling writes.
- Leaders are deliberately distributed across the cluster to avoid hotspots and ensure balanced utilization.

High availability therefore emerges from:

- Replica redundancy
- Deterministic leader placement
- Continuous topology adjustment

## Stateful Services Built on base-kv

All BifroMQ stateful servers share the same architectural foundation but optimize their storage schema and access paths based on workload characteristics:

| Service                             | store_name (for API headers) | Role/Workload                     |
| ----------------------------------- | ---------------------------- | --------------------------------- |
| [**DistWorker**](./distworker.md)   | `dist.worker`                | subscription routing              |
| [**InboxStore**](./inboxstore.md)   | `inbox.store`                | persistent offline message queues |
| [**RetainStore**](./retainstore.md) | `retain.store`               | retained message storage          |

This design allows each service to:

- Use the same base-kv primitives
- Apply **deep, workload-specific optimizations**
- Reuse the same balancing and recovery mechanisms

## Store Landscape

Stateful services run on an overlay cluster just like RPC services. You can inspect the server topology via API and also inspect how Range replicas are placed across storage nodes.

### Get store landscape

List the nodes of the stateful service overlay cluster.

**Request**

```
GET /store/landscape
Headers:
  store_name: <STORE_NAME_HEADER>
```

**Response**

```json
[
  {
    "hostId": "c3RvcmUtaWQ=", // Identity of the node in the Underlay Cluster
    "id": "710dc192-4641-4b31-bde1-a36329b33273", // Identity of the stateful server instance in the Overlay Cluster
    "address": "10.0.0.2", // server bind address
    "port": 36801, // server bind port
    "attributes": {
        ...
    }
  }
]
```

### Get range placement in a store

List Range replicas hosted on a specific store server.

**Request**

```
GET /store/ranges
Headers:
  store_name: <STORE_NAME_HEADER>
  store_id: <STORE_ID_HEADER>
```

**Response**

```json
[
  {
    "id": "115240914861228032_0", // the range id
    "ver": 14, // the version of range
    "boundary": {
      // the range boundary
      "startKey": null,
      "endKey": null
    },
    "state": "Normal", // the range state
    "role": "Leader", // the replica role
    "clusterConfig": {
      "voters": [
        "710dc192-4641-4b31-bde1-a36329b33273",
        "c2784a36-4509-41be-96bc-5809026bce99",
        "cd360c5f-7693-40c6-af9c-541cc2467a00"
      ],
      "learners": [],
      "nextVoters": [],
      "nextLearners": []
    }
  }
]
```

## Balancer Framework Overview

The **Balancer framework** continuously shapes the base-kv cluster topology. Although a centralized coordinator is straightforward to implement, the framework is designed to enable **distributed convergence**, meaning there is:

- No central coordinator
- No single point of control
- No out-of-band orchestration

Achieving distributed convergence requires each balancer implementation to be deterministic:

- Every node observes the strong eventually consistent global cluster state
- Each balancer deterministically derives the same _expected_ Range topology (the built-in balancers follow this pattern)
- Each node independently executes balance commands for the Ranges it currently leads

### Built-in StoreBalancers

BifroMQ ships with several built-in Balancers that cover common scenarios and can serve as references for custom implementations.  
The framework lets Balancer implementations expose runtime-tunable rules and be started/paused via API; which balancers to enable and their initial rules are set in configuration (for example, `BalancerOptions.balancers` keyed by balancerFactory FQN).

| Balancer              | Focus                                                    | Rules                                                                                                                                                                                |
| --------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `RangeLeaderBalancer` | Evenly spread Range leaders to avoid hotspots            |                                                                                                                                                                                      |
| `ReplicaCntBalancer`  | Keep replica counts aligned with goals (voters/learners) | - `votersPerRange`: target voters per range (must be odd)<br/>- `learnersPerRange`: target learners per range (-1 means no limit)                                                    |
| `RangeSplitBalancer`  | Split "hot" Ranges to sustain throughput                 | - `maxCpuUsagePerRange`: CPU threshold<br/>- `maxIODensityPerRange`: IO density cap<br/>- `ioNanosLimitPerRange`: IO latency cap (ns)<br/>- `maxRangesPerStore`: per-store range cap |

### BalancerOptions

[`BalancerOptions`](../../../admin_guide/configuration/config_file_manual.md#balanceroptions) tells a BifroMQ process with DistWorker enabled which balancers to instantiate at startup and the initial values of their rules. `BalancerOptions.balancers` is a map keyed by the balancerFactory FQN, with a `Struct` payload for initial rules. For example, to start a `ReplicaCntBalancer` on DistWorker with default replica targets:

```yaml
distWorkerConfig:
  balanceConfig:
    balancers:
      org.apache.bifromq.dist.worker.balance.ReplicaCntBalancerFactory:
        votersPerRange: 3
        learnersPerRange: -1
```

### Enable/Disable Balancer at Runtime

Balancers can be started or paused via the runtime API without restarting the service. This lets operators temporarily disable a balancer for observation or mitigation, then re-enable it as needed; deterministic behavior preserves convergence when reactivated. Note: ensure the `balancer_factory_class` is correct when enabling the balancer instances initialized via `BalancerOptions`.

#### Enable the balancer instances

```
PUT /store/balancer/enable
Headers:
  store_name: <STORE_NAME_HEADER>
  balancer_factory_class: <BALANCER_FACTORY_CLASS_FQN>
```

#### Disable the balancer instances

```
PUT /store/balancer/disable
Headers:
  store_name: <STORE_NAME_HEADER>
  balancer_factory_class: <BALANCER_FACTORY_CLASS_FQN>
```

### Update Balancer's rules at runtime

Balancer rules (the same `Struct` schema used in `BalancerOptions.balancers`) can be updated at runtime through the API. New rules take effect immediately, and subsequent balance cycles converge using the updated values.

#### Get rules override

Retrieve the rules override; a 404 is returned if no override is set.

**Request**

```
GET /store/balancer/rules
Headers:
  store_name: <STORE_NAME_HEADER>
  balancer_factory_class: <BALANCER_FACTORY_CLASS_FQN>
```

**Response**

```json
{
  "votersPerRange": 1.0
}
```

#### Merge rules override with existing rules

Merge a rules override with existing rules; the caller must ensure the payload is structurally valid.

```
PUT /store/balancer/rules
Headers:
  store_name: <STORE_NAME_HEADER>
  balancer_factory_class: <BALANCER_FACTORY_CLASS_FQN>
Body: balance rules override json
```

#### Get balancer states

Get the latest state of the balancer instances running on each stateful server.

**Request**

```
GET /store/balancer
Headers:
  store_name: <STORE_NAME_HEADER>
  balancer_factory_class: <BALANCER_FACTORY_CLASS_FQN>
```

**Response**

```json
{
  "org.apache.bifromq.dist.worker.balance.ReplicaCntBalancerFactory": {
    "710dc192-4641-4b31-bde1-a36329b33273": { // store id running the balancer instance
      "disable": false, // whether the balancer is disabled
      "loadRules": { // effective load rules
        "votersPerRange": 1.0,
        "learnersPerRange": -1.0
      },
      "hlc": "115526170745044992" // hlc timestamp of last update
    },
    ...
  }
}
```
