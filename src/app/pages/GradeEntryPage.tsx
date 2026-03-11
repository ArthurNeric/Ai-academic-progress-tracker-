import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, Plus, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { useAppData } from '../context/AppDataContext';

export default function GradeEntryPage() {
  const { grades, students, subjects, addGrade } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({ studentId: '', subjectId: '', score: 90, date: new Date().toISOString().slice(0, 10) });

  const filteredGrades = useMemo(() => grades.filter((grade) => {
    const matchesSearch = grade.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || grade.subjectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || grade.subjectId === subjectFilter;
    return matchesSearch && matchesSubject;
  }), [grades, searchQuery, subjectFilter]);

  const getGradeColor = (grade: string) => {
    const firstChar = grade[0];
    return firstChar === 'A' ? 'bg-green-100 text-green-800' : firstChar === 'B' ? 'bg-blue-100 text-blue-800' : firstChar === 'C' ? 'bg-yellow-100 text-yellow-800' : firstChar === 'D' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-semibold">Grade Entry</h1><p className="text-gray-500 mt-1">Record and manage student grades</p></div><Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}><DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Add Grade</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Add New Grade</DialogTitle><DialogDescription>Enter grade information for a student.</DialogDescription></DialogHeader><div className="space-y-4 py-4"><div><Label>Student</Label><Select value={form.studentId} onValueChange={(v) => setForm({ ...form, studentId: v })}><SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger><SelectContent>{students.map((student) => <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>)}</SelectContent></Select></div><div><Label>Subject</Label><Select value={form.subjectId} onValueChange={(v) => setForm({ ...form, subjectId: v })}><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger><SelectContent>{subjects.map((subject) => <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>)}</SelectContent></Select></div><div><Label>Score</Label><Input type="number" value={form.score} onChange={(e) => setForm({ ...form, score: Number(e.target.value) })} /></div><div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div><Button className="w-full" onClick={() => { addGrade(form); setIsDialogOpen(false); }}><Save className="w-4 h-4 mr-2" />Save Grade</Button></div></DialogContent></Dialog></div>
      <Card><CardContent className="pt-6"><div className="flex flex-col sm:flex-row gap-4"><div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><Input placeholder="Search by student or subject..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div><div className="sm:w-56"><Select value={subjectFilter} onValueChange={setSubjectFilter}><SelectTrigger><SelectValue placeholder="Filter by subject" /></SelectTrigger><SelectContent><SelectItem value="all">All Subjects</SelectItem>{subjects.map((subject) => <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>)}</SelectContent></Select></div></div></CardContent></Card>
      <Card><CardHeader><CardTitle>Grade Records ({filteredGrades.length})</CardTitle></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b"><th className="text-left py-3 px-4 font-medium">Student</th><th className="text-left py-3 px-4 font-medium">Subject</th><th className="text-left py-3 px-4 font-medium">Score</th><th className="text-left py-3 px-4 font-medium">Grade</th><th className="text-left py-3 px-4 font-medium">Date</th></tr></thead><tbody>{filteredGrades.map((grade) => <tr key={grade.id} className="border-b hover:bg-gray-50"><td className="py-3 px-4">{grade.studentName}</td><td className="py-3 px-4">{grade.subjectName}</td><td className="py-3 px-4">{grade.score}%</td><td className="py-3 px-4"><Badge className={getGradeColor(grade.grade)}>{grade.grade}</Badge></td><td className="py-3 px-4 text-gray-600">{grade.date}</td></tr>)}</tbody></table></div>{filteredGrades.length === 0 && <div className="text-center py-12 text-gray-500">No grades found matching your criteria</div>}</CardContent></Card>
    </div>
  );
}
