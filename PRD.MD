📘 PRD — Bangladesh Result System (bdresult2026.vercel.app)
🧩 Project Name

BD Result - Fast Academic Result Checker

🌐 Live Domain (target)

👉 https://bdresult2026.vercel.app
 (Vercel deployment)

💻 GitHub Repo

👉 https://github.com/maruff630-dev/bd.result.git

🎯 1. Objective (লক্ষ্য)

একটি ultra-fast, scalable result checking platform তৈরি করা যেখানে:

SSC / HSC student result instantly দেখা যাবে
1–2 lakh concurrent user হলেও কোনো crash হবে না
response time হবে < 500ms (cached system হলে)
👥 2. Target Users
SSC students
HSC students
Parents
Schools / colleges
⚙️ 3. Tech Stack
Frontend
Next.js (App Router) ⭐
Tailwind CSS
React Query (data fetching optimization)
Backend
Next.js API Routes (server actions)
Optional: Separate Node.js service (Render)
Database
Redis (primary cache) ⭐
MongoDB Atlas (persistent storage)
Deployment
Frontend: Vercel
Backend (optional microservice): Render / Railway
🧠 4. Core System Architecture
User → Next.js Frontend → API Route → Cache (Redis) → Result Source → Response
🔥 High Traffic Design (IMPORTANT)
Problem:

1–2 lakh users simultaneously

Solution:

✔ CDN (Vercel Edge Network)
✔ Redis caching (instant response)
✔ Rate limiting per IP
✔ Request deduplication
✔ Pre-cached popular roll numbers

⚡ 5. Data Flow (Result System)
Step-by-step:
User enters:
Roll
Board
Exam type
API checks:
Redis cache (fastest)
If NOT found:
Fetch from official board system
Education Board Bangladesh result portal
Store result:
Redis (fast access)
MongoDB (backup)
Return result to user
🧾 6. API Design
Endpoint:
POST /api/result
Request:
{
  "roll": "123456",
  "board": "dhaka",
  "exam": "hsc"
}
Response:
{
  "name": "Student Name",
  "gpa": "5.00",
  "group": "Science",
  "status": "passed"
}
🧱 7. Frontend Pages (Next.js)
Pages:
1. Home Page
Input form (roll, board, exam)
Fast search UI
2. Result Page
Student info
GPA display
Subject list
3. Error Page
“Result not found”
🚀 8. Performance Strategy (VERY IMPORTANT)
To handle 1–2 lakh users:
✔ Caching Strategy
Redis TTL: 24 hours
Hot data preloaded
✔ Edge Optimization
Vercel Edge Functions
Static rendering for UI
✔ Load control
Rate limit: 5 req/min per IP
Bot protection (Cloudflare)
🧪 9. Scaling Strategy
Level 1 (Startup)
Vercel + Redis only
Level 2 (Growth)
Add Render backend service
Separate scraping service
Level 3 (High traffic)
Multi-region Redis
Queue system (BullMQ)
🧰 10. Render Setup (Backend service)

If you use Render:

Service type:
Web Service (Node.js)
Environment variables:
REDIS_URL=your_redis_url
MONGODB_URI=your_mongo_uri
PORT=10000
Build command:
npm install
npm run build
Start command:
npm start
🔐 11. Security
Rate limiting middleware
IP blocking system
Bot detection
API key (internal use only)
📦 12. GitHub Workflow

Repo:
👉 https://github.com/maruff630-dev/bd.result.git

Workflow:
Push code to main branch
Vercel auto deploy
API routes live instantly
⚡ 13. Deployment (Vercel)
Steps:
Connect GitHub repo
Import project in Vercel
Framework: Next.js
Deploy
🧩 14. Key Features

✔ Instant result lookup
✔ Cached system (super fast)
✔ Mobile responsive UI
✔ High concurrency support
✔ Scalable backend

🚨 15. Important Reality Check

✔ Official API নেই
✔ তাই caching + smart fetching লাগবে
✔ scraping use করলে stability maintain করতে হবে
✔ Vercel alone heavy backend handle করতে পারবে না → Redis must

🧠 Final System Summary

👉 তোমার site হবে:

Frontend: Next.js (Vercel)
Backend: Next.js API + optional Render
Cache: Redis (main speed engine)
Data: Education Board system