import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAppData } from '../context/AppDataContext';

export default function AlertsPage() {
  const { alerts, currentUser } = useAppData();
  const visibleAlerts = currentUser?.role === 'student' ? alerts.filter((a) => a.studentId === currentUser.studentId) : alerts;
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-semibold">Alerts</h1><p className="text-gray-500 mt-1">System-generated performance alerts</p></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">{['low','medium','high','critical'].map((severity) => <Card key={severity}><CardHeader className="pb-2"><CardTitle className="text-sm font-medium capitalize">{severity}</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold">{visibleAlerts.filter((a) => a.severity === severity).length}</div></CardContent></Card>)}</div>
      <Card><CardHeader><CardTitle>Alert Records ({visibleAlerts.length})</CardTitle></CardHeader><CardContent className="space-y-3">{visibleAlerts.map((alert) => <div key={alert.id} className="border rounded-lg p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{alert.studentName}</p><p className="text-sm text-gray-500 capitalize">{alert.type} alert</p><p className="mt-2">{alert.message}</p><p className="text-xs text-gray-400 mt-2">Generated: {alert.date}</p></div><Badge>{alert.severity}</Badge></div></div>)}{!visibleAlerts.length ? <p className="text-gray-500">No alerts found.</p> : null}</CardContent></Card>
    </div>
  );
}
