---
id: "intro"
sidebar_position: 0
title: "Load Balancing"
---

# Load Balancing

BifroMQ applies different load-balancing mechanisms for client-facing services, internal RPC services, and stateful storage services.

## Client-Facing Services

**Purpose:**  
Distribute external MQTT and API traffic across multiple nodes to improve availability and absorb load variations.

**Approach:**

- Use standard **Layer 4 or Layer 7 load balancers** in front of MQTT Server or API Server.
- In controlled network environments, MQTT clients may use **custom client-side balancing strategies**.

## Internal RPC Services

**Purpose:**  
Balance internal request routing for subscription processing, inbox dispatching, and retained-message operations.

**Approach:**

- Use BifroMQ’s **traffic governance interfaces** to inspect service topology, define routing rules, and direct RPC traffic.

## Stateful Service Clusters

**Purpose:**  
Distribute sharded storage and compute workloads for dynamic subscriptions, offline messages, and retained messages.

**Approach:**

- The storage layer manages **shard placement, leader roles, and adaptive load distribution** automatically.
- Landscape-level APIs provide visibility into shard layout and replica distribution.
