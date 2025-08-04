import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  Settings, 
  Plus, 
  Minus,
  Search,
  BarChart3,
  Users,
  Activity,
  ShieldCheck
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const [inventory, setInventory] = useState([
    { id: 1, name: "Paracetamol 500mg", quantity: 150, minStock: 50, expiry: "2025-03-15", status: "good" },
    { id: 2, name: "Aspirin 75mg", quantity: 25, minStock: 30, expiry: "2024-12-20", status: "low" },
    { id: 3, name: "Vitamin D3", quantity: 80, minStock: 40, expiry: "2025-06-10", status: "good" },
    { id: 4, name: "Ibuprofen 400mg", quantity: 10, minStock: 25, expiry: "2025-01-30", status: "critical" },
    { id: 5, name: "Amoxicillin 250mg", quantity: 0, minStock: 20, expiry: "2024-11-15", status: "out" }
  ]);

  const analytics = {
    totalDispensed: 1247,
    dailyAverage: 42,
    mostDispensed: "Paracetamol 500mg",
    activeUsers: 324
  };

  const recentActivity = [
    { action: "Medicine Dispensed", details: "Paracetamol 500mg - John Doe", time: "2 min ago", type: "dispense" },
    { action: "Stock Updated", details: "Aspirin 75mg (+50 units)", time: "1 hour ago", type: "restock" },
    { action: "Low Stock Alert", details: "Ibuprofen 400mg (10 remaining)", time: "2 hours ago", type: "alert" },
    { action: "User Registered", details: "New user: Jane Smith", time: "3 hours ago", type: "user" }
  ];

  const handleStockUpdate = (medicineId: number, change: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === medicineId) {
        const newQuantity = Math.max(0, item.quantity + change);
        const newStatus = newQuantity === 0 ? "out" : 
                         newQuantity <= item.minStock * 0.5 ? "critical" :
                         newQuantity <= item.minStock ? "low" : "good";
        
        toast({
          title: "Stock Updated",
          description: `${item.name}: ${newQuantity} units available`,
        });
        
        return { ...item, quantity: newQuantity, status: newStatus };
      }
      return item;
    }));
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      good: { label: "Good Stock", className: "bg-medical-success text-white" },
      low: { label: "Low Stock", className: "bg-medical-warning text-white" },
      critical: { label: "Critical", className: "bg-medical-error text-white" },
      out: { label: "Out of Stock", className: "bg-gray-500 text-white" }
    };
    
    const config = configs[status as keyof typeof configs];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-medical-primary to-medical-accent rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">MEDIKIOSK Management</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to App
          </Button>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-medical-primary/10 rounded-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-medical-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{inventory.length}</p>
                      <p className="text-sm text-muted-foreground">Total Medicines</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-medical-success/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-medical-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{analytics.totalDispensed}</p>
                      <p className="text-sm text-muted-foreground">Total Dispensed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-medical-warning/10 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-medical-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{inventory.filter(i => i.status === "low" || i.status === "critical").length}</p>
                      <p className="text-sm text-muted-foreground">Low Stock Alerts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-medical-accent/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-medical-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{analytics.activeUsers}</p>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-20 medical-button flex-col gap-2">
                  <Plus className="w-6 h-6" />
                  Add Medicine
                </Button>
                <Button className="h-20 success-button flex-col gap-2">
                  <Package className="w-6 h-6" />
                  Bulk Restock
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Settings className="w-6 h-6" />
                  System Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            {/* Search */}
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search medicines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Inventory List */}
            <div className="space-y-4">
              {filteredInventory.map((medicine) => (
                <Card key={medicine.id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-medical-primary/10 rounded-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-medical-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{medicine.name}</h3>
                          <p className="text-sm text-muted-foreground">Expires: {medicine.expiry}</p>
                        </div>
                      </div>
                      {getStatusBadge(medicine.status)}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm font-medium">Current Stock</p>
                          <p className="text-lg font-bold">{medicine.quantity} units</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Min Stock</p>
                          <p className="text-sm text-muted-foreground">{medicine.minStock} units</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleStockUpdate(medicine.id, -1)}
                          disabled={medicine.quantity === 0}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleStockUpdate(medicine.id, 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button 
                          className="success-button"
                          size="sm"
                          onClick={() => handleStockUpdate(medicine.id, 50)}
                        >
                          Restock (+50)
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Dispensing Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Daily Average</p>
                    <p className="text-2xl font-bold text-medical-primary">{analytics.dailyAverage} dispensed</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Most Dispensed</p>
                    <p className="text-lg font-semibold">{analytics.mostDispensed}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Stock Levels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {inventory.slice(0, 3).map((medicine) => (
                      <div key={medicine.id} className="flex items-center justify-between">
                        <p className="text-sm">{medicine.name}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                medicine.status === "good" ? "bg-medical-success" :
                                medicine.status === "low" ? "bg-medical-warning" : "bg-medical-error"
                              }`}
                              style={{ width: `${Math.min(100, (medicine.quantity / medicine.minStock) * 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{medicine.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-white/50 rounded-xl">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === "dispense" ? "bg-medical-primary/10" :
                      activity.type === "restock" ? "bg-medical-success/10" :
                      activity.type === "alert" ? "bg-medical-warning/10" : "bg-medical-accent/10"
                    }`}>
                      {activity.type === "dispense" && <Package className="w-4 h-4 text-medical-primary" />}
                      {activity.type === "restock" && <Plus className="w-4 h-4 text-medical-success" />}
                      {activity.type === "alert" && <AlertTriangle className="w-4 h-4 text-medical-warning" />}
                      {activity.type === "user" && <Users className="w-4 h-4 text-medical-accent" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.details}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;