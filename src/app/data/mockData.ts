export interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  gpa: number;
  attendance: number;
  status: 'excellent' | 'good' | 'at-risk' | 'critical';
  avatar?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  instructor: string;
}

export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  grade: string;
  score: number;
  date: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
}

export interface Assignment {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  score?: number;
  maxScore: number;
}

export interface Alert {
  id: string;
  studentId: string;
  studentName: string;
  type: 'attendance' | 'grade' | 'behavior' | 'assignment';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  date: string;
  resolved: boolean;
}

export interface Recommendation {
  id: string;
  studentId: string;
  studentName: string;
  type: 'academic' | 'intervention' | 'enrichment';
  message: string;
  priority: 'low' | 'medium' | 'high';
  date: string;
}

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    email: 'emma.johnson@school.edu',
    grade: '10th Grade',
    gpa: 3.8,
    attendance: 95,
    status: 'excellent',
  },
  {
    id: '2',
    name: 'Liam Smith',
    email: 'liam.smith@school.edu',
    grade: '10th Grade',
    gpa: 3.2,
    attendance: 88,
    status: 'good',
  },
  {
    id: '3',
    name: 'Olivia Brown',
    email: 'olivia.brown@school.edu',
    grade: '11th Grade',
    gpa: 2.5,
    attendance: 75,
    status: 'at-risk',
  },
  {
    id: '4',
    name: 'Noah Davis',
    email: 'noah.davis@school.edu',
    grade: '11th Grade',
    gpa: 3.9,
    attendance: 98,
    status: 'excellent',
  },
  {
    id: '5',
    name: 'Ava Wilson',
    email: 'ava.wilson@school.edu',
    grade: '12th Grade',
    gpa: 2.0,
    attendance: 65,
    status: 'critical',
  },
  {
    id: '6',
    name: 'Ethan Martinez',
    email: 'ethan.martinez@school.edu',
    grade: '12th Grade',
    gpa: 3.5,
    attendance: 92,
    status: 'good',
  },
];

export const mockSubjects: Subject[] = [
  { id: '1', name: 'Mathematics', code: 'MATH101', credits: 4, instructor: 'Dr. Sarah Miller' },
  { id: '2', name: 'English Literature', code: 'ENG201', credits: 3, instructor: 'Prof. James Thompson' },
  { id: '3', name: 'Physics', code: 'PHY101', credits: 4, instructor: 'Dr. Michael Chen' },
  { id: '4', name: 'Chemistry', code: 'CHEM101', credits: 4, instructor: 'Dr. Emily Rodriguez' },
  { id: '5', name: 'History', code: 'HIST101', credits: 3, instructor: 'Prof. Robert Anderson' },
  { id: '6', name: 'Computer Science', code: 'CS101', credits: 4, instructor: 'Dr. Lisa Zhang' },
];

export const mockGrades: Grade[] = [
  { id: '1', studentId: '1', studentName: 'Emma Johnson', subjectId: '1', subjectName: 'Mathematics', grade: 'A', score: 92, date: '2026-03-01' },
  { id: '2', studentId: '1', studentName: 'Emma Johnson', subjectId: '2', subjectName: 'English Literature', grade: 'A-', score: 88, date: '2026-03-01' },
  { id: '3', studentId: '2', studentName: 'Liam Smith', subjectId: '1', subjectName: 'Mathematics', grade: 'B', score: 82, date: '2026-03-01' },
  { id: '4', studentId: '2', studentName: 'Liam Smith', subjectId: '3', subjectName: 'Physics', grade: 'B+', score: 85, date: '2026-03-01' },
  { id: '5', studentId: '3', studentName: 'Olivia Brown', subjectId: '2', subjectName: 'English Literature', grade: 'C', score: 72, date: '2026-03-01' },
  { id: '6', studentId: '4', studentName: 'Noah Davis', subjectId: '6', subjectName: 'Computer Science', grade: 'A+', score: 98, date: '2026-03-01' },
];

