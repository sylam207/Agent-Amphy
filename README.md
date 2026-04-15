# Agent Amphy

An AI-powered book companion that lets you upload PDFs and have voice conversations about their content. Upload a book, let AI break it down, and discuss it through natural voice chat — powered by Vapi, Next.js, and MongoDB.

**Live site:** [agent-amphy.vercel.app](https://agent-amphy.vercel.app/)

---

## What It Does

- **Upload a PDF** — Add any book and Agent Amphy extracts and processes the content into segments.
- **Voice Chat** — Start a real-time voice conversation with an AI that knows the book. Ask questions, get summaries, explore ideas, and deepen your understanding.
- **Personal Library** — Manage your uploaded books with search, delete, and cover images.
- **Subscription Plans** — Free, Standard ($7.99/mo), and Pro ($15/mo) tiers with different session limits, book caps, and session durations.

## Who It's For

- Students who want to discuss textbooks and study material interactively
- Readers looking for a deeper way to engage with non-fiction
- Anyone who learns better through conversation than reading alone

## Tech Stack

| Layer         | Technology                                      |
| ------------- | ----------------------------------------------- |
| Framework     | [Next.js 16](https://nextjs.org/) (App Router)  |
| Auth          | [Clerk](https://clerk.com/)                     |
| Database      | [MongoDB](https://www.mongodb.com/) + Mongoose  |
| Voice AI      | [Vapi](https://vapi.ai/) + ElevenLabs           |
| PDF Parsing   | [pdf.js](https://mozilla.github.io/pdf.js/)     |
| Styling       | [Tailwind CSS 4](https://tailwindcss.com/)      |
| Deployment    | [Vercel](https://vercel.com/)                   |

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB database (Atlas or local)
- Clerk account (for authentication and subscriptions)
- Vapi account (for voice AI)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/agent-amphy.git
cd agent-amphy
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_PLAN_STANDARD=your_standard_plan_id
NEXT_PUBLIC_CLERK_PLAN_PRO=your_pro_plan_id

# Vapi
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key
NEXT_PUBLIC_ASSISTANT_ID=your_vapi_assistant_id
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
npm run build
npm start
```

## Project Structure

```
app/
  layout.tsx              # Root layout with Clerk provider
  globals.css             # Global styles and design system
  (root)/
    page.tsx              # Homepage — library + hero section
    books/
      [slug]/page.tsx     # Book detail — voice chat interface
      new/page.tsx        # Upload new book form
    subscriptions/
      page.tsx            # Pricing page
  api/
    books/                # CRUD + upload API routes
    vapi/                 # Voice AI search endpoint
components/               # UI components (BookCard, Hero, Transcript, etc.)
database/                 # Mongoose connection and models
hooks/                    # useVapi hook for voice session management
lib/                      # Server actions, utilities, constants
```

## Deployment

Deployed on [Vercel](https://vercel.com/). Push to your connected branch and Vercel handles the rest. Set the same environment variables in your Vercel project settings under **Settings → Environment Variables**.
