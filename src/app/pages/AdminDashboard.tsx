import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Users, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';
import { Link } from 'react-router';
import { useAppData } from '../context/AppDataContext';

export default function AdminDashboard() {
  const { students, alerts, recommendations } = useAppData();
  const totalStudents = students.length;
  const atRiskStudents = students.filter((s) => s.status === 'at-risk' || s.status === 'critical').length;
  const activeAlerts = alerts.filter((a) => !a.resolved).length;
  const averageAttendance = totalStudents ? Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / totalStudents) : 0;

  const statusDistribution = [
    { name: 'Excellent', value: students.filter((s) => s.status === 'excellent').length, color: '#10b981' },
    { name: 'Good', value: students.filter((s) => s.status === 'good').length, color: '#3b82f6' },
    { name: 'At Risk', value: students.filter((s) => s.status === 'at-risk').length, color: '#f59e0b' },
    { name: 'Critical', value: students.filter((s) => s.status === 'critical').length, color: '#ef4444' },
  ];

  const avgGpa = totalStudents ? Number((students.reduce((acc, s) => acc + s.gpa, 0) / totalStudents).toFixed(2)) : 0;
  const performanceTrend = [
    { month: 'Jan', avgGPA: Math.max(2.0, avgGpa - 0.3) },
    { month: 'Feb', avgGPA: Math.max(2.2, avgGpa - 0.2) },
    { month: 'Mar', avgGPA: Math.max(2.4, avgGpa - 0.1) },
    { month: 'Apr', avgGPA: avgGpa },
  ];

  const alertsByType = [
    { type: 'Attendance', count: alerts.filter((a) => a.type === 'attendance').length },
    { type: 'Grades', count: alerts.filter((a) => a.type === 'grade').length },
    { type: 'Assignments', count: alerts.filter((a) => a.type === 'assignment').length },
    { type: 'Behavior', count: alerts.filter((a) => a.type === 'behavior').length },
  ];

  const recentAlerts = alerts.slice(0, 5);
  const highPriorityRecommendations = recommendations.filter((r) => r.priority === 'high').slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of academic performance and alerts</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Students</CardTitle><Users className="w-4 h-4 text-gray-500" /></CardHeader><CardContent><div className="text-2xl font-semibold">{totalStudents}</div><p className="text-xs text-gray-500 mt-1">Active enrollments</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">At-Risk Students</CardTitle><AlertTriangle className="w-4 h-4 text-orange-500" /></CardHeader><CardContent><div className="text-2xl font-semibold text-orange-600">{atRiskStudents}</div><p className="text-xs text-gray-500 mt-1">Require intervention</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Active Alerts</CardTitle><AlertTriangle className="w-4 h-4 text-red-500" /></CardHeader><CardContent><div className="text-2xl font-semibold text-red-600">{activeAlerts}</div><p className="text-xs text-gray-500 mt-1">Pending actions</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle><Calendar className="w-4 h-4 text-gray-500" /></CardHeader><CardContent><div className="text-2xl font-semibold">{averageAttendance}%</div><p className="text-xs text-green-600 flex items-center mt-1"><TrendingUp className="w-3 h-3 mr-1" />Updated from stored records</p></CardContent></Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle>Average GPA Trend</CardTitle><CardDescription>School-wide performance over time</CardDescription></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><AreaChart data={performanceTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis domain={[0, 4]} /><Tooltip /><Area type="monotone" dataKey="avgGPA" stroke="#3b82f6" fill="#93c5fd" /></AreaChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle>Student Status Distribution</CardTitle><CardDescription>Performance classification breakdown</CardDescription></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={statusDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{statusDistribution.map((entry, index) => <Cell key={index} fill={entry.color} />)}</Pie></PieChart></ResponsiveContainer></CardContent></Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle>Alerts by Type</CardTitle><CardDescription>Distribution of system-generated alerts</CardDescription></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={alertsByType}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="type" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="count" fill="#ef4444" /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle>Quick Links</CardTitle><CardDescription>Jump to the modules you need</CardDescription></CardHeader><CardContent className="grid grid-cols-2 gap-3">{['/admin/students','/admin/grades','/admin/attendance','/admin/reports'].map((path) => <Link key={path} to={path} className="rounded-lg border p-4 hover:bg-gray-50 text-sm font-medium">{path.split('/').pop()}</Link>)}</CardContent></Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle>Recent Alerts</CardTitle></CardHeader><CardContent className="space-y-3">{recentAlerts.length ? recentAlerts.map((alert) => <div key={alert.id} className="p-3 rounded-lg border"><div className="flex items-center justify-between gap-3"><div><p className="font-medium">{alert.studentName}</p><p className="text-sm text-gray-500">{alert.message}</p></div><Badge>{alert.severity}</Badge></div></div>) : <p className="text-gray-500">No alerts generated yet.</p>}</CardContent></Card>
        <Card><CardHeader><CardTitle>Priority Recommendations</CardTitle></CardHeader><CardContent className="space-y-3">{highPriorityRecommendations.length ? highPriorityRecommendations.map((rec) => <div key={rec.id} className="p-3 rounded-lg border"><p className="font-medium">{rec.studentName}</p><p className="text-sm text-gray-500">{rec.message}</p></div>) : <p className="text-gray-500">No high-priority recommendations right now.</p>}</CardContent></Card>
      </div>
    </div>
  );
}
