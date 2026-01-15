import Dexie, { Table } from 'dexie';
import { Category, MenuItem, Order } from '@/types/pos';
import { categories, menuItems, sampleOrders } from '@/data/mockData';

export class ARMenuDB extends Dexie {
    items!: Table<MenuItem>;
    categories!: Table<Category>;
    orders!: Table<Order>;
    settings!: Table<any>;

    constructor() {
        super('ARMenuDB');
        this.version(1).stores({
            items: 'id, name, categoryId, isAvailable, *tags',
            categories: 'id, name, sortOrder',
            orders: 'id, orderNumber, status, paymentStatus, createdAt',
            settings: 'key'
        });
    }
}

export const db = new ARMenuDB();

db.on('populate', () => {
    db.categories.bulkAdd(categories);
    db.items.bulkAdd(menuItems);
    db.orders.bulkAdd(sampleOrders);
});
