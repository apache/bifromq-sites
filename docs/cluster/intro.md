---
id: "intro"
sidebar_position: 0
title: "BifroMQ Cluster Overview"
---

BifroMQ employs a decentralized clustering approach, where MQTT protocol workloads are distributed across independent sub-clusters, each dedicated to specific functions. This design is built upon two foundational layers: the Underlay
Cluster and the Overlay Cluster, offering clarity and decoupled architecture for enhanced scalability and fault tolerance.

## Underlay Cluster

The Underlay Cluster forms the backbone of BifroMQ's cluster system. This layer
ensures high availability by eliminating single points of failure and maintaining accurate and timely cluster topology consistency.

#### Key Features:

- **Decentralized Construction**: Facilitates cluster formation without reliance on traditional registration centers, minimizing operational risks.
- **Failure Detection and Auto-Eviction**: Enhances cluster reliability through proactive failure detection and swift membership information synchronization.
- **Split-Brain Recovery**: Incorporates mechanisms to recover from network partitions, maintaining cluster integrity and consistency.

## Overlay Cluster

Built atop the Underlay Cluster, the Overlay Cluster, or Agent Cluster, focuses on specific functional services, leveraging the foundational cluster for membership management and inter-node communication. It simplifies deployment and
operational processes, automatically forming clusters to support stateless RPC services and stateful services built on distributed KV storage engines.

## Deployment Models

BifroMQ supports flexible deployment models, ranging from all-in-one processes(a.k.a `Standalone` cluster) to so-called `Independent Workload` clusters. See the [clustering guide](./clustering.mdx) for practical steps to configure, start, scale, and monitor a cluster.
