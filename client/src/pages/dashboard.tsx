import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/ui/navigation";
import StatsCards from "@/components/dashboard/stats-cards";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: subscriptions, isLoading: subscriptionsLoading } = useQuery({
    queryKey: ["/api/subscriptions"],
    retry: false,
  });

  const { data: tools, isLoading: toolsLoading } = useQuery({
    queryKey: ["/api/tools"],
    retry: false,
  });

  const { data: usageStats, isLoading: usageLoading } = useQuery({
    queryKey: ["/api/stats/usage"],
    retry: false,
  });

  if (isLoading || subscriptionsLoading || toolsLoading || usageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const activeTools = subscriptions?.length || 0;
  const totalSearches = usageStats?.searches || 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Navigation */}
        <div className="flex space-x-8 mb-8">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeSection === 'overview'
                ? 'bg-primary-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            data-testid="button-nav-overview"
          >
            <i className="fas fa-chart-pie mr-2"></i>Overview
          </button>
          <button
            onClick={() => setActiveSection('tools')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeSection === 'tools'
                ? 'bg-primary-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            data-testid="button-nav-tools"
          >
            <i className="fas fa-tools mr-2"></i>Tools
          </button>
          <button
            onClick={() => setActiveSection('billing')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeSection === 'billing'
                ? 'bg-primary-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            data-testid="button-nav-billing"
          >
            <i className="fas fa-credit-card mr-2"></i>Billing
          </button>
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <StatsCards
                activeTools={activeTools}
                searches={totalSearches}
                nextBilling="Dec 15"
              />

              {/* Recent Activity */}
              <Card data-testid="card-recent-activity">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-search text-primary-600 text-sm"></i>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900" data-testid="text-activity-description-0">
                          Started using keyword research tool
                        </p>
                        <p className="text-sm text-slate-500" data-testid="text-activity-time-0">
                          Welcome to KeywordPro!
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Subscription Status */}
            <div className="space-y-6">
              <Card data-testid="card-subscription-status">
                <CardHeader>
                  <CardTitle>Subscription Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subscriptions && subscriptions.length > 0 ? (
                      subscriptions.map((subscription: any, index: number) => (
                        <div
                          key={subscription.id}
                          className="flex items-center justify-between p-3 bg-success/10 rounded-lg"
                          data-testid={`subscription-item-${index}`}
                        >
                          <div className="flex items-center space-x-3">
                            <i className="fas fa-search text-success"></i>
                            <span className="font-medium text-slate-900" data-testid={`text-subscription-name-${index}`}>
                              {subscription.tool?.name || 'Tool'}
                            </span>
                          </div>
                          <span className="text-success font-semibold" data-testid={`text-subscription-status-${index}`}>
                            Active
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-slate-500" data-testid="text-no-subscriptions">
                          No active subscriptions yet
                        </p>
                        <Button
                          className="mt-2"
                          onClick={() => setActiveSection('tools')}
                          data-testid="button-browse-tools"
                        >
                          Browse Tools
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card data-testid="card-quick-actions">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link href="/keyword-tool">
                      <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-colors" data-testid="button-research-keywords">
                        <div className="flex items-center space-x-3">
                          <i className="fas fa-search text-primary-600"></i>
                          <span className="font-medium text-slate-900">Research Keywords</span>
                        </div>
                      </button>
                    </Link>
                    <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-colors" data-testid="button-download-reports">
                      <div className="flex items-center space-x-3">
                        <i className="fas fa-download text-primary-600"></i>
                        <span className="font-medium text-slate-900">Download Reports</span>
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Tools Section */}
        {activeSection === 'tools' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2" data-testid="text-tools-title">
                Available Tools
              </h2>
              <p className="text-slate-600" data-testid="text-tools-description">
                Subscribe to tools and start researching keywords
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {tools?.map((tool: any, index: number) => {
                const hasSubscription = subscriptions?.some((sub: any) => sub.toolId === tool.id);
                return (
                  <Card key={tool.id} className="p-6" data-testid={`card-tool-${index}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <i className={`fas fa-${tool.icon || 'search'} text-primary-600`}></i>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900" data-testid={`text-tool-name-${index}`}>
                            {tool.name}
                          </h3>
                          <p className="text-slate-600" data-testid={`text-tool-description-${index}`}>
                            {tool.description}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        hasSubscription 
                          ? 'bg-success text-white' 
                          : 'bg-slate-200 text-slate-600'
                      }`} data-testid={`text-tool-status-${index}`}>
                        {hasSubscription ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-slate-900" data-testid={`text-tool-price-${index}`}>
                        ₹{tool.price}<span className="text-sm font-normal text-slate-600">/year</span>
                      </span>
                      {hasSubscription ? (
                        <Link href="/keyword-tool">
                          <Button data-testid={`button-use-tool-${index}`}>Use Tool</Button>
                        </Link>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => {
                            // Mock subscription process
                            toast({
                              title: "Subscription Process",
                              description: "In a real app, this would redirect to Razorpay checkout.",
                            });
                          }}
                          data-testid={`button-subscribe-${index}`}
                        >
                          Subscribe
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Billing Section */}
        {activeSection === 'billing' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2" data-testid="text-billing-title">
                Billing & Subscriptions
              </h2>
              <p className="text-slate-600" data-testid="text-billing-description">
                Manage your subscriptions and payment methods
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Current Subscriptions */}
                <Card data-testid="card-current-subscriptions">
                  <CardHeader>
                    <CardTitle>Current Subscriptions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {subscriptions && subscriptions.length > 0 ? (
                        subscriptions.map((subscription: any, index: number) => (
                          <div
                            key={subscription.id}
                            className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                            data-testid={`billing-subscription-${index}`}
                          >
                            <div className="flex items-center space-x-4">
                              <i className="fas fa-search text-primary-600"></i>
                              <div>
                                <p className="font-medium text-slate-900" data-testid={`text-billing-tool-name-${index}`}>
                                  {subscription.tool?.name || 'Keyword Research Tool'}
                                </p>
                                <p className="text-sm text-slate-600" data-testid={`text-billing-subscription-type-${index}`}>
                                  Annual subscription
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-slate-900" data-testid={`text-billing-price-${index}`}>
                                ₹{subscription.tool?.price || '60'}/year
                              </p>
                              <p className="text-sm text-slate-600" data-testid={`text-billing-renewal-${index}`}>
                                Renews Dec 15, 2024
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-slate-500" data-testid="text-no-billing-subscriptions">
                            No active subscriptions
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Method & Usage */}
              <div className="space-y-6">
                <Card data-testid="card-payment-method">
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <p className="text-slate-500" data-testid="text-no-payment-method">
                        No payment method added yet
                      </p>
                      <Button className="mt-2" variant="outline" data-testid="button-add-payment">
                        Add Payment Method
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="card-usage-stats">
                  <CardHeader>
                    <CardTitle>This Month's Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Keyword Searches</span>
                        <span className="font-medium text-slate-900" data-testid="text-usage-searches">
                          {usageStats?.searches || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">CSV Exports</span>
                        <span className="font-medium text-slate-900" data-testid="text-usage-exports">
                          {usageStats?.exports || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">API Calls</span>
                        <span className="font-medium text-slate-900" data-testid="text-usage-api-calls">
                          {usageStats?.apiCalls || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
