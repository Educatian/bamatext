import { StudentProvider } from './context/StudentContext';
import { NotebookProvider } from './context/NotebookContext';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';

import { useAuth } from './context/AuthContext';
import { LandingPage } from './components/LandingPage';
import { AdminDashboard } from './components/AdminDashboard';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

function AppContent() {
  const { user, loading } = useAuth();
  const [showAdmin, setShowAdmin] = useState(false);

  // Check for admin URL param
  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setShowAdmin(true);
    }
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-slate-500 font-medium">Loading BamaText...</p>
        </div>
      </div>
    );
  }

  if (showAdmin) {
    return <AdminDashboard onBack={() => {
      setShowAdmin(false);
      window.history.pushState({}, '', '/');
    }} />;
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <StudentProvider>
      <NotebookProvider>
        <Layout />
      </NotebookProvider>
    </StudentProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
