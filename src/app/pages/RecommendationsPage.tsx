import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAppData } from '../context/AppDataContext';

export default function RecommendationsPage() {
  const { recommendations, currentUser } = useAppData();
  const visibleRecommendations = currentUser?.role === 'student' ? recommendations.filter((r) => r.studentId === currentUser.studentId) : recommendations;
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-semibold">Recommendations</h1><p className="text-gray-500 mt-1">Suggested actions based on alert analysis</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{['low','medium','high'].map((priority) => <Card key={priority}><CardHeader className="pb-2"><CardTitle className="text-sm font-medium capitalize">{priority} Priority</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold">{visibleRecommendations.filter((r) => r.priority === priority).length}</div></CardContent></Card>)}</div>
      <Card><CardHeader><CardTitle>Recommendation Records ({visibleRecommendations.length})</CardTitle></CardHeader><CardContent className="space-y-3">{visibleRecommendations.map((rec) => <div key={rec.id} className="border rounded-lg p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{rec.studentName}</p><p className="text-sm text-gray-500 capitalize">{rec.type}</p><p className="mt-2">{rec.message}</p><p className="text-xs text-gray-400 mt-2">Generated: {rec.date}</p></div><Badge>{rec.priority}</Badge></div></div>)}{!visibleRecommendations.length ? <p className="text-gray-500">No recommendations found.</p> : null}</CardContent></Card>
    </div>
  );
}
