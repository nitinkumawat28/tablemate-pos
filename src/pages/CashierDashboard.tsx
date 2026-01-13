import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Truck, ShoppingBag, LogOut, RefreshCw, 
  Clock, User, Receipt, Printer, Grid3X3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatINR } from '@/types/pos';
import { useToast } from '@/hooks/use-toast';

interface Table {
  id: string;
  number: string;
  section: string;
  status: 'blank' | 'running' | 'printed' | 'paid' | 'running-kot';
  amount?: number;
  time?: number; // minutes
  guests?: number;
}

const tableSections = [
  {
    name: 'Dine In',
    tables: [
      { id: 'd1', number: 'D1', section: 'Dine In', status: 'blank' as const },
      { id: 'd2', number: 'D2', section: 'Dine In', status: 'blank' as const },
      { id: 'd3', number: 'D3', section: 'Dine In', status: 'blank' as const },
      { id: 'd4', number: 'D4', section: 'Dine In', status: 'running' as const, amount: 850, time: 25 },
      { id: 'd5', number: 'D5', section: 'Dine In', status: 'blank' as const },
      { id: 'd6', number: 'D6', section: 'Dine In', status: 'blank' as const },
      { id: 'd7', number: 'D7', section: 'Dine In', status: 'running-kot' as const, amount: 270, time: 0 },
      { id: 'd8', number: 'D8', section: 'Dine In', status: 'blank' as const },
      { id: 'd9', number: 'D9', section: 'Dine In', status: 'printed' as const, amount: 1250, time: 45 },
      { id: 'd10', number: 'D10', section: 'Dine In', status: 'blank' as const },
      { id: 'd11', number: 'D11', section: 'Dine In', status: 'blank' as const },
      { id: 'd12', number: 'D12', section: 'Dine In', status: 'paid' as const, amount: 680 },
      { id: 'd13', number: 'D13', section: 'Dine In', status: 'blank' as const },
      { id: 'd14', number: 'D14', section: 'Dine In', status: 'blank' as const },
      { id: 'd15', number: 'D15', section: 'Dine In', status: 'blank' as const },
    ],
  },
  {
    name: 'Roof Top',
    tables: [
      { id: 'r1', number: 'R1', section: 'Roof Top', status: 'blank' as const },
      { id: 'r2', number: 'R2', section: 'Roof Top', status: 'running' as const, amount: 1500, time: 35 },
      { id: 'r3', number: 'R3', section: 'Roof Top', status: 'blank' as const },
      { id: 'r4', number: 'R4', section: 'Roof Top', status: 'blank' as const },
    ],
  },
  {
    name: 'AC Section',
    tables: [
      { id: 'a1', number: 'A1', section: 'AC Section', status: 'running' as const, amount: 2200, time: 15 },
      { id: 'a2', number: 'A2', section: 'AC Section', status: 'blank' as const },
      { id: 'a3', number: 'A3', section: 'AC Section', status: 'blank' as const },
      { id: 'a4', number: 'A4', section: 'AC Section', status: 'printed' as const, amount: 950, time: 30 },
      { id: 'a5', number: 'A5', section: 'AC Section', status: 'blank' as const },
      { id: 'a6', number: 'A6', section: 'AC Section', status: 'blank' as const },
    ],
  },
];

const statusConfig = {
  'blank': { label: 'Blank Table', color: 'bg-gray-100 border-gray-300', textColor: 'text-gray-600' },
  'running': { label: 'Running Table', color: 'bg-green-50 border-green-400', textColor: 'text-green-700' },
  'printed': { label: 'Printed', color: 'bg-blue-50 border-blue-400', textColor: 'text-blue-700' },
  'paid': { label: 'Paid Table', color: 'bg-purple-50 border-purple-400', textColor: 'text-purple-700' },
  'running-kot': { label: 'Running KOT', color: 'bg-yellow-100 border-yellow-500', textColor: 'text-yellow-800' },
};

