# Receipt Tracker AI

Receipt Tracker AI is an intelligent expense management platform that uses advanced AI to scan, analyze, and organize your receipts. Instantly extract key data from PDF receipts, categorize expenses, and gain actionable insights—all with a modern, user-friendly interface.


## Features

- **AI-Powered Receipt Scanning** – Drag and drop PDF receipts for instant data extraction using state-of-the-art AI agents
- **Expense Categorization** – Automatically tag and organize expenses by merchant, category, and custom tags
- **AI Summaries** – Get human-readable summaries of each receipt, including merchant, items, and transaction details
- **Advanced Export** – Export your receipt history and data for accounting or tax purposes
- **Usage Limits & Subscription Management** – Free and paid tiers with scan limits, managed via Schematic customer portal
- **Secure Authentication** – User accounts powered by Clerk
- **Real-Time Updates** – See uploaded receipts and extracted data instantly

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS, Radix UI
- **AI Integration**: Inngest Agent Kit, Anthropic Claude, OpenAI GPT-4o
- **Authentication**: Clerk
- **Database**: Convex (with file storage and metadata)
- **Subscription & Billing**: Schematic
- **Styling**: Tailwind CSS, Radix UI components

## Project Structure

- `app/` – Next.js app directory (pages, layouts, API routes)
- `components/` – Reusable UI components (PDFDropzone, ReceiptList, Header, etc.)
- `convex/` – Convex database schema, queries, mutations, and authentication config
- `actions/` – Server actions for file upload, access tokens, and business logic
- `inngest/` – AI agent definitions and orchestration for PDF parsing and data extraction
- `lib/` – Utility functions (Convex client, Schematic client, etc.)
- `public/` – Static assets

## Data Model

Receipts are stored with:

- User ID (Clerk)
- File metadata (name, display name, size, MIME type, upload date)
- AI-extracted fields: merchant name, address, contact, transaction date, amount, currency, itemized purchases, and summary
- Status (pending, processed, error)

See [`convex/schema.ts`](convex/schema.ts ) for full schema.

## Learn More

- [Convex Documentation](https://docs.convex.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Inngest Documentation](https://www.inngest.com/docs/agents)


**Built for modern expense tracking with AI.**
