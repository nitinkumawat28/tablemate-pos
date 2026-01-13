import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { menuItems } from "@/data/mockData";
import { Plus, Minus, Trash2, CreditCard, Banknote } from "lucide-react";
import { formatINR } from "@/types/pos";
import { Switch } from "@/components/ui/switch";

interface ManualOrderModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (orderData: any) => void;
}

interface OrderItem {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
}

export function ManualOrderModal({ open, onOpenChange, onSubmit }: ManualOrderModalProps) {
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [orderType, setOrderType] = useState<'dine-in' | 'takeaway'>('takeaway');
    const [selectedItemId, setSelectedItemId] = useState<string>('');
    const [items, setItems] = useState<OrderItem[]>([]);

    const handleAddItem = () => {
        if (!selectedItemId) return;
        const menuItem = menuItems.find(item => item.id === selectedItemId);
        if (!menuItem) return;

        setItems(prev => {
            const existing = prev.find(i => i.menuItemId === selectedItemId);
            if (existing) {
                return prev.map(i => i.menuItemId === selectedItemId
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
                );
            }
            return [...prev, {
                menuItemId: menuItem.id,
                name: menuItem.name,
                price: menuItem.price,
                quantity: 1
            }];
        });
        setSelectedItemId('');
    };

    const updateQuantity = (menuItemId: string, delta: number) => {
        setItems(prev => prev.map(item => {
            if (item.menuItemId === menuItemId) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        }));
    };

    const removeItem = (menuItemId: string) => {
        setItems(prev => prev.filter(item => item.menuItemId !== menuItemId));
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleSubmit = () => {
        if (items.length === 0) return;

        const subtotal = calculateTotal();
        const tax = subtotal * 0.05; // 5% GST
        const total = subtotal + tax;

        onSubmit({
            customerName,
            customerPhone,
            orderType,
            items,
            subtotal,
            tax,
            total
        });

        // Reset form
        setCustomerName('');
        setCustomerPhone('');
        setItems([]);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create New Manual Order</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cust-name">Customer Name</Label>
                            <Input
                                id="cust-name"
                                value={customerName}
                                onChange={e => setCustomerName(e.target.value)}
                                placeholder="Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cust-phone">Phone Number</Label>
                            <Input
                                id="cust-phone"
                                value={customerPhone}
                                onChange={e => setCustomerPhone(e.target.value)}
                                placeholder="Phone"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Order Type</Label>
                        <Select value={orderType} onValueChange={(v: any) => setOrderType(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dine-in">Dine In</SelectItem>
                                <SelectItem value="takeaway">Takeaway</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Add Terms</Label>
                        <div className="flex gap-2">
                            <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Select Item..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {menuItems.map(item => (
                                        <SelectItem key={item.id} value={item.id}>
                                            {item.name} - {formatINR(item.price)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleAddItem} disabled={!selectedItemId}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="border rounded-md p-2 h-[200px] flex flex-col">
                        <div className="font-semibold text-sm mb-2 px-2">Order Items</div>
                        <ScrollArea className="flex-1">
                            {items.length === 0 ? (
                                <div className="text-center text-muted-foreground p-4 text-sm">
                                    No items added yet
                                </div>
                            ) : (
                                <div className="space-y-2 px-2">
                                    {items.map(item => (
                                        <div key={item.menuItemId} className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded">
                                            <div className="flex-1 font-medium">
                                                {item.name}
                                                <div className="text-xs text-muted-foreground">
                                                    {formatINR(item.price)} x {item.quantity}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.menuItemId, -1)}>
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-4 text-center">{item.quantity}</span>
                                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.menuItemId, 1)}>
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive ml-2" onClick={() => removeItem(item.menuItemId)}>
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>

                    <div className="flex justify-end gap-4 text-sm font-semibold border-t pt-2">
                        <div>Subtotal: {formatINR(calculateTotal())}</div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={items.length === 0}>Create Order</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
