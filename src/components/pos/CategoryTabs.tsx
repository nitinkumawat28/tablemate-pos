import { Category } from '@/types/pos';
import { cn } from '@/lib/utils';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onSelect: (categoryId: string) => void;
}

export const CategoryTabs = ({ categories, activeCategory, onSelect }: CategoryTabsProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-1">
      <button
        onClick={() => onSelect('all')}
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-200 font-medium touch-target',
          activeCategory === 'all'
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        )}
      >
        <span>🍽️</span>
        <span>All Items</span>
      </button>
      
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-200 font-medium touch-target',
            activeCategory === category.id
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          )}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
};
