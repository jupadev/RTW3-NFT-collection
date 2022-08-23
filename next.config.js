/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    NFT_API_KEY: process.env.NEXT_PUBLIC_NFT_API_KEY,
    nextVar: "MyVar",
  },
};
