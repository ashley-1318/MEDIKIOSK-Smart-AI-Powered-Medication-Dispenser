import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  AlertCircle, 
  Pill, 
  Package,
  Home,
  Download,
  Clock
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Medicine {
  name: string;
  dosage: string;
  customQuantity: number;
  selected: boolean;
}

interface DispensingStep {
  id: number;
  medicine: string;
  status: 'pending' | 'dispensing' | 'completed' | 'error';
  slot: number;
  quantity: number;
}

const DispensingStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedMedicines, prescriptionData } = location.state as { 
    selectedMedicines: Medicine[]; 
    prescriptionData: any 
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [dispensingSteps, setDispensingSteps] = useState<DispensingStep[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Initialize dispensing steps
    const steps: DispensingStep[] = selectedMedicines.map((medicine, index) => ({
      id: index + 1,
      medicine: `${medicine.name} ${medicine.dosage}`,
      status: 'pending',
      slot: index + 1,
      quantity: medicine.customQuantity
    }));
    
    setDispensingSteps(steps);
    
    // Start dispensing simulation
    startDispensing(steps);
  }, [selectedMedicines]);

  const startDispensing = async (steps: DispensingStep[]) => {
    for (let i = 0; i < steps.length; i++) {
      // Update current step to dispensing
      setDispensingSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'dispensing' } : step
      ));
      setCurrentStep(i);
      
      // Simulate dispensing time (3-5 seconds per medicine)
      const dispensingTime = 3000 + Math.random() * 2000;
      await new Promise(resolve => setTimeout(resolve, dispensingTime));
      
      // 10% chance of error for simulation
      const hasError = Math.random() < 0.1;
      
      if (hasError) {
        setDispensingSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, status: 'error' } : step
        ));
        setHasError(true);
        
        toast({
          title: "Dispensing Error",
          description: `Error dispensing ${steps[i].medicine}. Please contact admin.`,
          variant: "destructive"
        });
        
        // Allow retry or continue
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Auto-retry once
        setDispensingSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, status: 'dispensing' } : step
        ));
        
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Mark as completed
      setDispensingSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'completed' } : step
      ));
      
      // Update progress
      const progress = ((i + 1) / steps.length) * 100;
      setOverallProgress(progress);
      
      toast({
        title: "Medicine Dispensed",
        description: `${steps[i].medicine} (${steps[i].quantity} unit${steps[i].quantity > 1 ? 's' : ''}) ready for pickup`,
      });
    }
    
    // All completed
    setIsCompleted(true);
    setCurrentStep(steps.length);
    
    toast({
      title: "Dispensing Complete",
      description: "All medicines have been dispensed successfully",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-medical-success" />;
      case 'dispensing':
        return <div className="w-5 h-5 border-2 border-medical-primary border-t-transparent rounded-full animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-medical-error" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-medical-success text-white';
      case 'dispensing':
        return 'bg-medical-primary text-white';
      case 'error':
        return 'bg-medical-error text-white';
      default:
        return 'bg-gray-200 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 p-6">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-xl font-bold">Medicine Dispensing</h1>
          <p className="text-sm text-muted-foreground">
            {isCompleted ? 'Dispensing Complete' : 'Please wait while medicines are dispensed'}
          </p>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto space-y-6">
        {/* Overall Progress */}
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-medical-primary to-medical-accent rounded-full flex items-center justify-center">
                {isCompleted ? (
                  <CheckCircle className="w-8 h-8 text-white animate-success-check" />
                ) : (
                  <Package className="w-8 h-8 text-white animate-dispensing" />
                )}
              </div>
              <h2 className="text-lg font-semibold">
                {isCompleted ? 'All Medicines Ready!' : 'Dispensing in Progress'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isCompleted 
                  ? 'Please collect your medicines from the dispenser' 
                  : `Step ${currentStep + 1} of ${dispensingSteps.length}`
                }
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Current Dispensing */}
        {!isCompleted && currentStep < dispensingSteps.length && (
          <Card className="glass-card border-medical-primary/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-medical-primary/10 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-medical-primary border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Currently Dispensing</p>
                  <p className="text-sm text-muted-foreground">
                    {dispensingSteps[currentStep]?.medicine} - Slot {dispensingSteps[currentStep]?.slot}
                  </p>
                </div>
                <Badge className="bg-medical-primary text-white">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dispensing Steps */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Dispensing Status</h3>
          {dispensingSteps.map((step, index) => (
            <Card key={step.id} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(step.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{step.medicine}</p>
                      <Badge className={getStatusColor(step.status)}>
                        {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Slot {step.slot}</span>
                      <span>•</span>
                      <span>{step.quantity} unit{step.quantity > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        {isCompleted && (
          <div className="space-y-3">
            <Button 
              onClick={() => navigate("/dashboard")}
              className="w-full h-14 success-button text-lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Dashboard
            </Button>
            
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => {
                toast({
                  title: "Receipt Generated",
                  description: "Dispensing receipt has been saved to your profile"
                });
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
          </div>
        )}

        {hasError && !isCompleted && (
          <Card className="glass-card border-medical-error/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-medical-error" />
                <div>
                  <p className="font-medium text-sm">Attention Required</p>
                  <p className="text-xs text-muted-foreground">
                    Some medicines had dispensing issues. Auto-retry in progress or contact admin if problems persist.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Safety Instructions */}
        <Card className="glass-card border-medical-warning/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Pill className="w-5 h-5 text-medical-warning mt-0.5" />
              <div>
                <h3 className="font-medium text-sm text-medical-warning">Safety Reminders</h3>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li>• Check medicine labels before consumption</li>
                  <li>• Verify expiry dates on all packages</li>
                  <li>• Follow prescribed dosage instructions</li>
                  <li>• Store medicines as directed</li>
                  <li>• Contact your doctor if side effects occur</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DispensingStatus;