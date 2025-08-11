import { Button } from "@/components/ui/button";

interface NavigationProps {
  user: any;
}

export default function Navigation({ user }: NavigationProps) {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <i className="fas fa-search-dollar text-2xl text-primary-600"></i>
            <span className="text-xl font-bold text-slate-900" data-testid="text-brand-name">
              KeywordPro
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-slate-600 hover:text-slate-900 transition-colors" data-testid="button-notifications">
              <i className="fas fa-bell"></i>
            </button>
            <div className="flex items-center space-x-3">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="User avatar" 
                  className="w-8 h-8 rounded-full object-cover"
                  data-testid="img-user-avatar"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-medium text-sm" data-testid="text-user-initials">
                    {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                  </span>
                </div>
              )}
              <span className="font-medium text-slate-900" data-testid="text-user-name">
                {user?.firstName || user?.email || 'User'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = "/api/logout"}
                data-testid="button-logout"
              >
                <i className="fas fa-sign-out-alt"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
