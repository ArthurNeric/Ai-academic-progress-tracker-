import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Download, Users, Award, TrendingUp, FileText } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { useAppData } from '../context/AppDataContext';

export default function ReportsPage() {
  const { students, grades, alerts } = useAppData();
  const avgGPA = students.length ? (students.reduce((acc, s) => acc + s.gpa, 0) / students.length).toFixed(2) : '0.00';
  const avgAttendance = students.length ? Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length) : 0;
  const gradeDistribution = ['A','B','C','D','F'].map((g) => ({ grade: g, count: grades.filter((item) => item.grade.startsWith(g)).length }));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-semibold">Academic Reports</h1><p className="text-gray-500 mt-1">Comprehensive analytics and insights</p></div><Button><Download className="w-4 h-4 mr-2" />Export Report</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6"><Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Students</CardTitle><Users className="w-4 h-4 text-gray-500" /></CardHeader><CardContent><div className="text-2xl font-semibold">{students.length}</div></CardContent></Card><Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Average GPA</CardTitle><Award className="w-4 h-4 text-gray-500" /></CardHeader><CardContent><div className="text-2xl font-semibold">{avgGPA}</div></CardContent></Card><Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle><TrendingUp className="w-4 h-4 text-gray-500" /></CardHeader><CardContent><div className="text-2xl font-semibold">{avgAttendance}%</div></CardContent></Card><Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Active Alerts</CardTitle><FileText className="w-4 h-4 text-gray-500" /></CardHeader><CardContent><div className="text-2xl font-semibold">{alerts.length}</div></CardContent></Card></div>
      <Card><CardHeader><CardTitle>Grade Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><BarChart data={gradeDistribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="grade" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#3b82f6" /></BarChart></ResponsiveContainer></CardContent></Card>
    </div>
  );
}
