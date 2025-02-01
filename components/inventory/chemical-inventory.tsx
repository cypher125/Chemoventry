'use client';

import { useState } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
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

type Chemical = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  description: string;
  vendor: string;
  hazard_information: string;
  molecular_formula: string;
  reactivity_group: string;
  chemical_type: string;
  chemical_state: string;
  expires: string;
  created_at: string;
  updated_at: string;
  location: string;
  created_by: number;
};

const initialChemicals: Chemical[] = [
  {
      id: "e56b4f99-1d2d-4446-86ef-20ea9a161f88",
      name: "Hydrochloric Acid",
      quantity: 500.0,
      unit: "l",
      description: "A strong acid used in laboratory and industrial processes.",
      vendor: "LabSupplies Co.",
      hazard_information: "Corrosive; handle with care.",
      molecular_formula: "HCl",
      reactivity_group: "Noble Gas",
      chemical_type: "Inorganic",
      chemical_state: "Liquid",
      expires: "2025-12-01",
      created_at: "2025-01-03T15:41:41.167647Z",
      updated_at: "2025-01-03T15:41:41.167661Z",
      location: "2",
      created_by: 1
  },
  {
      id: "0236bfc2-b471-47bf-b1f3-276fedf9cb24",
      name: "Ethanol",
      quantity: 1000.0,
      unit: "l",
      description: "A common solvent and disinfectant.",
      vendor: "ChemicalWorld Inc.",
      hazard_information: "Highly flammable; keep away from open flames.",
      molecular_formula: "C2H6O",
      reactivity_group: "Alkali",
      chemical_type: "Organic",
      chemical_state: "Liquid",
      expires: "2026-07-15",
      created_at: "2025-01-03T15:42:41.834678Z",
      updated_at: "2025-01-03T15:42:41.834690Z",
      location: "2",
      created_by: 1
  },
  {
      id: "1607747e-888f-48cd-80b3-39d53b0ec597",
      name: "Sodium Chloride",
      quantity: 2000.0,
      unit: "g",
      description: "Common salt used in labs and industries.",
      vendor: "Global Chemicals",
      hazard_information: "Non-hazardous under normal use.",
      molecular_formula: "NaCl",
      reactivity_group: "Nonmetal",
      chemical_type: "Inorganic",
      chemical_state: "Solid",
      expires: "2030-01-01",
      created_at: "2025-01-03T15:45:47.194636Z",
      updated_at: "2025-01-03T15:45:47.194649Z",
      location: "4",
      created_by: 1
  },
  {
      id: "e0ba7f8d-47b0-4052-9f5c-c699d6ddc316",
      name: "Ammonium Nitrate",
      quantity: 5000.0,
      unit: "g",
      description: "A compound used as a fertilizer and explosive precursor.",
      vendor: "AgriChem Supplies",
      hazard_information: "Explosive under certain conditions.",
      molecular_formula: "NH4NO3",
      reactivity_group: "Actinide",
      chemical_type: "Inorganic",
      chemical_state: "Solid",
      expires: "2028-11-10",
      created_at: "2025-01-03T15:48:33.773305Z",
      updated_at: "2025-01-03T15:48:33.773322Z",
      location: "3",
      created_by: 1
  },
  {
      id: "755d79dc-e424-4ded-a782-b3e74e4b6a54",
      name: "Sodium Chloride",
      quantity: 500.0,
      unit: "kg",
      description: "Commonly known as table salt, used in laboratories.",
      vendor: "ChemCorp Ltd.",
      hazard_information: "Non-flammable, avoid inhalation.",
      molecular_formula: "NaCl",
      reactivity_group: "Alkali",
      chemical_type: "Organic",
      chemical_state: "Gas",
      expires: "2025-04-12",
      created_at: "2025-01-20T13:54:12.757460Z",
      updated_at: "2025-01-20T13:54:12.757476Z",
      location: "3",
      created_by: 1
  }
];

