import { useParams, Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Mail, Award, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

export default function StudentProfilePage() {
  const { id } = useParams();
  const { students, grades, attendance, alerts, recommendations, assignments } = useAppData();
  const student = students.find((s) => s.id === id);
  if (!student) return <div className="text-center py-12"><h2 className="text-2xl font-semibold">Student not found</h2><Link to="/admin/students"><Button className="mt-4">Back to Students</Button></Link></div>;
  const studentGrades = grades.filter((g) => g.studentId === id);
  const studentAttendance = attendance.filter((a) => a.studentId === id);
  const studentAlerts = alerts.filter((a) => a.studentId === id);
  const studentRecommendations = recommendations.filter((r) => r.studentId === id);
  const studentAssignments = assignments.slice(0, 3);
  const gradeHistory = studentGrades.slice(0, 6).reverse().map((g, i) => ({ month: `R${i + 1}`, gpa: Number((g.score / 25).toFixed(2)) }));
  const getStatusColor = (status: string) => ({ excellent: 'bg-green-100 text-green-800', good: 'bg-blue-100 text-blue-800', 'at-risk': 'bg-orange-100 text-orange-800', critical: 'bg-red-100 text-red-800' }[status] || 'bg-gray-100 text-gray-800');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4"><Link to="/admin/students"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button></Link></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1"><CardContent className="pt-6"><div className="text-center"><div className="w-24 h-24 bg-blue-500 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-semibold mb-4">{student.name.split(' ').map((n) => n[0]).join('')}</div><h2 className="text-2xl font-semibold">{student.name}</h2><p className="text-gray-500 flex items-center justify-center gap-2 mt-1"><Mail className="w-4 h-4" />{student.email}</p><Badge className={`${getStatusColor(student.status)} mt-3`}>{student.status}</Badge></div><div className="mt-6 space-y-4"><div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><span className="text-gray-600">Grade Level</span><span className="font-medium">{student.grade}</span></div><div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><span className="text-gray-600">Student ID</span><span className="font-medium">{student.id}</span></div></div></CardContent></Card>
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Current GPA</CardTitle><Award className="w-4 h-4 text-gray-500" /></CardHeader><CardContent><div className="text-2xl font-semibold">{student.gpa.toFixed(2)}</div><p className="text-xs text-green-600 flex items-center mt-1"><TrendingUp className="w-3 h-3 mr-1" />Based on recorded grades</p></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Attendance</CardTitle><Calendar className="w-4 h-4 text-gray-500" /></CardHeader><CardContent><div className="text-2xl font-semibold">{student.attendance}%</div><div className="mt-2 bg-gray-200 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${student.attendance}%` }} /></div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Active Alerts</CardTitle><AlertTriangle className="w-4 h-4 text-gray-500" /></CardHeader><CardContent><div className="text-2xl font-semibold">{studentAlerts.filter((a) => !a.resolved).length}</div><p className="text-xs text-gray-500 mt-1">requires attention</p></CardContent></Card>
          <Card className="sm:col-span-3"><CardHeader><CardTitle>GPA Trend</CardTitle><CardDescription>Academic performance over recorded entries</CardDescription></CardHeader><CardContent><ResponsiveContainer width="100%" height={200}><LineChart data={gradeHistory.length ? gradeHistory : [{ month: 'R1', gpa: student.gpa }]}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis domain={[0, 4]} /><Tooltip /><Line type="monotone" dataKey="gpa" stroke="#3b82f6" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
        </div>
      </div>
      <Card><CardContent className="pt-6"><Tabs defaultValue="grades"><TabsList><TabsTrigger value="grades">Grades</TabsTrigger><TabsTrigger value="attendance">Attendance</TabsTrigger><TabsTrigger value="assignments">Assignments</TabsTrigger><TabsTrigger value="alerts">Alerts</TabsTrigger><TabsTrigger value="recommendations">Recommendations</TabsTrigger></TabsList>
        <TabsContent value="grades" className="mt-6"><div className="space-y-3">{studentGrades.length ? studentGrades.map((grade) => <div key={grade.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"><div><p className="font-medium">{grade.subjectName}</p><p className="text-sm text-gray-500">Recorded: {grade.date}</p></div><div className="text-right"><div className="text-2xl font-semibold">{grade.grade}</div><div className="text-sm text-gray-500">{grade.score}%</div></div></div>) : <p className="text-center text-gray-500 py-8">No grades recorded</p>}</div></TabsContent>
        <TabsContent value="attendance" className="mt-6"><div className="space-y-3">{studentAttendance.length ? studentAttendance.map((record) => <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"><div><p className="font-medium">{record.subjectName}</p><p className="text-sm text-gray-500">{record.date}</p></div><Badge>{record.status}</Badge></div>) : <p className="text-center text-gray-500 py-8">No attendance records</p>}</div></TabsContent>
        <TabsContent value="assignments" className="mt-6"><div className="space-y-3">{studentAssignments.map((assignment) => <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"><div><p className="font-medium">{assignment.title}</p><p className="text-sm text-gray-500">{assignment.subjectName}</p><p className="text-xs text-gray-400 mt-1">Due: {assignment.dueDate}</p></div><div className="text-right"><Badge>{assignment.status}</Badge>{assignment.score ? <p className="text-sm text-gray-500 mt-1">{assignment.score}/{assignment.maxScore}</p> : null}</div></div>)}</div></TabsContent>
        <TabsContent value="alerts" className="mt-6"><div className="space-y-3">{studentAlerts.length ? studentAlerts.map((alert) => <div key={alert.id} className="p-4 rounded-lg border bg-red-50 border-red-200"><div className="flex items-start justify-between"><div className="flex-1"><div className="flex items-center gap-2 mb-2"><Badge>{alert.severity}</Badge></div><p className="text-sm">{alert.message}</p></div></div></div>) : <p className="text-center text-gray-500 py-8">No alerts found</p>}</div></TabsContent>
        <TabsContent value="recommendations" className="mt-6"><div className="space-y-3">{studentRecommendations.length ? studentRecommendations.map((rec) => <div key={rec.id} className="p-4 rounded-lg border bg-blue-50 border-blue-200"><div className="flex items-center justify-between"><p className="font-medium">{rec.type}</p><Badge>{rec.priority}</Badge></div><p className="text-sm mt-2">{rec.message}</p></div>) : <p className="text-center text-gray-500 py-8">No recommendations generated</p>}</div></TabsContent>
      </Tabs></CardContent></Card>
    </div>
  );
}
