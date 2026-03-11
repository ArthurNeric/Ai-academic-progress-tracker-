import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  mockAssignments,
  mockAttendance,
  mockGrades,
  mockStudents,
  mockSubjects,
  type Assignment,
  type Attendance,
  type Grade,
  type Recommendation,
  type Alert,
  type Student,
  type Subject,
} from '../data/mockData';

export type UserRole = 'admin' | 'student';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  studentId?: string;
  lastLogin?: string;
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
}

interface AppDataContextType {
  students: Student[];
  subjects: Subject[];
  grades: Grade[];
  attendance: Attendance[];
  assignments: Assignment[];
  alerts: Alert[];
  recommendations: Recommendation[];
  users: User[];
  currentUser: AuthUser | null;
  login: (email: string, password: string, role: UserRole) => { ok: boolean; message?: string };
  logout: () => void;
  addStudent: (payload: { name: string; email: string; grade: string }) => void;
  addSubject: (payload: { name: string; code: string; credits: number; instructor: string }) => void;
  addGrade: (payload: { studentId: string; subjectId: string; score: number; date: string }) => void;
  addAttendance: (payload: { studentId: string; subjectId: string; status: Attendance['status']; date: string }) => void;
  addAssignment: (payload: { title: string; subjectId: string; studentId?: string; dueDate: string; status: Assignment['status']; maxScore: number; score?: number }) => void;
  addUser: (payload: { name: string; email: string; role: UserRole; password: string }) => void;
}

const STORAGE_KEY = 'academic-tracker-state-v1';
const AUTH_KEY = 'academic-tracker-auth-v1';

function scoreToLetter(score: number): string {
  if (score >= 97) return 'A+';
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 67) return 'D+';
  if (score >= 60) return 'D';
  return 'F';
}

function scoreToGpa(score: number): number {
  if (score >= 97) return 4.0;
  if (score >= 93) return 4.0;
  if (score >= 90) return 3.7;
  if (score >= 87) return 3.3;
  if (score >= 83) return 3.0;
  if (score >= 80) return 2.7;
  if (score >= 77) return 2.3;
  if (score >= 73) return 2.0;
  if (score >= 70) return 1.7;
  if (score >= 67) return 1.3;
  if (score >= 60) return 1.0;
  return 0.0;
}

function computeAttendancePercent(records: Attendance[], studentId: string) {
  const studentRecords = records.filter((r) => r.studentId === studentId);
  if (!studentRecords.length) return 100;
  const presentPoints = studentRecords.reduce((sum, record) => {
    if (record.status === 'present') return sum + 1;
    if (record.status === 'late' || record.status === 'excused') return sum + 0.5;
    return sum;
  }, 0);
  return Math.round((presentPoints / studentRecords.length) * 100);
}

function deriveStudents(baseStudents: Student[], grades: Grade[], attendance: Attendance[]): Student[] {
  return baseStudents.map((student) => {
    const studentGrades = grades.filter((g) => g.studentId === student.id);
    const avgScore = studentGrades.length
      ? studentGrades.reduce((sum, grade) => sum + grade.score, 0) / studentGrades.length
      : 85;
    const gpa = Number(scoreToGpa(avgScore).toFixed(2));
    const attendanceRate = computeAttendancePercent(attendance, student.id);
    let status: Student['status'] = 'good';
    if (avgScore >= 90 && attendanceRate >= 95) status = 'excellent';
    else if (avgScore >= 80 && attendanceRate >= 85) status = 'good';
    else if (avgScore >= 70 || attendanceRate >= 75) status = 'at-risk';
    else status = 'critical';
    return { ...student, gpa, attendance: attendanceRate, status };
  });
}

