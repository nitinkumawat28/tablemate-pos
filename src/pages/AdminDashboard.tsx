import { useState } from 'react';
import { categories, menuItems, restaurantInfo, sampleOrders } from '@/data/mockData';
import { formatINR } from '@/types/pos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import {
  LayoutDashboard,
  UtensilsCrossed,
  TrendingUp,
  IndianRupee,
  Users,
  Package,
  Search,
  Plus,
  Edit2,
  ToggleLeft,
  ToggleRight,
  FileText,
  PieChart,
  Camera,
  Box,
  Clock,
  Trash2,
  Calendar as CalendarIcon
} from 'lucide-react';

import { cn } from '@/lib/utils';

// Mock sales data
const todaySales = {
  totalOrders: 47,
  totalRevenue: 28450,
  cashAmount: 15200,
  upiAmount: 10800,
  cardAmount: 2450,
  cgstCollected: 711.25,
  sgstCollected: 711.25,
};

const topItems = [
  { name: 'Butter Chicken', quantity: 23, revenue: 8740 },
  { name: 'Chicken Biryani', quantity: 18, revenue: 6300 },
  { name: 'Paneer Butter Masala', quantity: 15, revenue: 4800 },
  { name: 'Butter Naan', quantity: 45, revenue: 2700 },
  { name: 'Dal Makhani', quantity: 12, revenue: 3120 },
];

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState(menuItems);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [historyOrders, setHistoryOrders] = useState(sampleOrders);
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    image: null as File | null,
    model3d: null as File | null
  });

  const handleSaveItem = () => {
    if (editingId) {
      // Edit existing item
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
              ...item,
              name: formData.name,
              price: Number(formData.price),
              // In a real app, handle file uploads here
            }
            : item
        )
      );
    } else {
      // Add new item
      const newItem = {
        id: (items.length + 1).toString(),
        name: formData.name,
        price: Number(formData.price),
        categoryId: formData.categoryId || 'starters', // default
        isVeg: true, // simplified
        isAvailable: true,
        gstRate: 5,
        ...formData
      };
      // @ts-ignore - simplified mock data addition
      setItems([...items, newItem]);
    }

    setIsAddItemOpen(false);
    setEditingId(null);
    setFormData({ name: '', categoryId: '', price: '', image: null, model3d: null });
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', categoryId: '', price: '', image: null, model3d: null });
    setIsAddItemOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      categoryId: items.find(i => i.id === item.id)?.categoryId || '', // simplified
      price: item.price.toString(),
      image: null,
      model3d: null
    });
    setIsAddItemOpen(true);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleItemAvailability = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const filteredHistory = historyOrders.filter((order) => {
    if (!date?.from) return true;
    const orderDate = new Date(order.createdAt);
    const start = new Date(date.from);
    start.setHours(0, 0, 0, 0);

    if (!date.to) {
      return orderDate >= start;
    }

    const end = new Date(date.to);
    end.setHours(23, 59, 59, 999);
    return orderDate >= start && orderDate <= end;
  });

  const handleDeleteHistory = (orderId: string) => {
    if (confirm('Are you sure you want to delete this history record?')) {
      setHistoryOrders(prev => prev.filter(order => order.id !== orderId));
    }
  };

  return (
    <div className="min-h-screen bg-pos-bg pb-20 md:pb-4 pt-4 md:pt-20">
      <div className="p-4 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
              <LayoutDashboard className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{restaurantInfo.name}</h1>
              <p className="text-sm text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/20">
                  <IndianRupee className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Revenue</p>
                  <p className="text-xl font-bold price-display">{formatINR(todaySales.totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-success/20">
                  <Package className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <p className="text-xl font-bold">{todaySales.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-info/20">
                  <TrendingUp className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Order</p>
                  <p className="text-xl font-bold price-display">
                    {formatINR(todaySales.totalRevenue / todaySales.totalOrders)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-warning/20">
                  <FileText className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">GST Collected</p>
                  <p className="text-xl font-bold price-display">
                    {formatINR(todaySales.cgstCollected + todaySales.sgstCollected)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="menu" className="space-y-4">
          <TabsList className="bg-card border border-border p-1 h-auto flex-wrap">
            <TabsTrigger value="menu" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <UtensilsCrossed className="h-4 w-4" />
              Menu Management
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <PieChart className="h-4 w-4" />
              Sales Report
            </TabsTrigger>
            <TabsTrigger value="gst" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="h-4 w-4" />
              GST Report
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Clock className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Menu Management Tab */}
          <TabsContent value="menu">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Menu Items</CardTitle>
                <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90" onClick={openAddModal}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{editingId ? "Edit Dish" : "Add New Dish"}</DialogTitle>
                      <DialogDescription>
                        {editingId ? "Edit the details of your dish." : "Add a new dish to your menu."} Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Dish Name
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                          Category
                        </Label>
                        <Input
                          id="category"
                          value={formData.categoryId}
                          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                          className="col-span-3"
                          placeholder="e.g., starters"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                          Price
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="image" className="text-right">
                          Image
                        </Label>
                        <div className="col-span-3 relative">
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-start text-muted-foreground"
                            onClick={() => document.getElementById('image')?.click()}
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            {formData.image ? formData.image.name : "Take/Upload Image"}
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="3dmodel" className="text-right">
                          3D Model
                        </Label>
                        <div className="col-span-3 relative">
                          <Input
                            id="3dmodel"
                            type="file"
                            accept=".glb,.gltf"
                            className="hidden"
                            onChange={(e) => setFormData({ ...formData, model3d: e.target.files?.[0] || null })}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-start text-muted-foreground"
                            onClick={() => document.getElementById('3dmodel')?.click()}
                          >
                            <Box className="mr-2 h-4 w-4" />
                            {formData.model3d ? formData.model3d.name : "Take/Upload 3D View"}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleSaveItem}>Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="mb-4 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search menu items..."
                    className="pl-10"
                  />
                </div>

                <div className="space-y-2">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-xl border transition-all duration-200',
                        item.isAvailable
                          ? 'bg-card border-border shadow-sm'
                          : 'bg-muted/50 border-border/50 opacity-60 grayscale-[0.8] hover:grayscale-[0.5] hover:opacity-80'
                      )}
                    >
                      {/* Veg indicator */}
                      <div className={`w-5 h-5 border-2 flex items-center justify-center rounded-sm shrink-0 ${item.isVeg ? 'border-green-600' : 'border-red-600'
                        }`}>
                        <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={cn('font-medium', !item.isAvailable && 'text-muted-foreground')}>
                          {item.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {categories.find((c) => c.id === item.categoryId)?.name} • GST {item.gstRate}%
                        </p>
                      </div>

                      <p className="font-semibold price-display shrink-0">{formatINR(item.price)}</p>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleItemAvailability(item.id)}
                          className={cn(
                            item.isAvailable ? 'text-success' : 'text-muted-foreground'
                          )}
                        >
                          {item.isAvailable ? (
                            <ToggleRight className="h-6 w-6" />
                          ) : (
                            <ToggleLeft className="h-6 w-6" />
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEditModal(item)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>


            {/* Sales Report Tab */}
          </TabsContent>
          <TabsContent value="sales">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Payment Mode Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IndianRupee className="h-5 w-5" />
                    Payment Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <span className="font-medium text-green-800">Cash</span>
                    <span className="font-bold price-display text-green-800">{formatINR(todaySales.cashAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                    <span className="font-medium text-purple-800">UPI</span>
                    <span className="font-bold price-display text-purple-800">{formatINR(todaySales.upiAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                    <span className="font-medium text-blue-800">Card</span>
                    <span className="font-bold price-display text-blue-800">{formatINR(todaySales.cardAmount)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Top Selling Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Top Selling Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topItems.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-3">
                        <span className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold',
                          index === 0 && 'bg-yellow-100 text-yellow-700',
                          index === 1 && 'bg-gray-100 text-gray-700',
                          index === 2 && 'bg-amber-100 text-amber-700',
                          index > 2 && 'bg-muted text-muted-foreground'
                        )}>
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.quantity} sold</p>
                        </div>
                        <span className="font-semibold price-display">{formatINR(item.revenue)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>


          </TabsContent>
          {/* GST Report Tab */}
          <TabsContent value="gst">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  GST Summary - Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20 text-center">
                    <p className="text-muted-foreground mb-2">CGST Collected</p>
                    <p className="text-3xl font-bold price-display text-primary">
                      {formatINR(todaySales.cgstCollected)}
                    </p>
                  </div>
                  <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20 text-center">
                    <p className="text-muted-foreground mb-2">SGST Collected</p>
                    <p className="text-3xl font-bold price-display text-primary">
                      {formatINR(todaySales.sgstCollected)}
                    </p>
                  </div>
                  <div className="p-6 bg-success/5 rounded-2xl border border-success/20 text-center">
                    <p className="text-muted-foreground mb-2">Total GST</p>
                    <p className="text-3xl font-bold price-display text-success">
                      {formatINR(todaySales.cgstCollected + todaySales.sgstCollected)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-xl">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> This is a summary for today. For detailed GST reports,
                    export data for specific date ranges using the calendar filter.
                  </p>
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Order History</h2>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-[300px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd, y")} -{" "}
                              {format(date.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(date.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Filter</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="rounded-md border bg-card">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Order No</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Customer</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Payment</th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Tax</th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Discount</th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Grand Total</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created At</th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {filteredHistory.map((order) => (
                        <tr key={order.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle font-medium">{order.orderNumber}</td>
                          <td className="p-4 align-middle">
                            <Badge variant="outline" className="capitalize">
                              {order.orderType || (order.tableNumber ? 'dine-in' : 'takeaway')}
                            </Badge>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex flex-col">
                              <span className="font-medium">{order.customerName || 'N/A'}</span>
                              <span className="text-xs text-muted-foreground">{order.customerPhone || ''}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle capitalize">{order.paymentMode || 'Pending'}</td>
                          <td className="p-4 align-middle text-right">{formatINR(order.cgst + order.sgst)}</td>
                          <td className="p-4 align-middle text-right">{formatINR(order.discount)}</td>
                          <td className="p-4 align-middle text-right font-bold">{formatINR(order.grandTotal)}</td>
                          <td className="p-4 align-middle text-muted-foreground">
                            {new Date(order.createdAt).toLocaleString()}
                          </td>
                          <td className="p-4 align-middle text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteHistory(order.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {filteredHistory.length === 0 && (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-muted-foreground">
                            No history records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
