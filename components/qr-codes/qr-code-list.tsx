'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import QRCode from 'react-qr-code';
import { useQRCodeStore } from '@/store/qrcode';
import { useInventoryStore } from '@/store/inventory';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Chemical } from '@/types/inventory';

export function QRCodeList() {
  const { 
    qrCodes, 
    fetchQRCodes, 
    deleteQRCode, 
    isLoadingQRCodes, 
    error 
  } = useQRCodeStore();
  const { chemicals, fetchChemicals, isLoadingChemicals } = useInventoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchQRCodes();
    fetchChemicals();
  }, [fetchQRCodes, fetchChemicals]);

  // Create a map of chemical IDs to chemical details for quick lookup
  const chemicalMap = chemicals.reduce((map, chemical) => {
    map[chemical.id] = chemical;
    return map;
  }, {} as Record<string, Chemical>);

  const filteredQRCodes = qrCodes.filter(
    (item) => {
      const chemical = chemicalMap[item.chemical_id];
      const chemicalName = chemical?.name || item.chemical_name;
      const chemicalFormula = chemical?.molecular_formula || '';
      
      const searchLower = searchTerm.toLowerCase();
      return chemicalName.toLowerCase().includes(searchLower) ||
        item.chemical_id.toLowerCase().includes(searchLower) ||
        chemicalFormula.toLowerCase().includes(searchLower);
    }
  );

  const handleDeleteQRCode = async (id: string) => {
    try {
      await deleteQRCode(id);
      toast({
        title: "Success",
        description: "QR code deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (error) {
      return dateString;
    }
  };

  const isLoading = isLoadingQRCodes || isLoadingChemicals;

  if (isLoading && qrCodes.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <p>Loading QR codes...</p>
      </div>
    );
  }

  if (error && qrCodes.length === 0) {
    return (
      <div className="flex justify-center items-center p-8 text-red-500">
        <AlertTriangle className="h-8 w-8 mr-2" />
        <div>
          <p className="font-semibold">Error loading QR codes</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <Input
        placeholder="Search QR codes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      
      {isLoading && (
        <div className="flex items-center text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin mr-2" />
          Updating...
        </div>
      )}
      
      <div className="overflow-x-auto">
        <Table className="min-w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableHead>Chemical Name</TableHead>
              <TableHead>Chemical ID</TableHead>
              <TableHead>Formula</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQRCodes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No QR codes found
                </TableCell>
              </TableRow>
            ) : (
              filteredQRCodes.map((item) => {
                // Get real chemical data if available
                const chemical = chemicalMap[item.chemical_id];
                return (
                  <TableRow key={item.id}>
                    <TableCell>{chemical?.name || item.chemical_name}</TableCell>
                    <TableCell>{item.chemical_id}</TableCell>
                    <TableCell>{chemical?.molecular_formula || '-'}</TableCell>
                    <TableCell>{formatDate(item.date_created)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="dark:text-gray-100" size="sm">
                              View QR
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{chemical?.name || item.chemical_name} QR Code</DialogTitle>
                              <DialogDescription>
                                Scan this QR code to access chemical information.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col items-center">
                              <QRCode
                                value={JSON.stringify({
                                  name: chemical?.name || item.chemical_name,
                                  id: item.chemical_id,
                                  formula: chemical?.molecular_formula || '',
                                })}
                                size={200}
                              />
                              {chemical && (
                                <p className="mt-2 text-sm text-muted-foreground">
                                  {chemical.name} ({chemical.molecular_formula})
                                </p>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteQRCode(item.id)}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            'Delete'
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
