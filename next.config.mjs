/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        API_URL: process.env.API_URL,
    },
    images: {
        unoptimized: true,
    },
    output: "export"
};

export default nextConfig;
