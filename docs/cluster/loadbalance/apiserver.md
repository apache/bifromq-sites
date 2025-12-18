---
sidebar_position: 2
title: "API Server"
---

# API Server Load Balancing

The API Server exposes **HTTP/HTTPS** endpoints for administrative operations such as proxy subscription, message publishing, session management, etc.

## Layer-7 Load Balancing

**Use cases:**

- SSL termination
- request routing
- authentication and authorization
- centralized rate limiting

**Approach:**  
Place a **Layer-7 load balancer or API Gateway** (e.g., NGINX, Envoy, Kong, AWS ALB, GCP API Gateway) in front of API Server nodes.

The L7 load balancer:

- distributes API requests across all nodes with API service enabled
- shields clients from node failures
- provides policy control not included in BifroMQ (auth, quota, throttling)

## API Server Cluster Behavior

The API Server forms a **logical service cluster** automatically on top of the Underlay cluster. Any BifroMQ node with the API server enabled (via `apiServerConfig.enable`) can process HTTP/HTTPS requests. No additional coordination is required beyond load balancer configuration.
