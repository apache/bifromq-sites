---
title: Test, Package & Install
sidebar_position: 5
description: Validate a plugin through the normal Runner lifecycle and real external behavior.
---

# Test, package, and install

Start with focused language tests, then run the standard bundle command. The meaningful acceptance check is a real Runner process:

1. Install the local bundle through `POST /plugins`.
2. Create a Tenon Document binding the correct interface and payload contract.
3. Observe Pipeline state, desired/applied ETags, plugin diagnostics, and external delivery.
4. Exercise malformed configuration, unavailable external services, retry or replay, and normal shutdown.
5. Remove the Tenon Document with its current ETag and confirm the plugin process exits.

Keep license and notice files in the bundle. Record the source commit, target platform, exact Program version, and evidence in the plugin README. See the [repository verification guide](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/CONTRIBUTING.md) for the shared checks.
