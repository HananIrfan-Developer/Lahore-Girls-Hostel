import { Timestamp } from 'firebase/firestore';

export type Role = 'admin' | 'owner' | 'staff' | 'student' | 'public';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: Role;
  createdAt: Timestamp;
}

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  fatherName?: string;
  cnicNumber?: string;
  phoneNumber?: string;
  role: Role;
  createdAt: any;
  roomNumber?: string;
  contactDetails?: string;
  guardianInfo?: string;
  photoUrl?: string;
  status?: 'inside' | 'outside';
}

export type ResidentStatus = 'inside' | 'outside';

export interface Resident {
  id: string;
  name: string;
  roomNumber: string;
  contactDetails: string;
  guardianInfo: string;
  photoUrl?: string;
  status: ResidentStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type AttendanceStatus = 'present' | 'absent';

export interface Attendance {
  id: string;
  residentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  markedBy: string;
  timestamp: Timestamp;
}

export type LogType = 'entry' | 'exit';

export interface InOutLog {
  id: string;
  residentId: string;
  type: LogType;
  timestamp: Timestamp;
  markedBy: string;
}
