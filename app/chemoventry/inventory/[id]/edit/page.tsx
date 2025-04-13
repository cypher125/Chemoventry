'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useInventoryStore } from '@/store/inventory';
import { Chemical } from '@/types/inventory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import PageTitle from '@/components/pageTitle';

export default function EditChemical() {
  const router = useRouter();
  const params = useParams();
  const { 
    selectedChemical, 
    fetchChemical, 
    updateChemical, 
    isLoadingChemical, 
    chemicalError,
    locations,
    fetchLocations
  } = useInventoryStore();

  const [chemical, setChemical] = useState<Partial<Chemical>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load chemical data
  useEffect(() => {
    if (params.id) {
      fetchChemical(params.id as string);
      fetchLocations();
    }
  }, [params.id, fetchChemical, fetchLocations]);

  // Update local state when chemical data is loaded
  useEffect(() => {
    if (selectedChemical) {
      setChemical(selectedChemical);
    }
  }, [selectedChemical]);

  const handleInputChange = (field: string, value: string | number) => {
    setChemical(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!chemical.id) return;
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
      await updateChemical(chemical.id, chemical);
      router.push(`/chemoventry/inventory/${chemical.id}`);
    } catch (error) {
      console.error('Failed to update chemical:', error);
      setSaveError('Failed to update chemical. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingChemical) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading chemical data...</p>
        </div>
      </div>
    );
  }

  if (chemicalError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-3xl border-destructive">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <h2 className="text-xl font-semibold mb-2">Error Loading Chemical</h2>
            <p className="text-muted-foreground text-center mb-4">
              {chemicalError}
            </p>
            <Button 
              variant="outline" 
              onClick={() => router.push('/chemoventry/inventory')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Inventory
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/chemoventry/inventory/${params.id}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <PageTitle title={`Edit ${chemical.name || 'Chemical'}`} />
        </div>
      </div>

      <Card className="w-full dark:bg-gray-900/60 dark:border-gray-800">
        <CardHeader>
          <CardTitle>Chemical Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {saveError && (
              <div className="bg-destructive/10 border border-destructive p-3 rounded-md text-destructive">
                {saveError}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="name">Chemical Name</Label>
                <Input
                  id="name"
                  value={chemical.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="formula">Formula</Label>
                <Input
                  id="formula"
                  value={chemical.formula || ''}
                  onChange={(e) => handleInputChange('formula', e.target.value)}
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="cas_number">CAS Number</Label>
                <Input
                  id="cas_number"
                  value={chemical.cas_number || ''}
                  onChange={(e) => handleInputChange('cas_number', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-3">
                  <Label htmlFor="initial_quantity">Initial Quantity</Label>
                  <Input
                    id="initial_quantity"
                    type="number"
                    value={chemical.initial_quantity || ''}
                    onChange={(e) => handleInputChange('initial_quantity', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={chemical.unit || ''}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-3">
                  <Label htmlFor="current_quantity">Current Quantity</Label>
                  <Input
                    id="current_quantity"
                    type="number"
                    value={chemical.current_quantity || ''}
                    onChange={(e) => handleInputChange('current_quantity', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="unit_display">Unit</Label>
                  <Input
                    id="unit_display"
                    value={chemical.unit || ''}
                    disabled
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="location">Location</Label>
                <Select
                  value={chemical.location_id}
                  onValueChange={(value) => handleInputChange('location_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="state">State</Label>
                <Select
                  value={chemical.state}
                  onValueChange={(value) => handleInputChange('state', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="liquid">Liquid</SelectItem>
                    <SelectItem value="gas">Gas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="expiry_date">Expiry Date</Label>
                <Input
                  id="expiry_date"
                  type="date"
                  value={chemical.expiry_date ? new Date(chemical.expiry_date).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('expiry_date', e.target.value)}
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  value={chemical.supplier || ''}
                  onChange={(e) => handleInputChange('supplier', e.target.value)}
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="storage_conditions">Storage Conditions</Label>
                <Input
                  id="storage_conditions"
                  value={chemical.storage_conditions || ''}
                  onChange={(e) => handleInputChange('storage_conditions', e.target.value)}
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="hazard_class">Hazard Class</Label>
                <Input
                  id="hazard_class"
                  value={chemical.hazard_class || ''}
                  onChange={(e) => handleInputChange('hazard_class', e.target.value)}
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="msds_url">MSDS URL</Label>
                <Input
                  id="msds_url"
                  value={chemical.msds_url || ''}
                  onChange={(e) => handleInputChange('msds_url', e.target.value)}
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="date_registered">Date Registered</Label>
                <Input
                  id="date_registered"
                  type="date"
                  value={chemical.date_registered ? new Date(chemical.date_registered).toISOString().split('T')[0] : ''}
                  disabled
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <Label htmlFor="comments">Comments</Label>
              <textarea
                id="comments"
                className="w-full min-h-[100px] px-3 py-2 border rounded-md dark:bg-gray-950 dark:border-gray-800"
                value={chemical.comments || ''}
                onChange={(e) => handleInputChange('comments', e.target.value)}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => router.push(`/chemoventry/inventory/${params.id}`)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 