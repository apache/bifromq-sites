import React, { type ReactNode } from 'react';

const diagramStyle = {
  display: 'block',
  width: '100%',
  maxWidth: 560,
  height: 'auto',
  margin: '1.5rem auto',
};
const ink = 'var(--color-text-primary)';
const muted = 'var(--color-text-secondary)';
const surface = 'var(--color-surface)';
const wash = 'var(--color-wash)';
const border = 'var(--color-border-strong)';
const accent = 'var(--color-accent)';

export function TenonOverviewDiagram(): ReactNode {
  return <svg viewBox="0 0 480 700" role="img" aria-labelledby="tenon-overview-title tenon-overview-desc" style={diagramStyle}>
    <title id="tenon-overview-title">From a Tenon Document to a running Pipeline</title>
    <desc id="tenon-overview-desc">A user submits a Tenon Document that selects plugin Programs, configures Instances, and connects Flows. The Runner applies the Tenon Document and runs a Pipeline connecting Source Instances through Lua to Sink Instances.</desc>
    <defs><marker id="tenon-overview-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill={accent} /></marker></defs>
    <g fontFamily="inherit" fill={ink} textAnchor="middle">
      <rect x="100" y="10" width="280" height="52" rx="6" fill={surface} stroke={border} />
      <text x="240" y="44" fontSize="23" fontWeight="600">User</text>
      <path d="M240 62V117" fill="none" stroke={accent} strokeWidth="2" markerEnd="url(#tenon-overview-arrow)" />
      <text x="250" y="96" textAnchor="start" fontSize="17" fill={muted}>writes and submits</text>
      <rect x="50" y="126" width="380" height="106" rx="6" fill={surface} stroke={accent} strokeWidth="2" />
      <text x="240" y="159" fontSize="23" fontWeight="600">Tenon Document</text>
      <text x="240" y="189" fontSize="18" fill={muted}>Plugin selection and configuration</text>
      <text x="240" y="215" fontSize="18" fill={muted}>Flows, Lua scripts, delivery settings</text>
      <path d="M240 232V293" fill="none" stroke={accent} strokeWidth="2" markerEnd="url(#tenon-overview-arrow)" />
      <text x="250" y="269" textAnchor="start" fontSize="17" fill={muted}>applied by</text>
      <rect x="12" y="302" width="456" height="386" rx="6" fill={wash} stroke={border} />
      <text x="36" y="338" textAnchor="start" fontSize="24" fontWeight="600">Tenon Runner</text>
      <text x="36" y="366" textAnchor="start" fontSize="17" fill={muted}>Manages the running Pipelines</text>
      <rect x="34" y="384" width="412" height="280" rx="6" fill={surface} stroke={border} strokeDasharray="5 5" />
      <text x="53" y="413" textAnchor="start" fontSize="18" fontWeight="600">Pipeline · one Flow shown</text>
      <rect x="90" y="430" width="300" height="52" rx="4" fill={wash} stroke={border} />
      <text x="240" y="462" fontSize="21">Source Instance · receives</text>
      <path d="M240 482V510" stroke={accent} strokeWidth="2" markerEnd="url(#tenon-overview-arrow)" />
      <rect x="90" y="518" width="300" height="48" rx="4" fill={wash} stroke={accent} />
      <text x="240" y="549" fontSize="21">Lua · transforms and routes</text>
      <path d="M240 566V594" stroke={accent} strokeWidth="2" markerEnd="url(#tenon-overview-arrow)" />
      <rect x="90" y="602" width="300" height="48" rx="4" fill={wash} stroke={border} />
      <text x="240" y="633" fontSize="21">Sink Instances · deliver</text>
    </g>
  </svg>;
}

