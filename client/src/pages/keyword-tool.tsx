import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/ui/navigation";
import KeywordForm from "@/components/keyword-research/keyword-form";
import ResultsTable from "@/components/keyword-research/results-table";
import { performKeywordResearch, exportKeywordsCSV } from "@/services/keyword-research";

export default function KeywordTool() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [searchParams, setSearchParams] = useState<any>(null);

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

  const handleKeywordSearch = async (seedKeyword: string, platforms: string[]) => {
    setIsSearching(true);
    setSearchParams({ seedKeyword, platforms });

    try {
      const searchResults = await performKeywordResearch(seedKeyword, platforms);
      setResults(searchResults);
      
      toast({
        title: "Research Complete",
        description: `Found keywords for ${platforms.join(', ')} platforms`,
      });
    } catch (error) {
      if (isUnauthorizedError(error as Error)) {
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
      
      toast({
        title: "Research Failed",
        description: error instanceof Error ? error.message : "Failed to perform keyword research",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleCopyToClipboard = (platform: 'amazon' | 'flipkart') => {
    const keywords = results?.[platform] || [];
    const keywordList = keywords.map((k: any) => k.keyword).join(', ');
    
    navigator.clipboard.writeText(keywordList).then(() => {
      toast({
        title: "Copied to Clipboard",
        description: `${platform} keywords copied successfully`,
      });
    }).catch(() => {
      toast({
        title: "Copy Failed", 
        description: "Failed to copy keywords to clipboard",
        variant: "destructive",
      });
    });
  };

  const handleExportCSV = async (platform: 'amazon' | 'flipkart') => {
    try {
      const keywords = results?.[platform] || [];
      await exportKeywordsCSV(platform, keywords);
      
      toast({
        title: "Export Successful",
        description: `${platform} keywords exported as CSV`,
      });
    } catch (error) {
      if (isUnauthorizedError(error as Error)) {
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

      toast({
        title: "Export Failed",
        description: "Failed to export keywords",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading keyword tool...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Tool Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <button className="text-slate-600 hover:text-slate-900 transition-colors" data-testid="button-back">
                  <i className="fas fa-arrow-left"></i>
                </button>
              </Link>
              <div className="flex items-center space-x-3">
                <i className="fas fa-search text-2xl text-primary-600"></i>
                <span className="text-xl font-bold text-slate-900" data-testid="text-tool-title">
                  Keyword Research Tool
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">
                Searches this month: <span className="font-semibold" data-testid="text-monthly-searches">0</span>
              </span>
              <Link href="/">
                <Button variant="outline" data-testid="button-back-dashboard">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8" data-testid="card-research-form">
              <CardHeader>
                <CardTitle>Research Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <KeywordForm 
                  onSubmit={handleKeywordSearch} 
                  isLoading={isSearching}
                />
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {isSearching && (
              <Card className="p-8 text-center" data-testid="card-loading">
                <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-600" data-testid="text-loading">
                  Analyzing keywords and fetching search volumes...
                </p>
              </Card>
            )}

            {results && !isSearching && (
              <div className="space-y-6" data-testid="section-results">
                {/* Amazon Results */}
                {results.amazon && results.amazon.length > 0 && (
                  <ResultsTable
                    platform="amazon"
                    title="Amazon Keywords"
                    icon="fab fa-amazon text-orange-500"
                    keywords={results.amazon}
                    onCopy={() => handleCopyToClipboard('amazon')}
                    onExport={() => handleExportCSV('amazon')}
                  />
                )}

                {/* Flipkart Results */}
                {results.flipkart && results.flipkart.length > 0 && (
                  <ResultsTable
                    platform="flipkart"
                    title="Flipkart Keywords"
                    icon="fas fa-shopping-cart text-blue-500"
                    keywords={results.flipkart}
                    onCopy={() => handleCopyToClipboard('flipkart')}
                    onExport={() => handleExportCSV('flipkart')}
                  />
                )}

                {/* Formatted Lists */}
                <Card data-testid="card-formatted-lists">
                  <CardHeader>
                    <CardTitle>Formatted Keyword Lists</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.amazon && results.amazon.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Amazon Keywords (Comma-separated)
                          </label>
                          <textarea
                            readOnly
                            value={results.amazon.map((k: any) => k.keyword).join(', ')}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-sm"
                            rows={3}
                            data-testid="textarea-amazon-list"
                          />
                        </div>
                      )}
                      {results.flipkart && results.flipkart.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Flipkart Keywords (Comma-separated)
                          </label>
                          <textarea
                            readOnly
                            value={results.flipkart.map((k: any) => k.keyword).join(', ')}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-sm"
                            rows={3}
                            data-testid="textarea-flipkart-list"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {!results && !isSearching && (
              <Card className="p-8 text-center" data-testid="card-empty-state">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-search text-2xl text-slate-400"></i>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2" data-testid="text-empty-title">
                  Ready to Research Keywords
                </h3>
                <p className="text-slate-600" data-testid="text-empty-description">
                  Enter a seed keyword and select platforms to get started with AI-powered keyword research.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
