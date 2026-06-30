#!/usr/bin/env node
/** Remove stale Next.js dev lock so `npm run dev` can start cleanly. */
const fs = require("fs");
const path = require("path");

const lockPath = path.join(process.cwd(), ".next", "dev", "lock");

try {
  fs.unlinkSync(lockPath);
  console.log("Removed stale .next/dev/lock");
} catch {
  // lock absent — nothing to do
}
