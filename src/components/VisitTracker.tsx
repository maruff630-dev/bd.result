'use client';

import { useEffect } from 'react';
import { ref, runTransaction } from 'firebase/database';
import { db } from '@/lib/firebase';

export default function VisitTracker() {
  useEffect(() => {
    // Only track in production to prevent strict mode double increment,
    // but since we want to test locally, we'll use a session storage flag to avoid double counting on reload
    if (typeof window !== 'undefined') {
      const hasVisited = sessionStorage.getItem('hasVisited');
      if (!hasVisited) {
        sessionStorage.setItem('hasVisited', 'true');
        const visitsRef = ref(db, 'analytics/visits');
        runTransaction(visitsRef, (currentVisits) => {
          return (currentVisits || 0) + 1;
        }).catch((err) => console.error("Failed to track visit:", err));
      }
    }
  }, []);

  return null; // This component doesn't render anything
}
