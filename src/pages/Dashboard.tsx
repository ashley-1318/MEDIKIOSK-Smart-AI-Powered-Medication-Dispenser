import { useState, useEffect } from "react";
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
  PlusCircle,
  Zap,
  Heart,
  Star
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [notifications] = useState([
    { id: 1, message: "Your prescription for Paracetamol is ready", type: "success", time: "2 min ago" },
    { id: 2, message: "Medicine stock is low - Admin notified", type: "warning", time: "1 hour ago" }
  ]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const quickActions = [
    {
      title: "Upload Prescription",
      description: "Take a photo or upload prescription image",
      icon: Upload,
      color: "medical-primary",
      path: "/upload",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Scan QR Code",
      description: "Quick access with prescription QR",
      icon: Scan,
      color: "medical-secondary",
      path: "/scan",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      title: "My Prescriptions",
      description: "View and manage your prescriptions",
      icon: History,
      color: "medical-accent",
      path: "/history",
      gradient: "from-purple-500 to-indigo-600"
    }
  ];

  const recentActivity = [
    { medicine: "Paracetamol 500mg", date: "Today, 2:30 PM", status: "Dispensed", icon: "success" },
    { medicine: "Vitamin D3", date: "Yesterday, 9:15 AM", status: "Dispensed", icon: "success" },
    { medicine: "Aspirin 75mg", date: "3 days ago", status: "Pending", icon: "pending" }
  ];

  const statsCards = [
    {
      title: "System Status",
      value: "Online",
      icon: Shield,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      status: "good"
    },
    {
      title: "Last Visit",
      value: "Today, 2:30 PM",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      status: "info"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Enhanced Header with Floating Effect */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 p-6 sticky top-0 z-50">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 hero-gradient rounded-2xl flex items-center justify-center shadow-lg animate-float">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  MEDIKIOSK
                </h1>
                <p className="text-sm text-muted-foreground">Welcome back, John</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-blue-50 transition-all duration-300" 
                onClick={() => navigate("/notifications")}
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center animate-medical-pulse">
                    <span className="text-white text-[10px] font-medium">{notifications.length}</span>
                  </div>
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-blue-50 transition-all duration-300"
                onClick={() => navigate("/profile")}
              >
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto space-y-8">
        {/* Enhanced Status Cards with Animation */}
        <div className={`grid grid-cols-2 gap-4 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
          {statsCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className={`glass-card hover:scale-105 transition-all duration-300 animate-stagger-${index + 1}`}>
                <CardContent className="p-4 text-center">
                  <div className={`w-10 h-10 mx-auto mb-3 ${stat.bgColor} rounded-2xl flex items-center justify-center shadow-sm`}>
                    <IconComponent className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{stat.title}</p>
                  <p className={`text-xs mt-1 ${stat.status === 'good' ? 'text-emerald-600 font-medium' : 'text-muted-foreground'}`}>
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced Quick Actions */}
        <div className={`${isVisible ? 'animate-slide-up animate-stagger-2' : 'opacity-0'}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Quick Actions
            </h2>
            <Zap className="w-5 h-5 text-yellow-500 animate-medical-pulse" />
          </div>
          <div className="space-y-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Card 
                  key={index}
                  className="glass-card hover:shadow-xl transition-all duration-500 cursor-pointer group transform hover:scale-[1.02] hover:-translate-y-1"
                  onClick={() => navigate(action.path)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-r ${action.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800 group-hover:text-gray-900 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-muted-foreground group-hover:text-gray-600 transition-colors">
                          {action.description}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          <Star className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Enhanced Recent Activity */}
        <Card className={`glass-card ${isVisible ? 'animate-slide-up animate-stagger-3' : 'opacity-0'}`}>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <History className="w-4 h-4 text-white" />
              </div>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 bg-gradient-to-r from-white/60 to-white/40 rounded-2xl hover:from-white/80 hover:to-white/60 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    item.icon === 'success' ? 'bg-emerald-100' : 'bg-orange-100'
                  }`}>
                    {item.icon === 'success' ? (
                      <Heart className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-800 group-hover:text-gray-900 transition-colors">
                      {item.medicine}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
                <Badge 
                  variant={item.status === "Dispensed" ? "default" : "secondary"}
                  className={`${item.status === "Dispensed" 
                    ? "bg-emerald-500 hover:bg-emerald-600 shadow-lg" 
                    : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  } transition-all duration-300`}
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Enhanced Emergency Section */}
        <Card className={`glass-card border-red-200/50 bg-gradient-to-r from-red-50/80 to-pink-50/80 ${isVisible ? 'animate-fade-in-scale animate-stagger-3' : 'opacity-0'}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg animate-medical-pulse">
                <PlusCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-700 text-lg">Emergency Access</h3>
                <p className="text-sm text-red-600/80">For immediate medical assistance</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-red-300 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
                onClick={() => {
                  toast({
                    title: "Emergency Mode Activated",
                    description: "Contacting medical personnel...",
                  });
                }}
              >
                Call Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Admin Access Button - Floating */}
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={() => navigate("/admin")}
            className="w-14 h-14 rounded-2xl shadow-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 hover:scale-110"
            size="icon"
          >
            <Settings className="w-6 h-6 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;