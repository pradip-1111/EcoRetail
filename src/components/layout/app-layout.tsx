"use client";

import { useAuth } from "@/contexts/auth-context";
import AppSidebarContent from "./app-sidebar";
import { Sidebar, SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { UserNav } from "./user-nav";
import { LoginDialog } from "../auth/login-dialog";
import { RegisterDialog } from "../auth/register-dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Leaf } from "lucide-react";

function AppHeader() {
  const { user } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-2">
            {user ? (
                <div className="md:hidden">
                    <SidebarTrigger size="icon" variant="outline" />
                </div>
            ) : (
                 <Link href="/" className="flex items-center gap-2">
                    <div className="bg-primary p-2 rounded-lg">
                        <Leaf className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-xl font-semibold">EcoRetail Insight</h1>
                </Link>
            )}
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <UserNav />
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setLoginOpen(true)}>Login</Button>
              <Button onClick={() => setRegisterOpen(true)}>Register</Button>
            </div>
          )}
        </div>
      </header>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      <RegisterDialog open={registerOpen} onOpenChange={setRegisterOpen} onRegister={() => setLoginOpen(true)} />
    </>
  );
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    if (!user) {
        return (
            <>
                <AppHeader />
                <main>{children}</main>
            </>
        )
    }

    return (
        <SidebarProvider>
          <Sidebar>
            <AppSidebarContent />
          </Sidebar>
          <SidebarInset>
            <AppHeader />
            <div className="p-4 sm:p-6 lg:p-8">{children}</div>
          </SidebarInset>
        </SidebarProvider>
    )
}
