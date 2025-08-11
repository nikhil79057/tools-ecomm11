import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface KeywordFormProps {
  onSubmit: (seedKeyword: string, platforms: string[]) => void;
  isLoading: boolean;
}

export default function KeywordForm({ onSubmit, isLoading }: KeywordFormProps) {
  const [seedKeyword, setSeedKeyword] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["amazon"]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (seedKeyword.trim() && selectedPlatforms.length > 0) {
      onSubmit(seedKeyword.trim(), selectedPlatforms);
    }
  };

  const handlePlatformChange = (platform: string, checked: boolean) => {
    setSelectedPlatforms(prev => {
      if (checked) {
        return [...prev, platform];
      } else {
        return prev.filter(p => p !== platform);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-keyword-research">
      <div>
        <Label htmlFor="seed-keyword">Seed Keyword</Label>
        <Input
          id="seed-keyword"
          type="text"
          value={seedKeyword}
          onChange={(e) => setSeedKeyword(e.target.value)}
          placeholder="e.g. wireless headphones"
          required
          data-testid="input-seed-keyword"
        />
      </div>

      <div>
        <Label className="mb-3 block">Platform</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="amazon"
              checked={selectedPlatforms.includes("amazon")}
              onCheckedChange={(checked) => handlePlatformChange("amazon", checked as boolean)}
              data-testid="checkbox-amazon"
            />
            <Label htmlFor="amazon">Amazon</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="flipkart"
              checked={selectedPlatforms.includes("flipkart")}
              onCheckedChange={(checked) => handlePlatformChange("flipkart", checked as boolean)}
              data-testid="checkbox-flipkart"
            />
            <Label htmlFor="flipkart">Flipkart</Label>
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || !seedKeyword.trim() || selectedPlatforms.length === 0}
        data-testid="button-research-submit"
      >
        {isLoading ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            Researching...
          </>
        ) : (
          <>
            <i className="fas fa-search mr-2"></i>
            Research Keywords
          </>
        )}
      </Button>
    </form>
  );
}
