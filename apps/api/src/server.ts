// ─── Server Entry Point ───────────────────────────────────────────────────────
// This file is ONLY responsible for:
// 1. Loading env (which validates all required variables)
// 2. Creating the Express app
// 3. Starting the HTTP listener
//
// Business logic lives in services, controllers, and routes — not here.

import { env } from './config/env';
import { createApp } from './app';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(
    `\n🚀 FitPilot API running on http://localhost:${env.PORT}`,
  );
  console.log(`   Environment: ${env.NODE_ENV}`);
  console.log(`   Health check: http://localhost:${env.PORT}/health\n`);
});

// ── Graceful shutdown ──────────────────────────────────────────────────────────
// When the process receives SIGTERM (e.g. from Docker or systemd), we:
// 1. Stop accepting new connections
// 2. Let in-flight requests finish (up to 10 seconds)
// 3. Exit cleanly
//
// This prevents "connection reset" errors during deployments.
function gracefulShutdown(signal: string) {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed. Exiting.');
    process.exit(0);
  });

  // Force exit after 10s if requests haven't drained
  setTimeout(() => {
    console.error('Forced exit after timeout.');
    process.exit(1);
  }, 10_000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Catch unhandled promise rejections — log and exit
// (Silently swallowing them causes subtle bugs)
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
  process.exit(1);
});
