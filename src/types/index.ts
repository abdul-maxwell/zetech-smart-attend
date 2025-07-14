
export interface User {
  id: string;
  user_id: string;
  email: string;
  role: 'student' | 'lecturer' | 'admin';
  first_name: string;
  last_name: string;
  admission_number?: string;
  id_number?: string;
  birth_certificate_number?: string;
  parent_email?: string;
  phone_number?: string;
  department?: string;
  year_of_study?: number;
  force_password_change: boolean;
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: string;
  name: string;
  code: string;
  lecturer_id?: string;
  department: string;
  schedule?: {
    day: string;
    start: string;
    end: string;
    room: string;
  };
  semester: string;
  academic_year: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceLog {
  id: string;
  student_id: string;
  class_id: string;
  timestamp: string;
  method: 'ble' | 'qr' | 'manual';
  beacon_uuid?: string;
  signal_strength?: number;
  marked_by?: string;
  notes?: string;
  created_at: string;
  classes?: {
    name: string;
    code: string;
  };
}

export interface AbsenceRequest {
  id: string;
  student_id: string;
  class_id: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected';
  supporting_documents?: string[];
  reviewed_by?: string;
  reviewed_at?: string;
  admin_comments?: string;
  created_at: string;
  updated_at: string;
  class?: Class;
  student?: User;
}

export interface BLEBeacon {
  id: string;
  uuid: string;
  class_id: string;
  location: string;
  description?: string;
  signal_threshold: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  class?: Class;
}

export interface WeeklyReport {
  id: string;
  student_id: string;
  week_start_date: string;
  week_end_date: string;
  total_classes: number;
  attended_classes: number;
  attendance_percentage: number;
  ai_insights?: string;
  content?: any;
  email_sent_at?: string;
  created_at: string;
}
