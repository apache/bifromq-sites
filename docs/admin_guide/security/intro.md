---
sidebar_position: 0
title: "Security Model"
---

This document defines the security model of Apache BifroMQ. It describes the expected deployment model, trusted
roles, security boundaries, and the responsibilities shared between BifroMQ and the surrounding platform.

This document is not a list of security features or a replacement for the ASF vulnerability reporting process. Its
purpose is to make the assumptions behind BifroMQ's architecture explicit.

## Product and Deployment Model

Apache BifroMQ is production-grade, multi-tenant MQTT messaging middleware for building large-scale messaging systems.
It is designed to be integrated into an operator's platform rather than deployed as a complete identity,
access-management, and perimeter-security system.

Only MQTT client listeners explicitly selected and secured by the operator are intended to accept traffic from MQTT
clients.

The following surfaces are operator-facing or internal by default:

- the HTTP API Server;
- cluster membership and inter-node communication endpoints;
- metrics, debugging, and operational endpoints;
- the plugin directory and installed plugin code;
- configuration files, JVM options, environment variables, certificates, and cluster discovery settings.

If any of these surfaces must be accessed outside the trusted deployment network, the operator must place an
appropriate security layer in front of them.

:::warning

The quick-start configuration, DevOnly implementations, and bundled DemoPlugin prioritize evaluation and integration
guidance. They are not a production security baseline.

:::

## Roles and Trust Assumptions

### Deployment Operators

Deployment operators install, configure, and run BifroMQ. They control the host, network, configuration files,
environment variables, JVM options, certificates, plugin directory, cluster discovery settings, and stored data.

Deployment operators are fully trusted. Anyone with equivalent access can control the BifroMQ deployment and is
therefore inside the trusted boundary.

### Plugin Authors and Plugin Code

BifroMQ plugins run inside the broker process and can access process resources available to their code. Plugin
class-loader isolation supports dependency and implementation separation; it is not a security sandbox.

Installed plugins and the people who approve them must be trusted. Operators are responsible for reviewing plugin code,
protecting the plugin supply chain, managing plugin credentials, and restricting plugin network access.

### MQTT Clients

MQTT clients are outside the trusted boundary.

BifroMQ is responsible for safely processing MQTT protocol input and for enforcing the authentication and authorization
decisions returned by the configured [Auth Provider](../../plugin/auth_provider.mdx).

When no production Auth Provider is configured, BifroMQ does not establish a production-grade client identity or
authorization boundary. Connections accepted under DevOnly behavior must not be treated as authenticated production
clients.

### Management API Callers

The BifroMQ API Server is a trusted control-plane interface. Its callers can perform administrative operations such as
publishing messages, managing sessions and subscriptions, and inspecting or changing cluster state.

The API Server is enabled by default on every BifroMQ service node, using port `8091`, and does not authenticate or
authorize HTTP callers at the application layer. It must be kept on a trusted network or placed behind a
customer-managed API gateway that provides authentication, authorization, rate limiting, and auditing.

TLS, including mutual TLS when configured, can protect the connection and authenticate transport peers. It does not
provide an application role model or prove that a caller is authorized to act for a tenant.

Request fields such as `tenant_id` identify the target of an operation. They are not proof that the caller is authorized
to act for that tenant.

### Cluster Members

BifroMQ nodes communicate over cluster membership and RPC interfaces. Cluster peers are expected to run inside an
operator-controlled cluster network.

The cluster environment name provides logical grouping. It is not a credential and must not be treated as node
authentication.

Operators must restrict cluster ports to trusted nodes, configure stable network boundaries, and enable the available
transport security when required by their deployment.

## Trust Boundaries

| Surface | Expected trust level | BifroMQ responsibility | Deployment responsibility |
| --- | --- | --- | --- |
| MQTT listeners | MQTT clients are untrusted | Parse MQTT traffic safely and enforce configured Auth Provider decisions | Configure production authentication, authorization, TLS, public rate limiting, and denial-of-service protection |
| HTTP API Server | Callers are trusted control-plane components | Execute documented administrative operations correctly | Keep the API private or protect it with an authenticated and authorized API gateway |
| Cluster membership and RPC | Peers are trusted cluster nodes | Implement cluster and RPC behavior and provide configurable transport security | Isolate cluster ports, manage certificates, and control cluster discovery |
| Plugins | Plugin code is fully trusted | Provide stable plugin interfaces and runtime integration | Review plugin code, protect the plugin directory, manage secrets, and restrict egress |
| Configuration and runtime inputs | Controlled by a trusted operator | Validate and apply documented configuration | Protect files, environment variables, JVM options, DNS, certificates, and deployment automation |
| Metrics and operational endpoints | Accessible only to trusted operational systems | Expose documented operational data | Restrict network access and protect any exported operational data |

