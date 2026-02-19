export enum Role {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  VERIFIER = 'VERIFIER',
}

export enum StaffStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED',
}

export interface StaffMember {
  id: string;
  fullName: string;
  role: string;
  department: string;
  joinDate: string;
  validUntil: string;
  status: StaffStatus;
  photoUrl: string;
  email: string;
  password?: string; // Added for password-based auth
}

export interface VerificationLog {
  id: string;
  staffId: string;
  timestamp: string;
  statusAtScan: StaffStatus;
  verifierId: string;
  result: 'PASS' | 'FAIL' | 'WARN';
}