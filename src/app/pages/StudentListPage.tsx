import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Search, Filter, Eye, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { useAppData } from '../context/AppDataContext';

export default function StudentListPage() {
  const { students, addStudent } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', grade: '10th Grade' });

  const filteredStudents = useMemo(() => students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [students, searchQuery, statusFilter]);

  const getStatusColor = (status: string) => ({ excellent: 'bg-green-100 text-green-800', good: 'bg-blue-100 text-blue-800', 'at-risk': 'bg-orange-100 text-orange-800', critical: 'bg-red-100 text-red-800' }[status] || 'bg-gray-100 text-gray-800');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-semibold">Student List</h1><p className="text-gray-500 mt-1">Manage and monitor enrolled students</p></div><Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}><DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Add Student</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Add Student</DialogTitle><DialogDescription>Create a new student profile.</DialogDescription></DialogHeader><div className="space-y-3 py-4"><div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div><div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div><div><Label>Grade</Label><Input value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} /></div><Button className="w-full" onClick={() => { addStudent(form); setForm({ name: '', email: '', grade: '10th Grade' }); setIsDialogOpen(false); }}>Save Student</Button></div></DialogContent></Dialog></div>
      <Card><CardContent className="pt-6"><div className="flex flex-col sm:flex-row gap-4"><div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><Input placeholder="Search by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div><div className="sm:w-48"><Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Filter by status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="excellent">Excellent</SelectItem><SelectItem value="good">Good</SelectItem><SelectItem value="at-risk">At Risk</SelectItem><SelectItem value="critical">Critical</SelectItem></SelectContent></Select></div></div></CardContent></Card>
      <Card><CardHeader><CardTitle>Students ({filteredStudents.length})</CardTitle></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b"><th className="text-left py-3 px-4 font-medium">Student</th><th className="text-left py-3 px-4 font-medium">Grade</th><th className="text-left py-3 px-4 font-medium">GPA</th><th className="text-left py-3 px-4 font-medium">Attendance</th><th className="text-left py-3 px-4 font-medium">Status</th><th className="text-left py-3 px-4 font-medium">Actions</th></tr></thead><tbody>{filteredStudents.map((student) => <tr key={student.id} className="border-b hover:bg-gray-50"><td className="py-3 px-4"><p className="font-medium">{student.name}</p><p className="text-sm text-gray-500">{student.email}</p></td><td className="py-3 px-4">{student.grade}</td><td className="py-3 px-4">{student.gpa.toFixed(2)}</td><td className="py-3 px-4">{student.attendance}%</td><td className="py-3 px-4"><Badge className={getStatusColor(student.status)}>{student.status}</Badge></td><td className="py-3 px-4"><Link to={`/admin/students/${student.id}`}><Button variant="ghost" size="sm"><Eye className="w-4 h-4 mr-2" />View</Button></Link></td></tr>)}</tbody></table></div>{filteredStudents.length === 0 && <div className="text-center py-12 text-gray-500">No students found matching your criteria</div>}</CardContent></Card>
    </div>
  );
}
