import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Explicitly set the root to the current directory to avoid
    // Next.js picking up the lockfile in the home folder.
    root: __dirname,
  },
};

export default nextConfig;
