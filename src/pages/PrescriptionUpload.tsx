import { useState, useRef } from "react";
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
  Scan
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const PrescriptionUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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
    setIsProcessing(true);
    
    // Simulate OCR processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    
    toast({
      title: "Prescription Scanned Successfully",
      description: "Medicine details have been extracted",
    });
    
    // Navigate to OCR results
    navigate("/ocr-results", { 
      state: { 
        prescriptionImage: uploadedImage,
        extractedData: {
          medicines: [
            {
              name: "Paracetamol",
              dosage: "500mg",
              frequency: "Twice daily",
              duration: "5 days",
              available: true
            }
          ],
          doctorName: "Dr. Smith",
          patientName: "John Doe",
          date: new Date().toLocaleDateString()
        }
      } 
    });
  };

  const uploadOptions = [
    {
      id: "gallery",
      title: "Choose from Gallery",
      description: "Select prescription image from device",
      icon: FileImage,
      color: "medical-primary",
      action: () => fileInputRef.current?.click()
    },
    {
      id: "camera",
      title: "Take Photo",
      description: "Use camera to capture prescription",
      icon: Camera,
      color: "medical-secondary",
      action: handleCamera
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 p-6">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Upload Prescription</h1>
            <p className="text-sm text-muted-foreground">Scan your prescription for medicine dispensing</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto space-y-6">
        {!uploadedImage ? (
          <>
            {/* Upload Instructions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-medical-primary" />
                  Upload Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-medical-success mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Clear & Well-lit</p>
                    <p className="text-xs text-muted-foreground">Ensure prescription is clearly visible</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-medical-success mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Complete Document</p>
                    <p className="text-xs text-muted-foreground">Include doctor's signature and stamp</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-medical-warning mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Recent Prescription</p>
                    <p className="text-xs text-muted-foreground">Within 30 days from issue date</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload Options */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Choose Upload Method</h2>
              {uploadOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Card 
                    key={option.id}
                    className="glass-card hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
                    onClick={option.action}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${option.color}/10`}>
                          <IconComponent className={`w-6 h-6 text-${option.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{option.title}</h3>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
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