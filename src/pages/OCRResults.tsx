import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Edit3, 
  Pill, 
  Clock, 
  Calendar,
  User,
  Stethoscope
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  available: boolean;
}

interface ExtractedData {
  medicines: Medicine[];
  doctorName: string;
  patientName: string;
  date: string;
}

const OCRResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { prescriptionImage, extractedData } = location.state as { 
    prescriptionImage: string; 
    extractedData: ExtractedData 
  };

  const [medicines, setMedicines] = useState<Medicine[]>(extractedData.medicines);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleEditMedicine = (index: number) => {
    toast({
      title: "Edit Medicine",
      description: "Medicine editing feature coming soon",
    });
  };

  const handleConfirmAndProceed = async () => {
    setIsConfirming(true);
    
    // Simulate confirmation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsConfirming(false);
    
    const availableMedicines = medicines.filter(med => med.available);
    
    if (availableMedicines.length === 0) {
      toast({
        title: "No Medicines Available",
        description: "None of the prescribed medicines are currently in stock",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Prescription Verified",
      description: `${availableMedicines.length} medicine(s) ready for dispensing`,
    });
    
    navigate("/medicine-selection", { 
      state: { 
        medicines: availableMedicines,
        prescriptionData: extractedData
      } 
    });
  };

  const availableCount = medicines.filter(med => med.available).length;
  const unavailableCount = medicines.filter(med => !med.available).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 p-6">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/upload")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">OCR Results</h1>
            <p className="text-sm text-muted-foreground">AI-extracted prescription details</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto space-y-6">
        {/* Prescription Info */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-medical-primary" />
              Prescription Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Patient</p>
                <p className="text-sm text-muted-foreground">{extractedData.patientName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Stethoscope className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Doctor</p>
                <p className="text-sm text-muted-foreground">{extractedData.doctorName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-muted-foreground">{extractedData.date}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-medical-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-medical-success" />
              </div>
              <p className="text-2xl font-bold text-medical-success">{availableCount}</p>
              <p className="text-xs text-muted-foreground">Available</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-medical-error/10 rounded-full flex items-center justify-center">
                <XCircle className="w-4 h-4 text-medical-error" />
              </div>
              <p className="text-2xl font-bold text-medical-error">{unavailableCount}</p>
              <p className="text-xs text-muted-foreground">Unavailable</p>
            </CardContent>
          </Card>
        </div>

        {/* Extracted Medicines */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Extracted Medicines</h2>
          {medicines.map((medicine, index) => (
            <Card key={index} className={`glass-card ${!medicine.available ? 'border-medical-error/30' : 'border-medical-success/30'}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      medicine.available ? 'bg-medical-success/10' : 'bg-medical-error/10'
                    }`}>
                      <Pill className={`w-5 h-5 ${
                        medicine.available ? 'text-medical-success' : 'text-medical-error'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{medicine.name}</h3>
                      <p className="text-sm text-muted-foreground">{medicine.dosage}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={medicine.available ? "default" : "destructive"}
                      className={medicine.available ? "bg-medical-success" : ""}
                    >
                      {medicine.available ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {medicine.available ? "Available" : "Unavailable"}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => handleEditMedicine(index)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <Separator className="my-3" />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Frequency</p>
                      <p className="text-muted-foreground">{medicine.frequency}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-muted-foreground">{medicine.duration}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {availableCount > 0 && (
            <Button 
              onClick={handleConfirmAndProceed}
              disabled={isConfirming}
              className="w-full h-14 medical-button text-lg"
            >
              {isConfirming ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Confirming...
                </div>
              ) : (
                `Confirm & Proceed to Dispensing (${availableCount} medicine${availableCount > 1 ? 's' : ''})`
              )}
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/upload")}
          >
            Retake Prescription
          </Button>
        </div>

        {unavailableCount > 0 && (
          <Card className="glass-card border-medical-warning/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-medical-warning" />
                <div>
                  <p className="font-medium text-sm">Some medicines unavailable</p>
                  <p className="text-xs text-muted-foreground">
                    {unavailableCount} medicine{unavailableCount > 1 ? 's are' : ' is'} currently out of stock. 
                    Admin has been notified for restocking.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OCRResults;