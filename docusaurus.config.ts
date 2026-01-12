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
      title: 'BifroMQ', // Minimalist title
      hideOnScroll: false,
      logo: {
        alt: 'Apache BifroMQ',
        src: 'img/logo.svg',
        srcDark: 'img/logo_dark.svg',
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
                <div style="margin-bottom: 2rem;">
                  <div style="font-weight: 800; font-size: 1.25rem; letter-spacing: -0.02em; margin-bottom: 0.5rem;">BifroMQ</div>
                  <p style="font-size: 0.9rem; line-height: 1.6; color: var(--color-text-secondary); max-width: 300px;">
                    Next-generation high-performance, multi-tenant MQTT broker for industrial-scale IoT.
                  </p>
                </div>
              `,
            },
            { label: 'Introduction', to: '/docs/get_started/intro' },
            { label: 'Downloads', to: '/download' },
            { label: 'Changelog', href: 'https://github.com/apache/bifromq/releases' },
          ],
        },
        {
          title: 'Development',
          items: [
            { label: 'GitHub', href: 'https://github.com/apache/bifromq' },
            { label: 'Issues', href: 'https://github.com/apache/bifromq/issues' },
            { label: 'API Docs', to: '/docs/user_guide/api/openapi' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'Discord', href: 'https://discord.gg/Pfs3QRadRB' },
            { label: 'Mailing List', href: 'mailto:dev@bifromq.apache.org' },
            { label: 'Blog', to: '/blog' },
            { label: 'Contribution', to: '/community' },
          ],
        },
        {
          title: 'Apache',
          items: [
            { label: 'Foundation', href: 'https://www.apache.org/' },
            { label: 'License', href: 'https://www.apache.org/licenses/LICENSE-2.0' },
            { label: 'Sponsorship', href: 'https://www.apache.org/foundation/sponsorship.html' },
            { label: 'Security', href: 'https://www.apache.org/security/' },
          ],
        },
      ],
      logo: {
        width: 180,
        src: '/img/apache-incubator.svg',
        href: 'https://incubator.apache.org/',
        alt: 'Apache Incubator',
      },
      copyright: `
        <div style="font-size: 0.85rem; line-height: 1.8; color: var(--color-text-tertiary); margin-top: 2rem;">
          <p>
            Copyright © ${new Date().getFullYear()} The Apache Software Foundation. 
            Licensed under the <a href="https://www.apache.org/licenses/LICENSE-2.0" style="color: var(--bifrost-blue); text-decoration: none;">Apache License, Version 2.0</a>.
          </p>
          <p>
            Apache BifroMQ, BifroMQ, Apache, the Apache feather logo, and the Apache BifroMQ project logo are either 
            registered trademarks or trademarks of The Apache Software Foundation.
          </p>
          <p style="margin-top: 1.5rem; font-style: italic; font-size: 0.8rem;">
             Apache BifroMQ is an effort undergoing incubation at The Apache Software Foundation (ASF), sponsored by the Apache Incubator.
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
