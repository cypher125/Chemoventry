'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import QRCode from 'react-qr-code';
import { useQRCodeStore } from '@/store/qrcode';
import { useInventoryStore } from '@/store/inventory';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function QRCodeGenerator() {
  const [selectedChemicalId, setSelectedChemicalId] = useState<string>('');
  const [generated, setGenerated] = useState(false);
  const [qrCodeData, setQRCodeData] = useState<{ name: string; id: string; formula: string } | null>(null);
  const { generateQRCode, isLoadingQRCodes } = useQRCodeStore();
  const { chemicals, isLoadingChemicals, fetchChemicals } = useInventoryStore();
  const { toast } = useToast();

  // Fetch chemicals on component mount
  useEffect(() => {
    fetchChemicals();
  }, [fetchChemicals]);

  const isLoading = isLoadingQRCodes || isLoadingChemicals;

  const handleGenerateQRCode = async () => {
    if (!selectedChemicalId) {
      toast({
        title: "Error",
        description: "Please select a chemical first.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Find the selected chemical from inventory
      const selectedChemical = chemicals.find(chemical => chemical.id === selectedChemicalId);
      
      if (!selectedChemical) {
        toast({
          title: "Error",
          description: "Selected chemical not found in inventory.",
          variant: "destructive",
        });
        return;
      }

      // Generate QR code with real data
      await generateQRCode(selectedChemical.id, selectedChemical.name);
      
      // Set QR code data for display
      setQRCodeData({
        name: selectedChemical.name,
        id: selectedChemical.id,
        formula: selectedChemical.molecular_formula || '',
      });
      
      setGenerated(true);
      
      toast({
        title: "Success",
        description: "QR code generated successfully.",
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setSelectedChemicalId('');
    setGenerated(false);
    setQRCodeData(null);
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Create a QR Code for a chemical in your inventory</CardTitle>
          <CardDescription>
            Generate a QR code that can be scanned to quickly access chemical information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!generated ? (
            <>
              <div className="space-y-2">
                <label htmlFor="chemical-select" className="text-sm font-medium">
                  Select Chemical
                </label>
                {isLoadingChemicals ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span>Loading chemicals...</span>
                  </div>
                ) : chemicals.length === 0 ? (
                  <div className="text-center p-4 border rounded-md bg-muted">
                    <p>No chemicals found in inventory.</p>
                  </div>
                ) : (
                  <Select
                    value={selectedChemicalId}
                    onValueChange={setSelectedChemicalId}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="chemical-select" className="w-full">
                      <SelectValue placeholder="Select a chemical" />
                    </SelectTrigger>
                    <SelectContent>
                      {chemicals.map((chemical) => (
                        <SelectItem key={chemical.id} value={chemical.id}>
                          {chemical.name} {chemical.molecular_formula ? `(${chemical.molecular_formula})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <Button
                onClick={handleGenerateQRCode}
                className="w-full"
                disabled={!selectedChemicalId || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate QR Code'
                )}
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              {qrCodeData && (
                <>
                  <QRCode
                    value={JSON.stringify(qrCodeData)}
                    size={200}
                  />
                  <div className="text-center space-y-1">
                    <p className="font-semibold">{qrCodeData.name}</p>
                    <p className="text-sm text-muted-foreground">ID: {qrCodeData.id}</p>
                    {qrCodeData.formula && (
                      <p className="text-sm text-muted-foreground">Formula: {qrCodeData.formula}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {generated && (
            <Button onClick={handleReset} variant="outline">
              Generate Another QR Code
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
