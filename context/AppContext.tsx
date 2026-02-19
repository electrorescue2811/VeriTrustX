import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StaffMember, VerificationLog, StaffStatus } from '../types';
import { MOCK_STAFF } from '../constants';
import { db, isFirebaseInitialized } from '../services/firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, doc, setDoc } from 'firebase/firestore';

interface AppContextType {
  staffList: StaffMember[];
  verificationLogs: VerificationLog[];
  addStaff: (staff: StaffMember) => void;
  updateStaffStatus: (id: string, status: StaffStatus) => void;
  logVerification: (log: VerificationLog) => void;
  currentUser: StaffMember | null;
  loginAsStaff: (id: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [verificationLogs, setVerificationLogs] = useState<VerificationLog[]>([]);
  const [currentUser, setCurrentUser] = useState<StaffMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Data Load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      if (isFirebaseInitialized && db) {
        try {
          // Fetch Staff
          const staffSnapshot = await getDocs(collection(db, 'staff'));
          if (!staffSnapshot.empty) {
            const firebaseStaff = staffSnapshot.docs.map(doc => doc.data() as StaffMember);
            setStaffList(firebaseStaff);
          } else {
             // Seed initial data if DB is empty
             setStaffList(MOCK_STAFF);
          }

          // Fetch Logs
          const logsSnapshot = await getDocs(collection(db, 'verification_logs'));
          if (!logsSnapshot.empty) {
            const firebaseLogs = logsSnapshot.docs.map(doc => doc.data() as VerificationLog);
            setVerificationLogs(firebaseLogs);
          }
        } catch (error) {
          console.error("Error loading from Firebase, falling back to mock:", error);
          setStaffList(MOCK_STAFF);
        }
      } else {
        // Fallback to Mock Data
        setStaffList(MOCK_STAFF);
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  const addStaff = async (staff: StaffMember) => {
    // Optimistic Update
    setStaffList((prev) => [...prev, staff]);

    if (isFirebaseInitialized && db) {
      try {
        // We use the staff ID as the document ID for easier updates
        await setDoc(doc(db, 'staff', staff.id), staff);
      } catch (e) {
        console.error("Error adding staff to Firebase:", e);
      }
    }
  };

  const updateStaffStatus = async (id: string, status: StaffStatus) => {
    // Optimistic Update
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );

    if (isFirebaseInitialized && db) {
      try {
        const staffRef = doc(db, 'staff', id);
        await updateDoc(staffRef, { status });
      } catch (e) {
        console.error("Error updating staff status in Firebase:", e);
      }
    }
  };

  const logVerification = async (log: VerificationLog) => {
    // Optimistic Update
    setVerificationLogs((prev) => [log, ...prev]);

    if (isFirebaseInitialized && db) {
      try {
        await addDoc(collection(db, 'verification_logs'), log);
      } catch (e) {
        console.error("Error adding log to Firebase:", e);
      }
    }
  };

  const loginAsStaff = (id: string) => {
    const user = staffList.find((s) => s.id === id);
    if (user) setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        staffList,
        verificationLogs,
        addStaff,
        updateStaffStatus,
        logVerification,
        currentUser,
        loginAsStaff,
        logout,
        isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};