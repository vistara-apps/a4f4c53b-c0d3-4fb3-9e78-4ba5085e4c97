# SkillShake - Base Mini App

Learn anything, anytime, from anyone nearby. A marketplace for hyper-local, on-demand micro-lessons delivered by local experts, discoverable through a 'shake' gesture.

## Features

- **Shake Discovery**: Discover random lessons by shaking your phone
- **Local Learning**: Find experts and lessons in your immediate vicinity
- **Micro-Payments**: Instant, secure payments via Base wallet
- **Live Sessions**: Video calls, recorded lessons, and in-person meetings
- **Expert Profiles**: Detailed profiles with ratings and availability
- **Farcaster Integration**: Seamless integration with Farcaster identity

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Blockchain**: Base network via MiniKit
- **Identity**: Farcaster integration
- **Location**: Browser Geolocation API
- **Motion**: Device motion for shake detection

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.local` and add your API keys:
   ```bash
   NEXT_PUBLIC_MINIKIT_API_KEY=your-minikit-api-key
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your-onchainkit-api-key
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Core Components

### ShakeDetector
Handles device motion detection and manual shake triggers for lesson discovery.

### LessonCard
Displays lesson information with booking functionality and expert details.

### ProfileHeader
Shows user or expert profiles with ratings, skills, and availability.

### ActionCard
Reusable card component for various actions and CTAs.

## Data Model

- **User**: Basic user information with location and skills
- **ExpertProfile**: Extended profile for lesson providers
- **MicroLesson**: Individual lesson with type, price, and duration
- **Session**: Booking and session management
- **Notification**: User notifications and alerts

## Mobile Features

- **Shake Detection**: Uses DeviceMotionEvent API
- **Location Services**: GPS-based expert discovery
- **Touch Optimized**: Mobile-first responsive design
- **Offline Fallback**: Manual discovery when motion unavailable

## Base Mini App Integration

- **MiniKit Provider**: Configured for Base network
- **Wallet Integration**: Seamless payment processing
- **Frame Actions**: In-frame booking and discovery
- **Identity**: Farcaster user context

## Development

The app uses mock data for development. In production, replace the `useMockData` hook with real API calls to your backend service.

Key hooks:
- `useGeolocation`: Location services
- `useMockData`: Development data
- `useMiniKit`: Base Mini App context

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to your preferred platform (Vercel, Netlify, etc.)

3. Configure environment variables in production

4. Set up your Base Mini App manifest for discovery

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
