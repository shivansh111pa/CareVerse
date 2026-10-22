/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/dashboard/doctor/analytics",
        destination: "/dashboard/doctor",
        permanent: false,
      },
      {
        source: "/dashboard/doctor/messages",
        destination: "/dashboard/doctor",
        permanent: false,
      },
      {
        source: "/dashboard/patient/history",
        destination: "/dashboard/patient/records",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
