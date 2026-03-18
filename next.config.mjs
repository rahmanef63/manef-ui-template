/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",

    // Turbopack is now stable in Next.js 16
    turbopack: {},

    // React 19 settings
    reactStrictMode: true,
};

export default nextConfig;
