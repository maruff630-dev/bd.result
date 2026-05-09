import { NextResponse } from 'next/server';
import { ref, runTransaction, get, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { fetchResultFromBoard } from '@/lib/scraper';
import { getCache, setCache, incrementRateLimit } from '@/lib/redis';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roll, board, exam, year, reg } = body;

    if (!roll || !board || !exam || !year || !reg) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Rate Limiting
    // Using a simplistic IP extraction for Next.js App Router
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const requestsThisMinute = await incrementRateLimit(ip);
    
    if (requestsThisMinute > 5) { // 5 requests per minute limit
      return NextResponse.json({ error: 'You can only search 5 times per minute. Please wait a moment before trying again.' }, { status: 429 });
    }

    // Cache Check in Redis
    const cacheKey = `result:${exam}:${year}:${board}:${roll}:${reg}`;
    const cachedResult = await getCache(cacheKey);

    if (cachedResult) {
      console.log('Serving from Redis Cache:', cacheKey);
      incrementFirebaseSearchCount();
      return NextResponse.json(cachedResult);
    }

    // Cache Check in Firebase
    const firebaseCacheKey = `results/${exam}_${year}_${board}_${roll}_${reg}`;
    const resultRef = ref(db, firebaseCacheKey);
    try {
      const snapshot = await get(resultRef);
      if (snapshot.exists()) {
        console.log('Serving from Firebase Cache:', firebaseCacheKey);
        incrementFirebaseSearchCount();
        
        // Also update Redis cache for faster subsequent reads
        await setCache(cacheKey, snapshot.val(), 60 * 60 * 24);
        
        return NextResponse.json(snapshot.val());
      }
    } catch (firebaseErr) {
      console.warn("Firebase cache read failed (likely due to rules), proceeding to scrape:", firebaseErr);
    }

    // Not in cache, fetch from official board
    console.log('Fetching from official BD Board...', { exam, year, board, roll, reg });
    const scrapedData = await fetchResultFromBoard(exam, year, board, roll, reg);

    if (scrapedData.error) {
      // If error is related to invalid credentials, don't cache it, just return
      return NextResponse.json({ error: scrapedData.error }, { status: 404 });
    }

    if (!scrapedData.reg) scrapedData.reg = reg;

    // Success! Cache the valid result in Redis
    await setCache(cacheKey, scrapedData, 60 * 60 * 24);

    // Cache in Firebase
    try {
      await set(resultRef, scrapedData);
      console.log('Saved to Firebase Cache:', firebaseCacheKey);
    } catch (firebaseErr) {
      console.warn("Firebase cache write failed (likely due to rules):", firebaseErr);
    }

    // Increment searches counter in Firebase
    incrementFirebaseSearchCount();

    return NextResponse.json(scrapedData);

  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function incrementFirebaseSearchCount() {
  try {
    const searchesRef = ref(db, 'analytics/searches');
    runTransaction(searchesRef, (currentSearches) => {
      return (currentSearches || 0) + 1;
    }).catch(e => console.error("Firebase transaction failed", e));
  } catch (e) {
    console.error("Failed to increment search count", e);
  }
}
