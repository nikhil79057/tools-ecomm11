import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role: string;
  createdAt: string;
  subscriptions: Array<{
    id: string;
    status: string;
    tool: {
      id: string;
      name: string;
      price: string;
    };
  }>;
}

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || 
      (filterStatus === "active" && user.subscriptions.some(sub => sub.status === "active")) ||
      (filterStatus === "free" && user.subscriptions.length === 0) ||
      (filterStatus === "churned" && user.subscriptions.every(sub => sub.status !== "active"));
    
    return matchesSearch && matchesFilter;
  });

  const getUserStatus = (user: User) => {
    const activeSubscriptions = user.subscriptions.filter(sub => sub.status === "active");
    if (activeSubscriptions.length > 0) return "Active";
    if (user.subscriptions.length > 0) return "Churned";
    return "Free";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success/10 text-success";
      case "Churned":
        return "bg-red-100 text-red-800";
      case "Free":
        return "bg-slate-100 text-slate-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getTotalUsage = (user: User) => {
    // Mock usage calculation - in real app would come from usage stats
    return Math.floor(Math.random() * 2000) + 100;
  };

  return (
    <Card data-testid="card-user-table">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
              data-testid="input-search-users"
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48" data-testid="select-filter-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active Subscribers</SelectItem>
                <SelectItem value="free">Free Users</SelectItem>
                <SelectItem value="churned">Churned Users</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button data-testid="button-add-user">
            <i className="fas fa-plus mr-2"></i>Add User
          </Button>
        </div>
      </div>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="px-6 py-3">User</TableHead>
                <TableHead className="px-6 py-3">Email</TableHead>
                <TableHead className="px-6 py-3">Subscription</TableHead>
                <TableHead className="px-6 py-3">Usage</TableHead>
                <TableHead className="px-6 py-3">Status</TableHead>
                <TableHead className="px-6 py-3">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => {
                  const userStatus = getUserStatus(user);
                  const activeSubscriptions = user.subscriptions.filter(sub => sub.status === "active");
                  
                  return (
                    <TableRow key={user.id} data-testid={`row-user-${index}`}>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {user.profileImageUrl ? (
                            <img
                              src={user.profileImageUrl}
                              alt="User avatar"
                              className="w-8 h-8 rounded-full object-cover"
                              data-testid={`img-user-avatar-${index}`}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-primary-600 font-medium text-sm" data-testid={`text-user-initials-${index}`}>
                                {user.firstName?.[0] || user.email[0].toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="font-medium text-slate-900" data-testid={`text-user-name-${index}`}>
                            {user.firstName && user.lastName 
                              ? `${user.firstName} ${user.lastName}`
                              : user.email.split('@')[0]
                            }
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-slate-600" data-testid={`text-user-email-${index}`}>
                        {user.email}
                      </TableCell>
                      <TableCell className="px-6 py-4" data-testid={`cell-user-subscription-${index}`}>
                        {activeSubscriptions.length > 0 ? (
                          <div className="space-y-1">
                            {activeSubscriptions.slice(0, 2).map((sub, subIndex) => (
                              <span
                                key={sub.id}
                                className="inline-block bg-success/10 text-success px-2 py-1 rounded-full text-xs font-medium mr-1"
                                data-testid={`badge-subscription-${index}-${subIndex}`}
                              >
                                {sub.tool.name}
                              </span>
                            ))}
                            {activeSubscriptions.length > 2 && (
                              <span className="text-xs text-slate-500" data-testid={`text-more-subscriptions-${index}`}>
                                +{activeSubscriptions.length - 2} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm" data-testid={`text-no-subscription-${index}`}>
                            No active subscriptions
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-slate-600" data-testid={`text-user-usage-${index}`}>
                        {getTotalUsage(user)} searches
                      </TableCell>
                      <TableCell className="px-6 py-4" data-testid={`cell-user-status-${index}`}>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(userStatus)}`}>
                          {userStatus}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4" data-testid={`cell-user-actions-${index}`}>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            data-testid={`button-edit-user-${index}`}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-danger hover:text-red-700"
                            data-testid={`button-suspend-user-${index}`}
                          >
                            {userStatus === "Active" ? "Suspend" : "Activate"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="px-6 py-8 text-center">
                    <div className="text-slate-500">
                      <i className="fas fa-users text-3xl mb-2 text-slate-300" data-testid="icon-no-users"></i>
                      <p data-testid="text-no-users">
                        {searchTerm || filterStatus !== "all" 
                          ? "No users found matching your criteria" 
                          : "No users found"
                        }
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
