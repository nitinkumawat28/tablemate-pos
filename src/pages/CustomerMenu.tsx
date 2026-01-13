import { useState, useMemo } from 'react';
import { categories, menuItems, restaurantInfo } from '@/data/mockData';
import { CartItem, MenuItem } from '@/types/pos';
import { MenuItemCard } from '@/components/pos/MenuItemCard';
import { CategoryTabs } from '@/components/pos/CategoryTabs';
import { CartDrawer } from '@/components/pos/CartDrawer';
import { Input } from '@/components/ui/input';
import { Search, Leaf, UtensilsCrossed } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CustomerMenu = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.categoryId === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nameHindi?.includes(searchQuery) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVeg = !vegOnly || item.isVeg;
      const isAvailable = item.isAvailable;

      return matchesCategory && matchesSearch && matchesVeg && isAvailable;
    });
  }, [activeCategory, searchQuery, vegOnly]);

  const getItemQuantity = (itemId: string) => {
    const cartItem = cart.find((item) => item.menuItem.id === itemId);
    return cartItem?.quantity || 0;
  };

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.menuItem.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.menuItem.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((ci) =>
          ci.menuItem.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci
        );
      }
      return prev.filter((ci) => ci.menuItem.id !== itemId);
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((ci) => ci.menuItem.id !== itemId));
    } else {
      setCart((prev) =>
        prev.map((ci) => (ci.menuItem.id === itemId ? { ...ci, quantity } : ci))
      );
    }
  };

  const handlePlaceOrder = (tableNumber: string, notes: string) => {
    toast({
      title: "Order Placed Successfully! 🎉",
      description: `Your order for ${tableNumber} has been sent to the kitchen.`,
    });
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-background pb-32 md:pb-24 pt-4 md:pt-20">
      {/* Header */}
      <header className="px-4 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
            <UtensilsCrossed className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{restaurantInfo.name}</h1>
            <p className="text-sm text-muted-foreground">Digital Menu</p>
          </div>
        </div>

        {/* Search and Veg Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes..."
              className="pl-10 h-12 bg-card"
            />
          </div>
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center gap-2 px-4 rounded-xl border-2 transition-all ${
              vegOnly
                ? 'border-green-600 bg-green-50 text-green-700'
                : 'border-border bg-card text-muted-foreground'
            }`}
          >
            <Leaf className="h-5 w-5" />
            <span className="font-medium hidden sm:inline">Veg</span>
          </button>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="px-4 mb-4">
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
      </div>

      {/* Menu Grid */}
      <div className="px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              quantity={getItemQuantity(item.id)}
              onAdd={() => addToCart(item)}
              onRemove={() => removeFromCart(item.id)}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items found</p>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={(id) => setCart((prev) => prev.filter((ci) => ci.menuItem.id !== id))}
        onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
};

export default CustomerMenu;
