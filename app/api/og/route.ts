import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          color: 'white',
          fontSize: 32,
          fontWeight: 'bold',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎓</div>
        <div style={{ fontSize: '36px', textAlign: 'center', marginBottom: '20px' }}>
          SkillShake
        </div>
        <div style={{ fontSize: '24px', color: '#94a3b8', textAlign: 'center' }}>
          Learn anything, anytime, from anyone nearby
        </div>
        <div style={{ fontSize: '20px', color: '#10b981', marginTop: '20px' }}>
          Shake to discover your next skill!
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

