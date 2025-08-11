import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
  activeTools: number;
  searches: number; 
  nextBilling: string;
}

export default function StatsCards({ activeTools, searches, nextBilling }: StatsCardsProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="p-6" data-testid="card-active-tools">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Active Tools</p>
            <p className="text-2xl font-bold text-slate-900" data-testid="text-active-tools">
              {activeTools}
            </p>
          </div>
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <i className="fas fa-tools text-primary-600"></i>
          </div>
        </div>
      </Card>
      
      <Card className="p-6" data-testid="card-searches">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Searches This Month</p>
            <p className="text-2xl font-bold text-slate-900" data-testid="text-monthly-searches">
              {searches}
            </p>
          </div>
          <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
            <i className="fas fa-search text-success"></i>
          </div>
        </div>
      </Card>
      
      <Card className="p-6" data-testid="card-billing">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Next Billing</p>
            <p className="text-lg font-bold text-slate-900" data-testid="text-next-billing">
              {nextBilling}
            </p>
          </div>
          <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
            <i className="fas fa-calendar text-warning"></i>
          </div>
        </div>
      </Card>
    </div>
  );
}
