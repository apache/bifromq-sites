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

Use Proxy Protocol only when the BifroMQ backend listener is reachable exclusively from trusted load balancers or an
equally trusted network path. The load balancer must replace client-supplied address metadata before forwarding the
connection. See the [Security Model](../../admin_guide/security/intro.md#mqtt-client-addresses-and-load-balancers) for
the complete trust-boundary requirements.

### Forwarded Client Address Configuration

Forwarded client-address processing is enabled by default on every MQTT listener to preserve load-balancer
deployments. Configure each listener independently when its upstream connection does not supply that metadata.

| Listener | Proxy Protocol setting | Client-address header setting |
| --- | --- | --- |
| TCP | `tcpListener.enableProxyProtocol` | Not applicable |
| TLS | `tlsListener.enableProxyProtocol` | Not applicable |
| WS | `wsListener.enableProxyProtocol` | `wsListener.enableClientAddressHeader` |
| WSS | `wssListener.enableProxyProtocol` | `wssListener.enableClientAddressHeader` |

Set `enableProxyProtocol: false` when the listener does not receive a Proxy Protocol v1 or v2 header. For WS and
WSS, set `enableClientAddressHeader: false` when the load balancer does not provide `X-Real-IP` and `X-Real-Port`, or
when those headers must be ignored. The two settings are independent. See the
[configuration file manual](../../admin_guide/configuration/config_file_manual.md#mqttserviceconfig-mqttserviceconfig)
for defaults and all listener options.

## Non-LB Deployment

Applicable when all clients use **MQTT 5** and the environment allows brokers to instruct clients to reconnect elsewhere.

**Mechanism:**  
BifroMQ can actively redirect clients using MQTT 5 disconnect semantics:

- `Server moved (0x9D)` — permanent relocation
- `Use another server (0x9C)` — temporary relocation

Redirection logic is defined by the **[Client Balancer Plugin](../../plugin/client_balancer.mdx)**, which can select target brokers based on metrics such as load, latency, or session distribution.
