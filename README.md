# SAFE - Mental Health Platform

A modern, calming, and professional mental health platform built with Next.js, featuring glassmorphism design, premium UI components, and a comprehensive suite of mental wellness tools.

## 🌿 Features

### Core Functionality
- **Landing Page**: Welcoming interface with mission statement and feature overview
- **Crisis Support Chat**: 24/7 interactive chat with trained professionals
- **Professional Booking**: Session scheduling with licensed therapists
- **Resource Library**: Curated self-help materials, guides, and tools
- **Peer Community**: Safe, moderated discussion forums
- **Admin Dashboard**: Comprehensive platform management and analytics

### Design System
- **Color Palette**: Sage green and beige primary colors with cream accents
- **Typography**: Inter and Poppins fonts for modern, readable text
- **UI Effects**: Glassmorphism, neumorphism, subtle animations
- **Icons**: Heroicons for consistent, scalable vector icons
- **Responsive**: Mobile-first design with desktop optimization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd mental-health-platform

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard
│   ├── booking/           # Appointment scheduling
│   ├── chat/              # Crisis support chat
│   ├── community/         # Peer support forum
│   ├── resources/         # Resource library
│   ├── globals.css        # Global styles & design system
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Landing page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── LandingPage.tsx   # Main landing page
│   └── Navigation.tsx    # Navigation component
└── lib/                  # Utility functions
    └── utils.ts          # Helper utilities
```

## 🎨 Design System

### Colors
- **Sage Green**: Primary brand color for trust and calm
- **Beige/Cream**: Warm, welcoming secondary colors
- **White/Transparent**: Glass effects and overlays

### Typography
- **Primary**: Inter - Clean, readable sans-serif
- **Secondary**: Poppins - Rounded, friendly headings

### Components
- **Glass Cards**: Translucent backgrounds with backdrop blur
- **Neumorphism**: Soft, embossed button styles
- **Smooth Animations**: Framer Motion for fluid interactions
- **Responsive Grid**: Tailwind CSS grid system

## 🛠️ Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animation library
- **Heroicons**: SVG icon library

### UI Libraries
- **Headless UI**: Accessible components
- **Tailwind Forms**: Enhanced form styling
- **Custom Components**: Purpose-built for mental health UX

### Development Tools
- **ESLint**: Code quality and consistency
- **PostCSS**: CSS processing and optimization
- **Autoprefixer**: CSS vendor prefixes

## 🔧 Configuration

### Tailwind CSS
Custom design tokens defined in `tailwind.config.js`:
- Sage green color palette (50-900)
- Beige and cream variations
- Custom animations (fade, slide, float, pulse)
- Glass effect utilities
- Neumorphism shadow styles

### TypeScript
Strict type checking enabled with path mapping for clean imports.

## 📱 Pages & Features

### Landing Page (`/`)
- Hero section with mission statement
- Feature showcase with animated cards
- Platform statistics
- Trust indicators and call-to-actions

### Support Chat (`/chat`)
- Real-time chat interface
- Quick response buttons
- Crisis resources sidebar
- Privacy indicators
- Typing indicators and animations

### Booking System (`/booking`)
- Multi-step appointment flow
- Therapist selection with profiles
- Session type options (video/phone/text)
- Date and time scheduling
- Form validation and confirmation

### Resource Library (`/resources`)
- Searchable content database
- Category and type filtering
- Featured resources section
- Downloadable materials
- User ratings and view counts

### Community Forum (`/community`)
- Anonymous posting options
- Category-based discussions
- Community guidelines
- Moderation features
- Crisis support integration

### Admin Dashboard (`/admin`)
- Platform analytics
- User activity monitoring
- Therapist status tracking
- System health indicators
- Content moderation tools

## 🔐 Privacy & Security

- HIPAA-compliant design principles
- End-to-end encryption indicators
- Anonymous interaction options
- Privacy-first data handling
- Secure session management

## 🎯 User Experience

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader optimization
- High contrast color ratios
- Focus management

### Performance
- Optimized images and assets
- Code splitting and lazy loading
- Efficient animations
- Fast loading times
- SEO optimization

### Mental Health Focus
- Calming color psychology
- Non-triggering language
- Crisis intervention pathways
- Support resource integration
- Professional guidance emphasis

## 🚀 Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production  
npm run start        # Start production server
npm run lint         # Run ESLint

# Additional commands
npm run type-check   # TypeScript type checking
npm run format       # Code formatting
```

## 🌐 Deployment

### Build Optimization
- Static generation where possible
- Dynamic imports for code splitting
- Image optimization
- CSS purging and minification

### Environment Setup
Configure environment variables for:
- Database connections
- API endpoints
- Third-party integrations
- Analytics tracking

## 📋 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

This project follows mental health best practices and ethical design principles. When contributing:

1. Maintain the calming, professional aesthetic
2. Ensure accessibility standards
3. Test with mental health considerations
4. Follow privacy-first development
5. Include appropriate content warnings

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Crisis Resources

If you're experiencing a mental health crisis:
- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **International Association for Suicide Prevention**: https://www.iasp.info/resources/Crisis_Centres/

## 💙 Acknowledgments

- Mental health professionals who guided the UX design
- Open source community for excellent UI libraries
- Users who provided feedback on accessibility and usability

---

**Note**: This is a UI demonstration project. For actual mental health services, please consult with licensed professionals and established healthcare providers.
