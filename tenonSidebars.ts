import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tenonSidebar: [
    { type: 'category', label: 'Get Started', collapsed: false, items: ['get-started/overview', 'get-started/build', 'get-started/first-pipeline', 'get-started/connect-bifromq'] },
    { type: 'category', label: 'User Guide', items: ['user-guide/documents', 'user-guide/lua-processing', 'user-guide/delivery', 'user-guide/operations', 'user-guide/observability', 'user-guide/troubleshooting'] },
    { type: 'category', label: 'Plugins', items: ['plugins/install', 'plugins/mqtt', 'plugins/debugging'] },
    { type: 'category', label: 'Develop a Plugin', items: ['develop/overview', 'develop/rust', 'develop/java', 'develop/config-payloads', 'develop/test-package'] },
    { type: 'category', label: 'Contribute SDKs & Scaffolds', items: ['contribute/overview', 'contribute/implementation-contract', 'contribute/ipc', 'contribute/scaffolds', 'contribute/verification'] },
    { type: 'category', label: 'Reference', items: ['reference/compatibility', 'reference/runner', 'reference/runner-schema', 'reference/document-schema', 'reference/http-api', 'reference/lua', 'reference/plugin-packages', 'reference/manifest-schema', 'reference/rust-sdk', 'reference/java-sdk', 'reference/runner-extensions'] },
    'reference/security',
    { type: 'link', label: 'Awesome Tenon Plugins', href: '/tenon/plugins/' },
    { type: 'link', label: 'Tenon on GitHub', href: 'https://github.com/apache/bifromq-tenon' },
  ],
};

export default sidebars;
