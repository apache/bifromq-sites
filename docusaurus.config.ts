// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require("prism-react-renderer");
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;
const tailwindPlugin = require("./plugins/tailwind-plugin.cjs");

const projectName = "BifroMQ";
const mainRepoName = "bifromq";
const siteRepoName = "bifromq-sites";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Apache BifroMQ (Incubating) - Open source MQTT Broker",
  tagline:
    "High-performance, multi-tenant MQTT broker for enterprise IoT infrastructure - Apache Incubator Project",
  favicon: "img/favicon.ico",
  url: `https://${projectName.toLowerCase()}.apache.org/`,
  baseUrl: "/",

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  trailingSlash: true,
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: ({ locale, versionDocsDirPath, docPath }) => {
            return `https://github.com/apache/${siteRepoName}/tree/master/website/${versionDocsDirPath}/${docPath}`;
          },
          lastVersion: "3.3.x",
          versions: {
            current: {
              label: "Next (Incubating)",
              banner: "unreleased",
              badge: true,
            },
          },
        },
        blog: {
          showReadingTime: true,
          blogSidebarCount: 10,
          editUrl: ({ locale }) => {
            return `https://github.com/apache/${siteRepoName}/tree/master/website/blog`;
          },
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  plugins: [tailwindPlugin, require.resolve("docusaurus-plugin-image-zoom")],

  themeConfig:
  {
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    colorMode: {
      defaultMode: "light",
      respectPrefersColorScheme: true,
    },
    zoom: {
      selector: ".markdown :not(em) > img",
      background: {
        light: "rgb(255, 255, 255)",
        dark: "rgb(50, 50, 50)",
      },
      config: {
        // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
      },
    },
    navbar: {
      title: "Apache BifroMQ (Incubating)",
      hideOnScroll: false,
      logo: {
        alt: "BifroMQ Logo",
        src: "img/logo.svg",
        srcDark: "img/logo_dark.svg",
        className: "bifromq-navbar-logo-class",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "right",
          label: "Docs",
        },
        {
          to: "/blog",
          label: "Blog",
          position: "right",
        },
        {
          to: "/docs/get_started/download/intro/",
          label: "Download",
          position: "right",
        },
        {
          to: "/docs/get_started/faq",
          label: "FAQ",
          position: "right",
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          // Optional: disable active class highlighting for current version
          dropdownActiveClassDisabled: true,
        },
        {
          type: 'dropdown',
          label: 'ASF',
          position: 'right',
          items: [
            {
              label: 'Foundation',
              to: 'https://www.apache.org/'
            },
            {
              label: 'License',
              to: 'https://www.apache.org/licenses/'
            },
            {
              label: 'Events',
              to: 'https://www.apache.org/events/current-event.html'
            },
            {
              label: 'Privacy',
              to: 'https://privacy.apache.org/policies/privacy-policy-public.html'
            },
            {
              label: 'Security',
              to: 'https://www.apache.org/security/'
            },
            {
              label: 'Sponsorship',
              to: 'https://www.apache.org/foundation/sponsorship.html'
            },
            {
              label: 'Thanks',
              to: 'https://www.apache.org/foundation/thanks.html'
            },
            {
              label: 'Code of Conduct',
              to: 'https://www.apache.org/foundation/policies/conduct.html'
            }
          ]
        },
        {
          href: `https://github.com/apache/${mainRepoName}`,
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        }
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      logo: {
        width: 200,
        src: "/img/apache-incubator.svg",
        href: "https://incubator.apache.org/",
        alt: "Apache Incubator logo"
      },
      copyright: `<div>
      <p>
        Apache ${projectName} is an effort undergoing incubation at The Apache Software Foundation (ASF), sponsored by the Apache Incubator. Incubation is required of all newly accepted projects until a further review indicates that the infrastructure, communications, and decision making process have stabilized in a manner consistent with other successful ASF projects. While incubation status is not necessarily a reflection of the completeness or stability of the code, it does indicate that the project has yet to be fully endorsed by the ASF.
      </p>
      <p>
        Copyright © ${new Date().getFullYear()} The Apache Software Foundation, Licensed under the Apache License, Version 2.0. <br/>
        Apache, the names of Apache projects, and the feather logo are either registered trademarks or trademarks of the Apache Software Foundation in the United States and/or other countries.
      </p>
      </div>`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  }
};

module.exports = config;