function deriveAlerts(students: Student[], assignments: Assignment[]): Alert[] {
  const alerts: Alert[] = [];
  students.forEach((student) => {
    if (student.attendance < 75) {
      alerts.push({
        id: `alert-att-${student.id}`,
        studentId: student.id,
        studentName: student.name,
        type: 'attendance',
        severity: student.attendance < 60 ? 'critical' : 'high',
        message: `Attendance dropped to ${student.attendance}%. Immediate monitoring is recommended.`,
        date: new Date().toISOString().slice(0, 10),
        resolved: false,
      });
    }
    if (student.gpa < 2.5) {
      alerts.push({
        id: `alert-grade-${student.id}`,
        studentId: student.id,
        studentName: student.name,
        type: 'grade',
        severity: student.gpa < 1.5 ? 'critical' : 'medium',
        message: `Current GPA is ${student.gpa.toFixed(2)}. Academic support is recommended.`,
        date: new Date().toISOString().slice(0, 10),
        resolved: false,
      });
    }
    const overdueCount = assignments.filter((a) => a.status === 'overdue').length;
    if (overdueCount > 0 && (student.status === 'at-risk' || student.status === 'critical')) {
      alerts.push({
        id: `alert-assign-${student.id}`,
        studentId: student.id,
        studentName: student.name,
        type: 'assignment',
        severity: overdueCount > 1 ? 'high' : 'medium',
        message: `There are overdue assignment records that need attention.`,
        date: new Date().toISOString().slice(0, 10),
        resolved: false,
      });
    }
  });
  return alerts;
}

function deriveRecommendations(alerts: Alert[]): Recommendation[] {
  return alerts.map((alert) => ({
    id: `rec-${alert.id}`,
    studentId: alert.studentId,
    studentName: alert.studentName,
    type: alert.type === 'grade' ? 'academic' : alert.severity === 'critical' ? 'intervention' : 'academic',
    priority: alert.severity === 'critical' || alert.severity === 'high' ? 'high' : alert.severity === 'medium' ? 'medium' : 'low',
    date: alert.date,
    message:
      alert.type === 'attendance'
        ? 'Set a follow-up meeting and monitor attendance weekly.'
        : alert.type === 'assignment'
          ? 'Review pending work and provide a catch-up schedule.'
          : 'Provide study support and review weak subject areas.',
  }));
}

