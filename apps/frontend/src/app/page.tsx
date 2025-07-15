
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, Users, Zap, ArrowRight, Star, CheckCircle } from "lucide-react"
import Options from "@/components/home/Options"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Header */}
      <header className="relative border-b bg-white/80 backdrop-blur-sm animate-slide-down">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 animate-fade-in">
            <div className="relative">
              <Zap className="h-8 w-8 text-indigo-600 animate-pulse-glow" />
              <div className="absolute inset-0 h-8 w-8 bg-indigo-600/20 rounded-full animate-ping"></div>
            </div>
            <span className="text-2xl font-bold text-gray-900 animate-slide-in-left">Promptiva</span>
          </div>
          <div className="space-x-4 animate-fade-in-delayed">
              <Options />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20 text-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-6 animate-bounce-gentle">
            <Star className="h-4 w-4 mr-2 animate-spin-slow" />
            AI-Powered Communication Platform
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 animate-text-reveal">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
              Automate Your
            </span>
            <br />
            <span className="animate-fade-in-up-delayed">Communication with AI</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in-up-delayed-2">
            Send personalized emails and make calls effortlessly. Just describe what you want to communicate, and let
            <span className="font-semibold text-indigo-600"> Promptiva </span>handle the rest.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up-delayed-3">
            <Link href="/signup">
              <Button
                size="lg"
                className="text-lg px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl group"
              >
                Start Communicating Smarter
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 bg-transparent"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up-delayed-4">
          <div className="text-center animate-float">
            <div className="text-3xl font-bold text-indigo-600 mb-2">10,000+</div>
            <div className="text-gray-600">Messages Sent</div>
          </div>
          <div className="text-center animate-float-delayed">
            <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
          <div className="text-center animate-float-delayed-2">
            <div className="text-3xl font-bold text-pink-600 mb-2">5min</div>
            <div className="text-gray-600">Setup Time</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative container mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Why Choose Promptiva?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of communication with our AI-powered platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-6 relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <div className="absolute inset-0 w-16 h-16 bg-blue-500/20 rounded-2xl animate-ping group-hover:animate-none"></div>
              </div>
              <CardTitle className="text-xl mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                Smart Email Generation
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Create personalized emails with AI that understands context, tone, and recipient preferences
              </CardDescription>
              <div className="mt-4 flex items-center justify-center text-sm text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <CheckCircle className="h-4 w-4 mr-2" />
                99% Delivery Rate
              </div>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up-delayed border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-6 relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <div className="absolute inset-0 w-16 h-16 bg-purple-500/20 rounded-2xl animate-ping group-hover:animate-none"></div>
              </div>
              <CardTitle className="text-xl mb-3 group-hover:text-purple-600 transition-colors duration-300">
                Automated Calling
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Make calls with AI-generated scripts tailored to each recipient and conversation context
              </CardDescription>
              <div className="mt-4 flex items-center justify-center text-sm text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <CheckCircle className="h-4 w-4 mr-2" />
                Natural Voice AI
              </div>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up-delayed-2 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-6 relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="absolute inset-0 w-16 h-16 bg-green-500/20 rounded-2xl animate-ping group-hover:animate-none"></div>
              </div>
              <CardTitle className="text-xl mb-3 group-hover:text-green-600 transition-colors duration-300">
                Contact Management
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Organize your contacts and personalize communication strategies for each relationship
              </CardDescription>
              <div className="mt-4 flex items-center justify-center text-sm text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <CheckCircle className="h-4 w-4 mr-2" />
                Smart Segmentation
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white animate-fade-in-up relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 animate-text-glow">
              Ready to Transform Your Communication?
            </h3>
            <p className="text-xl mb-8 opacity-90">Join thousands of professionals who have automated their outreach</p>
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                Get Started Free Today
              </Button>
            </Link>
          </div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-white/10 rounded-full animate-float-delayed"></div>
        </div>
      </section>
    </div>
  )
}
