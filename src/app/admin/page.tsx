'use client';

import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';
import { Users, Search, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminPanel() {
  const [visits, setVisits] = useState(0);
  const [searches, setSearches] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already authenticated in session
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@gmail.com' && password === 'admin@gmail.com') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setError('');
    } else {
      setError('Invalid email or password');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const visitsRef = ref(db, 'analytics/visits');
    const searchesRef = ref(db, 'analytics/searches');

    const unsubVisits = onValue(visitsRef, (snapshot) => {
      setVisits(snapshot.val() || 0);
    });

    const unsubSearches = onValue(searchesRef, (snapshot) => {
      setSearches(snapshot.val() || 0);
    });

    return () => {
      unsubVisits();
      unsubSearches();
    };
  }, [isAuthenticated]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Activity size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to access analytics</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-gray-900 bg-white"
                placeholder="admin@gmail.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-gray-900 bg-white"
                placeholder="••••••••"
                required
              />
            </div>
            
            {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors mt-6"
            >
              Sign In
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Activity className="text-blue-600" />
              BD Result Analytics
            </h1>
            <p className="text-gray-500 mt-1">Real-time statistics dashboard</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors text-sm"
          >
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-6"
          >
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
              <Users size={32} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Visits</p>
              <p className="text-4xl font-bold text-gray-900 mt-1">{visits.toLocaleString()}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-6"
          >
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
              <Search size={32} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Searches</p>
              <p className="text-4xl font-bold text-gray-900 mt-1">{searches.toLocaleString()}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
