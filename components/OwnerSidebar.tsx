"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Bell,
  Building2,
  Ticket,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import QuickSearch from '@/components/QuickSearch';

interface SidebarItem {
  title: string;
  href?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: string;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/owner",
    icon: LayoutDashboard,
  },
  {
    title: "Quản lý khách hàng",
    href: "/owner/customers", 
    icon: Users,
  },
  {
    title: "Quản lý bãi đỗ",
    href: "/owner/parking",
    icon: Building2,
  },
  {
    title: "Quản lý vé",
    href: "/owner/tickets",
    icon: Ticket,
  },
  {
    title: "Báo cáo thống kê",
    href: "/owner/reports",
    icon: BarChart3,
  },
  {
    title: "Tài khoản",
    href: "/owner/account",
    icon: User,
  },
];

interface OwnerSidebarProps {
  className?: string;
}

export default function OwnerSidebar({ className = "" }: OwnerSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleExpanded = (title: string) => {

    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  }
  // Returns true if the current path matches the item's href exactly
  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href;
  };

  // Returns true if any child of the item is active
  const isChildActive = (item: SidebarItem): boolean => {
    if (!item.children) return false;
    return item.children.some(child =>
      isActive(child.href) || isChildActive(child)
    )
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/account/login");
  };

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.title);
    const Icon = item.icon;

    // Determine if this item or any of its children is active
    const active = isActive(item.href);
    const childActive = isChildActive(item);

    if (hasChildren) {
      return (
        <div key={item.title} className="mb-1">
          <button
            onClick={() => toggleExpanded(item.title)}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-left rounded-lg transition-all duration-200 group
              ${active || childActive ? (!isCollapsed ? 'bg-green-100 text-green-700 border-r-2 border-green-600' : '') : 'hover:bg-green-50 hover:text-green-700'}
              ${level > 0 ? 'ml-4 text-sm' : ''}`}
          >
            <div className="flex items-center gap-3">
              {isCollapsed && (active || childActive) ? (
                <span className="flex items-center justify-center w-11 h-11 bg-green-100 rounded-lg mx-auto">
                  <Icon className="w-6 h-6 text-green-600" />
                </span>
              ) : (
                <span className="flex items-center justify-center w-11 h-11 mx-auto">
                  <Icon className={`${isCollapsed ? 'w-6 h-6' : 'w-4 h-4'} ${active || childActive ? 'text-green-600' : 'text-gray-500 group-hover:text-green-600'}`} />
                </span>
              )}
              {!isCollapsed && (
                <span className={`font-medium ${active || childActive ? 'text-green-700' : 'text-gray-700 group-hover:text-green-700'}`}>
                  {item.title}
                </span>
              )}
            </div>
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                {item.badge && (
                  <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                    {item.badge}
                  </Badge>
                )}
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
            )}
          </button>
          {/* Render children if expanded */}
          {isExpanded && item.children && (
            <div className="pl-4">
              {item.children.map(child => renderSidebarItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <Link
          key={item.title}
          href={item.href || '#'}
          className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group mb-1
            ${active ? (!isCollapsed ? 'bg-green-100 text-green-700 border-r-2 border-green-600' : '') : 'hover:bg-green-50 hover:text-green-700'}
            ${level > 0 ? 'ml-4 text-sm' : ''}`}
        >
          <div className="flex items-center gap-3">
            {isCollapsed && active ? (
              <span className="flex items-center justify-center w-11 h-11 bg-green-100 rounded-lg mx-auto">
                <Icon className="w-6 h-6 text-green-600" />
              </span>
            ) : (
              <span className="flex items-center justify-center w-11 h-11 mx-auto">
                <Icon className={`${isCollapsed ? 'w-6 h-6' : 'w-4 h-4'} ${active ? 'text-green-600' : 'text-gray-500 group-hover:text-green-600'}`} />
              </span>
            )}
            {!isCollapsed && (
              <span className={`font-medium ${active ? 'text-green-700' : 'text-gray-700 group-hover:text-green-700'}`}>
                {item.title}
              </span>
            )}
          </div>
          {!isCollapsed && item.badge && (
            <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
              {item.badge}
            </Badge>
          )}
        </Link>
      );
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-6 left-4 z-50 lg:hidden w-12 h-12 flex items-center justify-center"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
      </Button>

      {/* Sidebar */}
      <div className={`fixed lg:relative left-0 top-0 z-50 bg-white border-r border-gray-200 shadow-lg transition-all duration-300 lg:z-10
        ${isCollapsed ? 'w-16 min-w-[56px]' : 'w-72'}
        h-screen flex flex-col
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${className}
      `}>
        
        {/* Header */}
        <div className={`p-4 border-b border-gray-200 ${isCollapsed ? 'px-2' : ''}`}>
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-lg text-gray-800">GoPark Owner</h1>
                  <p className="text-xs text-gray-500">Quản lý bãi đỗ</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex w-12 h-12 items-center justify-center"
            >
              <Menu className="w-7 h-7" />
            </Button>
          </div>
        </div>

        {/* Owner Info */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">OW</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Parking Owner</p>
                <p className="text-xs text-gray-500">owner@gopark.com</p>
              </div>
              <div className="relative">
                <Bell className="w-4 h-4 text-gray-400" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
  <nav className={`flex-1 overflow-y-auto ${isCollapsed ? 'flex flex-col items-center justify-center pt-6' : 'p-4'}`}>
          <div className={`${isCollapsed ? 'flex flex-col gap-2 items-center justify-center' : 'space-y-2'}`}>
            {sidebarItems.map(item => renderSidebarItem(item))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {!isCollapsed ? (
            <div className="space-y-2">
              <QuickSearch isCollapsed={false} />
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <QuickSearch isCollapsed={true} />
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
