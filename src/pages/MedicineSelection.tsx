import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Pill, 
  Clock, 
  Calendar,
  Check,
  Edit3
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  available: boolean;
  selected?: boolean;
  customQuantity?: number;
}

const MedicineSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { medicines: initialMedicines, prescriptionData } = location.state as { 
    medicines: Medicine[]; 
    prescriptionData: any 
  };

  const [medicines, setMedicines] = useState<Medicine[]>(
    initialMedicines.map(med => ({ ...med, selected: true, customQuantity: 1 }))
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleToggleMedicine = (index: number) => {
    setMedicines(prev => prev.map((med, i) => 
      i === index ? { ...med, selected: !med.selected } : med
    ));
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    if (quantity >= 1 && quantity <= 10) {
      setMedicines(prev => prev.map((med, i) => 
        i === index ? { ...med, customQuantity: quantity } : med
      ));
    }
  };

  const handleStartDispensing = async () => {
    const selectedMedicines = medicines.filter(med => med.selected);
    
    if (selectedMedicines.length === 0) {
      toast({
        title: "No Medicines Selected",
        description: "Please select at least one medicine to dispense",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate dispensing preparation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    
    toast({
      title: "Dispensing Started",
      description: `Preparing to dispense ${selectedMedicines.length} medicine(s)`,
    });
    
    navigate("/dispensing", { 
      state: { 
        selectedMedicines,
        prescriptionData
      } 
    });
  };

  const selectedCount = medicines.filter(med => med.selected).length;
  const totalQuantity = medicines
    .filter(med => med.selected)
    .reduce((sum, med) => sum + (med.customQuantity || 1), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 p-6">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ocr-results")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Medicine Selection</h1>
            <p className="text-sm text-muted-foreground">Confirm medicines and quantities</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto space-y-6">
        {/* Selection Summary */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-medical-primary">{selectedCount}</p>
                <p className="text-sm text-muted-foreground">Selected</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-medical-secondary">{totalQuantity}</p>
                <p className="text-sm text-muted-foreground">Total Units</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medicine List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Available Medicines</h2>
          {medicines.map((medicine, index) => (
            <Card 
              key={index} 
              className={`glass-card transition-all duration-300 ${
                medicine.selected ? 'border-medical-primary/50 bg-medical-primary/5' : 'border-gray-200'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                        medicine.selected 
                          ? 'bg-medical-primary border-medical-primary' 
                          : 'border-gray-300 hover:border-medical-primary'
                      }`}
                      onClick={() => handleToggleMedicine(index)}
                    >
                      {medicine.selected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <h3 className="font-semibold">{medicine.name}</h3>
                      <p className="text-sm text-muted-foreground">{medicine.dosage}</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-medical-primary/10 rounded-full flex items-center justify-center">
                    <Pill className="w-5 h-5 text-medical-primary" />
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="space-y-3">
                  {/* Prescription Details */}
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

                  {/* Quantity Selector */}
                  {medicine.selected && (
                    <div className="bg-white/50 rounded-xl p-3">
                      <Label className="text-sm font-medium">Quantity to Dispense</Label>
                      <div className="flex items-center gap-3 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8"
                          onClick={() => handleQuantityChange(index, (medicine.customQuantity || 1) - 1)}
                          disabled={(medicine.customQuantity || 1) <= 1}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          value={medicine.customQuantity || 1}
                          onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                          className="w-16 text-center"
                          min="1"
                          max="10"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8"
                          onClick={() => handleQuantityChange(index, (medicine.customQuantity || 1) + 1)}
                          disabled={(medicine.customQuantity || 1) >= 10}
                        >
                          +
                        </Button>
                        <span className="text-sm text-muted-foreground ml-2">
                          Max: 10 units
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleStartDispensing}
            disabled={selectedCount === 0 || isProcessing}
            className="w-full h-14 medical-button text-lg"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Preparing Dispenser...
              </div>
            ) : (
              `Start Dispensing (${selectedCount} medicine${selectedCount !== 1 ? 's' : ''})`
            )}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/ocr-results")}
          >
            Back to Results
          </Button>
        </div>

        {/* Instructions */}
        <Card className="glass-card border-medical-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-medical-primary/10 rounded-full flex items-center justify-center">
                <Edit3 className="w-4 h-4 text-medical-primary" />
              </div>
              <div>
                <h3 className="font-medium text-sm text-medical-primary">Important Notes</h3>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li>• Verify medicine selection before dispensing</li>
                  <li>• Check expiry dates on dispensed medicines</li>
                  <li>• Follow prescribed dosage instructions</li>
                  <li>• Collect all medicines before leaving</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicineSelection;