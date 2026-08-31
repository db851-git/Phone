/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emit a self-contained server bundle for Docker / self-hosting.
  output: "standalone",
};

export default nextConfig;
