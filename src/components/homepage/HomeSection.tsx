import React, { useEffect, useRef, useState } from 'react';
import Typed from "typed.js";
import Translate, { translate as translateFn } from '@docusaurus/Translate';
import CallToAction from "./CallToAction";
import {
  UsersIcon,
  CloudArrowUpIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  CircleStackIcon,
  GlobeAltIcon,
  ChartBarIcon,
  LockClosedIcon,
  ArrowPathIcon,
  BeakerIcon,
  CommandLineIcon,
  PlayIcon,
  ArrowRightIcon,
  BuildingOfficeIcon,
  WifiIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  SparklesIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import {
  CpuChipIcon as CpuChipIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid,
  RocketLaunchIcon as RocketLaunchIconSolid,
  GlobeAltIcon as GlobeAltIconSolid,
  BoltIcon as BoltIconSolid,
  StarIcon as StarIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  UsersIcon as UsersIconSolid,
  CircleStackIcon as CircleStackIconSolid,
  CloudArrowUpIcon as CloudArrowUpIconSolid,
  LockClosedIcon as LockClosedIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  ArrowPathIcon as ArrowPathIconSolid,
  BeakerIcon as BeakerIconSolid,
  CommandLineIcon as CommandLineIconSolid,
  SparklesIcon as SparklesIconSolid
} from '@heroicons/react/24/solid';

// 动态文本内容
const textLines = [
  translateFn({ id: "High-Performance", message: "High-Performance" }),
  translateFn({ id: "Java-based", message: "Java-based" }),
  translateFn({ id: "Native Multi-Tenancy", message: "Native Multi-Tenancy" }),
  translateFn({ id: "Open-Source", message: "Open-Source" }),
  translateFn({ id: "Built-in Storage", message: "Built-in Storage" }),
  translateFn({ id: "Massive Connectivity", message: "Massive Connectivity" }),
  translateFn({ id: "Extensible", message: "Extensible" })
];

// 核心特性
const coreFeatures = [
  {
    name: <Translate>100% MQTT Support</Translate>,
    description: <Translate>Fully supports MQTT 3.1, 3.1.1 and 5.0 features over TCP, TLS, WS, WSS. Complete protocol implementation with all advanced features.</Translate>,
    icon: CpuChipIcon,
    solidIcon: CpuChipIconSolid,
    gradient: "from-blue-500 to-cyan-500",
    stats: "MQTT 3.1-5.0",
    highlight: "Full compliance"
  },
  {
    name: <Translate>Built-in Storage Engine</Translate>,
    description: <Translate>Optimized for critical load targeting, no third-party middleware dependencies. Deploy anywhere with confidence.</Translate>,
    icon: CircleStackIcon,
    solidIcon: CircleStackIconSolid,
    gradient: "from-emerald-500 to-teal-500",
    stats: "Zero deps",
    highlight: "Self-contained"
  },
  {
    name: <Translate>Native Multi-Tenancy</Translate>,
    description: <Translate>Built-in support for multi-tenancy resource sharing and workload isolation. Perfect for SaaS platforms and enterprise environments.</Translate>,
    icon: UsersIcon,
    solidIcon: UsersIconSolid,
    gradient: "from-purple-500 to-pink-500",
    stats: "Multi-tenant",
    highlight: "Resource isolation"
  },
  {
    name: <Translate>Extensible Mechanisms</Translate>,
    description: <Translate>Supports extensions, including Authentication/Authorization, Event, and System/Tenant Monitoring. Rich plugin architecture.</Translate>,
    icon: ShieldCheckIcon,
    solidIcon: ShieldCheckIconSolid,
    gradient: "from-orange-500 to-red-500",
    stats: "Plugin-ready",
    highlight: "Highly extensible"
  },
]

// 技术规格
const techSpecs = [
  {
    icon: CpuChipIcon,
    solidIcon: CpuChipIconSolid,
    title: <Translate>Performance</Translate>,
    value: "1M+",
    description: <Translate>Concurrent Connections</Translate>,
    gradient: "from-blue-500 to-cyan-500",
    detail: "High-performance messaging"
  },
  {
    icon: RocketLaunchIcon,
    solidIcon: RocketLaunchIconSolid,
    title: <Translate>Java-based</Translate>,
    value: "JVM",
    description: <Translate>Technology Stack</Translate>,
    gradient: "from-emerald-500 to-teal-500",
    detail: "Enterprise-grade platform"
  },
  {
    icon: ShieldCheckIcon,
    solidIcon: ShieldCheckIconSolid,
    title: <Translate>Open Source</Translate>,
    value: "Apache 2.0",
    description: <Translate>License</Translate>,
    gradient: "from-purple-500 to-pink-500",
    detail: "Community-driven"
  },
  {
    icon: GlobeAltIcon,
    solidIcon: GlobeAltIconSolid,
    title: <Translate>GitHub Stars</Translate>,
    value: "663+",
    description: <Translate>Community Support</Translate>,
    gradient: "from-orange-500 to-red-500",
    detail: "Growing ecosystem"
  },
]

export default function HomeSection() {
  const typedRef = useRef(null);
  const [isVisible, setIsVisible] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const observerRef = useRef(null);

  // 滚动动画观察器
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // 观察所有需要动画的元素
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <main className="relative overflow-hidden">
      {/* Hero Section - 优雅统一设计 */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/50">
        {/* 精简背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          {/* 微妙网格 */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:80px_80px] opacity-30 dark:opacity-20"></div>

          {/* 优雅几何装饰 */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-400/5 dark:to-purple-400/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 dark:from-emerald-400/5 dark:to-cyan-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

          {/* 浮动装饰元素 */}
          <div className="absolute top-20 right-20 w-24 h-24 border border-slate-200/40 dark:border-slate-700/40 rounded-2xl rotate-12 animate-float opacity-60 dark:opacity-40"></div>
          <div className="absolute bottom-32 left-32 w-16 h-16 border border-slate-200/40 dark:border-slate-700/40 rounded-full animate-float-delayed opacity-50 dark:opacity-30"></div>
        </div>

        {/* Hero 内容 */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* 状态徽章 */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200/50 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8 backdrop-blur-sm">
              <SparklesIcon className="w-4 h-4 mr-2" />
              <Translate>Apache Incubating Project</Translate>
            </div>

            {/* 主标题 */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                Apache BifroMQ (Incubating)
              </span>
            </h1>

            {/* 副标题 */}
            <p className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-12 font-light">
              <Translate>Java-based high-performance Apache MQTT Broker messaging middleware that adopts Multi-tenancy architecture.</Translate>
            </p>

            {/* CTA 按钮组 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <a
                href="./docs/get_started/intro/"
                className="group relative inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform min-w-[200px] justify-center"
              >
                <PlayIcon className="w-5 h-5 mr-2 transition-transform" />
                <Translate>Get Started</Translate>
                <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="https://github.com/apache/bifromq"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 rounded-xl border border-slate-200/50 dark:border-slate-600/50 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm min-w-[200px] justify-center"
              >
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <Translate>View on GitHub</Translate>
              </a>
            </div>
          </div>
        </div>

        {/* 向下滚动指示器 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="group relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200/50 dark:border-slate-700/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-xl"
            onClick={() => {
              const nextSection = document.querySelector('section:nth-of-type(2)');
              nextSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <ChevronDownIcon className="h-5 w-5 animate-bounce text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </div>
        </div>
      </section>

      {/* 核心特性区域 - 全新交互设计 */}
      <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* 动态背景 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-40 h-40 border border-dashed border-blue-200/20 dark:border-blue-800/20 rounded-full animate-spin opacity-20" style={{ animationDuration: '30s' }}></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 border border-dashed border-purple-200/20 dark:border-purple-800/20 rounded-full animate-spin opacity-15" style={{ animationDuration: '25s', animationDirection: 'reverse' }}></div>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-4xl text-center mb-20" data-animate id="core-features">

            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                <Translate>What is BifroMQ?</Translate>
              </span>
            </h2>

            <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-300">
              <Translate>BifroMQ is a high-performance, distributed Apache MQTT broker implementation that seamlessly integrates native multi-tenancy support.</Translate>
              {' '}
              <Translate>It is designed to support building large-scale IoT device connections and messaging systems</Translate>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {coreFeatures.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1">
                  {/* 渐变背景效果 */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>

                  <div className="flex items-start space-x-6 relative z-10">
                    {/* 图标区域 */}
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>

                      {/* 统计徽章 */}
                      <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-400">
                        {feature.stats}
                      </div>
                    </div>

                    {/* 内容区域 */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                        {feature.name}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                        {feature.description}
                      </p>

                      {/* 亮点信息 */}
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        <CheckCircleIconSolid className="w-4 h-4 mr-2" />
                        {feature.highlight}
                      </div>
                    </div>
                  </div>

                  {/* 悬停光晕效果 */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}