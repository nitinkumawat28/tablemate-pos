import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { Order } from '@/types/pos';

export const usePOSData = () => {
    const items = useLiveQuery(() => db.items.toArray(), [], []);
    const categories = useLiveQuery(() => db.categories.orderBy('sortOrder').toArray(), [], []);
    const orders = useLiveQuery(() => db.orders.orderBy('createdAt').reverse().toArray(), [], []);

    // Calculate Today's Sales
    const todaySales = useLiveQuery(async () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaysOrders = await db.orders
            .where('createdAt')
            .aboveOrEqual(today)
            .toArray();

        return todaysOrders.reduce((acc, order) => {
            acc.totalOrders++;
            acc.totalRevenue += order.grandTotal;

            if (order.paymentMode === 'cash') acc.cashAmount += order.grandTotal;
            if (order.paymentMode === 'upi') acc.upiAmount += order.grandTotal;
            if (order.paymentMode === 'card') acc.cardAmount += order.grandTotal;

            acc.cgstCollected += order.cgst || 0;
            acc.sgstCollected += order.sgst || 0;

            return acc;
        }, {
            totalOrders: 0,
            totalRevenue: 0,
            cashAmount: 0,
            upiAmount: 0,
            cardAmount: 0,
            cgstCollected: 0,
            sgstCollected: 0,
        });
    }, [], {
        totalOrders: 0,
        totalRevenue: 0,
        cashAmount: 0,
        upiAmount: 0,
        cardAmount: 0,
        cgstCollected: 0,
        sgstCollected: 0,
    });

    // Calculate Top Items
    const topItems = useLiveQuery(async () => {
        const allOrders = await db.orders.toArray();
        const itemMap = new Map<string, { name: string; quantity: number; revenue: number }>();

        allOrders.forEach(order => {
            order.items.forEach(item => {
                const existing = itemMap.get(item.name) || { name: item.name, quantity: 0, revenue: 0 };
                existing.quantity += item.quantity;
                existing.revenue += item.price * item.quantity;
                itemMap.set(item.name, existing);
            });
        });

        return Array.from(itemMap.values())
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);
    }, [], []);

    // Calculate Peak Hours
    const peakHours = useLiveQuery(async () => {
        const allOrders = await db.orders.toArray();
        const hoursMap = new Array(24).fill(0);

        allOrders.forEach(order => {
            const hour = new Date(order.createdAt).getHours();
            hoursMap[hour]++;
        });

        return hoursMap.map((count, hour) => ({
            hour: `${hour}:00`,
            orders: count
        }));
    }, [], []);

    return {
        items,
        categories,
        orders,
        todaySales,
        topItems,
        peakHours,
        isLoading: !items || !categories || !orders
    };
};
