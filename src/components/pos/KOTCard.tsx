import { Order, OrderStatus } from '@/types/pos';
import { Button } from '@/components/ui/button';
import { Clock, ChefHat, CheckCircle2, Timer } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface KOTCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

export const KOTCard = ({ order, onStatusChange }: KOTCardProps) => {
  const statusConfig = {
    new: {
      cardClass: 'kot-card-new',
      badge: 'status-new',
      icon: Clock,
      label: 'NEW',
      nextStatus: 'preparing' as OrderStatus,
      nextLabel: 'Start Preparing',
    },
    preparing: {
      cardClass: 'kot-card-preparing',
      badge: 'status-preparing',
      icon: ChefHat,
      label: 'PREPARING',
      nextStatus: 'ready' as OrderStatus,
      nextLabel: 'Mark Ready',
    },
    ready: {
      cardClass: 'kot-card-ready',
      badge: 'status-ready',
      icon: CheckCircle2,
      label: 'READY',
      nextStatus: 'served' as OrderStatus,
      nextLabel: 'Mark Served',
    },
    served: {
      cardClass: 'kot-card-ready',
      badge: 'status-ready',
      icon: CheckCircle2,
      label: 'SERVED',
      nextStatus: null,
      nextLabel: '',
    },
    cancelled: {
      cardClass: 'kot-card',
      badge: 'status-badge bg-muted text-muted-foreground',
      icon: Clock,
      label: 'CANCELLED',
      nextStatus: null,
      nextLabel: '',
    },
  };

  const config = statusConfig[order.status];
  const StatusIcon = config.icon;
  const timeAgo = formatDistanceToNow(order.createdAt, { addSuffix: true });

  return (
    <div className={cn(config.cardClass, 'animate-scale-in')}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {order.tableNumber ? (
              <span className="text-2xl font-bold">{order.tableNumber}</span>
            ) : (
              <span className="text-2xl font-bold">Token #{order.tokenNumber}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Timer className="h-4 w-4" />
            <span>{timeAgo}</span>
          </div>
        </div>

        <div className={config.badge}>
          <StatusIcon className="h-4 w-4 mr-1" />
          {config.label}
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-2 mb-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
            <span className="text-xl font-bold text-primary min-w-[32px]">
              {item.quantity}×
            </span>
            <div className="flex-1">
              <span className="kitchen-text">{item.name}</span>
              {item.notes && (
                <p className="text-sm text-muted-foreground mt-0.5">📝 {item.notes}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Order Notes */}
      {order.notes && (
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 mb-4">
          <p className="text-sm font-medium text-warning-foreground">
            📝 {order.notes}
          </p>
        </div>
      )}

      {/* Action Button */}
      {config.nextStatus && (
        <Button
          onClick={() => onStatusChange(order.id, config.nextStatus!)}
          className={cn(
            'w-full h-12 font-semibold text-base',
            order.status === 'new' && 'bg-warning hover:bg-warning/90 text-warning-foreground',
            order.status === 'preparing' && 'bg-success hover:bg-success/90'
          )}
        >
          {config.nextLabel}
        </Button>
      )}
    </div>
  );
};
