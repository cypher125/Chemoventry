'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  Building2, 
  CalendarDays, 
  Info, 
  User,
  Container,
  ArrowLeft,
  Loader2,
  Download,
  QrCode,
  Copy,
  ClipboardCopy,
  FileWarning,
  Check
} from 'lucide-react';
import { format } from 'date-fns';
import { useInventoryStore } from '@/store/inventory';
import PageTitle from '@/components/pageTitle';
import QRCode from 'react-qr-code';
import { useTheme } from 'next-themes';

export default function ChemicalInformation() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { 
    selectedChemical, 
    fetchChemical, 
    isLoadingChemical, 
    chemicalError,
    locations
  } = useInventoryStore();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const qrCodeRef = useRef(null);

  useEffect(() => {
    if (params.id) {
      // Fetch the chemical details
      fetchChemical(params.id as string);
    }
  }, [params.id, fetchChemical]);

  // Generate QR code data
  const generateQRData = (chemical) => {
    return JSON.stringify({
      id: chemical.id,
      name: chemical.name,
      formula: chemical.molecular_formula
    });
  };

  // Helper function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download QR code as PNG
  const downloadQrCode = () => {
    if (!qrCodeRef.current) return;
    
    const svg = qrCodeRef.current.querySelector('svg');
    if (!svg) return;
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    const svgRect = svg.getBoundingClientRect();
    canvas.width = svgRect.width;
    canvas.height = svgRect.height;
    
    // Create an image from the SVG
    const img = new Image();
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      // Fill with white background
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        // Convert canvas to PNG
        const pngUrl = canvas.toDataURL('image/png');
        
        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `${chemical.name.replace(/\s+/g, '_')}_QR.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
      
      // Clean up
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  };

  // Show loading state
  if (isLoadingChemical) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Loading chemical information...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (chemicalError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-3xl border-destructive dark:border-destructive">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <FileWarning className="w-16 h-16 text-destructive mb-4" />
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

  // Show not found state
  if (!selectedChemical) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-3xl dark:border-gray-800">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Chemical Not Found</h2>
            <p className="text-muted-foreground text-center">
              The chemical you are looking for does not exist or has been removed.
            </p>
            <Button 
              variant="outline" 
              className="mt-6"
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

  const chemical = selectedChemical;
  
  // Find location name
  const getLocationName = () => {
    if (typeof chemical.location === 'object' && chemical.location.name) {
      return chemical.location.name;
    } 
    
    if (locations && locations.length > 0) {
      const locationObj = locations.find(loc => loc.id === chemical.location.toString());
      return locationObj ? locationObj.name : chemical.location.toString();
    }
    
    return chemical.location.toString();
  };

  // Determine appropriate badge colors based on properties
  const getReactivityBadgeVariant = () => {
    const reactivityMap = {
      'Alkali': 'destructive',
      'Halogen': 'destructive',
      'Noble Gas': 'outline',
      'Transition Metal': 'secondary',
      'Nonmetal': 'secondary',
      'default': 'outline'
    };
    return reactivityMap[chemical.reactivity_group] || reactivityMap.default;
  };

  const getStateBadgeVariant = () => {
    const stateMap = {
      'Solid': 'outline',
      'Liquid': 'secondary',
      'Gas': 'default',
      'Plasma': 'destructive',
      'default': 'outline'
    };
    return stateMap[chemical.chemical_state] || stateMap.default;
  };

  const getTypeBadgeVariant = () => {
    return chemical.chemical_type === 'Organic' ? 'secondary' : 'default';
  };

  // Calculate if expiration date is approaching
  const isExpirationApproaching = () => {
    const expirationDate = new Date(chemical.expires);
    const now = new Date();
    const threeMonths = 3 * 30 * 24 * 60 * 60 * 1000; // approx 3 months in ms
    return expirationDate.getTime() - now.getTime() < threeMonths;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/chemoventry/inventory')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <PageTitle title={chemical.name} />
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main information column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="dark:bg-gray-900/60 dark:border-gray-800">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold mb-1">
                    {chemical.name}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {chemical.molecular_formula}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant={getTypeBadgeVariant()}>
                    {chemical.chemical_type}
                  </Badge>
                  <Badge variant={getStateBadgeVariant()}>
                    {chemical.chemical_state}
                  </Badge>
                  <Badge variant={getReactivityBadgeVariant()}>
                    {chemical.reactivity_group}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="storage">Storage</TabsTrigger>
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-6">
                  {chemical.description && (
                    <div className="bg-muted/40 rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center">
                        <Info className="h-4 w-4 mr-2" />
                        Description
                      </h3>
                      <p className="text-muted-foreground">
                        {chemical.description}
                      </p>
                    </div>
                  )}
                  
                  {chemical.hazard_information && (
                    <div className={`${isExpirationApproaching() ? 'bg-destructive/10' : 'bg-muted/40'} rounded-lg p-4`}>
                      <h3 className="font-medium mb-2 flex items-center">
                        <AlertTriangle className={`h-4 w-4 mr-2 ${isExpirationApproaching() ? 'text-destructive' : ''}`} />
                        Hazard Information
                      </h3>
                      <p className="text-muted-foreground">
                        {chemical.hazard_information}
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard 
                      icon={<Building2 className="h-5 w-5" />}
                      title="Vendor"
                      value={chemical.vendor}
                    />
                    
                    <InfoCard 
                      icon={<CalendarDays className={`h-5 w-5 ${isExpirationApproaching() ? 'text-destructive' : ''}`} />}
                      title="Expiration Date"
                      value={format(new Date(chemical.expires), 'PPP')}
                      alert={isExpirationApproaching()}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="storage" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard 
                      icon={<Building2 className="h-5 w-5" />}
                      title="Storage Location"
                      value={getLocationName()}
                    />
                    
                    <InfoCard 
                      icon={<Container className="h-5 w-5" />}
                      title="Quantity"
                      value={`${chemical.quantity} ${chemical.unit || ''}`}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="metadata" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard 
                      icon={<User className="h-5 w-5" />}
                      title="Created By"
                      value={chemical.created_by.toString()}
                    />
                    
                    <InfoCard 
                      icon={<ClipboardCopy className="h-5 w-5" />}
                      title="Chemical ID"
                      value={chemical.id}
                      action={
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(chemical.id)}
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      }
                    />
                    
                    {chemical.created_at && (
                      <InfoCard 
                        icon={<CalendarDays className="h-5 w-5" />}
                        title="Created At"
                        value={format(new Date(chemical.created_at), 'PPP p')}
                      />
                    )}
                    
                    {chemical.updated_at && (
                      <InfoCard 
                        icon={<CalendarDays className="h-5 w-5" />}
                        title="Last Updated"
                        value={format(new Date(chemical.updated_at), 'PPP p')}
                      />
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* QR Code and Quick Info Column */}
        <div className="space-y-6">
          <Card className="dark:bg-gray-900/60 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl">
                <QrCode className="h-5 w-5 inline mr-2" />
                Chemical QR Code
              </CardTitle>
              <CardDescription>
                Scan to quickly identify this chemical
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-2">
              <div className="bg-white p-4 rounded-lg mb-4 w-full max-w-xs" ref={qrCodeRef}>
                <QRCode 
                  value={generateQRData(chemical)}
                  size={200}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  viewBox={`0 0 256 256`}
                />
              </div>
              <div className="text-center text-sm text-muted-foreground">
                <p className="font-medium">{chemical.name}</p>
                <p className="font-mono">{chemical.molecular_formula}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pt-2">
              <Button variant="outline" size="sm" className="w-full max-w-xs" onClick={downloadQrCode}>
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
            </CardFooter>
          </Card>
          
          {chemical.expires && (
            <Card className={`${isExpirationApproaching() ? 'border-destructive dark:border-destructive' : 'dark:border-gray-800'} dark:bg-gray-900/60`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center">
                  <AlertTriangle className={`h-5 w-5 mr-2 ${isExpirationApproaching() ? 'text-destructive' : ''}`} />
                  Expiration Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-center p-3 rounded-md ${isExpirationApproaching() ? 'bg-destructive/10' : 'bg-green-100 dark:bg-green-900/20'}`}>
                  <p className="font-medium">
                    {isExpirationApproaching() 
                      ? 'Expiring Soon!' 
                      : 'In Date'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expires on {format(new Date(chemical.expires), 'PPP')}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper component for info cards
function InfoCard({
  icon,
  title,
  value,
  alert = false,
  action = null
}) {
  return (
    <div className={`p-4 rounded-lg ${alert ? 'bg-destructive/10' : 'bg-muted/40'}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className={`mr-3 ${alert ? 'text-destructive' : 'text-foreground'}`}>
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-medium">{title}</h3>
            <p className="text-base">{value}</p>
          </div>
        </div>
        {action}
      </div>
    </div>
  );
}
