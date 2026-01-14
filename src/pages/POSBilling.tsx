import { useState, useMemo } from 'react';
import { categories, menuItems, restaurantInfo } from '@/data/mockData';
import { OrderItem, PaymentMode, formatINR, calculateGST, generateInvoiceNumber } from '@/types/pos';
import { CategoryTabs } from '@/components/pos/CategoryTabs';
import { POSBillItem } from '@/components/pos/POSBillItem';
import { PaymentModal } from '@/components/pos/PaymentModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Percent, Trash2, Printer, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const POSBilling = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage');
  const [tableNumber, setTableNumber] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { toast } = useToast();

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.categoryId === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch && item.isAvailable;
    });
  }, [activeCategory, searchQuery]);

  const addToBill = (menuItem: typeof menuItems[0]) => {
    setOrderItems((prev) => {
      const existing = prev.find((item) => item.menuItemId === menuItem.id);
      if (existing) {
        return prev.map((item) =>
          item.menuItemId === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: `order-item-${Date.now()}`,
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
          gstRate: menuItem.gstRate,
        },
      ];
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      setOrderItems((prev) => prev.filter((item) => item.id !== itemId));
    } else {
      setOrderItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      );
    }
  };

  const removeItem = (itemId: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearBill = () => {
    setOrderItems([]);
    setDiscount(0);
    setTableNumber('');
  };

  // Calculate totals
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discountAmount = discountType === 'percentage'
    ? (subtotal * discount) / 100
    : discount;

  const afterDiscount = subtotal - discountAmount;

  // Calculate GST per item and sum
  const gstBreakdown = orderItems.reduce((acc, item) => {
    const itemTotal = item.price * item.quantity;
    const { cgst, sgst } = calculateGST(itemTotal, item.gstRate);
    acc.cgst += cgst;
    acc.sgst += sgst;
    return acc;
  }, { cgst: 0, sgst: 0 });

  // Apply discount proportionally to GST
  const discountRatio = subtotal > 0 ? afterDiscount / subtotal : 1;
  const adjustedCgst = gstBreakdown.cgst * discountRatio;
  const adjustedSgst = gstBreakdown.sgst * discountRatio;

  const grandTotal = afterDiscount + adjustedCgst + adjustedSgst;

  const handlePaymentComplete = (paymentMode: PaymentMode) => {
    const invoiceNumber = generateInvoiceNumber();
    toast({
      title: "Payment Successful! 🎉",
      description: `Invoice ${invoiceNumber} generated. Mode: ${paymentMode.toUpperCase()}`,
    });
    clearBill();
    setShowPaymentModal(false);
  };

  return (
    <div className="min-h-screen bg-pos-bg pb-4 pt-16 md:pt-20 h-[100dvh] overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-4 p-4 h-full">
        {/* Menu Section */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items... (Keyboard: F2)"
              className="pl-10 h-12 bg-card text-lg"
            />
          </div>

          {/* Categories */}
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />

          {/* Menu Grid */}
          <div className="flex-1 overflow-y-auto mt-4 scrollbar-hide">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              {filteredMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => addToBill(item)}
                  className="p-3 bg-card rounded-xl border border-border hover:border-primary hover:shadow-md transition-all text-left touch-target active:scale-95"
                >
                  {/* Veg indicator */}
                  <div className={`w-4 h-4 border-2 mb-2 flex items-center justify-center rounded-sm ${item.isVeg ? 'border-green-600' : 'border-red-600'
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                  </div>
                  <p className="font-medium text-sm line-clamp-2 mb-1">{item.name}</p>
                  <p className="text-primary font-semibold price-display">{formatINR(item.price)}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bill Section */}
        <div className="w-full lg:w-[400px] xl:w-[450px] flex flex-col bg-card rounded-2xl border border-border overflow-hidden h-full">
          {/* Bill Header */}
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Current Bill
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearBill}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                disabled={orderItems.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>

            {/* Table Number */}
            <Input
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Table Number (e.g., T-05)"
              className="h-10"
            />
          </div>

          {/* Bill Items */}
          <div className="flex-1 overflow-y-auto p-3 min-h-0">
            {orderItems.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <Calculator className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No items added</p>
                <p className="text-sm">Tap items to add to bill</p>
              </div>
            ) : (
              orderItems.map((item) => (
                <POSBillItem
                  key={item.id}
                  item={item}
                  onQuantityChange={(qty) => updateQuantity(item.id, qty)}
                  onRemove={() => removeItem(item.id)}
                />
              ))
            )}
          </div>

          {/* Bill Summary */}
          <div className="p-3 border-t border-border bg-muted/30 space-y-2">
            {/* Discount Input */}
            <div className="flex items-center gap-2 mb-2">
              <Percent className="h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                value={discount || ''}
                onChange={(e) => setDiscount(Number(e.target.value))}
                placeholder="Discount"
                className="h-9 w-24"
              />
              <div className="flex rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => setDiscountType('percentage')}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${discountType === 'percentage' ? 'bg-primary text-primary-foreground' : 'bg-card'
                    }`}
                >
                  %
                </button>
                <button
                  onClick={() => setDiscountType('amount')}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${discountType === 'amount' ? 'bg-primary text-primary-foreground' : 'bg-card'
                    }`}
                >
                  ₹
                </button>
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="price-display">{formatINR(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount</span>
                  <span className="price-display">-{formatINR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">CGST</span>
                <span className="price-display">{formatINR(adjustedCgst)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">SGST</span>
                <span className="price-display">{formatINR(adjustedSgst)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="text-lg font-bold">Grand Total</span>
              <span className="text-2xl font-bold price-display text-primary">
                {formatINR(grandTotal)}
              </span>
            </div>

            {/* Payment Button */}
            <Button
              onClick={() => setShowPaymentModal(true)}
              className="w-full h-12 text-lg font-bold bg-success hover:bg-success/90 mt-2 shadow-sm"
              disabled={orderItems.length === 0}
            >
              <Printer className="h-5 w-5 mr-2" />
              Pay & Print Bill
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        grandTotal={grandTotal}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
};

export default POSBilling;
