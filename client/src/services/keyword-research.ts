import { apiRequest } from "@/lib/queryClient";

export interface KeywordResult {
  keyword: string;
  volume: number;
  competition: 'Low' | 'Medium' | 'High';
}

export interface KeywordResearchResults {
  amazon: KeywordResult[];
  flipkart: KeywordResult[];
}

export async function performKeywordResearch(
  seedKeyword: string, 
  platforms: string[]
): Promise<KeywordResearchResults> {
  const response = await apiRequest('POST', '/api/keyword-research', {
    seedKeyword,
    platforms,
  });

  if (!response.ok) {
    throw new Error(`Failed to perform keyword research: ${response.statusText}`);
  }

  return await response.json();
}

export async function exportKeywordsCSV(
  platform: 'amazon' | 'flipkart',
  keywords: KeywordResult[]
): Promise<void> {
  const response = await apiRequest('POST', '/api/keyword-research/export', {
    platform,
    keywords,
  });

  if (!response.ok) {
    throw new Error(`Failed to export keywords: ${response.statusText}`);
  }

  // Get the CSV content as blob
  const blob = await response.blob();
  
  // Create download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${platform}_keywords.csv`;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export async function getUserUsageStats(): Promise<{
  searches: number;
  exports: number;
  apiCalls: number;
}> {
  const response = await apiRequest('GET', '/api/stats/usage');

  if (!response.ok) {
    throw new Error(`Failed to fetch usage stats: ${response.statusText}`);
  }

  return await response.json();
}

export async function getUserKeywordHistory(limit = 10): Promise<any[]> {
  const response = await apiRequest('GET', `/api/keyword-research/history?limit=${limit}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch keyword history: ${response.statusText}`);
  }

  return await response.json();
}
