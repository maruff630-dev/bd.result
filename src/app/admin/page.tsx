'use client';

import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';
import { Users, Search, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminPanel() {
  const [visits, setVisits] = useState(0);
  const [searches, setSearches] = useState(0);

  useEffect(() => {
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
  }, []);

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
