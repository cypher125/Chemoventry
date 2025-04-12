'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import PageTitle from '@/components/pageTitle';
import { useUserStore } from '@/store/user';
import { Loader2, AlertTriangle, Pencil, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { format } from 'date-fns';
import { User } from '@/types/user';
import { useRouter } from 'next/navigation';

export default function UserManagementPage() {
  const { users, fetchUsers, addUser, deleteUser, isLoadingUsers, error, currentUser, getCurrentUser } = useUserStore();
  const [newUser, setNewUser] = useState<Partial<User>>({
    is_active: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
    getCurrentUser();
  }, [fetchUsers, getCurrentUser]);

  // Filter users based on role - attendants can only see themselves
  const filteredUsers = users.filter(
    (user) => {
      // If user is not an admin/administrator, only show their own user
      if (currentUser && currentUser.role !== 'admin' && currentUser.role !== 'administrator') {
        return user.id === currentUser.id;
      }
      
      // Admin can see all users, further filtered by search term
      return (
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  );

  const handleAddUser = async () => {
    if (newUser.first_name && newUser.last_name && newUser.email && newUser.role) {
      try {
        await addUser(newUser);
        setNewUser({ is_active: true });
        setOpenDialog(false);
        toast({
          title: "Success",
          description: "User added successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add user. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const viewUserDetails = (id: string) => {
    router.push(`/chemoventry/users/${id}`);
  };

  if (isLoadingUsers && users.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <PageTitle title="User Management" />
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <PageTitle title="User Management" />
        <div className="flex justify-center items-center p-8 text-red-500">
          <AlertTriangle className="h-8 w-8 mr-2" />
          <div>
            <p className="font-semibold">Error loading users</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <PageTitle title="User Management" />
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-sm"
        />
        {currentUser && (currentUser.role === 'admin' || currentUser.role === 'administrator') && (
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">Add User</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Enter the details of the new user to add to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <Label htmlFor="first_name" className="sm:text-right">
                    First Name
                  </Label>
                  <Input
                    id="first_name"
                    value={newUser.first_name || ''}
                    onChange={(e) =>
                      setNewUser({ ...newUser, first_name: e.target.value })
                    }
                    className="sm:col-span-3"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <Label htmlFor="last_name" className="sm:text-right">
                    Last Name
                  </Label>
                  <Input
                    id="last_name"
                    value={newUser.last_name || ''}
                    onChange={(e) =>
                      setNewUser({ ...newUser, last_name: e.target.value })
                    }
                    className="sm:col-span-3"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="sm:text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email || ''}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="sm:col-span-3"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="sm:text-right">
                    Role
                  </Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: 'admin' | 'attendant') =>
                      setNewUser({ ...newUser, role: value })
                    }
                  >
                    <SelectTrigger className="sm:col-span-3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="attendant">Lab Attendant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <Label htmlFor="is_active" className="sm:text-right">
                    Active
                  </Label>
                  <div className="flex items-center sm:col-span-3">
                    <Switch
                      id="is_active"
                      checked={newUser.is_active}
                      onCheckedChange={(checked) =>
                        setNewUser({ ...newUser, is_active: checked })
                      }
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddUser} disabled={isLoadingUsers}>
                  {isLoadingUsers ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add User'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {isLoadingUsers && users.length > 0 && (
        <div className="flex items-center text-xs text-muted-foreground mb-2">
          <Loader2 className="h-3 w-3 animate-spin mr-2" />
          Updating...
        </div>
      )}
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <button 
                      onClick={() => viewUserDetails(user.id)}
                      className="hover:underline text-left cursor-pointer"
                    >
                      {user.first_name} {user.last_name}
                    </button>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.role === 'admin' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {user.role === 'admin' ? 'Administrator' : 'Lab Attendant'}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(user.join_date)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.is_active 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewUserDetails(user.id)}
                        title="Edit user"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={isLoadingUsers}
                        title="Delete user"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Toaster />
    </div>
  );
}
