import { Link, useLocation } from 'react-router-dom';
import { UtensilsCrossed, Calculator, ChefHat, LayoutDashboard, QrCode, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Menu', icon: QrCode },
  { path: '/pos', label: 'POS', icon: Calculator },
  { path: '/cashier-login', label: 'Cashier', icon: UserCircle },
  { path: '/kitchen', label: 'Kitchen', icon: ChefHat },
  { path: '/admin', label: 'Admin', icon: LayoutDashboard },
];

export const AppNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 pb-safe-bottom md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="flex items-center justify-around md:justify-start md:gap-1 md:px-4 h-16">
        {/* Logo - Desktop only */}
        <Link to="/" className="hidden md:flex items-center gap-2 mr-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">SpiceOS</span>
        </Link>

        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 md:px-4 md:py-2 rounded-xl transition-all touch-target',
                isActive
                  ? 'text-primary md:bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground md:hover:bg-muted'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'text-primary')} />
              <span className={cn('text-xs md:text-sm font-medium', isActive && 'text-primary')}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
