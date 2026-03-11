import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Calendar, Bell, Award, Clock } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

export default function StudentDashboard() {
  const { currentUser, students, assignments, alerts, recommendations, grades } = useAppData();
  const student = students.find((s) => s.id === currentUser?.studentId) || students[0];
  const studentAssignments = assignments.slice(0, 4);
  const studentAlerts = alerts.filter((a) => a.studentId === student?.id && !a.resolved);
  const studentRecommendations = recommendations.filter((r) => r.studentId === student?.id);
  const studentGrades = grades.filter((g) => g.studentId === student?.id);
  const gradeData = studentGrades.slice(0, 6).reverse().map((g, index) => ({ month: `R${index + 1}`, gpa: Number((g.score / 25).toFixed(2)) }));
  const subjectScores = studentGrades.slice(0, 5).map((g) => ({ subject: g.subjectName.slice(0, 8), score: g.score }));
  if (!student) return null;

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-semibold">Welcome back, {student.name}</h1><p className="text-gray-500 mt-1">Here is your academic progress overview</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Current GPA</CardTitle><Award className="w-4 h-4 text-gray-500" /></CardHeader><CardContent><div className="text-2xl font-semibold">{student.gpa.toFixed(2)}</div><p className="text-xs text-green-600 flex items-center mt-1"><TrendingUp className="w-3 h-3 mr-1" />Based on recorded grades</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Attendance</CardTitle><Calendar className="w-4 h-4 text-gray-500" /></CardHeader><CardContent><div className="text-2xl font-semibold">{student.attendance}%</div><Progress value={student.attendance} className="mt-2" /></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Pending Tasks</CardTitle><Clock className="w-4 h-4 text-gray-500" /></CardHeader><CardContent><div className="text-2xl font-semibold">{studentAssignments.filter((a) => a.status === 'pending' || a.status === 'overdue').length}</div><p className="text-xs text-gray-500 mt-1">assignments due</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Active Alerts</CardTitle><Bell className="w-4 h-4 text-gray-500" /></CardHeader><CardContent><div className="text-2xl font-semibold">{studentAlerts.length}</div><p className="text-xs text-gray-500 mt-1">system notifications</p></CardContent></Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle>Grade Trend</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><LineChart data={gradeData.length ? gradeData : [{ month: 'R1', gpa: student.gpa }]}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis domain={[0, 4]} /><Tooltip /><Line type="monotone" dataKey="gpa" stroke="#3b82f6" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle>Subject Scores</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={subjectScores.length ? subjectScores : [{ subject: 'No Data', score: 0 }]}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="subject" /><YAxis domain={[0, 100]} /><Tooltip /><Bar dataKey="score" fill="#3b82f6" /></BarChart></ResponsiveContainer></CardContent></Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle>Alerts</CardTitle></CardHeader><CardContent className="space-y-3">{studentAlerts.length ? studentAlerts.map((alert) => <div key={alert.id} className="border rounded-lg p-3"><div className="flex items-center justify-between"><p className="font-medium">{alert.type}</p><Badge>{alert.severity}</Badge></div><p className="text-sm text-gray-500 mt-1">{alert.message}</p></div>) : <p className="text-gray-500">No active alerts.</p>}</CardContent></Card>
        <Card><CardHeader><CardTitle>Recommendations</CardTitle></CardHeader><CardContent className="space-y-3">{studentRecommendations.length ? studentRecommendations.map((rec) => <div key={rec.id} className="border rounded-lg p-3"><div className="flex items-center justify-between"><p className="font-medium">{rec.type}</p><Badge>{rec.priority}</Badge></div><p className="text-sm text-gray-500 mt-1">{rec.message}</p></div>) : <p className="text-gray-500">No recommendations yet.</p>}</CardContent></Card>
      </div>
    </div>
  );
}
