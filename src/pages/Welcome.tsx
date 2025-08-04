import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Smartphone, CreditCard, Fingerprint, Activity, ShieldCheck, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Welcome = () => {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [rfidUid, setRfidUid] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
      description: "Login with phone number verification",
      icon: Smartphone,
      color: "medical-primary"
    },
    {
      id: "rfid",
      title: "RFID Card",
      description: "Scan your medical RFID card",
      icon: CreditCard,
      color: "medical-secondary"
    },
    {
      id: "biometric",
      title: "Biometric",
      description: "Fingerprint or Face ID authentication",
      icon: Fingerprint,
      color: "medical-accent"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      {/* Header */}
      <div className="p-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-medical-primary to-medical-accent rounded-2xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">MEDIKIOSK</h1>
        </div>
        <p className="text-muted-foreground text-lg">Smart Medicine Dispenser</p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Badge variant="secondary" className="bg-medical-success/10 text-medical-success border-medical-success/20">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Secure
          </Badge>
          <Badge variant="secondary" className="bg-medical-primary/10 text-medical-primary border-medical-primary/20">
            <Clock className="w-3 h-3 mr-1" />
            24/7 Available
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-6">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Choose your preferred login method</p>
          </div>

          {/* Login Methods */}
          <div className="space-y-4">
            {loginMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <Card 
                  key={method.id}
                  className="glass-card hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
                  onClick={() => setLoginMethod(method.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${method.color}/10`}>
                        <IconComponent className={`w-6 h-6 text-${method.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{method.title}</h3>
                        <p className="text-muted-foreground text-sm">{method.description}</p>
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