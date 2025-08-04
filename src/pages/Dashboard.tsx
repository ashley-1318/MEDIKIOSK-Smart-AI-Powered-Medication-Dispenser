import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Scan, 
  Bell, 
  User, 
  Activity, 
  Clock, 
  Shield,
  Settings,
  History,
  PlusCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [notifications] = useState([
    { id: 1, message: "Your prescription for Paracetamol is ready", type: "success", time: "2 min ago" },
    { id: 2, message: "Medicine stock is low - Admin notified", type: "warning", time: "1 hour ago" }
  ]);

  const quickActions = [
    {
      title: "Upload Prescription",
      description: "Take a photo or upload prescription image",
      icon: Upload,
      color: "medical-primary",
      path: "/upload"
    },
    {
      title: "Scan QR Code",
      description: "Quick access with prescription QR",
      icon: Scan,
      color: "medical-secondary",
      path: "/scan"
    },
    {
      title: "My Prescriptions",
      description: "View and manage your prescriptions",
      icon: History,
      color: "medical-accent",
      path: "/history"
    }
  ];

  const recentActivity = [
    { medicine: "Paracetamol 500mg", date: "Today, 2:30 PM", status: "Dispensed" },
    { medicine: "Vitamin D3", date: "Yesterday, 9:15 AM", status: "Dispensed" },
    { medicine: "Aspirin 75mg", date: "3 days ago", status: "Pending" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 p-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-medical-primary to-medical-accent rounded-2xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">MEDIKIOSK</h1>
              <p className="text-sm text-muted-foreground">Welcome back, John</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/notifications")}>
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-medical-error rounded-full text-xs flex items-center justify-center">
                  <span className="text-white text-[10px]">{notifications.length}</span>
                </div>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-medical-success/10 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-medical-success" />
              </div>
              <p className="text-sm font-medium">System Status</p>
              <p className="text-xs text-medical-success">Online</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-medical-primary/10 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-medical-primary" />
              </div>
              <p className="text-sm font-medium">Last Visit</p>
              <p className="text-xs text-muted-foreground">Today, 2:30 PM</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Card 
                  key={index}
                  className="glass-card hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
                  onClick={() => navigate(action.path)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${action.color}/10`}>
                        <IconComponent className={`w-6 h-6 text-${action.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                <div>
                  <p className="font-medium text-sm">{item.medicine}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
                <Badge 
                  variant={item.status === "Dispensed" ? "default" : "secondary"}
                  className={item.status === "Dispensed" ? "bg-medical-success text-white" : ""}
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Emergency Section */}
        <Card className="glass-card border-medical-error/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-medical-error/10 rounded-full flex items-center justify-center">
                <PlusCircle className="w-5 h-5 text-medical-error" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-medical-error">Emergency Access</h3>
                <p className="text-sm text-muted-foreground">For immediate medical assistance</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-medical-error text-medical-error hover:bg-medical-error hover:text-white"
                onClick={() => {
                  toast({
                    title: "Emergency Mode Activated",
                    description: "Contacting medical personnel...",
                  });
                }}
              >
                Call
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;