export function FirstPipelineDiagram(): ReactNode {
  return <svg viewBox="0 0 480 500" role="img" aria-labelledby="tenon-pipeline-title tenon-pipeline-desc" style={diagramStyle}>
    <title id="tenon-pipeline-title">The first Pipeline: timer to Stdout Sink</title>
    <desc id="tenon-pipeline-desc">Dummy Source provides the Flow's Source binding but emits no records. A timer calls Lua every second. Lua builds a probe message and emits it to Stdout Sink, whose output is visible through live diagnostics.</desc>
    <defs><marker id="tenon-pipeline-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill={accent} /></marker></defs>
    <g fontFamily="inherit" fill={ink} textAnchor="middle">
      <rect x="12" y="10" width="456" height="395" rx="6" fill={wash} stroke={border} />
      <text x="34" y="47" textAnchor="start" fontSize="23" fontWeight="600">Pipeline: debug</text>
      <rect x="28" y="70" width="204" height="88" rx="4" fill={surface} stroke={border} />
      <text x="130" y="106" fontSize="22" fontWeight="600">Dummy Source</text>
      <text x="130" y="134" fontSize="18" fill={muted}>No input records</text>
      <rect x="248" y="70" width="204" height="88" rx="4" fill={surface} stroke={accent} />
      <text x="350" y="106" fontSize="22" fontWeight="600">Lua timer</text>
      <text x="350" y="134" fontSize="18" fill={muted}>Every second</text>
      <path d="M130 158V208" stroke={muted} strokeWidth="2" strokeDasharray="5 5" />
      <path d="M350 158V199" stroke={accent} strokeWidth="2" markerEnd="url(#tenon-pipeline-arrow)" />
      <rect x="48" y="208" width="384" height="74" rx="4" fill={surface} stroke={accent} />
      <text x="240" y="239" fontSize="22" fontWeight="600">Lua processing</text>
      <text x="240" y="264" fontSize="18" fill={muted}>Build and emit “probe N”</text>
      <path d="M240 282V317" stroke={accent} strokeWidth="2" markerEnd="url(#tenon-pipeline-arrow)" />
      <rect x="48" y="326" width="384" height="58" rx="4" fill={surface} stroke={border} />
      <text x="240" y="362" fontSize="22" fontWeight="600">Stdout Sink</text>
      <path d="M240 384V438" stroke={accent} strokeWidth="2" markerEnd="url(#tenon-pipeline-arrow)" />
      <text x="250" y="425" textAnchor="start" fontSize="17" fill={muted}>live diagnostics</text>
      <text x="240" y="473" fontSize="21" fontFamily="var(--font-mono)">probe 1 · probe 2 · probe 3 …</text>
    </g>
  </svg>;
}

export function MqttPipelineDiagram(): ReactNode {
  return <svg viewBox="0 0 480 630" role="img" aria-labelledby="tenon-mqtt-title tenon-mqtt-desc" style={diagramStyle}>
    <title id="tenon-mqtt-title">Forward MQTT messages through Tenon</title>
    <desc id="tenon-mqtt-desc">A publisher sends a message to tenon/input on BifroMQ. The MQTT Source receives it, Lua preserves its body and changes its topic, and the MQTT Sink publishes it to tenon/output on the same BifroMQ broker. A subscriber receives the result. Source and Sink use the same broker plugin instance configured in the Tenon Document.</desc>
    <defs><marker id="tenon-mqtt-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill={accent} /></marker></defs>
    <g fontFamily="inherit" fill={ink} textAnchor="middle">
      <text x="240" y="28" fontSize="19">Publisher → BifroMQ</text>
      <rect x="88" y="43" width="304" height="52" rx="4" fill={surface} stroke={border} />
      <text x="240" y="76" fontSize="22" fontFamily="var(--font-mono)">tenon/input</text>
      <path d="M240 95V133" stroke={accent} strokeWidth="2" markerEnd="url(#tenon-mqtt-arrow)" />
      <rect x="12" y="142" width="456" height="327" rx="6" fill={wash} stroke={border} />
      <text x="34" y="174" textAnchor="start" fontSize="23" fontWeight="600">Tenon · forward Flow</text>
      <rect x="48" y="194" width="384" height="56" rx="4" fill={surface} stroke={border} />
      <text x="240" y="229" fontSize="22">MQTT Source · subscribes</text>
      <path d="M240 250V280" stroke={accent} strokeWidth="2" markerEnd="url(#tenon-mqtt-arrow)" />
      <rect x="48" y="289" width="384" height="75" rx="4" fill={surface} stroke={accent} />
      <text x="240" y="319" fontSize="22" fontWeight="600">Lua processing</text>
      <text x="240" y="346" fontSize="18" fill={muted}>New topic · unchanged message body</text>
      <path d="M240 364V394" stroke={accent} strokeWidth="2" markerEnd="url(#tenon-mqtt-arrow)" />
      <rect x="48" y="403" width="384" height="48" rx="4" fill={surface} stroke={border} />
      <text x="240" y="434" fontSize="22">MQTT Sink · publishes</text>
      <path d="M240 451V507" stroke={accent} strokeWidth="2" markerEnd="url(#tenon-mqtt-arrow)" />
      <rect x="88" y="516" width="304" height="52" rx="4" fill={surface} stroke={border} />
      <text x="240" y="549" fontSize="22" fontFamily="var(--font-mono)">tenon/output</text>
      <text x="240" y="604" fontSize="19">BifroMQ → Subscriber</text>
    </g>
  </svg>;
}
