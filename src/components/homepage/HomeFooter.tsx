import React from 'react'
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import {
  EnvelopeIcon,
  DocumentTextIcon,
  NewspaperIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const HomeFooter: React.FC = () => {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 border-t border-slate-800/50 dark:border-slate-700/50">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col">
            <div className="flex items-center mb-6">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Apache BifroMQ
              </span>
            </div>
            <p className="text-slate-400 dark:text-slate-300 mb-6 text-sm leading-relaxed">
              <Translate>
                  Open-source, high-performance MQTT broker with enterprise-grade reliability. Applicable to IoT, IM and other scenarios.
               </Translate>
            </p>

            {/* Social Links */}
            <div className="flex space-x-3">
              <a
                href="mailto:hello@bifromq.io"
                className="size-10 flex items-center justify-center rounded-lg bg-slate-800/50 dark:bg-slate-800/80 text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 dark:hover:bg-slate-700 transition-all duration-200 border border-slate-700/50 dark:border-slate-600/50"
                aria-label="Email"
              >
                <EnvelopeIcon className="h-4 w-4" />
              </a>
              <a
                href="https://discord.gg/Pfs3QRadRB"
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 flex items-center justify-center rounded-lg bg-slate-800/50 dark:bg-slate-800/80 text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 dark:hover:bg-slate-700 transition-all duration-200 border border-slate-700/50 dark:border-slate-600/50"
                aria-label="Discord"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
              <a
                href="https://github.com/apache/bifromq"
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 flex items-center justify-center rounded-lg bg-slate-800/50 dark:bg-slate-800/80 text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 dark:hover:bg-slate-700 transition-all duration-200 border border-slate-700/50 dark:border-slate-600/50"
                aria-label="GitHub"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Resources */}
          <div className="flex flex-col h-full">
            <h3 className="text-sm font-semibold text-white mb-6 flex items-center">
              <NewspaperIcon className="h-4 w-4 mr-2 text-blue-400" />
              <Translate>Resources</Translate>
            </h3>
            <div className="space-y-3 flex-grow">
              <div className="group">
                <Link
                  to="/blog"
                  className="text-sm text-slate-400 dark:text-slate-300 hover:text-white dark:hover:text-blue-300 transition-all duration-200 flex items-center group-hover:translate-x-1"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <Translate>Blog</Translate>
                </Link>
              </div>
              <div className="group">
                <a
                  href="https://github.com/apache/bifromq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 dark:text-slate-300 hover:text-white dark:hover:text-blue-300 transition-all duration-200 flex items-center group-hover:translate-x-1"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <Translate>GitHub</Translate>
                </a>
              </div>
              <div className="group">
                <a
                  href="https://github.com/apache/bifromq/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 dark:text-slate-300 hover:text-white dark:hover:text-blue-300 transition-all duration-200 flex items-center group-hover:translate-x-1"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <Translate>Releases</Translate>
                </a>
              </div>
              <div className="group">
                <a
                  href="https://github.com/apache/bifromq/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 dark:text-slate-300 hover:text-white dark:hover:text-blue-300 transition-all duration-200 flex items-center group-hover:translate-x-1"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <Translate>Issues</Translate>
                </a>
              </div>
            </div>
          </div>

          {/* Apache */}
          <div className="flex flex-col h-full">
            <h3 className="text-sm font-semibold text-white mb-6 flex items-center">
              <DocumentTextIcon className="h-4 w-4 mr-2 text-purple-400" />
              <Translate>Apache</Translate>
            </h3>
            <div className="space-y-3 flex-grow">
              <div className="group">
                <a
                  href="https://incubator.apache.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 dark:text-slate-300 hover:text-white dark:hover:text-purple-300 transition-all duration-200 flex items-center group-hover:translate-x-1"
                >
                  <span className="w-1 h-1 bg-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <Translate>Apache Incubator</Translate>
                </a>
              </div>
              <div className="group">
                <a
                  href="https://www.apache.org/foundation/policies/conduct"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 dark:text-slate-300 hover:text-white dark:hover:text-purple-300 transition-all duration-200 flex items-center group-hover:translate-x-1"
                >
                  <span className="w-1 h-1 bg-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <Translate>Code of Conduct</Translate>
                </a>
              </div>
              <div className="group">
                <a
                  href="https://www.apache.org/licenses/LICENSE-2.0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 dark:text-slate-300 hover:text-white dark:hover:text-purple-300 transition-all duration-200 flex items-center group-hover:translate-x-1"
                >
                  <span className="w-1 h-1 bg-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <Translate>Apache 2.0 License</Translate>
                </a>
              </div>
            </div>
          </div>

          {/* Community */}
          <div className="flex flex-col h-full">
            <h3 className="text-sm font-semibold text-white mb-6 flex items-center">
              <TagIcon className="h-4 w-4 mr-2 text-emerald-400" />
              <Translate>Community</Translate>
            </h3>
            <div className="space-y-3 flex-grow">
              <div className="group">
                <a
                  href="https://opensource.baidu.com/#/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 dark:text-slate-300 hover:text-white dark:hover:text-emerald-300 transition-all duration-200 flex items-center group-hover:translate-x-1"
                >
                  <span className="w-1 h-1 bg-emerald-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <Translate>Thanks Baidu</Translate>
                </a>
              </div>
              <div className="group">
                <a
                  href="https://mqtt.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 dark:text-slate-300 hover:text-white dark:hover:text-emerald-300 transition-all duration-200 flex items-center group-hover:translate-x-1"
                >
                  <span className="w-1 h-1 bg-emerald-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <Translate>MQTT.org</Translate>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="border-t border-slate-800/50 dark:border-slate-700/50 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-4 md:mb-0">
              <Translate>© 2024 Apache Software Foundation. Licensed under Apache License 2.0.</Translate>
            </div>
            <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                <Translate>Apache Incubating</Translate>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;
