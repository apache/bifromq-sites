---
sidebar_position: 1
title: "MQTT Server"
---

# MQTT Server Load Balancing

MQTT Broker nodes expose **TCP / TLS / WS / WSS** endpoints for MQTT 3.1.1 and MQTT 5.0 clients.  
Two load-balancing approaches are available depending on deployment conditions.

## L4 Load Balancing

**Use cases:**

- Horizontal distribution of client connections
- TLS offloading at the load balancer layer

**Supported balancers:**  
Any standard **Layer-4 TCP load balancer** (e.g., NGINX stream, HAProxy, AWS NLB).

**Proxy Protocol Support:**  
BifroMQ supports **Proxy Protocol v1 and v2**. It allows the load balancer to forward the real client IP and port.

## Non-LB Deployment

Applicable when all clients use **MQTT 5** and the environment allows brokers to instruct clients to reconnect elsewhere.

**Mechanism:**  
BifroMQ can actively redirect clients using MQTT 5 disconnect semantics:

- `Server moved (0x9D)` — permanent relocation
- `Use another server (0x9C)` — temporary relocation

Redirection logic is defined by the **[Client Balancer Plugin](../../plugin/client_balancer.mdx)**, which can select target brokers based on metrics such as load, latency, or session distribution.
