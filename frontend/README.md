# Dermastore Frontend

A modern, scalable Next.js 14 e-commerce frontend for Dermastore - South Africa's leading online skincare retailer.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Data Fetching**: TanStack Query v5
- **Backend**: Magento 2 (Headless) via GraphQL

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Magento 2.4.x instance (for backend)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local with your configuration
nano .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Magento Configuration
NEXT_PUBLIC_MAGENTO_API_URL=https://your-magento.com/rest/V1
NEXT_PUBLIC_MAGENTO_GRAPHQL_URL=https://your-magento.com/graphql

# AWS AI Services
NEXT_PUBLIC_AI_API_URL=https://your-api-gateway.amazonaws.com/prod

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://dermastore.co.za
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (shop)/            # Shop routes (products, brands)
│   │   ├── (checkout)/        # Checkout routes (cart, checkout)
│   │   ├── (ai)/              # AI feature routes
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/
│   │   ├── ui/                # Base UI components
│   │   ├── layout/            # Header, Footer, etc.
│   │   ├── home/              # Homepage components
│   │   └── product/           # Product components
│   ├── lib/
│   │   ├── magento/           # Magento API client
│   │   └── utils.ts           # Utility functions
│   └── store/                 # Zustand stores
├── public/                    # Static assets
├── tailwind.config.ts         # Tailwind configuration
└── next.config.js             # Next.js configuration
```

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode

# Analysis
npm run analyze      # Analyze bundle size
```

## Features

### Implemented

- ✅ Homepage with hero, featured products, categories
- ✅ Product listing with filters and sorting
- ✅ Product detail pages
- ✅ Shopping cart with persistence
- ✅ AI Skin Analysis page
- ✅ Responsive design
- ✅ SEO optimization
- ✅ Magento GraphQL integration

### Planned

- 🔄 Checkout flow
- 🔄 User authentication
- 🔄 Order history
- 🔄 Wishlist
- 🔄 Search with Algolia/OpenSearch
- 🔄 AI Chatbot integration
- 🔄 Product recommendations

## Styling

The project uses Tailwind CSS with a custom theme based on Dermastore's brand colors:

- **Primary**: Teal (#008B8B)
- **Accent**: Soft Pink (#FFB6C1)
- **Fonts**: Inter (body), Playfair Display (headings)

## Deployment

### Vercel (Recommended)

```bash
vercel
```

### Docker

```bash
docker build -t dermastore-frontend .
docker run -p 3000:3000 dermastore-frontend
```

## API Integration

### Magento GraphQL

The frontend connects to Magento 2 via GraphQL for:
- Product catalog
- Cart management
- Customer authentication
- Order placement

### AWS AI Services

AI features use AWS Lambda functions:
- `/api/skin-analysis` - Rekognition + Bedrock
- `/api/recommendations` - Personalize
- `/api/chatbot` - Bedrock Claude

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

Proprietary - Dermastore (Pty) Ltd
