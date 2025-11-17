# Veo 3.1 AI Video Studio

Generate 8K ultra-realistic cinematic sequences using Google Veo 3.1 with a production-ready web interface.

## Features

- Shot-level prompt builder with cinematic camera, lens, lighting, and framing controls
- Server-side integration with Google Veo 3.1 video generation API (with local simulation fallback)
- Real-time status polling with render timeline and downloadable masters
- Responsive, glassmorphism-inspired UI optimized for high-end creative workflows
- Deploy-ready Next.js 14 App Router project targeting Vercel

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create an `.env.local` file and provide your Google Veo credential. The app falls back to a simulated render if the key is missing, which is helpful for demos.

```bash
GOOGLE_VEO_API_KEY=your-veo-api-key
```

### 3. Run the development server

```bash
npm run dev
```

Open <http://localhost:3000> to use the studio.

## Production Build

```bash
npm run build
npm start
```

## Vercel Deployment

The project is optimized for Vercel. After configuring the `GOOGLE_VEO_API_KEY` environment variable in the project settings, deploy with:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-67688337
```

## API Integration Notes

- The app issues a `POST /api/veo` request that forwards to Google Veo 3.1 (or a simulator when unset)
- Jobs are polled via `GET /api/veo/:jobId` until completion or failure
- Responses capture ETA, render metadata, preview frames, and the final 8K MP4 URL

## License

MIT © 2024
