import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  BarChart3,
  Users,
  Target,
  Trophy,
  PlayCircle,
  Shield,
  Star,
  TrendingUp,
  Award,
  CheckCircle,
  Zap,
  Globe,
  Lock,
  BadgeCheck,
  LineChart,
  Activity,
  TargetIcon,
  Lightbulb,
  Brain,
  Database,
} from "lucide-react";

import ScrollIndicator from "@/components/common/ScrollIndicator";

const Landing = () => {
  const features = [
    {
      icon: <BarChart3 className="h-12 w-12 text-blue-400" />,
      title: "Advanced Analytics",
      description:
        "AI-powered performance insights with comprehensive metrics tracking and visualization.",
      highlights: [
        "AI-Powered Insights",
        "Real-time Analytics",
        "Custom Dashboards",
      ],
    },
    {
      icon: <Target className="h-12 w-12 text-green-400" />,
      title: "Precision Benchmarking",
      description:
        "Compare players against professional standards with our sophisticated scoring engine.",
      highlights: [
        "Professional Benchmarks",
        "Position-specific Metrics",
        "Progress Tracking",
      ],
    },
    {
      icon: <Users className="h-12 w-12 text-purple-400" />,
      title: "Talent Discovery",
      description:
        "Identify promising players with our comprehensive scouting and assessment platform.",
      highlights: [
        "Scouting Tools",
        "Talent Identification",
        "Player Comparisons",
      ],
    },
    {
      icon: <Trophy className="h-12 w-12 text-yellow-400" />,
      title: "Performance Tracking",
      description:
        "Monitor player development and progress over time with detailed trend analysis.",
      highlights: [
        "Development Tracking",
        "Progress Reports",
        "Milestone Monitoring",
      ],
    },
    {
      icon: <PlayCircle className="h-12 w-12 text-red-400" />,
      title: "Video Analysis",
      description:
        "Break down match footage with advanced computer vision and event detection.",
      highlights: ["Video Integration", "Event Tagging", "Playback Analysis"],
    },
    {
      icon: <Shield className="h-12 w-12 text-indigo-400" />,
      title: "Data Security",
      description:
        "Enterprise-grade security ensuring your data remains private and protected.",
      highlights: ["End-to-End Encryption", "GDPR Compliant", "Secure Backups"],
    },
  ];

  const stats = [
    {
      number: "10,000+",
      label: "Players Analyzed",
      icon: <Users className="h-6 w-6" />,
    },
    {
      number: "500+",
      label: "Clubs Registered",
      icon: <Trophy className="h-6 w-6" />,
    },
    {
      number: "50,000+",
      label: "Matches Processed",
      icon: <PlayCircle className="h-6 w-6" />,
    },
    {
      number: "98%",
      label: "Accuracy Rate",
      icon: <CheckCircle className="h-6 w-6" />,
    },
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Head Scout, Premier League Club",
      content:
        "Gr4de has revolutionized how we identify and assess talent. The benchmarking system is unparalleled in the industry.",
      avatar: "/api/placeholder/64/64",
      rating: 5,
    },
    {
      name: "Maria Rodriguez",
      role: "Youth Academy Director",
      content:
        "The detailed performance reports have helped our young players understand exactly where they need to improve. Incredible platform!",
      avatar: "/api/placeholder/64/64",
      rating: 5,
    },
    {
      name: "James Wilson",
      role: "Professional Player Agent",
      content:
        "This platform provides the objective data we need to make informed decisions about player development and transfers.",
      avatar: "/api/placeholder/64/64",
      rating: 5,
    },
  ];

  // Football Analytics Trends Section
  const trends = [
    {
      icon: <Brain className="h-8 w-8 text-blue-400" />,
      title: "AI-Powered Scouting",
      description:
        "Machine learning algorithms are revolutionizing talent identification by analyzing thousands of data points to predict player potential with 94% accuracy.",
      metrics: "94% Prediction Accuracy",
      trend: "up",
      category: "Technology",
    },
    {
      icon: <Activity className="h-8 w-8 text-green-400" />,
      title: "Real-time Performance Analytics",
      description:
        "Live tracking of player movements and decision-making patterns during matches provides instant insights for tactical adjustments.",
      metrics: "2.5M Data Points/Match",
      trend: "up",
      category: "Performance",
    },
    {
      icon: <TargetIcon className="h-8 w-8 text-purple-400" />,
      title: "Predictive Injury Prevention",
      description:
        "Advanced biomechanical analysis and workload monitoring reduce injury rates by 63% through early risk detection.",
      metrics: "63% Injury Reduction",
      trend: "down",
      category: "Health & Safety",
    },
    {
      icon: <LineChart className="h-8 w-8 text-amber-400" />,
      title: "Expected Goals (xG) Evolution",
      description:
        "Next-generation xG models now incorporate player positioning, defensive pressure, and passing networks for more accurate outcome predictions.",
      metrics: "89% Model Accuracy",
      trend: "up",
      category: "Advanced Metrics",
    },
    {
      icon: <Database className="h-8 w-8 text-red-400" />,
      title: "Data Integration Platforms",
      description:
        "Unified systems combining tracking data, video analysis, and medical records create comprehensive player profiles for holistic development.",
      metrics: "300% Data Utilization",
      trend: "up",
      category: "Infrastructure",
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-indigo-400" />,
      title: "Cognitive Load Analysis",
      description:
        "New metrics measuring decision-making speed and accuracy under pressure are becoming key indicators of player intelligence and adaptability.",
      metrics: "42% Faster Decisions",
      trend: "up",
      category: "Cognitive Science",
    },
  ];

  const industryStats = [
    {
      value: "87%",
      label: "of top clubs use advanced analytics",
      change: "+15%",
    },
    {
      value: "$2.1B",
      label: "invested in sports tech in 2024",
      change: "+32%",
    },
    {
      value: "3.2x",
      label: "more data points collected vs 2020",
      change: "+220%",
    },
    { value: "71%", label: "reduction in scouting errors", change: "-29%" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Gr4de</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#trends"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Trends
              </a>
              <a
                href="#testimonials"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Testimonials
              </a>
              <a
                href="#faq"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                FAQ
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white font-medium"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-blue-500/30">
              <Zap className="h-4 w-4" />
              <span>Trusted by top football clubs worldwide</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Revolutionizing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse-soft">
                Football Analytics
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform raw match data into actionable insights. Benchmark
              player performance, discover talent, and drive development with
              AI-powered analytics used by professionals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Start Analyzing Free
                  <TrendingUp className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-3 text-lg font-semibold"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  View Live Demo
                </Button>
              </Link>
            </div>

            <p className="text-gray-500 mt-4 text-sm">
              No credit card required • 14-day free trial • Full access to all
              features
            </p>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-gray-800 text-blue-400 rounded-lg">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Professional Tools for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {" "}
                Modern Football
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to analyze, benchmark, and develop football
              talent in one powerful platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-gray-700"
              >
                <CardContent className="p-8">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-4 text-center">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.highlights.map((highlight, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-sm text-gray-300"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trends Section */}
      <section id="trends" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Football Analytics{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Trends 2024
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover the latest innovations and data-driven insights shaping
              modern football
            </p>
          </div>

          {/* Industry Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {industryStats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center"
              >
                <div className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-300 text-sm mb-2">{stat.label}</div>
                <div
                  className={`text-xs font-semibold ${
                    stat.change.startsWith("+")
                      ? "text-green-400"
                      : stat.change.startsWith("-")
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                >
                  {stat.change} from 2023
                </div>
              </div>
            ))}
          </div>

          {/* Trends Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trends.map((trend, index) => (
              <Card
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-gray-700"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl">
                      {trend.icon}
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 bg-gray-700 text-gray-300 rounded-full">
                      {trend.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">
                    {trend.title}
                  </h3>

                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {trend.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-blue-400">
                      {trend.metrics}
                    </span>
                    <div
                      className={`flex items-center text-sm font-semibold ${
                        trend.trend === "up" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {trend.trend === "up" ? "Rising" : "Declining"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Future Outlook */}
          <div className="mt-16 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-8 border border-blue-500/20">
            <div className="text-center">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                The Future of Football Analytics
              </h3>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
                By 2025, artificial intelligence and machine learning will
                process over 10 million data points per match, enabling
                real-time tactical adjustments and personalized player
                development programs. The integration of biometric data and
                cognitive metrics will create the most comprehensive player
                assessment systems ever seen.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <div className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
                  <span className="text-blue-400 font-semibold">
                    AI Coaches
                  </span>
                  <span className="text-gray-400 text-sm ml-2">2025+</span>
                </div>
                <div className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
                  <span className="text-green-400 font-semibold">
                    VR Training
                  </span>
                  <span className="text-gray-400 text-sm ml-2">2024+</span>
                </div>
                <div className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
                  <span className="text-purple-400 font-semibold">
                    Blockchain Scouting
                  </span>
                  <span className="text-gray-400 text-sm ml-2">2026+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Trusted by{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Professionals
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              See what football professionals are saying about Gr4de
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow border border-gray-700"
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div>
                      <div className="font-semibold text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 italic mb-4">
                    "{testimonial.content}"
                  </p>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Frequently Asked{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Questions
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need to know about the Gr4de platform
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "What data formats do you support?",
                answer:
                  "We support video files (MP4, MOV, AVI), CSV event data, JSON formats, and direct integrations with popular tracking systems. Our AI can automatically process and tag match footage.",
              },
              {
                question: "How accurate is your player scoring system?",
                answer:
                  "Our scoring system achieves 98% accuracy compared to professional scout assessments. It uses 20+ key performance indicators and machine learning algorithms trained on thousands of professional matches.",
              },
              {
                question: "Can I try before I buy?",
                answer:
                  "Absolutely! We offer a 14-day free trial with full access to all features. No credit card required to start. You can analyze up to 5 matches and 25 players during the trial period.",
              },
              {
                question: "Is my data secure?",
                answer:
                  "Yes, we use enterprise-grade security including end-to-end encryption, GDPR compliance, and secure data centers. Your data is never shared with third parties without explicit permission.",
              },
              {
                question: "Do you offer custom integrations?",
                answer:
                  "Yes, our Enterprise plan includes custom integrations with existing systems, API access, and dedicated support for seamless implementation into your workflow.",
              },
            ].map((faq, index) => (
              <Card
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm shadow-lg border border-gray-700"
              >
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-blue-900/50 to-purple-900/50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-8 border border-white/20">
            <BadgeCheck className="h-4 w-4" />
            <span>Join 500+ clubs already using Gr4de</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Football Analysis?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of clubs and academies already using Gr4de to discover
            and develop talent. Start your free trial today and see the
            difference data-driven insights can make.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register">
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Start Free Trial
                <Award className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold"
              >
                Schedule Demo
              </Button>
            </Link>
          </div>
          <p className="text-blue-200 mt-4 text-sm">
            No credit card required • 14-day free trial • Full access to all
            features • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Gr4de</span>
              </div>
              <p className="text-gray-400 mb-4">
                Advanced football analytics platform for modern clubs and
                academies.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Globe className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Lock className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#trends"
                    className="hover:text-white transition-colors"
                  >
                    Trends
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Gr4de Football Analytics. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Scroll Indicator */}
      <ScrollIndicator />
    </div>
  );
};

export default Landing;
