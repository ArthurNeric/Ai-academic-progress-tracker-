import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, Plus, Calendar, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { useAppData } from '../context/AppDataContext';

export default function AssignmentTrackingPage() {
  const { assignments, subjects, addAssignment } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: '', subjectId: '', dueDate: new Date().toISOString().slice(0,10), status: 'pending' as const, maxScore: 100, score: undefined as number | undefined });

  const filteredAssignments = useMemo(() => assignments.filter((assignment) => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) || assignment.subjectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [assignments, searchQuery, statusFilter]);

  const getStatusVariant = (status: string) => status === 'graded' ? 'default' : status === 'submitted' ? 'secondary' : status === 'pending' ? 'outline' : 'destructive';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-semibold">Assignment Tracking</h1><p className="text-gray-500 mt-1">Monitor assignments and submissions</p></div><Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}><DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Add Assignment</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Add Assignment</DialogTitle><DialogDescription>Create a new assignment record.</DialogDescription></DialogHeader><div className="space-y-4 py-4"><div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div><div><Label>Subject</Label><Select value={form.subjectId} onValueChange={(v) => setForm({ ...form, subjectId: v })}><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger><SelectContent>{subjects.map((subject) => <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>)}</SelectContent></Select></div><div><Label>Due Date</Label><Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></div><div><Label>Status</Label><Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="submitted">Submitted</SelectItem><SelectItem value="graded">Graded</SelectItem><SelectItem value="overdue">Overdue</SelectItem></SelectContent></Select></div><div><Label>Max Score</Label><Input type="number" value={form.maxScore} onChange={(e) => setForm({ ...form, maxScore: Number(e.target.value) })} /></div><Button className="w-full" onClick={() => { addAssignment(form); setIsDialogOpen(false); }}>Save Assignment</Button></div></DialogContent></Dialog></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6"><Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Assignments</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold">{assignments.length}</div></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Pending</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold text-orange-600">{assignments.filter((a) => a.status === 'pending').length}</div></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Submitted</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold text-blue-600">{assignments.filter((a) => a.status === 'submitted').length}</div></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Overdue</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold text-red-600">{assignments.filter((a) => a.status === 'overdue').length}</div></CardContent></Card></div>
      <Card><CardContent className="pt-6"><div className="flex flex-col sm:flex-row gap-4"><div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><Input placeholder="Search assignments..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div><div className="sm:w-48"><Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger><SelectValue placeholder="Filter by status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="submitted">Submitted</SelectItem><SelectItem value="graded">Graded</SelectItem><SelectItem value="overdue">Overdue</SelectItem></SelectContent></Select></div></div></CardContent></Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filteredAssignments.map((assignment) => <Card key={assignment.id} className="hover:shadow-lg transition-shadow"><CardHeader><div className="flex items-start justify-between"><Badge variant={getStatusVariant(assignment.status)}>{assignment.status}</Badge>{assignment.status === 'overdue' ? <Clock className="w-5 h-5 text-red-500" /> : null}</div><CardTitle className="mt-3">{assignment.title}</CardTitle></CardHeader><CardContent><div className="space-y-3"><div><p className="text-sm text-gray-500">Subject</p><p className="font-medium">{assignment.subjectName}</p></div><div><p className="text-sm text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" />Due Date</p><p className="font-medium">{assignment.dueDate}</p></div>{assignment.score !== undefined ? <div className="pt-3 border-t"><p className="text-sm text-gray-500">Score</p><p className="font-medium">{assignment.score}/{assignment.maxScore}</p></div> : null}</div></CardContent></Card>)}</div>
    </div>
  );
}
