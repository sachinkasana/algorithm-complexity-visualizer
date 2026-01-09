import type { MetadataRoute } from 'next';

const baseUrl = process.env.VERCEL_URL
  ? new URL(`https://${process.env.VERCEL_URL}`)
  : new URL('https://algorithm-complexity-visualizer-pi.vercel.app');

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Algorithm Complexity Visualizer',
    short_name: 'AlgoViz',
    description: 'Visualize sorting and searching algorithms step by step.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0f172a',
    scope: '/',
    icons: [
      {
        src: new URL('/icon.png', baseUrl).toString(),
        sizes: '64x64',
        type: 'image/png',
      },
      {
        src: new URL('/apple-icon.png', baseUrl).toString(),
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
