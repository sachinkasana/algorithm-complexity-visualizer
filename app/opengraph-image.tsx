import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '60px',
          background: 'linear-gradient(135deg, #0f172a, #1e3a8a)',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: 56, fontWeight: 700 }}>Algorithm Complexity Visualizer</div>
          <div style={{ fontSize: 28, color: '#bae6fd' }}>See sorting and searching algorithms in motion.</div>
        </div>
        <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-end' }}>
          <div style={{ width: 44, height: 180, borderRadius: 12, background: 'linear-gradient(135deg, #22d3ee, #3b82f6)' }} />
          <div style={{ width: 44, height: 240, borderRadius: 12, background: 'linear-gradient(135deg, #22d3ee, #3b82f6)' }} />
          <div style={{ width: 44, height: 300, borderRadius: 12, background: 'linear-gradient(135deg, #22d3ee, #3b82f6)' }} />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
