"use client";

import { useUser } from "@/lib/hooks/useUser";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export function UserInfo() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center space-x-3 animate-pulse">
        <div className="h-10 w-10 bg-muted rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-sidebar-foreground truncate">
            {user.fullName || "Usuario"}
          </p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start"
        onClick={() => logout()}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar Sesión
      </Button>
    </div>
  );
}
