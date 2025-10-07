import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove or empty experimental config to fix 'turbo' errors
  experimental: {},
  // Other config options if any
};

export default withNextIntl(nextConfig);