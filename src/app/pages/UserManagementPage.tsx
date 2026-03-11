import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, UserPlus, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAppData } from '../context/AppDataContext';

export default function UserManagementPage() {
  const { users, addUser } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'student' as const, password: 'student123' });
  const filteredUsers = useMemo(() => users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  }), [users, searchQuery, roleFilter]);
  const getRoleBadgeColor = (role: string) => role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800';
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-semibold">User Management</h1><p className="text-gray-500 mt-1">Manage system users and permissions</p></div><Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}><DialogTrigger asChild><Button><UserPlus className="w-4 h-4 mr-2" />Add User</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Add New User</DialogTitle><DialogDescription>Create a new user account.</DialogDescription></DialogHeader><div className="space-y-4 py-4"><div><Label>Full Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div><div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div><div><Label>Role</Label><Select value={form.role} onValueChange={(v: any) => setForm({ ...form, role: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="student">Student</SelectItem></SelectContent></Select></div><div><Label>Password</Label><Input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div><Button className="w-full" onClick={() => { addUser(form); setIsDialogOpen(false); }}>Create User</Button></div></DialogContent></Dialog></div>
      <Card><CardContent className="pt-6"><div className="flex flex-col sm:flex-row gap-4"><div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><Input placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div><div className="sm:w-48"><Select value={roleFilter} onValueChange={setRoleFilter}><SelectTrigger><SelectValue placeholder="Filter by role" /></SelectTrigger><SelectContent><SelectItem value="all">All Roles</SelectItem><SelectItem value="admin">Admin</SelectItem><SelectItem value="student">Student</SelectItem></SelectContent></Select></div></div></CardContent></Card>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6"><Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Users</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold">{users.length}</div></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Admins</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold text-purple-600">{users.filter((u) => u.role === 'admin').length}</div></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Students</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold text-green-600">{users.filter((u) => u.role === 'student').length}</div></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Active</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold">{users.filter((u) => u.status === 'active').length}</div></CardContent></Card></div>
      <Card><CardHeader><CardTitle>User Accounts</CardTitle></CardHeader><CardContent><div className="space-y-3">{filteredUsers.map((user) => <div key={user.id} className="border rounded-lg p-4 flex items-center justify-between"><div><div className="flex items-center gap-2"><p className="font-medium">{user.name}</p>{user.role === 'admin' ? <Shield className="w-4 h-4 text-purple-600" /> : null}</div><p className="text-sm text-gray-500">{user.email}</p><p className="text-xs text-gray-400 mt-1">Last login: {user.lastLogin || 'Never'}</p></div><Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge></div>)}</div></CardContent></Card>
    </div>
  );
}
