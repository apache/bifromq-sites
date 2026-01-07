import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {releaseVersion} from './releaseInfo';

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
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
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
          editUrl: ({versionDocsDirPath, docPath}) =>
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
      title: 'Apache BifroMQ (Incubating)',
      hideOnScroll: false,
      logo: {
        alt: 'BifroMQ Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo_dark.svg',
        className: 'bifromq-navbar-logo-class',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'right',
          label: 'Docs',
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
          label: 'Download',
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
          label: 'ASF',
          position: 'right',
          items: [
            {
              label: 'Foundation',
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
              label: 'Privacy',
              to: 'https://privacy.apache.org/policies/privacy-policy-public.html',
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
      style: 'dark',
      links: [
        {
          title: 'Apache BifroMQ',
          items: [
            {
              html: `<span class="footer__link-item">High-performance Apache MQTT broker with enterprise-grade reliability. Applicable to IoT, IM and other scenarios.</span>`,
            },
          ],
        },
        {
          title: 'Contact / Community',
          items: [
            {
              label: 'Email: dev@bifromq.apache.org',
              href: 'mailto:dev@bifromq.apache.org',
            },
            {
              label: 'Discord: https://discord.gg/Pfs3QRadRB',
              href: 'https://discord.gg/Pfs3QRadRB',
            },
            {
              label: 'GitHub: https://github.com/apache/bifromq',
              href: 'https://github.com/apache/bifromq',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'GitHub: https://github.com/apache/bifromq',
              href: 'https://github.com/apache/bifromq',
            },
            {
              label: 'Releases: /docs/get_started/download/intro/',
              to: '/docs/get_started/download/intro/',
            },
            {
              label: 'Issues: https://github.com/apache/bifromq/issues',
              href: 'https://github.com/apache/bifromq/issues',
            },
          ],
        },
        {
          title: 'Apache',
          items: [
            {
              label: 'Apache Incubator: https://incubator.apache.org/',
              href: 'https://incubator.apache.org/',
            },
            {
              label: 'Code of Conduct: https://www.apache.org/foundation/policies/conduct',
              href: 'https://www.apache.org/foundation/policies/conduct',
            },
            {
              label: 'Apache 2.0 License: https://www.apache.org/licenses/LICENSE-2.0',
              href: 'https://www.apache.org/licenses/LICENSE-2.0',
            },
          ],
        },
        {
          title: 'Others',
          items: [
            {
              label: 'Thanks OpenSource@Baidu: https://opensource.baidu.com/',
              href: 'https://opensource.baidu.com/',
            },
            {
              label:
                'MQTT v3.1.1: https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html',
              href: 'https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html',
            },
            {
              label:
                'MQTT v5.0: https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html',
              href: 'https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html',
            },
          ],
        },
      ],
      logo: {
        width: 200,
        src: '/img/apache-incubator.svg',
        href: 'https://incubator.apache.org/',
        alt: 'Apache Incubator logo',
      },
      copyright: `<div>
      <p>
        © 2026 Apache Software Foundation. Licensed under Apache License 2.0. <br/>
        Apache Incubating
      </p>
      <p>
        Apache ${projectName} is an effort undergoing incubation at The Apache Software Foundation (ASF), sponsored by the Apache Incubator. Incubation is required of all newly accepted projects until a further review indicates that the infrastructure, communications, and decision making process have stabilized in a manner consistent with other successful ASF projects. While incubation status is not necessarily a reflection of the completeness or stability of the code, it does indicate that the project has yet to be fully endorsed by the ASF.
      </p>
      <p>
        Apache, the names of Apache projects, and the feather logo are either registered trademarks or trademarks of the Apache Software Foundation in the United States and/or other countries.
      </p>
      </div>`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
