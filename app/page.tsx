"use client";

import { useState } from "react";
import { CalendarView } from "@/components/calendar-view";
import { TimeRegistration } from "@/components/time-registration";
import { ExportView } from "@/components/export-view";
import { ConfigurationView } from "@/components/configuration-view";
import { UserInfo } from "@/components/user-info";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Download, Settings } from "lucide-react";

export default function Home() {
  const [activeView, setActiveView] = useState<
    "calendar" | "register" | "export" | "config"
  >("calendar");

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground">
            Reporte de tiempo
          </h1>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <Button
              variant={activeView === "calendar" ? "default" : "ghost"}
              className="w-full justify-start text-base"
              onClick={() => setActiveView("calendar")}
            >
              <Calendar className="mr-3 h-5 w-5" />
              Calendario
            </Button>

            <Button
              variant={activeView === "register" ? "default" : "ghost"}
              className="w-full justify-start text-base"
              onClick={() => setActiveView("register")}
            >
              <Clock className="mr-3 h-5 w-5" />
              Registrar tiempo
            </Button>

            <Button
              variant={activeView === "export" ? "default" : "ghost"}
              className="w-full justify-start text-base"
              onClick={() => setActiveView("export")}
            >
              <Download className="mr-3 h-5 w-5" />
              Exportar
            </Button>

            <Button
              variant={activeView === "config" ? "default" : "ghost"}
              className="w-full justify-start text-base"
              onClick={() => setActiveView("config")}
            >
              <Settings className="mr-3 h-5 w-5" />
              Configuración
            </Button>
            <Button
              variant={activeView === "config" ? "default" : "ghost"}
              className="w-full justify-start text-base"
              onClick={() => setActiveView("config")}
            >
              <Settings className="mr-3 h-5 w-5" />
              Configuración
            </Button>
          </div>
        </nav>

        {/* User Info and Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <UserInfo />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {activeView === "calendar" && (
          <CalendarView onRegisterClick={() => setActiveView("register")} />
        )}
        {activeView === "register" && (
          <TimeRegistration onSuccess={() => setActiveView("calendar")} />
        )}
        {activeView === "export" && <ExportView />}
        {activeView === "config" && <ConfigurationView />}
      </main>
    </div>
  );
}
