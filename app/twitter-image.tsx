import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 600,
};

export const contentType = 'image/png';

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '56px',
          background: 'linear-gradient(135deg, #0f172a, #1e40af)',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: 52, fontWeight: 700 }}>Algorithm Complexity Visualizer</div>
          <div style={{ fontSize: 26, color: '#bae6fd' }}>Compare algorithms with live stats.</div>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
          <div style={{ width: 40, height: 160, borderRadius: 12, background: 'linear-gradient(135deg, #22d3ee, #3b82f6)' }} />
          <div style={{ width: 40, height: 220, borderRadius: 12, background: 'linear-gradient(135deg, #22d3ee, #3b82f6)' }} />
          <div style={{ width: 40, height: 280, borderRadius: 12, background: 'linear-gradient(135deg, #22d3ee, #3b82f6)' }} />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
