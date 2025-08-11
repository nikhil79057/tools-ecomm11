import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const handleGetStarted = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <i className="fas fa-search-dollar text-2xl text-primary-600"></i>
              <span className="text-xl font-bold text-slate-900">KeywordPro</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors" data-testid="link-features">Features</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors" data-testid="link-pricing">Pricing</a>
              <a href="#contact" className="text-slate-600 hover:text-slate-900 transition-colors" data-testid="link-contact">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={handleGetStarted}
                data-testid="button-login"
              >
                Login
              </Button>
              <Button 
                onClick={handleGetStarted}
                data-testid="button-get-started"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight" data-testid="text-hero-headline">
                Professional Keyword Research Made Simple
              </h1>
              <p className="text-xl text-blue-100 mb-8" data-testid="text-hero-tagline">
                Discover high-volume keywords for Amazon and Flipkart. Boost your product visibility with AI-powered keyword research tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  variant="secondary"
                  onClick={handleGetStarted}
                  data-testid="button-start-free-trial"
                >
                  Start Free Trial
                </Button>
                <Button 
                  size="lg"
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                  data-testid="button-watch-demo"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative bg-white rounded-xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="bg-slate-100 h-4 rounded w-3/4"></div>
                  <div className="bg-slate-100 h-4 rounded w-1/2"></div>
                  <div className="bg-primary-100 h-8 rounded"></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-100 h-12 rounded"></div>
                    <div className="bg-slate-100 h-12 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4" data-testid="text-features-title">
              Powerful Features for Sellers
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto" data-testid="text-features-subtitle">
              Everything you need to dominate marketplace search results
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "fas fa-search",
                title: "Smart Keyword Discovery",
                description: "AI-powered keyword suggestions with accurate search volume estimates for Amazon and Flipkart",
                color: "primary"
              },
              {
                icon: "fas fa-chart-line",
                title: "Volume Analytics", 
                description: "Get precise monthly search volume data to prioritize high-impact keywords",
                color: "success"
              },
              {
                icon: "fas fa-download",
                title: "Export & Integration",
                description: "Export results as CSV or copy formatted lists directly to your clipboard",
                color: "warning"
              },
              {
                icon: "fas fa-store",
                title: "Multi-Platform Support",
                description: "Research keywords for Amazon, Flipkart, or both platforms simultaneously",
                color: "purple"
              },
              {
                icon: "fas fa-clock",
                title: "Real-time Results",
                description: "Get instant keyword suggestions and volume data in seconds",
                color: "indigo"
              },
              {
                icon: "fas fa-shield-alt", 
                title: "Secure & Reliable",
                description: "Enterprise-grade security with 99.9% uptime guarantee",
                color: "pink"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-8 rounded-xl card-hover" data-testid={`card-feature-${index}`}>
                <div className={`w-16 h-16 bg-${feature.color === 'primary' ? 'primary' : feature.color}-100 rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <i className={`${feature.icon} text-2xl text-${feature.color === 'primary' ? 'primary' : feature.color}-600`}></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4" data-testid={`text-feature-title-${index}`}>
                  {feature.title}
                </h3>
                <p className="text-slate-600" data-testid={`text-feature-description-${index}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4" data-testid="text-pricing-title">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600" data-testid="text-pricing-subtitle">
              Pay only for the tools you use. No hidden fees.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <Card className="relative" data-testid="card-pricing-starter">
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2" data-testid="text-plan-name-starter">
                    Starter
                  </h3>
                  <div className="text-3xl font-bold text-slate-900 mb-1" data-testid="text-plan-price-starter">
                    ₹60<span className="text-lg font-normal text-slate-600">/year</span>
                  </div>
                  <p className="text-slate-600 mb-6" data-testid="text-plan-description-starter">
                    Per tool subscription
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={handleGetStarted}
                    data-testid="button-plan-starter"
                  >
                    Get Started
                  </Button>
                </div>
                <ul className="mt-8 space-y-4">
                  {[
                    "Unlimited keyword searches",
                    "CSV export", 
                    "Email support"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center" data-testid={`text-starter-feature-${index}`}>
                      <i className="fas fa-check text-success mr-3"></i>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Professional Plan */}
            <Card className="relative border-2 border-primary-600 shadow-lg" data-testid="card-pricing-professional">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2" data-testid="text-plan-name-professional">
                    Professional
                  </h3>
                  <div className="text-3xl font-bold text-slate-900 mb-1" data-testid="text-plan-price-professional">
                    ₹250<span className="text-lg font-normal text-slate-600">/year</span>
                  </div>
                  <p className="text-slate-600 mb-6" data-testid="text-plan-description-professional">
                    All tools bundle
                  </p>
                  <Button 
                    className="w-full"
                    onClick={handleGetStarted}
                    data-testid="button-plan-professional"
                  >
                    Get Started
                  </Button>
                </div>
                <ul className="mt-8 space-y-4">
                  {[
                    "All current and future tools",
                    "Priority support",
                    "Advanced analytics",
                    "API access"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center" data-testid={`text-professional-feature-${index}`}>
                      <i className="fas fa-check text-success mr-3"></i>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Enterprise Plan */}
            <Card className="relative" data-testid="card-pricing-enterprise">
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2" data-testid="text-plan-name-enterprise">
                    Enterprise
                  </h3>
                  <div className="text-3xl font-bold text-slate-900 mb-1" data-testid="text-plan-price-enterprise">
                    Custom
                  </div>
                  <p className="text-slate-600 mb-6" data-testid="text-plan-description-enterprise">
                    For large teams
                  </p>
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    data-testid="button-plan-enterprise"
                  >
                    Contact Sales
                  </Button>
                </div>
                <ul className="mt-8 space-y-4">
                  {[
                    "Custom integrations",
                    "Dedicated support",
                    "SLA guarantee",
                    "White-label options"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center" data-testid={`text-enterprise-feature-${index}`}>
                      <i className="fas fa-check text-success mr-3"></i>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <i className="fas fa-search-dollar text-2xl text-primary-500"></i>
                <span className="text-xl font-bold">KeywordPro</span>
              </div>
              <p className="text-slate-400" data-testid="text-footer-description">
                Professional keyword research tools for e-commerce sellers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors" data-testid="link-footer-features">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors" data-testid="link-footer-pricing">Pricing</a></li>
                <li><a href="#api" className="hover:text-white transition-colors" data-testid="link-footer-api">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#help" className="hover:text-white transition-colors" data-testid="link-footer-help">Help Center</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors" data-testid="link-footer-contact">Contact</a></li>
                <li><a href="#status" className="hover:text-white transition-colors" data-testid="link-footer-status">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors" data-testid="link-footer-twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors" data-testid="link-footer-linkedin">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors" data-testid="link-footer-github">
                  <i className="fab fa-github"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p data-testid="text-footer-copyright">
              &copy; 2024 KeywordPro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
