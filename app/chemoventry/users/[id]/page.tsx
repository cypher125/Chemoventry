'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useUserStore } from '@/store/user';
import { User } from '@/types/user';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  User as UserIcon,
  Calendar, 
  Mail,
  Briefcase,
  Shield,
  Loader2,
  AlertTriangle 
} from 'lucide-react';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { fetchUserById, updateUser, isLoadingUsers, error, currentUser, getCurrentUser } = useUserStore();
  
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (params.id) {
      loadUserData(params.id as string);
    }
  }, [params.id]);

  const loadUserData = async (userId: string) => {
    try {
      const userData = await fetchUserById(userId);
      if (userData) {
        setUser(userData);
        setEditedUser(userData);
      } else {
        // Handle case where no user is found
        toast({
          title: "User not found",
          description: "The requested user could not be found.",
          variant: "destructive",
        });
        router.push('/chemoventry/users');
      }
    } catch (error) {
      console.error('Error loading user:', error);
      toast({
        title: "Error",
        description: "Failed to load user data. Please try again.",
        variant: "destructive",
      });
      router.push('/chemoventry/users');
    }
  };

  const handleSaveChanges = async () => {
    if (!user || !editedUser) return;
    
    try {
      await updateUser(user.id, editedUser);
      setIsEditing(false);
      
      // Reload user data to get updated values
      loadUserData(user.id);
      
      toast({
        title: 'Success',
        description: 'User information updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user information',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const goBack = () => {
    router.back();
  };

  // Loading state
  if (isLoadingUsers && !user) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading user information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !user) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-red-500">
          <AlertTriangle className="h-12 w-12" />
          <p className="text-lg font-medium">Error loading user information</p>
          <p>{error}</p>
          <Button onClick={goBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // User not found
  if (!user) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <UserIcon className="h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium">User not found</p>
          <Button onClick={goBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" onClick={goBack} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">User Profile</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <UserIcon className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-xl">
              {user.first_name} {user.last_name}
            </CardTitle>
            <CardDescription className="flex justify-center">
              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                {user.role === 'admin' ? 'Administrator' : 'Lab Attendant'}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center text-sm">
              <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Joined {formatDate(user.join_date)}</span>
            </div>
            <div className="flex items-center text-sm">
              <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Role: {user.role === 'admin' ? 'Administrator' : 'Lab Attendant'}</span>
            </div>
            <div className="flex items-center text-sm">
              <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Status: </span>
              <Badge 
                variant={user.is_active ? 'outline' : 'destructive'} 
                className="ml-2"
              >
                {user.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              className="w-full"
              variant={isEditing ? "secondary" : "default"}
            >
              {isEditing ? "Cancel Editing" : "Edit Profile"}
            </Button>
          </CardFooter>
        </Card>

        {/* User Details Section */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Information</CardTitle>
                  <CardDescription>
                    View and manage user profile details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first_name">First Name</Label>
                          <Input 
                            id="first_name" 
                            value={editedUser.first_name || ''} 
                            onChange={(e) => setEditedUser({...editedUser, first_name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last_name">Last Name</Label>
                          <Input 
                            id="last_name" 
                            value={editedUser.last_name || ''} 
                            onChange={(e) => setEditedUser({...editedUser, last_name: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={editedUser.email || ''} 
                          onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select 
                          value={editedUser.role} 
                          onValueChange={(value: 'admin' | 'attendant') => 
                            setEditedUser({...editedUser, role: value})
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrator</SelectItem>
                            <SelectItem value="attendant">Lab Attendant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="is_active">Account Status</Label>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="is_active" 
                            checked={editedUser.is_active} 
                            onCheckedChange={(checked) => 
                              setEditedUser({...editedUser, is_active: checked})
                            }
                          />
                          <Label htmlFor="is_active">{editedUser.is_active ? 'Active' : 'Inactive'}</Label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">First Name</p>
                          <p>{user.first_name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                          <p>{user.last_name}</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p>{user.email}</p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Role</p>
                        <p>{user.role === 'admin' ? 'Administrator' : 'Lab Attendant'}</p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Join Date</p>
                        <p>{formatDate(user.join_date)}</p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Last Login</p>
                        <p>{user.last_login ? formatDate(user.last_login) : 'Never'}</p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Account Status</p>
                        <Badge variant={user.is_active ? 'outline' : 'destructive'}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
                {isEditing && (
                  <CardFooter>
                    <Button 
                      onClick={handleSaveChanges} 
                      className="w-full"
                      disabled={isLoadingUsers}
                    >
                      {isLoadingUsers ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="activity" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>
                    Recent actions performed by this user
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="py-10 text-center text-muted-foreground">
                    <p>Activity tracking coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
