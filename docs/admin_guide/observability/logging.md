---
sidebar_position: 1
title: "Logging"
---

BifroMQ utilizes the standard SLF4J interface for logging purposes and selects Apache Log4j as its logging backend. The logs are organized into five distinct levels: TRACE, DEBUG, INFO, WARN, and ERROR, with INFO set as the default log level.

### Log4j Configuration File

The log4j configuration file, named `log4j2.xml`, is located in the `conf` directory within the BifroMQ installation folder. This file allows for detailed customization of logging behavior, including log level settings, output formats, and file rotation policies.

### Log Directories

By default, BifroMQ stores log files in the `log` directory found in the installation folder. If necessary, an alternative logging directory can be designated by setting the `LOG_DIR` environment variable.

### Plugin Logging

Plugin implementors can also leverage the standard SLF4J interface for logging.
