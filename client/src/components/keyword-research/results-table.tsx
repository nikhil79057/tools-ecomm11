import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Keyword {
  keyword: string;
  volume: number;
  competition: 'Low' | 'Medium' | 'High';
}

interface ResultsTableProps {
  platform: string;
  title: string;
  icon: string;
  keywords: Keyword[];
  onCopy: () => void;
  onExport: () => void;
}

export default function ResultsTable({ 
  platform, 
  title, 
  icon, 
  keywords, 
  onCopy, 
  onExport 
}: ResultsTableProps) {
  const getCompetitionBadge = (competition: string) => {
    const colors = {
      Low: 'bg-green-100 text-green-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      High: 'bg-red-100 text-red-800',
    };
    return colors[competition as keyof typeof colors] || colors.Medium;
  };

  return (
    <Card data-testid={`card-results-${platform}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <i className={`${icon} mr-2`}></i>
            {title}
          </CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCopy}
              data-testid={`button-copy-${platform}`}
            >
              <i className="fas fa-copy mr-1"></i>Copy List
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onExport}
              data-testid={`button-export-${platform}`}
            >
              <i className="fas fa-download mr-1"></i>Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Keyword</TableHead>
              <TableHead>Monthly Volume</TableHead>
              <TableHead>Competition</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keywords.map((keyword, index) => (
              <TableRow key={index} data-testid={`row-keyword-${platform}-${index}`}>
                <TableCell className="font-medium" data-testid={`text-keyword-${platform}-${index}`}>
                  {keyword.keyword}
                </TableCell>
                <TableCell data-testid={`text-volume-${platform}-${index}`}>
                  {keyword.volume.toLocaleString()}
                </TableCell>
                <TableCell>
                  <span 
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getCompetitionBadge(keyword.competition)}`}
                    data-testid={`badge-competition-${platform}-${index}`}
                  >
                    {keyword.competition}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
