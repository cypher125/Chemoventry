'use client';

import { useState } from 'react';
import { Plus, MoreHorizontal, Loader2 } from 'lucide-react';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { useInventoryStore } from '@/store/inventory';
import { Chemical } from '@/types/inventory';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function ChemicalInventory() {
  const { 
    chemicals, 
    locations, 
    isLoadingChemicals, 
    chemicalsError,
    addChemical, 
    deleteChemical 
  } = useInventoryStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [newChemical, setNewChemical] = useState<Partial<Chemical>>({});
  const [reactivityFilter, setReactivityFilter] = useState<
    Chemical['reactivity_group'] | 'All'
  >('All');
  const [organicStateFilter, setOrganicStateFilter] = useState<
    Chemical['chemical_state'] | 'All'
  >('All');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredChemicals = chemicals.filter(
    (chemical) =>
      chemical.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (reactivityFilter === 'All' ||
        chemical.reactivity_group === reactivityFilter) &&
      (organicStateFilter === 'All' ||
        chemical.chemical_state === organicStateFilter)
  );

  const handleAddChemical = async () => {
    if (newChemical.name && newChemical.molecular_formula) {
      setIsSubmitting(true);
      try {
        await addChemical(newChemical);
        setNewChemical({});
      } catch (error) {
        console.error('Failed to add chemical:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDeleteChemical = async (id: string) => {
    try {
      await deleteChemical(id);
    } catch (error) {
      console.error('Failed to delete chemical:', error);
    }
  };

  // Helper function to get location name from ID
  const getLocationName = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : locationId;
  };

  return (
    <Card className="w-full dark:bg-gray-900/60 dark:border-none">
      <CardHeader>
        <CardTitle>Chemical Inventory</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row lg:justify-between items-center mb-4 space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-2 w-full">
            <Input
              className="w-full sm:w-80"
              placeholder="Search chemicals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={reactivityFilter}
              onValueChange={(value) =>
                setReactivityFilter(value as Chemical['reactivity_group'] | 'All')
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Reactivity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Reactivity</SelectItem>
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
            <Select
              value={organicStateFilter}
              onValueChange={(value) =>
                setOrganicStateFilter(value as Chemical['chemical_state'] | 'All')
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All States</SelectItem>
                <SelectItem value="Solid">Solid</SelectItem>
                <SelectItem value="Liquid">Liquid</SelectItem>
                <SelectItem value="Gas">Gas</SelectItem>
                <SelectItem value="Plasma">Plasma</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap">
                <Plus className="mr-2 h-4 w-4" />
                Add Chemical
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Chemical</DialogTitle>
                <DialogDescription>
                  Fill in the details below to add a new chemical to your
                  inventory.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={newChemical.name || ''}
                    onChange={(e) =>
                      setNewChemical({ ...newChemical, name: e.target.value })
                    }
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="formula" className="text-right">
                    Formula *
                  </Label>
                  <Input
                    id="formula"
                    value={newChemical.formula || ''}
                    onChange={(e) =>
                      setNewChemical({
                        ...newChemical,
                        formula: e.target.value,
                      })
                    }
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cas_number" className="text-right">
                    CAS Number *
                  </Label>
                  <Input
                    id="cas_number"
                    value={newChemical.cas_number || ''}
                    onChange={(e) =>
                      setNewChemical({
                        ...newChemical,
                        cas_number: e.target.value,
                      })
                    }
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    Quantity *
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newChemical.initial_quantity || ''}
                    onChange={(e) =>
                      setNewChemical({
                        ...newChemical,
                        initial_quantity: Number(e.target.value),
                        current_quantity: Number(e.target.value),
                      })
                    }
                    className="col-span-2"
                    required
                  />
                  <Input
                    id="unit"
                    placeholder="Unit (g, ml, etc)"
                    value={newChemical.unit || ''}
                    onChange={(e) =>
                      setNewChemical({
                        ...newChemical,
                        unit: e.target.value,
                      })
                    }
                    className="col-span-1"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location *
                  </Label>
                  <Select
                    value={newChemical.location_id}
                    onValueChange={(value) =>
                      setNewChemical({
                        ...newChemical,
                        location_id: value,
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3">
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="state" className="text-right">
                    State
                  </Label>
                  <Select
                    value={newChemical.state}
                    onValueChange={(value) =>
                      setNewChemical({
                        ...newChemical,
                        state: value as 'solid' | 'liquid' | 'gas',
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="liquid">Liquid</SelectItem>
                      <SelectItem value="gas">Gas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reactivity_group" className="text-right">
                    Reactivity Group
                  </Label>
                  <Select
                    value={newChemical.reactivity_group}
                    onValueChange={(value) =>
                      setNewChemical({
                        ...newChemical,
                        reactivity_group: value,
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3">
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="expiry_date" className="text-right">
                    Expiry Date
                  </Label>
                  <Input
                    id="expiry_date"
                    type="date"
                    value={newChemical.expiry_date || ''}
                    onChange={(e) =>
                      setNewChemical({
                        ...newChemical,
                        expiry_date: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="supplier" className="text-right">
                    Supplier
                  </Label>
                  <Input
                    id="supplier"
                    value={newChemical.supplier || ''}
                    onChange={(e) =>
                      setNewChemical({
                        ...newChemical,
                        supplier: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hazard_class" className="text-right">
                    Hazard Class
                  </Label>
                  <Input
                    id="hazard_class"
                    value={newChemical.hazard_class || ''}
                    onChange={(e) =>
                      setNewChemical({
                        ...newChemical,
                        hazard_class: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="storage_conditions" className="text-right">
                    Storage Conditions
                  </Label>
                  <Input
                    id="storage_conditions"
                    value={newChemical.storage_conditions || ''}
                    onChange={(e) =>
                      setNewChemical({
                        ...newChemical,
                        storage_conditions: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="msds_url" className="text-right">
                    MSDS URL
                  </Label>
                  <Input
                    id="msds_url"
                    value={newChemical.msds_url || ''}
                    onChange={(e) =>
                      setNewChemical({
                        ...newChemical,
                        msds_url: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="comments" className="text-right">
                    Comments
                  </Label>
                  <textarea
                    id="comments"
                    value={newChemical.comments || ''}
                    onChange={(e) =>
                      setNewChemical({
                        ...newChemical,
                        comments: e.target.value,
                      })
                    }
                    className="col-span-3 min-h-[100px] px-3 py-2 border rounded-md dark:bg-gray-950 dark:border-gray-800"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  onClick={handleAddChemical} 
                  disabled={
                    isSubmitting || 
                    !newChemical.name || 
                    !newChemical.formula || 
                    !newChemical.cas_number || 
                    !newChemical.initial_quantity || 
                    !newChemical.unit || 
                    !newChemical.location_id
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Add Chemical'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {chemicalsError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{chemicalsError}</AlertDescription>
          </Alert>
        )}

        {isLoadingChemicals ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading chemicals...</span>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Formula</TableHead>
                  <TableHead>Reactivity Group</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Expiration Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Chemical State</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChemicals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6">
                      No chemicals found. Add some to your inventory.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredChemicals.map((chemical) => (
                    <TableRow key={chemical.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/chemoventry/inventory/${chemical.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {chemical.name}
                        </Link>
                      </TableCell>
                      <TableCell>{chemical.molecular_formula}</TableCell>
                      <TableCell>{chemical.reactivity_group}</TableCell>
                      <TableCell>{chemical.quantity}</TableCell>
                      <TableCell>{getLocationName(chemical.location.toString())}</TableCell>
                      <TableCell>
                        {new Date(chemical.expires).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{chemical.chemical_type}</TableCell>
                      <TableCell>{chemical.chemical_state}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => navigator.clipboard.writeText(chemical.id)}
                            >
                              Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/chemoventry/inventory/${chemical.id}`}>
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/chemoventry/inventory/${chemical.id}/edit`}>
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteChemical(chemical.id)}
                              className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}