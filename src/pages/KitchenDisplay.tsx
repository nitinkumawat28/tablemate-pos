import { useState, useEffect } from 'react';
import { sampleOrders } from '@/data/mockData';
import { Order, OrderStatus } from '@/types/pos';
import { KOTCard } from '@/components/pos/KOTCard';
import { Button } from '@/components/ui/button';
import { ChefHat, Clock, CheckCircle2, Bell, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusFilters: { status: OrderStatus | 'all'; label: string; icon: typeof Clock }[] = [
  { status: 'all', label: 'All Orders', icon: ChefHat },
  { status: 'new', label: 'New', icon: Bell },
  { status: 'preparing', label: 'Preparing', icon: Clock },
  { status: 'ready', label: 'Ready', icon: CheckCircle2 },
];

const KitchenDisplay = () => {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus, updatedAt: new Date() }
          : order
      )
    );
  };

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === 'all') {
      return order.status !== 'served' && order.status !== 'cancelled';
    }
    return order.status === activeFilter;
  });

  const orderCounts = {
    all: orders.filter((o) => o.status !== 'served' && o.status !== 'cancelled').length,
    new: orders.filter((o) => o.status === 'new').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    ready: orders.filter((o) => o.status === 'ready').length,
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-4 pt-4 md:pt-20">
      {/* Header */}
      <header className="px-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
              <ChefHat className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Kitchen Display</h1>
              <p className="text-sm text-muted-foreground">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
          </div>

          <Button variant="outline" size="icon" onClick={() => setLastRefresh(new Date())}>
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {statusFilters.map(({ status, label, icon: Icon }) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all font-medium touch-target',
                activeFilter === status
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
              <span className={cn(
                'ml-1 px-2 py-0.5 rounded-full text-xs font-bold',
                activeFilter === status
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}>
                {orderCounts[status]}
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* Orders Grid */}
      <div className="px-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <ChefHat className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-xl font-medium text-muted-foreground">No orders</p>
            <p className="text-sm text-muted-foreground mt-1">
              {activeFilter === 'all' ? 'All caught up!' : `No ${activeFilter} orders`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredOrders.map((order) => (
              <KOTCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* New Order Alert (simulated) */}
      {orderCounts.new > 0 && (
        <div className="fixed top-4 right-4 md:top-24 bg-kot-new text-white px-4 py-2 rounded-full shadow-lg animate-pulse-soft z-40">
          <Bell className="h-4 w-4 inline mr-2" />
          {orderCounts.new} new order{orderCounts.new > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default KitchenDisplay;
