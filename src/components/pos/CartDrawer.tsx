import { CartItem, formatINR, calculateGST } from '@/types/pos';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Plus, Minus, Trash2, Send, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface CartDrawerProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  onPlaceOrder: (tableNumber: string, notes: string) => void;
}

export const CartDrawer = ({ items, onUpdateQuantity, onRemove, onPlaceOrder }: CartDrawerProps) => {
  const [tableNumber, setTableNumber] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  
  // Calculate GST based on individual item rates
  const gstBreakdown = items.reduce((acc, item) => {
    const itemTotal = item.menuItem.price * item.quantity;
    const { cgst, sgst } = calculateGST(itemTotal, item.menuItem.gstRate);
    acc.cgst += cgst;
    acc.sgst += sgst;
    return acc;
  }, { cgst: 0, sgst: 0 });

  const grandTotal = subtotal + gstBreakdown.cgst + gstBreakdown.sgst;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = () => {
    if (!tableNumber.trim()) {
      return;
    }
    onPlaceOrder(tableNumber, orderNotes);
    setTableNumber('');
    setOrderNotes('');
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-4 right-4 left-4 h-14 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg rounded-2xl z-50 md:left-auto md:w-auto md:px-8"
          disabled={items.length === 0}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          <span className="font-semibold">View Cart</span>
          {totalItems > 0 && (
            <>
              <span className="mx-2">•</span>
              <span className="font-semibold">{totalItems} items</span>
              <span className="mx-2">•</span>
              <span className="price-display">{formatINR(grandTotal)}</span>
            </>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        <SheetHeader className="pb-4 border-b">
          <SheetTitle className="text-xl">Your Order</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {items.map((item) => (
              <div key={item.menuItem.id} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                {/* Veg/Non-veg indicator */}
                <div className={`w-4 h-4 border-2 flex items-center justify-center rounded-sm shrink-0 ${
                  item.menuItem.isVeg ? 'border-green-600' : 'border-red-600'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${item.menuItem.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{item.menuItem.name}</h4>
                  <p className="text-sm text-muted-foreground price-display">
                    {formatINR(item.menuItem.price)}
                  </p>
                  {item.notes && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {item.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity - 1)}
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 rounded-lg"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-semibold min-w-[24px] text-center">{item.quantity}</span>
                  <Button
                    onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity + 1)}
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 rounded-lg"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  onClick={() => onRemove(item.menuItem.id)}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Order Details */}
          <div className="border-t pt-4 space-y-4 pb-safe-bottom">
            {/* Table Number Input */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Table Number / Token</label>
              <Input
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="e.g., T-05 or Token 42"
                className="h-12 text-lg"
              />
            </div>

            {/* Order Notes */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Special Instructions (Optional)</label>
              <Input
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g., Less spicy, no onion"
                className="h-12"
              />
            </div>

            {/* Bill Summary */}
            <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="price-display">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">CGST</span>
                <span className="price-display">{formatINR(gstBreakdown.cgst)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">SGST</span>
                <span className="price-display">{formatINR(gstBreakdown.sgst)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                <span>Grand Total</span>
                <span className="price-display text-primary">{formatINR(grandTotal)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <Button
              onClick={handlePlaceOrder}
              className="w-full h-14 text-lg font-semibold bg-success hover:bg-success/90"
              disabled={!tableNumber.trim() || items.length === 0}
            >
              <Send className="h-5 w-5 mr-2" />
              Place Order
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