export const mockAttendance: Attendance[] = [
  { id: '1', studentId: '1', studentName: 'Emma Johnson', subjectId: '1', subjectName: 'Mathematics', date: '2026-03-10', status: 'present' },
  { id: '2', studentId: '1', studentName: 'Emma Johnson', subjectId: '2', subjectName: 'English Literature', date: '2026-03-10', status: 'present' },
  { id: '3', studentId: '2', studentName: 'Liam Smith', subjectId: '1', subjectName: 'Mathematics', date: '2026-03-10', status: 'late' },
  { id: '4', studentId: '3', studentName: 'Olivia Brown', subjectId: '2', subjectName: 'English Literature', date: '2026-03-10', status: 'absent' },
  { id: '5', studentId: '5', studentName: 'Ava Wilson', subjectId: '5', subjectName: 'History', date: '2026-03-10', status: 'absent' },
];

export const mockAssignments: Assignment[] = [
  { id: '1', title: 'Calculus Problem Set 5', subjectId: '1', subjectName: 'Mathematics', dueDate: '2026-03-15', status: 'pending', maxScore: 100 },
  { id: '2', title: 'Shakespeare Essay', subjectId: '2', subjectName: 'English Literature', dueDate: '2026-03-12', status: 'submitted', score: 88, maxScore: 100 },
  { id: '3', title: 'Physics Lab Report', subjectId: '3', subjectName: 'Physics', dueDate: '2026-03-20', status: 'pending', maxScore: 100 },
  { id: '4', title: 'Chemistry Midterm Project', subjectId: '4', subjectName: 'Chemistry', dueDate: '2026-03-08', status: 'overdue', maxScore: 100 },
  { id: '5', title: 'Programming Assignment 3', subjectId: '6', subjectName: 'Computer Science', dueDate: '2026-03-18', status: 'graded', score: 95, maxScore: 100 },
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    studentId: '5',
    studentName: 'Ava Wilson',
    type: 'attendance',
    severity: 'critical',
    message: 'Attendance has dropped below 70%. Immediate intervention recommended.',
    date: '2026-03-09',
    resolved: false,
  },
  {
    id: '2',
    studentId: '3',
    studentName: 'Olivia Brown',
    type: 'grade',
    severity: 'high',
    message: 'GPA has fallen to 2.5. Academic support recommended.',
    date: '2026-03-08',
    resolved: false,
  },
  {
    id: '3',
    studentId: '2',
    studentName: 'Liam Smith',
    type: 'assignment',
    severity: 'medium',
    message: 'Multiple late submissions detected in the last two weeks.',
    date: '2026-03-07',
    resolved: false,
  },
  {
    id: '4',
    studentId: '1',
    studentName: 'Emma Johnson',
    type: 'grade',
    severity: 'low',
    message: 'Slight dip in recent quiz scores. Monitor progress.',
    date: '2026-03-05',
    resolved: true,
  },
];

export const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    studentId: '5',
    studentName: 'Ava Wilson',
    type: 'intervention',
    message: 'Schedule one-on-one tutoring sessions in Mathematics and Chemistry. Consider counseling for attendance issues.',
    priority: 'high',
    date: '2026-03-09',
  },
  {
    id: '2',
    studentId: '3',
    studentName: 'Olivia Brown',
    type: 'intervention',
    message: 'Enroll in after-school study program. Assign peer mentor for English Literature.',
    priority: 'high',
    date: '2026-03-08',
  },
  {
    id: '3',
    studentId: '4',
    studentName: 'Noah Davis',
    type: 'enrichment',
    message: 'Consider enrollment in advanced Computer Science courses or coding competitions.',
    priority: 'medium',
    date: '2026-03-07',
  },
  {
    id: '4',
    studentId: '1',
    studentName: 'Emma Johnson',
    type: 'enrichment',
    message: 'Eligible for honors program. Recommend participation in Math Olympiad.',
    priority: 'medium',
    date: '2026-03-06',
  },
  {
    id: '5',
    studentId: '2',
    studentName: 'Liam Smith',
    type: 'academic',
    message: 'Encourage better time management. Provide study schedule template.',
    priority: 'low',
    date: '2026-03-05',
  },
];
