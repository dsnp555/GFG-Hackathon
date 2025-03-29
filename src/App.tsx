import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { DoctorDashboard } from './components/DoctorDashboard';
import { PatientDashboard } from './components/PatientDashboard';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return user.role === 'doctor' ? <DoctorDashboard /> : <PatientDashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    
    </AuthProvider>
  );
}

export default App;