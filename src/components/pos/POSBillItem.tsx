import { OrderItem, formatINR } from '@/types/pos';
import { Button } from '@/components/ui/button';
import { Plus, Minus, X } from 'lucide-react';

interface POSBillItemProps {
  item: OrderItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export const POSBillItem = ({ item, onQuantityChange, onRemove }: POSBillItemProps) => {
  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex items-center gap-2 py-2 border-b border-border/50 animate-fade-in">
      <Button
        onClick={onRemove}
        size="icon"
        variant="ghost"
        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{item.name}</p>
        <p className="text-sm text-muted-foreground price-display">{formatINR(item.price)}</p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Button
          onClick={() => onQuantityChange(item.quantity - 1)}
          size="icon"
          variant="outline"
          className="h-9 w-9"
          disabled={item.quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="font-semibold min-w-[32px] text-center text-lg">{item.quantity}</span>
        <Button
          onClick={() => onQuantityChange(item.quantity + 1)}
          size="icon"
          variant="outline"
          className="h-9 w-9"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-right min-w-[80px] shrink-0">
        <p className="font-semibold price-display">{formatINR(itemTotal)}</p>
      </div>
    </div>
  );
};
