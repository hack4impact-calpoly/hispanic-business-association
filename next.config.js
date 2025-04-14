/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hba-website-test-images.s3.us-west-2.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