export function ChemicalInventory() {
  const [chemicals, setChemicals] = useState<Chemical[]>(initialChemicals);
  const [searchTerm, setSearchTerm] = useState('');
  const [newChemical, setNewChemical] = useState<Partial<Chemical>>({});
  const [reactivityFilter, setReactivityFilter] = useState<
    Chemical['reactivity_group'] | 'All'
  >('All');
  const [organicStateFilter, setOrganicStateFilter] = useState<
    Chemical['chemical_state'] | 'All'
  >('All');

  const filteredChemicals = chemicals.filter(
    (chemical) =>
      chemical.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (reactivityFilter === 'All' ||
        chemical.reactivity_group === reactivityFilter) &&
      (organicStateFilter === 'All' ||
        chemical.chemical_state === organicStateFilter)
  );

  const handleAddChemical = () => {
    if (newChemical.name && newChemical.molecular_formula && newChemical.id) {
      const newChemicalWithId = {
        ...newChemical,
        id: (chemicals.length + 1).toString(),
      } as Chemical;
      setChemicals([...chemicals, newChemicalWithId]);
      setNewChemical({});
    }
  };

  const handleDeleteChemical = (id: string) => {
    const chemicalToDelete = chemicals.find((c) => c.id === id);
    setChemicals(chemicals.filter((c) => c.id !== id));
    if (chemicalToDelete) {
    }
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
              placeholder="Search chemicals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full dark:bg-gray-800 sm:max-w-sm"
            />
            <Select
              value={reactivityFilter}
              onValueChange={(value) =>
                setReactivityFilter(value as Chemical['reactivity_group'] | 'All')
              }
            >
              <SelectTrigger className="w-full sm:w-[180px] dark:bg-gray-800">
                <SelectValue placeholder="Reactivity" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800">
                <SelectItem value="All">All Reactivity</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Noble Gas">Noble Gas</SelectItem>
                <SelectItem value="Alkali">Alkali</SelectItem>
                <SelectItem value="Nonmetal">Nonmetal</SelectItem>
                <SelectItem value="Actinide">Actinide</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={organicStateFilter}
              onValueChange={(value) =>
                setOrganicStateFilter(value as Chemical['chemical_state'] | 'All')
              }
            >
              <SelectTrigger className="w-full dark:bg-gray-800 sm:w-[180px]">
                <SelectValue placeholder="Organic State" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800">
                <SelectItem value="All">All States</SelectItem>
                <SelectItem value="Solid">Solid</SelectItem>
                <SelectItem value="Liquid">Liquid</SelectItem>
                <SelectItem value="Gas">Gas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add Chemical
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xs sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Chemical</DialogTitle>
                <DialogDescription>
                  Enter the details of the new chemical to add to the inventory.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newChemical.name || ''}
                    onChange={(e) =>
                      setNewChemical({ ...newChemical, name: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="formula" className="text-right">
                    Formula
                  </Label>
                  <Input
                    id="formula"
                    value={newChemical.molecular_formula || ''}
                    onChange={(e) =>
                      setNewChemical({
                        ...newChemical,
                        molecular_formula: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="formula" className="text-right">
                    Molecular Formula
                  </Label>
                  <Input
                    id="formula"
                    value={newChemical.molecular_formula || ''}
                    onChange={(e) =>
                      setNewChemical({
                        ...newChemical,
                        molecular_formula: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
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
                        reactivity_group: value as Chemical['reactivity_group'],
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select reactivity group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Noble Gas">Noble Gas</SelectItem>
                      <SelectItem value="Alkali">Alkali</SelectItem>
                      <SelectItem value="Nonmetal">Nonmetal</SelectItem>
                      <SelectItem value="Actinide">Actinide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="chemicalState" className="text-right">
                    Chemical State
                  </Label>
                  <Select
                    value={newChemical.chemical_state}
                    onValueChange={(value) =>
                      setNewChemical({
                        ...newChemical,
                        chemical_state: value as Chemical['chemical_state'],
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select chemical state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Solid">Solid</SelectItem>
                      <SelectItem value="Liquid">Liquid</SelectItem>
                      <SelectItem value="Gas">Gas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  className=" dark:bg-gray-300 bg-gray-200 text-gray-800 hover:bg-gray-100"
                  onClick={handleAddChemical}
                >
                  Add Chemical
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="overflow-x-auto">
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChemicals.map((chemical) => (
                <TableRow key={chemical.id}>
                  <TableCell>
                    <Link
                      href={`/inventory/${chemical.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {chemical.name}
                    </Link>
                  </TableCell>
                  <TableCell>{chemical.molecular_formula}</TableCell>
                  <TableCell>{chemical.reactivity_group}</TableCell>
                  <TableCell>{`${chemical.quantity} ${chemical.unit}`}</TableCell>
                  <TableCell>{chemical.location}</TableCell>
                  <TableCell>{chemical.expires}</TableCell>
                  <TableCell>{chemical.chemical_type}</TableCell>
                  <TableCell>{chemical.chemical_state}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/inventory/${chemical.id}`}>
                            View details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit chemical</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteChemical(chemical.id)}
                        >
                          Delete chemical
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  {/* Other Table Cells */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}