import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order, Table } from '@/types/pos';
import { TableView } from '@/components/pos/TableView';
import { ManualOrderModal } from '@/components/pos/ManualOrderModal';
import { AddTableModal } from '@/components/pos/AddTableModal';
import {
  Plus, Search, Truck, ShoppingBag, LogOut, RefreshCw,
  Clock, User, Receipt, Printer, Grid3X3, Calendar as CalendarIcon,
  Download
} from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn, exportToCSV } from '@/lib/utils';
import { formatINR } from '@/types/pos';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { usePOSData } from '@/hooks/use-pos-data';
import { db } from '@/db/db';

// Static Table Layout Configuration
const tableSections = [
  {
    name: 'Dine In',
    tables: [
      { id: 'd1', number: 'D1', section: 'Dine In', status: 'blank' as const },
      { id: 'd2', number: 'D2', section: 'Dine In', status: 'blank' as const },
      { id: 'd3', number: 'D3', section: 'Dine In', status: 'blank' as const },
      { id: 'd4', number: 'D4', section: 'Dine In', status: 'blank' as const },
      { id: 'd5', number: 'D5', section: 'Dine In', status: 'blank' as const },
      { id: 'd6', number: 'D6', section: 'Dine In', status: 'blank' as const },
      { id: 'd7', number: 'D7', section: 'Dine In', status: 'blank' as const },
      { id: 'd8', number: 'D8', section: 'Dine In', status: 'blank' as const },
      { id: 'd9', number: 'D9', section: 'Dine In', status: 'blank' as const },
      { id: 'd10', number: 'D10', section: 'Dine In', status: 'blank' as const },
      { id: 'd11', number: 'D11', section: 'Dine In', status: 'blank' as const },
      { id: 'd12', number: 'D12', section: 'Dine In', status: 'blank' as const },
      { id: 'd13', number: 'D13', section: 'Dine In', status: 'blank' as const },
      { id: 'd14', number: 'D14', section: 'Dine In', status: 'blank' as const },
      { id: 'd15', number: 'D15', section: 'Dine In', status: 'blank' as const },
    ],
  },
  {
    name: 'Roof Top',
    tables: [
      { id: 'r1', number: 'R1', section: 'Roof Top', status: 'blank' as const },
      { id: 'r2', number: 'R2', section: 'Roof Top', status: 'blank' as const },
      { id: 'r3', number: 'R3', section: 'Roof Top', status: 'blank' as const },
      { id: 'r4', number: 'R4', section: 'Roof Top', status: 'blank' as const },
    ],
  },
  {
    name: 'AC Section',
    tables: [
      { id: 'a1', number: 'A1', section: 'AC Section', status: 'blank' as const },
      { id: 'a2', number: 'A2', section: 'AC Section', status: 'blank' as const },
      { id: 'a3', number: 'A3', section: 'AC Section', status: 'blank' as const },
      { id: 'a4', number: 'A4', section: 'AC Section', status: 'blank' as const },
      { id: 'a5', number: 'A5', section: 'AC Section', status: 'blank' as const },
      { id: 'a6', number: 'A6', section: 'AC Section', status: 'blank' as const },
    ],
  },
];

