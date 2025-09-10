import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
})

export default withMDX(nextConfig)
