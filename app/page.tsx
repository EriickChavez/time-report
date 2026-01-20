"use client";

import { useEffect, useState } from "react";
import { CalendarView } from "@/components/calendar-view";
import { TimeRegistration } from "@/components/time-registration";
import { ExportView } from "@/components/export-view";
import { ConfigurationView } from "@/components/configuration-view";
import { UserInfo } from "@/components/user-info";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Download, Settings, Menu, X } from "lucide-react";
import { getCurrentUser } from "./actions/auth";
import { redirect } from "next/navigation";

export default function Home() {
  const [activeView, setActiveView] = useState<
    "calendar" | "register" | "export" | "config"
  >("calendar");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const validateUser = async () => {
    const user = await getCurrentUser();
    if (!user) {
      redirect("/login");
    }
  };

  useEffect(() => {
    validateUser();
  }, []);

  const menuItems = [
    { id: "calendar", label: "Calendario", icon: Calendar },
    { id: "register", label: "Registrar tiempo", icon: Clock },
    { id: "export", label: "Exportar", icon: Download },
    { id: "config", label: "Configuración", icon: Settings },
  ] as const;

  const handleNavigation = (view: typeof activeView) => {
    setActiveView(view);
    setIsMenuOpen(false); // Cierra el menú al navegar
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* 1. Botón Hamburguesa Móvil (Aparece en pantallas < md) */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-sidebar border-sidebar-border"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* 2. Overlay para móvil (Cierra el menú al hacer clic fuera) */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* 3. Sidebar (Se adapta dinámicamente) */}
      <aside
        className={`
        fixed md:relative z-40 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ease-in-out
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground">
            Reporte de tiempo
          </h1>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? "default" : "ghost"}
                  className="w-full justify-start text-base"
                  onClick={() => handleNavigation(item.id)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <UserInfo />
        </div>
      </aside>

      {/* 4. Contenido Principal */}
      <main className="flex-1 overflow-auto w-full pt-16 md:pt-0">
        <div className="h-full">
          {activeView === "calendar" && (
            <CalendarView onRegisterClick={() => setActiveView("register")} />
          )}
          {activeView === "register" && (
            <TimeRegistration onSuccess={() => setActiveView("calendar")} />
          )}
          {activeView === "export" && <ExportView />}
          {activeView === "config" && <ConfigurationView />}
        </div>
      </main>
    </div>
  );
}
