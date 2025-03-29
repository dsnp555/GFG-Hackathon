export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'doctor' | 'patient';
  assignedTo?: string | string[]; // doctorId for patients, patientIds for doctors
}

export interface Milestone {
  id: string;
  patientId: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  category: string;
  points: number;
}

export interface CareTip {
  id: string;
  title: string;
  description: string;
  category: string;
  doctorId: string;
  patientId: string;
  createdAt: string;
}

export interface Test {
  id: string;
  patientId: string;
  doctorId: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  results?: string;
  category: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (user: Omit<User, 'id'>) => Promise<void>;
  logout: () => void;
}