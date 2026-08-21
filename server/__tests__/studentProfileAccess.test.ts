import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getStudentProfile } from '../services/studentProfile';
import { Student, Attendance, AuditLog } from '../models/school';
import * as schoolService from '../services/school';

vi.mock('../models/school', () => ({
  Student: {
    findOne: vi.fn(),
    findByIdAndUpdate: vi.fn()
  },
  Attendance: {
    find: vi.fn()
  },
  AuditLog: {
    find: vi.fn(),
    create: vi.fn()
  },
  SchoolUser: {
    updateMany: vi.fn()
  }
}));

vi.mock('../services/school', () => ({
  getSchoolIdentity: vi.fn()
}));

describe('getStudentProfile Access Control', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (Attendance.find as any).mockReturnValue({ lean: vi.fn().mockResolvedValue([]) });
    (AuditLog.find as any).mockReturnValue({ sort: vi.fn().mockReturnThis(), limit: vi.fn().mockReturnThis(), lean: vi.fn().mockResolvedValue([]) });
  });

  const mockPlatformUser = { id: 'u1', email: 'test@test.com', name: 'Test' };

  it('allows admin to view any student', async () => {
    (schoolService.getSchoolIdentity as any).mockResolvedValue({
      connection: 'connected',
      role: 'admin',
      profileId: 'admin_profile'
    });
    
    (Student.findOne as any).mockReturnValue({
      lean: vi.fn().mockResolvedValue({ _id: 'student123', name: 'John Doe' })
    });

    const result = await getStudentProfile(mockPlatformUser, 'student123');
    expect(result.student.name).toBe('John Doe');
  });

  it('allows a student to view their own profile', async () => {
    (schoolService.getSchoolIdentity as any).mockResolvedValue({
      connection: 'connected',
      role: 'student',
      profileId: 'student123'
    });
    
    (Student.findOne as any).mockReturnValue({
      lean: vi.fn().mockResolvedValue({ _id: 'student123', name: 'John Doe' })
    });

    const result = await getStudentProfile(mockPlatformUser, 'student123');
    expect(result.student.name).toBe('John Doe');
  });

  it('prevents a student from viewing another student profile', async () => {
    (schoolService.getSchoolIdentity as any).mockResolvedValue({
      connection: 'connected',
      role: 'student',
      profileId: 'student456' // Different ID
    });
    
    (Student.findOne as any).mockReturnValue({
      lean: vi.fn().mockResolvedValue({ _id: 'student123', name: 'John Doe' })
    });

    await expect(getStudentProfile(mockPlatformUser, 'student123'))
      .rejects
      .toThrow('Forbidden: You can only view your own profile');
  });

  it('throws unauthorized for unknown roles', async () => {
    (schoolService.getSchoolIdentity as any).mockResolvedValue({
      connection: 'connected',
      role: 'guest',
      profileId: 'guest_profile'
    });

    await expect(getStudentProfile(mockPlatformUser, 'student123'))
      .rejects
      .toThrow('Unauthorized');
  });
});