function buildInitialState() {
  const baseStudents = mockStudents;
  const subjects = mockSubjects;
  const grades = mockGrades;
  const attendance = mockAttendance;
  const assignments = mockAssignments;
  const students = deriveStudents(baseStudents, grades, attendance);
  const alerts = deriveAlerts(students, assignments);
  const recommendations = deriveRecommendations(alerts);
  const users: User[] = [
    {
      id: 'user-admin',
      name: 'Admin User',
      email: 'admin@school.edu',
      password: 'admin123',
      role: 'admin',
      status: 'active',
      lastLogin: '',
    },
    ...students.map((student) => ({
      id: `user-${student.id}`,
      name: student.name,
      email: student.email,
      password: 'student123',
      role: 'student' as const,
      status: 'active' as const,
      studentId: student.id,
      lastLogin: '',
    })),
  ];
  return { baseStudents, students, subjects, grades, attendance, assignments, alerts, recommendations, users };
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const initial = useMemo(() => {
    if (typeof window === 'undefined') return buildInitialState();
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const students = deriveStudents(parsed.baseStudents, parsed.grades, parsed.attendance);
      return {
        ...parsed,
        students,
        alerts: deriveAlerts(students, parsed.assignments),
        recommendations: deriveRecommendations(deriveAlerts(students, parsed.assignments)),
      };
    }
    return buildInitialState();
  }, []);

  const [baseStudents, setBaseStudents] = useState<Student[]>(initial.baseStudents);
  const [subjects, setSubjects] = useState<Subject[]>(initial.subjects);
  const [grades, setGrades] = useState<Grade[]>(initial.grades);
  const [attendance, setAttendance] = useState<Attendance[]>(initial.attendance);
  const [assignments, setAssignments] = useState<Assignment[]>(initial.assignments);
  const [users, setUsers] = useState<User[]>(initial.users);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  const students = useMemo(() => deriveStudents(baseStudents, grades, attendance), [baseStudents, grades, attendance]);
  const alerts = useMemo(() => deriveAlerts(students, assignments), [students, assignments]);
  const recommendations = useMemo(() => deriveRecommendations(alerts), [alerts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ baseStudents, subjects, grades, attendance, assignments, users }));
  }, [baseStudents, subjects, grades, attendance, assignments, users]);

  useEffect(() => {
    if (currentUser) localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
    else localStorage.removeItem(AUTH_KEY);
  }, [currentUser]);

  const login = (email: string, password: string, role: UserRole) => {
    const found = users.find((user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password && user.role === role && user.status === 'active');
    if (!found) return { ok: false, message: 'Invalid credentials or role.' };
    const authUser: AuthUser = { id: found.id, name: found.name, email: found.email, role: found.role, studentId: found.studentId };
    setCurrentUser(authUser);
    setUsers((prev) => prev.map((user) => user.id === found.id ? { ...user, lastLogin: new Date().toISOString().slice(0, 10) } : user));
    return { ok: true };
  };

  const logout = () => setCurrentUser(null);

  const addStudent = (payload: { name: string; email: string; grade: string }) => {
    const id = String(Date.now());
    const student: Student = { id, name: payload.name, email: payload.email, grade: payload.grade, gpa: 0, attendance: 100, status: 'good' };
    setBaseStudents((prev) => [student, ...prev]);
    setUsers((prev) => [{ id: `user-${id}`, name: payload.name, email: payload.email, password: 'student123', role: 'student', status: 'active', studentId: id, lastLogin: '' }, ...prev]);
  };

  const addSubject = (payload: { name: string; code: string; credits: number; instructor: string }) => {
    const id = String(Date.now());
    setSubjects((prev) => [{ id, ...payload }, ...prev]);
  };

  const addGrade = (payload: { studentId: string; subjectId: string; score: number; date: string }) => {
    const student = students.find((s) => s.id === payload.studentId);
    const subject = subjects.find((s) => s.id === payload.subjectId);
    if (!student || !subject) return;
    setGrades((prev) => [{ id: String(Date.now()), studentId: student.id, studentName: student.name, subjectId: subject.id, subjectName: subject.name, score: payload.score, grade: scoreToLetter(payload.score), date: payload.date }, ...prev]);
  };

  const addAttendance = (payload: { studentId: string; subjectId: string; status: Attendance['status']; date: string }) => {
    const student = students.find((s) => s.id === payload.studentId);
    const subject = subjects.find((s) => s.id === payload.subjectId);
    if (!student || !subject) return;
    setAttendance((prev) => [{ id: String(Date.now()), studentId: student.id, studentName: student.name, subjectId: subject.id, subjectName: subject.name, status: payload.status, date: payload.date }, ...prev]);
  };

  const addAssignment = (payload: { title: string; subjectId: string; studentId?: string; dueDate: string; status: Assignment['status']; maxScore: number; score?: number }) => {
    const subject = subjects.find((s) => s.id === payload.subjectId);
    if (!subject) return;
    setAssignments((prev) => [{ id: String(Date.now()), title: payload.title, subjectId: subject.id, subjectName: subject.name, dueDate: payload.dueDate, status: payload.status, maxScore: payload.maxScore, score: payload.score }, ...prev]);
  };

  const addUser = (payload: { name: string; email: string; role: UserRole; password: string }) => {
    const id = `user-${Date.now()}`;
    setUsers((prev) => [{ id, name: payload.name, email: payload.email, role: payload.role, password: payload.password, status: 'active', lastLogin: '' }, ...prev]);
  };

  return (
    <AppDataContext.Provider value={{ students, subjects, grades, attendance, assignments, alerts, recommendations, users, currentUser, login, logout, addStudent, addSubject, addGrade, addAttendance, addAssignment, addUser }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used inside AppDataProvider');
  return context;
}
