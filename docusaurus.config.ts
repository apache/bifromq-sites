import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { releaseVersion } from './releaseInfo';

const lightCodeTheme = prismThemes.github;
const darkCodeTheme = prismThemes.dracula;

const projectName = 'BifroMQ';
const mainRepoName = 'bifromq';
const siteRepoName = 'bifromq-sites';

const config: Config = {
  title: 'An Open Source Apache MQTT Broker | Apache BifroMQ (Incubating)',
  tagline:
    'Java-based high-performance Apache MQTT Broker messaging middleware that adopts Multi-tenancy architecture.',
  favicon: 'img/favicon.ico',
  url: `https://${projectName.toLowerCase()}.apache.org/`,
  baseUrl: '/',

  onBrokenLinks: 'throw',
  trailingSlash: true,


  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
  ],
  themes: [
    [
      '@docusaurus/theme-mermaid',
      {
        mermaid: {
          theme: {
            light: 'default',
            dark: 'dark',
          },
        },
      },
    ],
    'docusaurus-theme-redoc',
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: ({ versionDocsDirPath, docPath }) =>
            `https://github.com/apache/${siteRepoName}/tree/master/${versionDocsDirPath}/${docPath}`,
          lastVersion: 'current',
          versions: {
            current: {
              label: `${releaseVersion}`,
              badge: true,
            },
          },
        },
        blog: {
          showReadingTime: true,
          blogSidebarCount: 10,
          editUrl: () =>
            `https://github.com/apache/${siteRepoName}/tree/master/blog`,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    'docusaurus-plugin-image-zoom',
    [
      'docusaurus-plugin-redoc',
      {
        id: 'bifromq',
        spec: 'docs/user_guide/api/BifroMQ-API.yaml',
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    zoom: {
      selector: '.markdown :not(em) > img',
      background: {
        light: 'rgb(255, 255, 255)',
        dark: 'rgb(50, 50, 50)',
      },
      config: {
        // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
      },
    },
    navbar: {
      title: 'BifroMQ', // Empty title to use logo only
      hideOnScroll: false,
      logo: {
        alt: 'Apache BifroMQ',
        src: '/img/logo.svg',
        srcDark: '/img/logo_dark.svg',
        className: 'bifromq-navbar-logo-class', // Keep class for custom override if needed
        style: { height: '32px', width: 'auto' }, // Inline hint, handled by CSS mostly
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'right',
          label: 'Documentation',
        },
        {
          to: '/blog',
          label: 'Blog',
          position: 'right',
        },
        {
          to: '/community',
          label: 'Community',
          position: 'right',
        },
        {
          to: '/download',
          label: 'Downloads',
          position: 'right',
        },
        {
          to: '/docs/get_started/faq',
          label: 'FAQ',
          position: 'right',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
        },
        {
          type: 'dropdown',
          label: 'Foundation',
          position: 'right',
          items: [
            {
              label: 'Apache Software Foundation',
              to: 'https://www.apache.org/',
            },
            {
              label: 'License',
              to: 'https://www.apache.org/licenses/',
            },
            {
              label: 'Events',
              to: 'https://www.apache.org/events/current-event.html',
            },
            {
              label: 'Security',
              to: 'https://www.apache.org/security/',
            },
            {
              label: 'Sponsorship',
              to: 'https://www.apache.org/foundation/sponsorship.html',
            },
            {
              label: 'Thanks',
              to: 'https://www.apache.org/foundation/thanks.html',
            },
            {
              label: 'Code of Conduct',
              to: 'https://www.apache.org/foundation/policies/conduct.html',
            },
            {
              label: 'Privacy Policy',
              to: 'https://privacy.apache.org/policies/privacy-policy-public.html',
            },
          ],
        },
        {
          href: `https://github.com/apache/${mainRepoName}`,
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Apache BifroMQ',
          items: [
            {
              html: `
                <div style="margin-bottom: 1.5rem;">
                  <p style="font-size: 0.9rem; line-height: 1.6; color: var(--color-text-secondary); max-width: 320px; margin-bottom: 2rem;">
                    High-performance Apache MQTT broker with enterprise-grade reliability. Applicable to IoT, IM and other scenarios.
                  </p>
                  <div style="display: flex; gap: 24px; align-items: center;">
                    <a href="https://github.com/apache/bifromq" target="_blank" rel="noopener noreferrer" style="color: var(--color-text-tertiary); transition: color 0.3s; display: flex;" onmouseover="this.style.color='var(--bifrost-blue)'" onmouseout="this.style.color='var(--color-text-tertiary)'">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                    </a>
                    <a href="https://discord.gg/Pfs3QRadRB" target="_blank" rel="noopener noreferrer" style="color: var(--color-text-tertiary); transition: color 0.3s; display: flex;" onmouseover="this.style.color='var(--bifrost-blue)'" onmouseout="this.style.color='var(--color-text-tertiary)'">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.419c0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z"/></svg>
                    </a>
                    <a href="mailto:dev@bifromq.apache.org" style="color: var(--color-text-tertiary); transition: color 0.3s; display: flex;" onmouseover="this.style.color='var(--bifrost-blue)'" onmouseout="this.style.color='var(--color-text-tertiary)'">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </a>
                  </div>
                </div>
              `,
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            { label: 'GitHub', href: 'https://github.com/apache/bifromq' },
            { label: 'Releases', href: 'https://github.com/apache/bifromq/releases' },
            { label: 'Issues', href: 'https://github.com/apache/bifromq/issues' },
          ],
        },
        {
          title: 'Apache',
          items: [
            { label: 'Apache Incubator', href: 'https://incubator.apache.org/' },
            { label: 'Code of Conduct', href: 'https://www.apache.org/foundation/policies/conduct.html' },
            { label: 'Apache 2.0 License', href: 'https://www.apache.org/licenses/LICENSE-2.0' },
          ],
        },
        {
          title: 'Others',
          items: [
            { label: 'Thanks OpenSource@Baidu', href: 'https://opensource.baidu.com/' },
            { label: 'MQTT v3.1.1', href: 'http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html' },
            { label: 'MQTT v5.0', href: 'https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html' },
          ],
        },
      ],
      logo: {
        width: 180,
        src: '/img/apache-incubator.svg',
        href: 'https://incubator.apache.org/',
        alt: 'Apache Incubator',
        className: 'footer__incubator-logo',
      },
      copyright: `
        <div style="font-size: 0.8rem; line-height: 1.8; color: var(--color-text-tertiary); text-align: center; border-top: 1px solid var(--color-border); padding-top: 3rem;">
          <p style="margin-bottom: 1.5rem; max-width: 1100px; margin-left: auto; margin-right: auto;">
            Apache BifroMQ is an effort undergoing incubation at The Apache Software Foundation (ASF), sponsored by the Apache Incubator. Incubation is required of all newly accepted projects until a further review indicates that the infrastructure, communications, and decision making process have stabilized in a manner consistent with other successful ASF projects. While incubation status is not necessarily a reflection of the completeness or stability of the code, it does indicate that the project has yet to be fully endorsed by the ASF.
          </p>
          <p style="margin-bottom: 1.5rem;">
            Copyright © 2026 The Apache Software Foundation, Licensed under the Apache License, Version 2.0.
          </p>
          <p style="max-width: 1200px; margin-left: auto; margin-right: auto;">
            Apache, the names of Apache projects, and the feather logo are either registered trademarks or trademarks of the Apache Software Foundation in the United States and/or other countries.
          </p>
        </div>
      `,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
