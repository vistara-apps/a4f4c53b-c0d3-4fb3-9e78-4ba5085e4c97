import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'SkillShake - Learn anything, anytime, from anyone nearby',
  description: 'A marketplace for hyper-local, on-demand micro-lessons delivered by local experts, discoverable through a shake gesture.',
  openGraph: {
    title: 'SkillShake',
    description: 'Learn anything, anytime, from anyone nearby.',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkillShake',
    description: 'Learn anything, anytime, from anyone nearby.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
