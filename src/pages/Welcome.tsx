import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Smartphone, CreditCard, Fingerprint, Activity, ShieldCheck, Clock, Sparkles, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Welcome = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [loginMethod, setLoginMethod] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [rfidUid, setRfidUid] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLogin = async (method: string) => {
    setIsProcessing(true);
    
    // Simulate authentication process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (method === "otp" && phoneNumber) {
      setShowOtpInput(true);
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${phoneNumber}`,
      });
    } else if (method === "rfid" && rfidUid) {
      toast({
        title: "RFID Authenticated",
        description: "Access granted via RFID",
      });
      navigate("/dashboard");
    } else if (method === "biometric") {
      toast({
        title: "Biometric Verified",
        description: "Fingerprint authentication successful",
      });
      navigate("/dashboard");
    }
    
    setIsProcessing(false);
  };

  const verifyOtp = async () => {
    if (otp === "1234") { // Mock OTP
      toast({
        title: "Authentication Successful",
        description: "Welcome to MEDIKIOSK",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please check your verification code",
        variant: "destructive",
      });
    }
  };

  const loginMethods = [
    {
      id: "otp",
      title: "Phone OTP",
      description: "Secure verification via SMS",
      icon: Smartphone,
      gradient: "from-blue-500 to-blue-600",
      shadowColor: "shadow-blue-500/25"
    },
    {
      id: "rfid",
      title: "RFID Card",
      description: "Tap your medical card",
      icon: CreditCard,
      gradient: "from-emerald-500 to-green-600",
      shadowColor: "shadow-emerald-500/25"
    },
    {
      id: "biometric",
      title: "Biometric",
      description: "Fingerprint or Face ID",
      icon: Fingerprint,
      gradient: "from-purple-500 to-indigo-600",
      shadowColor: "shadow-purple-500/25"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-green-200/30 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-purple-200/30 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Enhanced Header */}
      <div className={`p-8 text-center relative z-10 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-16 hero-gradient rounded-3xl flex items-center justify-center shadow-xl animate-float">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-green-600 bg-clip-text text-transparent">
              MEDIKIOSK
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <p className="text-lg text-muted-foreground font-medium">Smart Medicine Dispenser</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-3">
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Secure & Trusted
          </Badge>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <Clock className="w-3 h-3 mr-1" />
            24/7 Available
          </Badge>
          <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
            <Zap className="w-3 h-3 mr-1" />
            Fast Dispensing
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-8 pb-8 relative z-10">
        <div className="max-w-sm mx-auto space-y-8">
          <div className={`text-center ${isVisible ? 'animate-slide-up animate-stagger-1' : 'opacity-0'}`}>
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-muted-foreground">Choose your preferred authentication method</p>
          </div>

          {/* Enhanced Login Methods */}
          <div className={`space-y-6 ${isVisible ? 'animate-slide-up animate-stagger-2' : 'opacity-0'}`}>
            {loginMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <Card 
                  key={method.id}
                  className={`glass-card hover:shadow-xl transition-all duration-500 cursor-pointer group transform hover:scale-[1.02] hover:-translate-y-2 ${method.shadowColor}`}
                  onClick={() => setLoginMethod(method.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${method.gradient} rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800 group-hover:text-gray-900 transition-colors">
                          {method.title}
                        </h3>
                        <p className="text-sm text-muted-foreground group-hover:text-gray-600 transition-colors">
                          {method.description}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Login Dialogs */}
      <Dialog open={loginMethod === "otp"} onOpenChange={() => setLoginMethod(null)}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-medical-primary" />
              Phone Authentication
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!showOtpInput ? (
              <>
                <Input
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="text-center text-lg"
                />
                <Button 
                  onClick={() => handleLogin("otp")}
                  disabled={!phoneNumber || isProcessing}
                  className="w-full medical-button"
                >
                  {isProcessing ? "Sending OTP..." : "Send OTP"}
                </Button>
              </>
            ) : (
              <>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Enter the 4-digit code sent to {phoneNumber}
                  </p>
                  <Input
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="text-center text-lg"
                    maxLength={4}
                  />
                </div>
                <Button 
                  onClick={verifyOtp}
                  disabled={otp.length !== 4}
                  className="w-full medical-button"
                >
                  Verify OTP
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={loginMethod === "rfid"} onOpenChange={() => setLoginMethod(null)}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-medical-secondary" />
              RFID Authentication
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-medical-secondary/10 rounded-2xl flex items-center justify-center">
                <CreditCard className="w-10 h-10 text-medical-secondary animate-medical-pulse" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Enter your RFID card UID for testing
              </p>
            </div>
            <Input
              placeholder="Enter RFID UID"
              value={rfidUid}
              onChange={(e) => setRfidUid(e.target.value)}
              className="text-center"
            />
            <Button 
              onClick={() => handleLogin("rfid")}
              disabled={!rfidUid || isProcessing}
              className="w-full success-button"
            >
              {isProcessing ? "Authenticating..." : "Authenticate"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={loginMethod === "biometric"} onOpenChange={() => setLoginMethod(null)}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-medical-accent" />
              Biometric Authentication
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-medical-accent/10 rounded-2xl flex items-center justify-center">
                <Fingerprint className="w-10 h-10 text-medical-accent animate-medical-pulse" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Place your finger on the sensor or look at the camera
              </p>
            </div>
            <Button 
              onClick={() => handleLogin("biometric")}
              disabled={isProcessing}
              className="w-full medical-button"
            >
              {isProcessing ? "Scanning..." : "Start Biometric Scan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Welcome;