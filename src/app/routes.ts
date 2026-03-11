import { createBrowserRouter } from "react-router";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StudentListPage from "./pages/StudentListPage";
import StudentProfilePage from "./pages/StudentProfilePage";
import SubjectManagementPage from "./pages/SubjectManagementPage";
import GradeEntryPage from "./pages/GradeEntryPage";
import AttendanceTrackingPage from "./pages/AttendanceTrackingPage";
import AssignmentTrackingPage from "./pages/AssignmentTrackingPage";
import AlertsPage from "./pages/AlertsPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import ReportsPage from "./pages/ReportsPage";
import UserManagementPage from "./pages/UserManagementPage";
import DashboardLayout from "./components/DashboardLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/admin",
    Component: DashboardLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "students", Component: StudentListPage },
      { path: "students/:id", Component: StudentProfilePage },
      { path: "subjects", Component: SubjectManagementPage },
      { path: "grades", Component: GradeEntryPage },
      { path: "attendance", Component: AttendanceTrackingPage },
      { path: "assignments", Component: AssignmentTrackingPage },
      { path: "alerts", Component: AlertsPage },
      { path: "recommendations", Component: RecommendationsPage },
      { path: "reports", Component: ReportsPage },
      { path: "users", Component: UserManagementPage },
    ],
  },
  {
    path: "/student",
    Component: DashboardLayout,
    children: [
      { index: true, Component: StudentDashboard },
      { path: "assignments", Component: AssignmentTrackingPage },
      { path: "alerts", Component: AlertsPage },
      { path: "recommendations", Component: RecommendationsPage },
    ],
  },
]);
