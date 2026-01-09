import { ImageResponse } from 'next/og';

export const size = {
  width: 64,
  height: 64,
};

export const contentType = 'image/png';

export default function Icon() {
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
          borderRadius: '14px',
        }}
      >
        <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
          <div style={{ width: 10, height: 26, borderRadius: 4, background: 'linear-gradient(135deg, #22d3ee, #3b82f6)' }} />
          <div style={{ width: 10, height: 34, borderRadius: 4, background: 'linear-gradient(135deg, #22d3ee, #3b82f6)' }} />
          <div style={{ width: 10, height: 42, borderRadius: 4, background: 'linear-gradient(135deg, #22d3ee, #3b82f6)' }} />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
