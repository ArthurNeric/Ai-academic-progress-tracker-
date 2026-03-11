import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { useAppData } from '../context/AppDataContext';

export default function AttendanceTrackingPage() {
  const { attendance, students, subjects, addAttendance } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({ studentId: '', subjectId: '', status: 'present' as const, date: new Date().toISOString().slice(0, 10) });

  const filteredAttendance = useMemo(() => attendance.filter((record) => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || record.subjectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [attendance, searchQuery, statusFilter]);

  const getStatusVariant = (status: string) => status === 'present' ? 'default' : status === 'late' ? 'secondary' : status === 'excused' ? 'outline' : 'destructive';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-semibold">Attendance Tracking</h1><p className="text-gray-500 mt-1">Monitor and record student attendance</p></div><Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}><DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Record Attendance</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Record Attendance</DialogTitle><DialogDescription>Mark attendance for a student.</DialogDescription></DialogHeader><div className="space-y-4 py-4"><div><Label>Student</Label><Select value={form.studentId} onValueChange={(v) => setForm({ ...form, studentId: v })}><SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger><SelectContent>{students.map((student) => <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>)}</SelectContent></Select></div><div><Label>Subject</Label><Select value={form.subjectId} onValueChange={(v) => setForm({ ...form, subjectId: v })}><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger><SelectContent>{subjects.map((subject) => <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>)}</SelectContent></Select></div><div><Label>Status</Label><Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger><SelectContent><SelectItem value="present">Present</SelectItem><SelectItem value="late">Late</SelectItem><SelectItem value="absent">Absent</SelectItem><SelectItem value="excused">Excused</SelectItem></SelectContent></Select></div><div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div><Button className="w-full" onClick={() => { addAttendance(form); setIsDialogOpen(false); }}>Save Record</Button></div></DialogContent></Dialog></div>
      <Card><CardContent className="pt-6"><div className="flex flex-col sm:flex-row gap-4"><div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><Input placeholder="Search by student or subject..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div><div className="sm:w-48"><Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger><SelectValue placeholder="Filter by status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="present">Present</SelectItem><SelectItem value="late">Late</SelectItem><SelectItem value="absent">Absent</SelectItem><SelectItem value="excused">Excused</SelectItem></SelectContent></Select></div></div></CardContent></Card>
      <Card><CardHeader><CardTitle>Attendance Records ({filteredAttendance.length})</CardTitle></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b"><th className="text-left py-3 px-4 font-medium">Student</th><th className="text-left py-3 px-4 font-medium">Subject</th><th className="text-left py-3 px-4 font-medium">Date</th><th className="text-left py-3 px-4 font-medium">Status</th></tr></thead><tbody>{filteredAttendance.map((record) => <tr key={record.id} className="border-b hover:bg-gray-50"><td className="py-3 px-4">{record.studentName}</td><td className="py-3 px-4">{record.subjectName}</td><td className="py-3 px-4"><div className="flex items-center gap-2 text-gray-600"><CalendarIcon className="w-4 h-4" />{record.date}</div></td><td className="py-3 px-4"><Badge variant={getStatusVariant(record.status)}>{record.status}</Badge></td></tr>)}</tbody></table></div></CardContent></Card>
    </div>
  );
}
