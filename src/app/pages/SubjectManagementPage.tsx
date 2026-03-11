import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search, Plus, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { useAppData } from '../context/AppDataContext';

export default function SubjectManagementPage() {
  const { subjects, addSubject } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', credits: 3, instructor: 'Admin Managed' });

  const filteredSubjects = useMemo(() => subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  ), [subjects, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-semibold">Subject Management</h1><p className="text-gray-500 mt-1">Manage courses used by the web application</p></div><Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}><DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Add Subject</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Add New Subject</DialogTitle><DialogDescription>Enter the details for the new subject.</DialogDescription></DialogHeader><div className="space-y-4 py-4"><div><Label>Subject Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div><div><Label>Subject Code</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></div><div><Label>Credits</Label><Input type="number" value={form.credits} onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })} /></div><div><Label>Instructor / Owner</Label><Input value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} /></div><Button className="w-full" onClick={() => { addSubject(form); setForm({ name: '', code: '', credits: 3, instructor: 'Admin Managed' }); setIsDialogOpen(false); }}>Add Subject</Button></div></DialogContent></Dialog></div>
      <Card><CardContent className="pt-6"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><Input placeholder="Search subjects, codes, or instructors..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div></CardContent></Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filteredSubjects.map((subject) => <Card key={subject.id} className="hover:shadow-lg transition-shadow"><CardHeader><div className="flex items-start justify-between"><div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center"><BookOpen className="w-6 h-6 text-blue-600" /></div><span className="text-sm text-gray-500">{subject.code}</span></div><CardTitle className="mt-4">{subject.name}</CardTitle></CardHeader><CardContent><div className="space-y-2 text-sm"><p><span className="text-gray-500">Credits:</span> {subject.credits}</p><p><span className="text-gray-500">Owner:</span> {subject.instructor}</p></div></CardContent></Card>)}</div>
    </div>
  );
}