## Responsibilities of BifroMQ

Within the boundaries described above, BifroMQ is responsible for:

- safely processing protocol input received from MQTT clients;
- applying authentication and authorization results returned by the configured Auth Provider;
- preserving tenant separation after a client identity has been established;
- honoring configured TLS and certificate-validation behavior;
- preventing lower-trust MQTT clients from invoking control-plane operations;
- handling malformed or adversarial input without unintended code execution, cross-tenant access, persistent data
  corruption, or disproportionate resource amplification;
- documenting security-relevant defaults and the intended exposure of each interface.

A problem in these areas may represent a BifroMQ security vulnerability even when the surrounding platform is otherwise
configured correctly.

## Responsibilities of Deployment Operators

A production deployment should:

- configure a reviewed, production-grade Auth Provider;
- enable TLS or WSS where client traffic crosses an untrusted network;
- expose only the required MQTT client listeners;
- keep the API Server behind a trusted network or authenticated API gateway;
- restrict cluster membership and RPC ports to trusted BifroMQ nodes;
- protect configuration files, JVM options, environment variables, certificates, plugin artifacts, data volumes, logs,
  and deployment credentials;
- install only reviewed production plugins;
- remove or disable development and demonstration components that are not required;
- apply network egress controls to plugins and external integrations;
- configure tenant resource policies, rate limits, monitoring, and operational alerting appropriate to the workload;
- use separate deployments when the required isolation is stronger than the trust model of a shared process and shared
  operator boundary.

## Development and Demonstration Components

BifroMQ includes DevOnly behavior and a bundled DemoPlugin to make the software easy to evaluate and to provide runnable
examples of the plugin interfaces.

These components demonstrate how an integrator can implement authentication, resource throttling, tenant settings,
event collection, and monitoring. They are not production implementations and do not define a production security
boundary.

Production operators must replace demonstration providers with reviewed implementations that satisfy their identity,
authorization, availability, privacy, and network-security requirements.

The presence of a demonstration component in a distribution does not make it production-ready or part of BifroMQ's
production security guarantees. Some demo features may start with the distribution; operators must review and disable or
remove them in production.

## Security Issue Classification

Every report is evaluated on its specific facts. The following examples clarify how the security model is applied.

### Generally Considered Security Vulnerabilities

Examples include:

- an MQTT client bypassing a correctly configured Auth Provider;
- an authenticated client accessing another tenant's messages or state without authorization;
- malformed or low-volume network input causing unintended code execution, sensitive-data disclosure, persistent
  corruption, or disproportionate resource exhaustion;
- bypassing configured TLS or certificate validation;
- an untrusted MQTT client reaching a control-plane operation through a BifroMQ protocol or routing path while the
  operator-facing interface remains isolated by deployment controls;
- unauthorized modification or loading of plugins without prior access to trusted operator controls.

### Generally Outside the BifroMQ Security Boundary

The following behaviors do not, by themselves, demonstrate a BifroMQ vulnerability:

- a deployment operator using existing access to modify configuration, JVM options, environment variables,
  certificates, plugins, DNS, or stored data;
- a trusted plugin reading process data, making network requests, or otherwise exercising the privileges granted to
  in-process code;
- exposing the operator-facing API Server directly to an untrusted network without the required gateway or network
  restriction;
- unrestricted MQTT access when the operator has not configured a production Auth Provider;
- security limitations in components clearly identified as DevOnly, demonstration, or testing implementations;
- vulnerabilities introduced entirely by customer-written plugins, gateways, deployment scripts, or external services;
- cluster discovery resolving addresses supplied through trusted operator configuration and trusted cluster DNS;
- capacity exhaustion caused solely by traffic exceeding the deployment's provisioned capacity or by missing perimeter
  rate limits.

These cases may still justify documentation improvements or defensive hardening. They are not automatically classified
as security vulnerabilities unless an untrusted actor crosses a boundary that BifroMQ claims to enforce.

## Reporting a Security Issue

Security reports should identify:

- the affected BifroMQ version;
- the relevant deployment configuration;
- the attacker's role and existing access;
- the trusted boundary that is crossed;
- the resulting confidentiality, integrity, or availability impact;
- a minimal proof of concept showing the behavior.

Suspected vulnerabilities must be reported privately by following the
[Apache Software Foundation security reporting process](https://www.apache.org/security/). Do not open a public issue
before coordinated disclosure.
