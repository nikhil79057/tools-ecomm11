import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isUnauthorizedError } from "@/lib/authUtils";
import UserTable from "@/components/admin/user-table";

export default function AdminPortal() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('users');

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

    if (!isLoading && user?.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "Admin access required",
        variant: "destructive",
      });
      window.location.href = "/";
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    retry: false,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/admin/analytics"],
    retry: false,
  });

  const { data: tools, isLoading: toolsLoading } = useQuery({
    queryKey: ["/api/tools"],
    retry: false,
  });

  if (isLoading || usersLoading || analyticsLoading || toolsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <header className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <i className="fas fa-cog text-2xl text-primary-500"></i>
              <span className="text-xl font-bold" data-testid="text-admin-title">
                Admin Portal
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-300" data-testid="text-admin-welcome">
                Welcome, {user?.firstName || 'Admin'}
              </span>
              <button 
                onClick={() => window.location.href = "/api/logout"} 
                className="text-slate-300 hover:text-white transition-colors"
                data-testid="button-logout"
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Navigation */}
        <div className="flex space-x-8 mb-8">
          <button
            onClick={() => setActiveSection('users')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeSection === 'users'
                ? 'bg-primary-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            data-testid="button-nav-users"
          >
            <i className="fas fa-users mr-2"></i>Users
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
            onClick={() => setActiveSection('analytics')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeSection === 'analytics'
                ? 'bg-primary-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            data-testid="button-nav-analytics"
          >
            <i className="fas fa-chart-line mr-2"></i>Analytics
          </button>
          <button
            onClick={() => setActiveSection('cms')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeSection === 'cms'
                ? 'bg-primary-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            data-testid="button-nav-cms"
          >
            <i className="fas fa-edit mr-2"></i>CMS
          </button>
        </div>

        {/* Users Section */}
        {activeSection === 'users' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2" data-testid="text-users-title">
                User Management
              </h2>
              <p className="text-slate-600" data-testid="text-users-description">
                Manage sellers, subscriptions, and user data
              </p>
            </div>

            <UserTable users={users || []} />
          </div>
        )}

        {/* Tools Section */}
        {activeSection === 'tools' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2" data-testid="text-tools-title">
                Tool Management
              </h2>
              <p className="text-slate-600" data-testid="text-tools-description">
                Create, edit, and manage available tools
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {tools?.map((tool: any, index: number) => (
                <Card key={tool.id} className="p-6" data-testid={`card-admin-tool-${index}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <i className={`fas fa-${tool.icon || 'search'} text-primary-600`}></i>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900" data-testid={`text-admin-tool-name-${index}`}>
                          {tool.name}
                        </h3>
                        <p className="text-slate-600" data-testid={`text-admin-tool-description-${index}`}>
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-green-600 bg-green-50 w-8 h-8 rounded-full flex items-center justify-center" data-testid={`button-tool-toggle-${index}`}>
                        <i className={`fas fa-toggle-${tool.isActive ? 'on' : 'off'}`}></i>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Current Price</span>
                      <span className="font-medium text-slate-900" data-testid={`text-admin-tool-price-${index}`}>
                        ₹{tool.price}/year
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-4">
                    <Button className="flex-1" data-testid={`button-edit-tool-${index}`}>
                      Edit Tool
                    </Button>
                    <Button variant="outline" className="flex-1" data-testid={`button-tool-analytics-${index}`}>
                      View Analytics
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Section */}
        {activeSection === 'analytics' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2" data-testid="text-analytics-title">
                Analytics & Reporting
              </h2>
              <p className="text-slate-600" data-testid="text-analytics-description">
                Monitor business metrics and user behavior
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6" data-testid="card-mrr">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Monthly Recurring Revenue</p>
                    <p className="text-2xl font-bold text-slate-900" data-testid="text-mrr">
                      ₹{analytics?.mrr || 0}
                    </p>
                    <p className="text-sm text-success">+{analytics?.revenueGrowth || 0}% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-rupee-sign text-success"></i>
                  </div>
                </div>
              </Card>

              <Card className="p-6" data-testid="card-subscribers">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Subscribers</p>
                    <p className="text-2xl font-bold text-slate-900" data-testid="text-subscribers">
                      {analytics?.activeSubscribers || 0}
                    </p>
                    <p className="text-sm text-success">+{analytics?.subscriberGrowth || 0}% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-users text-primary-600"></i>
                  </div>
                </div>
              </Card>

              <Card className="p-6" data-testid="card-churn">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Churn Rate</p>
                    <p className="text-2xl font-bold text-slate-900" data-testid="text-churn">
                      {analytics?.churnRate || 0}%
                    </p>
                    <p className="text-sm text-danger">Target: &lt;3%</p>
                  </div>
                  <div className="w-12 h-12 bg-danger/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-chart-line text-danger"></i>
                  </div>
                </div>
              </Card>

              <Card className="p-6" data-testid="card-searches">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Searches</p>
                    <p className="text-2xl font-bold text-slate-900" data-testid="text-total-searches">
                      {analytics?.totalSearches || 0}
                    </p>
                    <p className="text-sm text-success">This month</p>
                  </div>
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-search text-warning"></i>
                  </div>
                </div>
              </Card>
            </div>

            {/* Charts Placeholder */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="p-6" data-testid="card-revenue-chart">
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                    <p className="text-slate-500" data-testid="text-chart-placeholder">
                      Chart visualization would go here
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6" data-testid="card-growth-chart">
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                    <p className="text-slate-500" data-testid="text-chart-placeholder-2">
                      Chart visualization would go here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* CMS Section */}
        {activeSection === 'cms' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2" data-testid="text-cms-title">
                Content Management
              </h2>
              <p className="text-slate-600" data-testid="text-cms-description">
                Edit landing page content and marketing materials
              </p>
            </div>

            <div className="space-y-6">
              <Card className="p-6" data-testid="card-hero-editor">
                <CardHeader>
                  <CardTitle>Hero Section</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Headline
                      </label>
                      <input
                        type="text"
                        defaultValue="Professional Keyword Research Made Simple"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        data-testid="input-hero-headline"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Tagline
                      </label>
                      <textarea
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        rows={3}
                        defaultValue="Discover high-volume keywords for Amazon and Flipkart. Boost your product visibility with AI-powered keyword research tools."
                        data-testid="textarea-hero-tagline"
                      />
                    </div>
                  </div>
                  <Button className="mt-4" data-testid="button-save-hero">
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              <Card className="p-6" data-testid="card-pricing-editor">
                <CardHeader>
                  <CardTitle>Pricing Plans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900" data-testid="text-starter-plan">
                          Starter Plan
                        </p>
                        <p className="text-sm text-slate-600">Per tool subscription</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <input
                          type="number"
                          defaultValue="60"
                          className="w-20 px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          data-testid="input-starter-price"
                        />
                        <span className="text-slate-600">₹/year</span>
                        <Button variant="outline" size="sm" data-testid="button-edit-starter">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
