import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
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
  Lock
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: <BarChart3 className="h-12 w-12 text-blue-600" />,
      title: 'Advanced Analytics',
      description: 'AI-powered performance insights with comprehensive metrics tracking and visualization.',
      highlights: ['AI-Powered Insights', 'Real-time Analytics', 'Custom Dashboards']
    },
    {
      icon: <Target className="h-12 w-12 text-green-600" />,
      title: 'Precision Benchmarking',
      description: 'Compare players against professional standards with our sophisticated scoring engine.',
      highlights: ['Professional Benchmarks', 'Position-specific Metrics', 'Progress Tracking']
    },
    {
      icon: <Users className="h-12 w-12 text-purple-600" />,
      title: 'Talent Discovery',
      description: 'Identify promising players with our comprehensive scouting and assessment platform.',
      highlights: ['Scouting Tools', 'Talent Identification', 'Player Comparisons']
    },
    {
      icon: <Trophy className="h-12 w-12 text-yellow-600" />,
      title: 'Performance Tracking',
      description: 'Monitor player development and progress over time with detailed trend analysis.',
      highlights: ['Development Tracking', 'Progress Reports', 'Milestone Monitoring']
    },
    {
      icon: <PlayCircle className="h-12 w-12 text-red-600" />,
      title: 'Video Analysis',
      description: 'Break down match footage with advanced computer vision and event detection.',
      highlights: ['Video Integration', 'Event Tagging', 'Playback Analysis']
    },
    {
      icon: <Shield className="h-12 w-12 text-indigo-600" />,
      title: 'Data Security',
      description: 'Enterprise-grade security ensuring your data remains private and protected.',
      highlights: ['End-to-End Encryption', 'GDPR Compliant', 'Secure Backups']
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Players Analyzed', icon: <Users className="h-6 w-6" /> },
    { number: '500+', label: 'Clubs Registered', icon: <Trophy className="h-6 w-6" /> },
    { number: '50,000+', label: 'Matches Processed', icon: <PlayCircle className="h-6 w-6" /> },
    { number: '98%', label: 'Accuracy Rate', icon: <CheckCircle className="h-6 w-6" /> }
  ];

  const testimonials = [
    {
      name: 'Alex Johnson',
      role: 'Head Scout, Premier League Club',
      content: 'Gr4de has revolutionized how we identify and assess talent. The benchmarking system is unparalleled in the industry.',
      avatar: '/api/placeholder/64/64',
      rating: 5
    },
    {
      name: 'Maria Rodriguez',
      role: 'Youth Academy Director',
      content: 'The detailed performance reports have helped our young players understand exactly where they need to improve. Incredible platform!',
      avatar: '/api/placeholder/64/64',
      rating: 5
    },
    {
      name: 'James Wilson',
      role: 'Professional Player Agent',
      content: 'This platform provides the objective data we need to make informed decisions about player development and transfers.',
      avatar: '/api/placeholder/64/64',
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$49',
      period: 'month',
      description: 'Perfect for individual coaches and small academies',
      features: [
        'Up to 50 players',
        'Basic analytics',
        '5 match analyses per month',
        'Standard support',
        'PDF reports'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Professional',
      price: '$199',
      period: 'month',
      description: 'Ideal for professional clubs and large academies',
      features: [
        'Up to 500 players',
        'Advanced analytics',
        'Unlimited match analyses',
        'Priority support',
        'Custom reports',
        'API access',
        'White-label options'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'month',
      description: 'For football organizations with custom needs',
      features: [
        'Unlimited players',
        'Enterprise analytics',
        'Dedicated support',
        'Custom integrations',
        'On-premise deployment',
        'SLA guarantee',
        'Training & onboarding'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Gr4de</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Features</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Testimonials</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Pricing</a>
              <a href="#faq" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">FAQ</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 font-medium">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
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
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Zap className="h-4 w-4" />
              <span>Trusted by top football clubs worldwide</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Revolutionizing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse-soft">
                Football Analytics
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform raw match data into actionable insights. Benchmark player performance, 
              discover talent, and drive development with AI-powered analytics used by professionals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                  Start Analyzing Free
                  <TrendingUp className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  View Live Demo
                </Button>
              </Link>
            </div>

            <p className="text-gray-500 mt-4 text-sm">
              No credit card required • 14-day free trial • Full access to all features
            </p>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Professional Tools for 
              <span className="text-blue-600"> Modern Football</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to analyze, benchmark, and develop football talent in one powerful platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4 text-center">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
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

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              How <span className="text-blue-600">Gr4de</span> Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to transform your football analysis and player development
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Match Data</h3>
              <p className="text-gray-600">
                Upload match videos or event data through our secure platform. 
                Support for multiple formats and automatic processing with AI-powered analysis.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Analysis & Benchmarking</h3>
              <p className="text-gray-600">
                Our advanced algorithms process the data and compare player performance 
                against comprehensive benchmarks across 20+ key performance indicators.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Actionable Insights</h3>
              <p className="text-gray-600">
                Receive detailed reports with performance scores, development 
                recommendations, comparative analysis, and personalized training plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Trusted by <span className="text-blue-600">Professionals</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what football professionals are saying about Gr4de
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic mb-4">"{testimonial.content}"</p>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent <span className="text-blue-600">Pricing</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for your organization. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`border-2 relative ${
                plan.popular ? 'border-blue-500 shadow-xl scale-105' : 'border-gray-200'
              } transition-transform duration-300`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period !== 'Custom' && (
                      <span className="text-gray-600">/{plan.period}</span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="text-blue-600">Questions</span>
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about the Gr4de platform
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "What data formats do you support?",
                answer: "We support video files (MP4, MOV, AVI), CSV event data, JSON formats, and direct integrations with popular tracking systems. Our AI can automatically process and tag match footage."
              },
              {
                question: "How accurate is your player scoring system?",
                answer: "Our scoring system achieves 98% accuracy compared to professional scout assessments. It uses 20+ key performance indicators and machine learning algorithms trained on thousands of professional matches."
              },
              {
                question: "Can I try before I buy?",
                answer: "Absolutely! We offer a 14-day free trial with full access to all features. No credit card required to start. You can analyze up to 5 matches and 25 players during the trial period."
              },
              {
                question: "Is my data secure?",
                answer: "Yes, we use enterprise-grade security including end-to-end encryption, GDPR compliance, and secure data centers. Your data is never shared with third parties without explicit permission."
              },
              {
                question: "Do you offer custom integrations?",
                answer: "Yes, our Enterprise plan includes custom integrations with existing systems, API access, and dedicated support for seamless implementation into your workflow."
              }
            ].map((faq, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Football Analysis?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of clubs and academies already using Gr4de to discover and develop talent. 
            Start your free trial today and see the difference data-driven insights can make.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold shadow-lg">
                Start Free Trial
                <Award className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold">
                Schedule Demo
              </Button>
            </Link>
          </div>
          <p className="text-blue-200 mt-4 text-sm">
            No credit card required • 14-day free trial • Full access to all features • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Gr4de</span>
              </div>
              <p className="text-gray-400 mb-4">
                Advanced football analytics platform for modern clubs and academies.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Globe className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Lock className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Gr4de Football Analytics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;