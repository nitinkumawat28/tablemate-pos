import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PaymentMode, formatINR } from '@/types/pos';
import { Banknote, Smartphone, CreditCard, Printer, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  grandTotal: number;
  onPaymentComplete: (paymentMode: PaymentMode) => void;
}

export const PaymentModal = ({ isOpen, onClose, grandTotal, onPaymentComplete }: PaymentModalProps) => {
  const [selectedMode, setSelectedMode] = useState<PaymentMode | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  const paymentModes: { mode: PaymentMode; label: string; icon: typeof Banknote; color: string }[] = [
    { mode: 'cash', label: 'Cash', icon: Banknote, color: 'bg-green-500 hover:bg-green-600' },
    { mode: 'upi', label: 'UPI', icon: Smartphone, color: 'bg-purple-500 hover:bg-purple-600' },
    { mode: 'card', label: 'Card', icon: CreditCard, color: 'bg-blue-500 hover:bg-blue-600' },
  ];

  const handlePayment = () => {
    if (selectedMode) {
      setIsPaid(true);
      setTimeout(() => {
        onPaymentComplete(selectedMode);
        setIsPaid(false);
        setSelectedMode(null);
      }, 1000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Payment</DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {/* Amount Display */}
          <div className="text-center mb-8">
            <p className="text-muted-foreground mb-2">Amount to Pay</p>
            <p className="text-5xl font-bold price-display text-primary">
              {formatINR(grandTotal)}
            </p>
          </div>

          {/* Payment Mode Selection */}
          {!isPaid ? (
            <>
              <p className="text-sm font-medium text-center mb-4">Select Payment Mode</p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {paymentModes.map(({ mode, label, icon: Icon, color }) => (
                  <button
                    key={mode}
                    onClick={() => setSelectedMode(mode)}
                    className={cn(
                      'flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all',
                      selectedMode === mode
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className={cn('p-3 rounded-full text-white', color)}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-14"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 h-14 bg-success hover:bg-success/90"
                  onClick={handlePayment}
                  disabled={!selectedMode}
                >
                  <Printer className="h-5 w-5 mr-2" />
                  Pay & Print
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-20 h-20 rounded-full bg-success flex items-center justify-center animate-scale-in">
                <Check className="h-10 w-10 text-white" />
              </div>
              <p className="text-xl font-semibold text-success">Payment Successful!</p>
              <p className="text-muted-foreground">Printing receipt...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
