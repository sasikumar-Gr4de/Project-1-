// App.jsx or your main component
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [isProfessional, setIsProfessional] = useState(false);

  // Sample data - replace with your actual data
  const featuredMatches = [
    {
      id: 1,
      homeTeam: "Manchester United",
      awayTeam: "Liverpool",
      score: "2-1",
      date: "2024-03-15",
      analysis: "85% complete",
      xG: { home: 1.8, away: 1.2 },
      possession: { home: 48, away: 52 }
    },
    {
      id: 2,
      homeTeam: "Barcelona",
      awayTeam: "Real Madrid",
      score: "3-2",
      date: "2024-03-16",
      analysis: "92% complete",
      xG: { home: 2.4, away: 1.9 },
      possession: { home: 62, away: 38 }
    }
  ];

  const teamStats = [
    { name: "Attack Rating", value: 84 },
    { name: "Defense Rating", value: 78 },
    { name: "Midfield Control", value: 82 },
    { name: "Set Piece Efficiency", value: 76 }
  ];

  const features = [
    {
      title: "AI-Powered Predictions",
      description: "Machine learning algorithms predict match outcomes with 87% accuracy",
      icon: "Prediction",
      stats: "87% Accuracy"
    },
    {
      title: "Real-time Analytics",
      description: "Live data tracking and analysis during matches",
      icon: "Analytics",
      stats: "Live Updates"
    },
    {
      title: "Player Performance",
      description: "Individual player tracking and performance metrics",
      icon: "Performance",
      stats: "500+ Metrics"
    },
    {
      title: "Tactical Analysis",
      description: "Break down formations and strategic decisions",
      icon: "Tactics",
      stats: "15+ Formations"
    },
    {
      title: "Injury Predictions",
      description: "AI models predict potential player injuries",
      icon: "Injury",
      stats: "92% Precision"
    },
    {
      title: "Transfer Market Analysis",
      description: "Player valuation and transfer recommendations",
      icon: "Transfer",
      stats: "$2B+ Analyzed"
    }
  ];

  const testimonials = [
    {
      name: "Alex Ferguson",
      role: "Former Manager, Manchester United",
      content: "This platform revolutionized how we analyze opponent tactics. The predictive insights are incredibly accurate.",
      avatar: "AF"
    },
    {
      name: "Pep Guardiola",
      role: "Manager, Manchester City",
      content: "The tactical breakdowns and player performance metrics have become essential to our match preparation.",
      avatar: "PG"
    },
    {
      name: "Jurgen Klopp",
      role: "Manager, Liverpool FC",
      content: "Finally, a football analytics tool that understands what coaches actually need. Game-changing technology.",
      avatar: "JK"
    }
  ];

  const FeatureIcon = ({ type }) => {
    const icons = {
      Prediction: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      Analytics: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      Performance: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      Tactics: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      Injury: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      Transfer: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    };

    return icons[type] || icons.Prediction;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg mr-3 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">G4</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Gr4de Analytics</span>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <a href="#" className="text-blue-600 border-b-2 border-blue-600 px-3 py-2 text-sm font-medium">Dashboard</a>
                <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Matches</a>
                <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Teams</a>
                <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Players</a>
                <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Insights</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-gray-300">Sign In</Button>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Badge className="mb-6 bg-blue-500 hover:bg-blue-600 text-white border-0">
              Trusted by 500+ Football Clubs Worldwide
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Advanced Football
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Intelligence</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform raw data into winning strategies with our AI-powered football analytics platform. 
              Gain competitive advantages through deep insights and predictive intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 px-8 font-semibold">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Watch Demo
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-300">87%</div>
                <div className="text-blue-200 text-sm">Prediction Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-300">500+</div>
                <div className="text-blue-200 text-sm">Performance Metrics</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-300">15+</div>
                <div className="text-blue-200 text-sm">League Coverage</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-300">24/7</div>
                <div className="text-blue-200 text-sm">Real-time Analysis</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-gray-600 text-sm uppercase tracking-wider">Trusted by top football organizations</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            {["Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1", "UEFA"].map((league) => (
              <div key={league} className="text-gray-400 font-semibold text-lg">
                {league}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Football Intelligence
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              From grassroots to professional levels, our platform delivers insights that drive success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4 text-white">
                    <FeatureIcon type={feature.icon} />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    {feature.title}
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-xs">
                      {feature.stats}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live Match Analysis Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="recent" className="w-full">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Live Match Analysis</h2>
                <p className="text-gray-600 mt-2">Real-time insights and post-match breakdowns</p>
              </div>
              <TabsList className="bg-white">
                <TabsTrigger value="recent">Recent Matches</TabsTrigger>
                <TabsTrigger value="live">Live Now</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="recent">
              <div className="grid md:grid-cols-2 gap-6">
                {featuredMatches.map((match) => (
                  <Card key={match.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{match.homeTeam} vs {match.awayTeam}</CardTitle>
                          <CardDescription>{match.date} • Final Score: {match.score}</CardDescription>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {match.analysis}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Expected Goals (xG)</span>
                              <span>{match.xG.home} - {match.xG.away}</span>
                            </div>
                            <Progress value={match.xG.home / (match.xG.home + match.xG.away) * 100} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Possession</span>
                              <span>{match.possession.home}% - {match.possession.away}%</span>
                            </div>
                            <Progress value={match.possession.home} className="h-2" />
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Analysis Progress</span>
                          <span>85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        View Detailed Analysis
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Team Performance Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Performance Metrics</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Deep dive into team and player statistics with our comprehensive analytics suite
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Manchester United - Performance Dashboard</CardTitle>
                <CardDescription>2023-2024 Premier League Season Analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamStats.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{stat.name}</span>
                      <span>{stat.value}%</span>
                    </div>
                    <Progress value={stat.value} className="h-2" />
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall Rating</span>
                    <Badge className="bg-blue-100 text-blue-800">80/100</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
                <CardDescription>Critical metrics driving success analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-semibold">Expected Goals (xG)</p>
                      <p className="text-sm text-gray-600">2.4 per match • League Rank: 3rd</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">+12%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-semibold">Pass Completion Rate</p>
                      <p className="text-sm text-gray-600">86% accuracy • Top 15% in League</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">+5%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-semibold">Defensive Actions</p>
                      <p className="text-sm text-gray-600">18.2 per match • Pressure Index: High</p>
                    </div>
                    <Badge className="bg-red-100 text-red-800">-3%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-semibold">Set Piece Efficiency</p>
                      <p className="text-sm text-gray-600">76% success rate • 12 goals this season</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">+8%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Football Experts</h2>
            <p className="text-blue-200 max-w-2xl mx-auto">
              Professional coaches and analysts rely on our platform for critical match insights
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 bg-white/10 backdrop-blur-sm text-white">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-blue-200 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-blue-100 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-0">
            Limited Time Offer
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Football Analysis?
          </h2>
          <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
            Join thousands of coaches, analysts, and football organizations using Gr4de Analytics to gain competitive advantages.
          </p>
          
          <div className="bg-gray-50 rounded-2xl p-8 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Label htmlFor="professional-mode" className="text-lg font-semibold">
                Professional Plan Features
              </Label>
              <Switch
                id="professional-mode"
                checked={isProfessional}
                onCheckedChange={setIsProfessional}
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Advanced AI Predictions</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Real-time Match Analysis</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Player Performance Tracking</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className={`w-5 h-5 ${isProfessional ? 'bg-green-500' : 'bg-gray-300'} rounded-full flex items-center justify-center mr-3`}>
                    {isProfessional && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span>Custom AI Models</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-5 h-5 ${isProfessional ? 'bg-green-500' : 'bg-gray-300'} rounded-full flex items-center justify-center mr-3`}>
                    {isProfessional && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span>Priority Support</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-5 h-5 ${isProfessional ? 'bg-green-500' : 'bg-gray-300'} rounded-full flex items-center justify-center mr-3`}>
                    {isProfessional && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span>API Access</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 font-semibold">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              Schedule Demo
            </Button>
          </div>
          <p className="text-gray-500 text-sm mt-4">No credit card required • 14-day free trial</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg mr-3 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">G4</span>
                </div>
                <span className="text-xl font-bold">Gr4de Analytics</span>
              </div>
              <p className="text-gray-400 mb-4">
                Advanced football intelligence platform for professionals and enthusiasts worldwide.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-xs">TW</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-xs">FB</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-xs">IN</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2024 Gr4de Analytics. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;