import { StaffMember, StaffStatus } from './types';

export const MOCK_STAFF: StaffMember[] = [
  {
    id: 'NGO-8821',
    fullName: 'Sarah Jenkins',
    role: 'Field Coordinator',
    department: 'Humanitarian Aid',
    joinDate: '2023-01-15',
    validUntil: '2025-12-31',
    status: StaffStatus.ACTIVE,
    photoUrl: 'https://picsum.photos/200/200?random=1',
    email: 'sarah.j@ngo.org',
    password: 'password123'
  },
  {
    id: 'NGO-9942',
    fullName: 'Michael Chen',
    role: 'Medical Officer',
    department: 'Health Services',
    joinDate: '2022-05-20',
    validUntil: '2024-05-20',
    status: StaffStatus.EXPIRED,
    photoUrl: 'https://picsum.photos/200/200?random=2',
    email: 'm.chen@ngo.org',
    password: 'password123'
  },
  {
    id: 'NGO-1102',
    fullName: 'David Okeke',
    role: 'Logistics Manager',
    department: 'Supply Chain',
    joinDate: '2024-02-10',
    validUntil: '2026-02-10',
    status: StaffStatus.SUSPENDED,
    photoUrl: 'https://picsum.photos/200/200?random=3',
    email: 'd.okeke@ngo.org',
    password: 'password123'
  }
];