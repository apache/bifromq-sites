import React from 'react';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import {
  RocketLaunchIcon,
  ArrowRightIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import {
  RocketLaunchIcon as RocketLaunchIconSolid,
  SparklesIcon as SparklesIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  UsersIcon as UsersIconSolid,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';

interface CallToActionProps {
  className?: string;
}

const CallToAction: React.FC<CallToActionProps> = ({ 
  className = '' 
}) => {
  // Primary variant (full CTA section)
  return (
    <section className={`py-16 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950 relative overflow-hidden ${className}`}>
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        <div className="text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-semibold mb-8 border border-white/20">
            <RocketLaunchIconSolid className="h-5 w-5 mr-2 text-yellow-400" />
            <Translate>Ready to Start</Translate>
            <SparklesIconSolid className="h-4 w-4 ml-2 text-yellow-400 animate-pulse" />
          </div>

          {/* Main Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <Translate>Build High-Performance MQTT Broker</Translate>
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            <Translate>Join thousands of developers building next-generation applications with Apache BifroMQ - the open-source, high-performance MQTT broker trusted by industry leaders</Translate>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-6 justify-center mb-16">
            <Link
              to="/docs"
              className="group relative inline-flex items-center px-8 py-4 rounded-2xl bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-all duration-300 hover:shadow-2xl hover:shadow-white/25 hover:-translate-y-1 overflow-hidden"
            >
              {/* Button Light Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <RocketLaunchIconSolid className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300 relative z-10" />
              <span className="relative z-10"><Translate>Get Started</Translate></span>
              <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
            </Link>

            <a
              href="https://github.com/apache/bifromq"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:shadow-xl backdrop-blur-sm"
            >
              <svg className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <Translate>View on GitHub</Translate>
              <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;