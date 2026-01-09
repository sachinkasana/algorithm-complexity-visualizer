import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a',
          borderRadius: '32px',
        }}
      >
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <div style={{ width: 26, height: 70, borderRadius: 10, background: 'linear-gradient(135deg, #22d3ee, #3b82f6)' }} />
          <div style={{ width: 26, height: 92, borderRadius: 10, background: 'linear-gradient(135deg, #22d3ee, #3b82f6)' }} />
          <div style={{ width: 26, height: 114, borderRadius: 10, background: 'linear-gradient(135deg, #22d3ee, #3b82f6)' }} />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
