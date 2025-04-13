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
      const location_id = typeof selectedChemical.location === 'object' 
        ? selectedChemical.location.id 
        : selectedChemical.location;
        
      setChemical({
        ...selectedChemical,
        location_id
      });
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
      // Convert quantity to a number to ensure proper format
      const updatedChemical = {
        ...chemical,
        quantity: Number(chemical.quantity),
      };
      
      await updateChemical(chemical.id, updatedChemical);
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
              
              <div className="space-y-3">
                <Label htmlFor="quantity">Initial Quantity</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="quantity"
                    type="number"
                    value={chemical.quantity || ''}
                    onChange={(e) => handleInputChange('quantity', Number(e.target.value))}
                    className="flex-1"
                  />
                  <Input
                    id="unit"
                    placeholder="Unit (g, ml)"
                    value={chemical.unit || ''}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    className="w-24"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="location_id">Location</Label>
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
                <Label htmlFor="chemical_state">Chemical State</Label>
                <Select
                  value={chemical.chemical_state}
                  onValueChange={(value) => handleInputChange('chemical_state', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select chemical state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Solid">Solid</SelectItem>
                    <SelectItem value="Liquid">Liquid</SelectItem>
                    <SelectItem value="Gas">Gas</SelectItem>
                    <SelectItem value="Plasma">Plasma</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="reactivity_group">Reactivity Group</Label>
                <Select
                  value={chemical.reactivity_group}
                  onValueChange={(value) => handleInputChange('reactivity_group', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reactivity group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alkali">Alkali</SelectItem>
                    <SelectItem value="Alkaline Earth">Alkaline Earth</SelectItem>
                    <SelectItem value="Transition Metal">Transition Metal</SelectItem>
                    <SelectItem value="Lanthanide">Lanthanide</SelectItem>
                    <SelectItem value="Actinide">Actinide</SelectItem>
                    <SelectItem value="Metal">Metal</SelectItem>
                    <SelectItem value="Nonmetal">Nonmetal</SelectItem>
                    <SelectItem value="Halogen">Halogen</SelectItem>
                    <SelectItem value="Noble Gas">Noble Gas</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="chemical_type">Chemical Type</Label>
                <Select
                  value={chemical.chemical_type}
                  onValueChange={(value) => handleInputChange('chemical_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select chemical type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Organic">Organic</SelectItem>
                    <SelectItem value="Inorganic">Inorganic</SelectItem>
                    <SelectItem value="Both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="expires">Expiration Date</Label>
                <Input
                  id="expires"
                  type="date"
                  value={chemical.expires ? new Date(chemical.expires).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('expires', e.target.value)}
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="vendor">Vendor/Supplier</Label>
                <Input
                  id="vendor"
                  value={chemical.vendor || ''}
                  onChange={(e) => handleInputChange('vendor', e.target.value)}
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="hazard_information">Hazard Information</Label>
                <Input
                  id="hazard_information"
                  value={chemical.hazard_information || ''}
                  onChange={(e) => handleInputChange('hazard_information', e.target.value)}
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="molecular_formula">Molecular Formula</Label>
                <Input
                  id="molecular_formula"
                  value={chemical.molecular_formula || ''}
                  onChange={(e) => handleInputChange('molecular_formula', e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={chemical.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
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