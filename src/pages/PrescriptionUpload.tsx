import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Upload, 
  Camera, 
  FileImage, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Scan,
  Sparkles,
  Zap
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { processPrescriptionImage } from "@/services/PrescriptionOCR";
import { ExtractedData } from "@/types/prescription";
import heroImage from "@/assets/medikiosk-hero.jpg";

const PrescriptionUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setShowPreview(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCamera = () => {
    // Simulate camera capture
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a mock prescription image
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 400, 300);
      ctx.fillStyle = '#000000';
      ctx.font = '16px Arial';
      ctx.fillText('PRESCRIPTION', 50, 50);
      ctx.fillText('Dr. Smith Medical Center', 50, 80);
      ctx.fillText('Patient: John Doe', 50, 120);
      ctx.fillText('Rx: Paracetamol 500mg', 50, 150);
      ctx.fillText('Take 1 tablet twice daily', 50, 180);
      ctx.fillText('Duration: 5 days', 50, 210);
      
      const dataUrl = canvas.toDataURL();
      setUploadedImage(dataUrl);
      setShowPreview(true);
    }
  };

  const handleScanPrescription = async () => {
    if (!uploadedImage) return;
    
    setIsProcessing(true);
    
    try {
      toast({
        title: "Processing Prescription",
        description: "AI is analyzing your prescription...",
      });

      // Process prescription using your ML model
      const extractedData = await processPrescriptionImage(uploadedImage);
      
      setIsProcessing(false);
      setShowPreview(false);
      
      toast({
        title: "Prescription Scanned",
        description: "AI extraction completed successfully",
      });
      
      // Navigate to OCR results with processed data
      navigate("/ocr-results", { 
        state: { 
          prescriptionImage: uploadedImage,
          extractedData
        } 
      });
    } catch (error) {
      setIsProcessing(false);
      console.error('OCR processing failed:', error);
      
      toast({
        title: "Processing Failed",
        description: "Unable to process prescription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const uploadOptions = [
    {
      id: "gallery",
      title: "Choose from Gallery",
      description: "Select prescription from your device",
      icon: FileImage,
      gradient: "from-blue-500 to-blue-600",
      action: () => fileInputRef.current?.click()
    },
    {
      id: "camera",
      title: "Take Photo",
      description: "Capture prescription with camera",
      icon: Camera,
      gradient: "from-emerald-500 to-green-600",
      action: handleCamera
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-32 h-32 bg-blue-200/20 rounded-full animate-float" />
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-green-200/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 p-6 sticky top-0 z-50">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="hover:bg-blue-50">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-md">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Upload Prescription
                </h1>
                <p className="text-sm text-muted-foreground">AI-powered medicine extraction</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto space-y-8 relative z-10">
        {!uploadedImage ? (
          <>
            {/* Hero Section */}
            <div className={`text-center ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
              <div className="w-48 h-36 mx-auto mb-6 rounded-3xl overflow-hidden shadow-xl">
                <img 
                  src={heroImage} 
                  alt="MEDIKIOSK Smart Dispenser" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  AI-Powered Analysis
                </h2>
              </div>
              <p className="text-muted-foreground">
                Upload your prescription and let our AI extract medicine details instantly
              </p>
            </div>

            {/* Enhanced Upload Instructions */}
            <Card className={`glass-card ${isVisible ? 'animate-slide-up animate-stagger-1' : 'opacity-0'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-emerald-800">Clear & Well-lit Photo</p>
                      <p className="text-xs text-emerald-600">Ensure good lighting and sharp focus</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-blue-800">Complete Document</p>
                      <p className="text-xs text-blue-600">Include doctor's signature and stamp</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-orange-800">Recent Prescription</p>
                      <p className="text-xs text-orange-600">Within 30 days from issue date</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Upload Options */}
            <div className={`space-y-6 ${isVisible ? 'animate-slide-up animate-stagger-2' : 'opacity-0'}`}>
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold">Choose Upload Method</h3>
              </div>
              {uploadOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Card 
                    key={option.id}
                    className="glass-card hover:shadow-xl transition-all duration-500 cursor-pointer group transform hover:scale-[1.02] hover:-translate-y-1"
                    onClick={option.action}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 bg-gradient-to-r ${option.gradient} rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800 group-hover:text-gray-900 transition-colors">
                            {option.title}
                          </h3>
                          <p className="text-sm text-muted-foreground group-hover:text-gray-600 transition-colors">
                            {option.description}
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

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </>
        ) : (
          /* Image Preview */
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="w-5 h-5 text-medical-primary" />
                  Prescription Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <img 
                    src={uploadedImage} 
                    alt="Prescription" 
                    className="w-full h-64 object-cover rounded-xl border-2 border-medical-primary/20"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm"
                    onClick={() => {
                      setUploadedImage(null);
                      setShowPreview(false);
                    }}
                  >
                    Change
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Scan Button */}
            <Button 
              onClick={handleScanPrescription}
              disabled={isProcessing}
              className="w-full h-14 medical-button text-lg"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Scanning Prescription...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Scan className="w-5 h-5" />
                  Scan Prescription
                </div>
              )}
            </Button>

            {isProcessing && (
              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-medical-primary/10 rounded-full flex items-center justify-center">
                      <Scan className="w-4 h-4 text-medical-primary animate-pulse" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">AI Processing</p>
                      <p className="text-xs text-muted-foreground">Extracting medicine details...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Prescription Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {uploadedImage && (
              <img 
                src={uploadedImage} 
                alt="Prescription Preview" 
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowPreview(false)}>
                Retake
              </Button>
              <Button className="flex-1 medical-button" onClick={() => setShowPreview(false)}>
                Use This
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrescriptionUpload;