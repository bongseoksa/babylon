/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: false,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    loader: 'akamai',
    path: '',
    unoptimized: true,
    domains: ['maxwork-plus-dev.s3.amazonaws.com'], // 외부 링크 이미지 불러오기 위해 등록
  },
  output: 'export',
  distDir: 'out',
};

export default nextConfig;
