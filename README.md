<p align="center">
  <img src="/public/logo.svg" alt="Birbal Logo" width="200" />
</p>

<h1 align="center">Birbal — AI Chat Assistant</h1>

<p align="center">
  A modern, multi-model AI chat application with a sleek Mughal-inspired interface.<br/>
  Built with Next.js 15, Tailwind CSS v4, Prisma, and the Vercel AI SDK.
</p>

---

## ✨ Features

- **Multi-Model Support** — Choose from a curated list of AI models via OpenRouter (free & paid)
- **Chat History** — Persistent conversations stored in PostgreSQL with full message history
- **Rename & Delete Chats** — Manage your conversations with inline rename and delete actions
- **Modern Mughal UI** — A premium dark/light theme with Libre Baskerville typography
- **Real-time Streaming** — AI responses stream in real-time with stop/retry controls
- **Smart Sidebar** — Grouped by time (Today, Yesterday, Last 7 Days, Older) with search
- **OAuth Authentication** — Sign in with GitHub or Google via Better Auth

---

## 🛠 Tech Stack

| Layer          | Technology                                    |
| -------------- | --------------------------------------------- |
| Framework      | [Next.js 15](https://nextjs.org/) (App Router)|
| Styling        | [Tailwind CSS v4](https://tailwindcss.com/)   |
| Database       | PostgreSQL + [Prisma ORM](https://prisma.io/) |
| AI             | [Vercel AI SDK](https://sdk.vercel.ai/) + [OpenRouter](https://openrouter.ai/) |
| Auth           | [Better Auth](https://better-auth.com/)       |
| State          | [Zustand](https://zustand.docs.pmnd.rs/) + [TanStack Query](https://tanstack.com/query) |
| UI Components  | [Radix UI](https://radix-ui.com/) + [Lucide Icons](https://lucide.dev/) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18 (or Bun)
- **PostgreSQL** database (or use the included Docker Compose)
- **OpenRouter API Key** — [Get one here](https://openrouter.ai/keys)
- OAuth credentials for GitHub and/or Google (optional, for social login)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/birbal.git
cd birbal
npm install
# or
bun install
```

### 2. Configure Environment

Copy the example env file and fill in your credentials:

```bash
cp .example.env .env
```

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/birbal

# Better Auth
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000

# OAuth (GitHub)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# OAuth (Google)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OpenRouter
OPENROUTER_API_KEY=your-openrouter-api-key
```

### 3. Set Up the Database

```bash
# Start PostgreSQL via Docker (optional)
docker compose up -d

# Push the Prisma schema to your database
npx prisma db push

# Generate the Prisma client
npx prisma generate
```

### 4. Run the Dev Server

```bash
npm run dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
birbal/
├── app/                    # Next.js App Router pages & layouts
│   ├── (auth)/             # Authentication pages (sign-in)
│   ├── (root)/             # Main app (chat pages, sidebar layout)
│   └── api/                # API routes (chat, AI models, auth)
├── components/             # Shared UI components (Radix-based)
│   ├── ai-elements/        # AI-specific components (conversation, message, prompt)
│   ├── providers/          # Context providers (theme, query)
│   └── ui/                 # Base UI primitives (button, input, dialog, etc.)
├── lib/                    # Core utilities (auth, db, prompts)
├── modules/                # Feature modules
│   ├── ai-models/          # AI model fetching hooks
│   ├── authtentication/    # Auth actions & user button
│   ├── chats/              # Chat CRUD (actions, hooks, components, store)
│   └── messages/           # Message display & form components
├── prisma/                 # Prisma schema & migrations
└── public/                 # Static assets (logo, icons)
```

---

## 📄 License

This project is for personal/educational use. See the repository for details.
