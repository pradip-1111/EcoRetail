'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Leaf,
  Trash2,
  Footprints,
  Recycle,
  BadgeCheck,
  Settings,
  CircleHelp,
  Mail,
  LogOut,
  Lightbulb,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '../ui/button';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/products', label: 'Eco-Products', icon: Leaf },
  { href: '/waste-reduction', label: 'AI Waste Predictor', icon: Trash2 },
  { href: '/carbon-footprint', label: 'Carbon Footprint', icon: Footprints },
  { href: '/supply-chain', label: 'Shelf Placement', icon: Lightbulb },
  { href: '/email-marketing', label: 'Email Marketing', icon: Mail },
  { href: '/certifications', label: 'Certifications', icon: BadgeCheck },
];

export default function AppSidebarContent() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <Leaf className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold">EcoRetail Insight</h1>
        </Link>
      </SidebarHeader>
      <Separator />
      <SidebarContent className="p-4">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                className="w-full justify-start"
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator />
      <SidebarFooter className="p-4">
        <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/settings'}
                className="w-full justify-start"
              >
                <Link href="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/help'}
                className="w-full justify-start"
              >
                 <Link href="/help">
                    <CircleHelp className="h-4 w-4" />
                    <span>Help</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <Button
                variant="ghost"
                className="w-full justify-start px-2"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Button>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
