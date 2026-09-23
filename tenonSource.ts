export const tenonSource = {
  repository: 'https://github.com/apache/bifromq-tenon',
  commit: '21452dc53be3491567dbe9958294e34bf0fc79f5',
};

export const tenonDocsBase = '/tenon/docs/development';

// Website guides are edited here; source links resolve to these pages during import.
export const tenonGuidePages: Record<string, string> = {
  'guide/quickstart.md': 'get-started/first-pipeline',
  'guide/tenon-document.md': 'user-guide/documents',
  'guide/observability.md': 'user-guide/observability',
  'guide/runner.md': 'reference/runner',
  'guide/http-api.md': 'reference/http-api',
  'guide/lua.md': 'reference/lua',
  'guide/plugins.md': 'reference/plugin-packages',
  'guide/runner-extensions.md': 'reference/runner-extensions',
};

export type TenonImport = {
  source: string;
  id: string;
  title: string;
  description: string;
  startHeading?: string;
  endHeading?: string;
};

// The source repository owns these contracts. Regenerate copies with sync:tenon.
export const tenonImports: TenonImport[] = [
  { source: 'SECURITY.md', id: 'reference/security', title: 'Security', description: 'Tenon trust boundaries, deployment responsibilities, and vulnerability reporting.' },
  { source: 'sdk/java/README.md', id: 'reference/java-sdk', title: 'Java SDK Lifecycle', description: 'Tenon Java plugin callbacks, send results, and lifecycle.', startHeading: '## Plugin callbacks and results', endHeading: '## Packaging' },
  { source: 'sdk/rust/plugin-sdk/README.md', id: 'reference/rust-sdk', title: 'Rust SDK Lifecycle', description: 'Tenon Rust Source, Sink, and shared-object callbacks and completion semantics.', startHeading: '## Source lifecycle', endHeading: '## Payload contracts, packaging, and testing' },
  { source: 'contracts/tenon-document/v1.schema.json', id: 'reference/document-schema', title: 'Tenon Document Schema', description: 'Tenon Document v1 fields, types, defaults, and constraints.' },
  { source: 'contracts/runner/config.schema.json', id: 'reference/runner-schema', title: 'Runner Configuration Schema', description: 'Runner configuration fields, types, and constraints.' },
  { source: 'contracts/plugin/manifest.schema.json', id: 'reference/manifest-schema', title: 'Plugin Manifest Schema', description: 'Plugin manifest fields, types, and constraints.' },
];