const CashierDashboard = () => {
  const { orders } = usePOSData();
  const [activeTab, setActiveTab] = useState<'tables' | 'history'>('tables');
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
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

  const statusConfig = {
    'blank': { label: 'Blank Table' },
    'running': { label: 'Running Table' },
    'printed': { label: 'Printed' },
    'paid': { label: 'Paid Table' },
    'running-kot': { label: 'Running KOT' },
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

  // Derive Table Status from Orders
  const getTableStatus = (tableNumber: string): Table['status'] => {
    const activeOrder = orders?.find(o =>
      o.tableNumber === tableNumber && o.paymentStatus !== 'paid'
    );
    if (!activeOrder) return 'blank';
    if (activeOrder.status === 'served') return 'printed';
    return 'running';
  };

  const getTableAmount = (tableNumber: string) => {
    const activeOrder = orders?.find(o =>
      o.tableNumber === tableNumber && o.paymentStatus !== 'paid'
    );
    return activeOrder?.grandTotal;
  };

  const getTableTime = (tableNumber: string) => {
    const activeOrder = orders?.find(o =>
      o.tableNumber === tableNumber && o.paymentStatus !== 'paid'
    );
    if (!activeOrder) return undefined;
    const diff = Date.now() - new Date(activeOrder.createdAt).getTime();
    return Math.floor(diff / 60000);
  };

  const dynamicTableSections = tableSections.map(section => ({
    ...section,
    tables: section.tables.map(table => ({
      ...table,
      status: getTableStatus(table.number),
      amount: getTableAmount(table.number),
      time: getTableTime(table.number)
    }))
  }));

  const filteredHistory = orders?.filter((order) => {
    if (!date?.from) return true;
    const orderDate = new Date(order.createdAt);
    const start = new Date(date.from);
    start.setHours(0, 0, 0, 0);

    if (!date.to) {
      return orderDate >= start;
    }

    const end = new Date(date.to);
    end.setHours(23, 59, 59, 999);
    return orderDate >= start && orderDate <= end;
  }) || [];



  const handleExport = () => {
    const dataToExport = filteredHistory.map(order => ({
      "Order No": order.orderNumber,
      "Date": new Date(order.createdAt).toLocaleDateString(),
      "Time": new Date(order.createdAt).toLocaleTimeString(),
      "Table": order.tableNumber || 'N/A',
      "Items": order.items.map(i => `${i.quantity}x ${i.name}`).join('; '),
      "Total": order.grandTotal,
      "Payment": order.paymentMode || 'Pending',
      "Status": order.status
    }));
    exportToCSV(dataToExport, `order_history_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleCreateOrder = async (orderData: any) => {
    try {
      const newOrder: Order = {
        id: crypto.randomUUID(),
        orderNumber: `ORD${Math.floor(Math.random() * 1000)}`,
        status: 'new',
        tableNumber: orderData.orderType === 'dine-in' ? 'T-99' : undefined,
        tokenNumber: orderData.orderType === 'takeaway' ? Math.floor(Math.random() * 100) : undefined,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        orderType: orderData.orderType,
        items: orderData.items,
        subtotal: orderData.subtotal,
        cgst: orderData.tax / 2,
        sgst: orderData.tax / 2,
        discount: 0,
        discountType: 'amount',
        grandTotal: orderData.total,
        paymentStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.orders.add(newOrder);
      toast({
        title: "Order Created",
        description: `Order ${newOrder.orderNumber} created successfully`,
      });
      setIsNewOrderOpen(false);
    } catch (error) {
      console.error("Failed to create order:", error);
      toast({
        title: "Error",
        description: "Failed to create order.",
        variant: "destructive"
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
            <button
              className={cn("p-2 rounded-lg hover:bg-muted", activeTab === 'tables' && "bg-muted")}
              onClick={() => setActiveTab('tables')}
            >
              <Grid3X3 className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-lg">SpiceOS</span>
            </div>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 ml-4"
              onClick={() => setIsNewOrderOpen(true)}
            >
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
            <Button
              variant={activeTab === 'history' ? "secondary" : "ghost"}
              size="sm"
              className="gap-1"
              onClick={() => setActiveTab('history')}
            >
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
            <Button variant="outline" size="sm" onClick={() => setIsAddTableOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Table
            </Button>
            <div className="h-6 w-px bg-border mx-2" />
            <div className="h-6 w-px bg-border mx-2" />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be redirected to the login screen.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>Sign Out</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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

      {/* Main Content */}
      <main className="p-4 space-y-6 pb-24">
        {activeTab === 'tables' ? (
          /* Tables View */
          dynamicTableSections.map((section) => (
            <div key={section.name}>
              <h2 className="text-sm font-medium text-muted-foreground mb-3">{section.name}</h2>
              <TableView tables={section.tables} onTableClick={handleTableClick} />
            </div>
          ))
        ) : (
          /* History View */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Order History</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleExport} disabled={filteredHistory.length === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-[300px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Filter</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="rounded-md border bg-card">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Order No</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Customer</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Payment</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Tax</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Discount</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Grand Total</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created At</th>

                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {filteredHistory.map((order) => (
                      <tr key={order.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle font-medium">{order.orderNumber}</td>
                        <td className="p-4 align-middle">
                          <Badge variant="outline" className="capitalize">
                            {order.orderType || (order.tableNumber ? 'dine-in' : 'takeaway')}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-col">
                            <span className="font-medium">{order.customerName || 'N/A'}</span>
                            <span className="text-xs text-muted-foreground">{order.customerPhone || ''}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle capitalize">{order.paymentMode || 'Pending'}</td>
                        <td className="p-4 align-middle text-right">{formatINR(order.cgst + order.sgst)}</td>
                        <td className="p-4 align-middle text-right">{formatINR(order.discount)}</td>
                        <td className="p-4 align-middle text-right font-bold">{formatINR(order.grandTotal)}</td>
                        <td className="p-4 align-middle text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString()}
                        </td>

                      </tr>
                    ))}
                    {filteredHistory.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-muted-foreground">
                          No history records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <ManualOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        onCreateOrder={handleCreateOrder}
      />
      <AddTableModal
        isOpen={isAddTableOpen}
        onClose={() => setIsAddTableOpen(false)}
        onAddTable={() => { }} // Placeholder for now
      />
    </div>
  );
};

export default CashierDashboard;
