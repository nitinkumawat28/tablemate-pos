import { MenuItem, formatINR } from '@/types/pos';
import { Plus, Minus, Leaf, Drumstick, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MenuItemCardProps {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

export const MenuItemCard = ({ item, quantity, onAdd, onRemove }: MenuItemCardProps) => {
  const isBestseller = item.tags?.includes('bestseller');
  const isSpicy = item.tags?.includes('spicy');

  return (
    <div className="menu-card animate-fade-in">
      {/* Image placeholder with gradient */}
      <div className="relative h-32 bg-gradient-to-br from-accent/50 to-accent overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-50">
            {item.isVeg ? '🥗' : '🍖'}
          </div>
        )}

        {/* Veg/Non-veg indicator */}
        <div className={`absolute top-2 left-2 w-5 h-5 border-2 flex items-center justify-center rounded-sm ${item.isVeg ? 'border-green-600 bg-white' : 'border-red-600 bg-white'
          }`}>
          <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
        </div>

        {/* Bestseller badge */}
        {isBestseller && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
            ★ Bestseller
          </div>
        )}

        {/* 3D View Button */}
        <Button
          size="sm"
          variant="secondary"
          className="absolute bottom-2 right-2 h-7 px-2 text-xs font-medium bg-background/80 hover:bg-background/90 backdrop-blur-sm shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Open 3D view
          }}
        >
          <Box className="w-3.5 h-3.5 mr-1" />
          3D View
        </Button>
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
            {item.nameHindi && (
              <p className="text-xs text-muted-foreground">{item.nameHindi}</p>
            )}
          </div>
          {isSpicy && <span className="text-sm">🌶️</span>}
        </div>

        {item.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="price-display text-lg text-foreground">
            {formatINR(item.price)}
          </span>

          {quantity === 0 ? (
            <Button
              onClick={onAdd}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4"
            >
              ADD
            </Button>
          ) : (
            <div className="flex items-center gap-2 bg-primary rounded-lg">
              <Button
                onClick={onRemove}
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-semibold text-primary-foreground min-w-[20px] text-center">
                {quantity}
              </span>
              <Button
                onClick={onAdd}
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