const CashierDashboard = () => {
  const [searchBill, setSearchBill] = useState('');
  const [searchKOT, setSearchKOT] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('cashierLoggedIn');
    if (!isLoggedIn) {
      navigate('/cashier-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('cashierLoggedIn');
    localStorage.removeItem('cashierEmail');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    navigate('/cashier-login');
  };

  const handleTableClick = (table: Table) => {
    if (table.status === 'blank') {
      toast({
        title: `New Order - ${table.number}`,
        description: "Starting new order for this table",
      });
      navigate('/pos', { state: { tableNumber: table.number } });
    } else {
      toast({
        title: `Table ${table.number}`,
        description: `Status: ${statusConfig[table.status].label}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-muted rounded-lg">
              <Grid3X3 className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-lg">SpiceOS</span>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90 ml-4">
              <Plus className="h-4 w-4 mr-1" />
              New Order
            </Button>
            <div className="relative ml-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Bill No."
                value={searchBill}
                onChange={(e) => setSearchBill(e.target.value)}
                className="pl-9 w-28 h-9"
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="KOT No."
                value={searchKOT}
                onChange={(e) => setSearchKOT(e.target.value)}
                className="pl-9 w-28 h-9"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1">
              <Receipt className="h-4 w-4" />
              <span className="hidden lg:inline">Orders</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1">
              <Clock className="h-4 w-4" />
              <span className="hidden lg:inline">History</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1">
              <Printer className="h-4 w-4" />
              <span className="hidden lg:inline">Reports</span>
            </Button>
            <div className="h-6 w-px bg-border mx-2" />
            <Button variant="outline" size="sm" className="text-primary border-primary">
              <Truck className="h-4 w-4 mr-1" />
              Delivery
            </Button>
            <Button variant="outline" size="sm" className="text-primary border-primary">
              <ShoppingBag className="h-4 w-4 mr-1" />
              Pick Up
            </Button>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Table
            </Button>
            <div className="h-6 w-px bg-border mx-2" />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Sub Header */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Table View</h1>
            <Button variant="outline" size="sm" className="gap-1 text-primary border-primary">
              <Plus className="h-4 w-4" />
              Contactless
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Move KOT / Items
            </Button>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-gray-200 border border-gray-400"></span>
                <span className="text-muted-foreground">Blank Table</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-green-200 border border-green-500"></span>
                <span className="text-muted-foreground">Running Table</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-blue-200 border border-blue-500"></span>
                <span className="text-muted-foreground">Printed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-purple-200 border border-purple-500"></span>
                <span className="text-muted-foreground">Paid Table</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-yellow-200 border border-yellow-500"></span>
                <span className="text-muted-foreground">Running KOT</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Table Sections */}
      <main className="p-4 space-y-6 pb-24">
        {tableSections.map((section) => (
          <div key={section.name}>
            <h2 className="text-sm font-medium text-muted-foreground mb-3">{section.name}</h2>
            <div className="flex flex-wrap gap-3">
              {section.tables.map((table) => {
                const config = statusConfig[table.status];
                return (
                  <button
                    key={table.id}
                    onClick={() => handleTableClick(table)}
                    className={cn(
                      'w-20 h-20 rounded-lg border-2 flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-md',
                      config.color
                    )}
                  >
                    {table.status !== 'blank' && table.time !== undefined && (
                      <span className="text-[10px] text-muted-foreground">{table.time} Min</span>
                    )}
                    <span className={cn('font-semibold text-sm', config.textColor)}>
                      {table.number}
                    </span>
                    {table.amount && (
                      <span className={cn('text-xs font-medium', config.textColor)}>
                        ₹{table.amount.toLocaleString('en-IN')}
                      </span>
                    )}
                    {table.status === 'running-kot' && (
                      <div className="flex gap-1 mt-1">
                        <span className="w-4 h-4 rounded bg-white border flex items-center justify-center">
                          <Printer className="h-2.5 w-2.5" />
                        </span>
                        <span className="w-4 h-4 rounded bg-white border flex items-center justify-center">
                          <Clock className="h-2.5 w-2.5" />
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default CashierDashboard;
