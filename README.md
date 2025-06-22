# Albanian Tourism App 🇦🇱

A React Native mobile application for exploring Albanian cultural events and beautiful beaches. Built with Expo and TypeScript, this app provides users with information about tourism opportunities across Albania.

## Features

### 📅 Events Tab

- Browse upcoming cultural events across Albania
- View events by category (Art Fest, Theater, Concerts, Sports, Local Celebrations, Agrotourism & Gastronomy, Visual Arts)
- See event details including dates, times, locations, and images
- Infinite scroll pagination for browsing large event lists
- Pull-to-refresh functionality

### 🏖️ Beaches Tab

- Discover beautiful beaches along Albania's coastline
- Filter beaches by municipality
- View beach information including type (Public, Private, Managed), area, and descriptions
- Detailed beach information with photos and location coordinates
- Support for both English and Albanian language content

## Technical Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State Management**: React Hooks (useState, useEffect)
- **API Integration**: Custom hooks for data fetching
- **UI Components**: Themed components with light/dark mode support
- **Images**: Expo Image with optimization

## API Integration

The app consumes data from the Albanian Tourism API (`https://tea2.base.al/api/`) with the following endpoints:

- `GET /events` - Retrieve cultural events with pagination
- `GET /categories` - Get event categories
- `GET /municipalities` - Get Albanian municipalities
- `GET /beaches` - Get beach information

## Project Structure

```
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── index.tsx      # Events screen
│   │   └── explore.tsx    # Beaches screen
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── EventCard.tsx      # Event display component
│   ├── BeachCard.tsx      # Beach display component
│   ├── CategoryCard.tsx   # Category display component
│   └── ui/               # Base UI components
├── hooks/                 # Custom React hooks
│   └── useApi.ts         # API data fetching hooks
├── services/             # API service layer
│   └── api.ts           # API client and methods
├── types/               # TypeScript type definitions
│   └── api.ts          # API response types
└── constants/          # App constants
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for testing)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd tourism-albania
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Run on your preferred platform:

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Development

### Key Components

- **EventCard**: Displays event information with images, dates, and categories
- **BeachCard**: Shows beach details with type badges and descriptions
- **CategoryCard**: Presents event categories with overlay text on images

### Custom Hooks

- **useEvents**: Manages event data fetching with pagination
- **useBeaches**: Handles beach data with filtering capabilities
- **useCategories**: Fetches event categories
- **useMunicipalities**: Loads municipality data

### API Service

The `apiService` provides methods for:

- Fetching paginated events
- Retrieving categories and municipalities
- Getting beach information with filtering
- Error handling and loading states

## Features to Implement

- [ ] Event detail pages
- [ ] Beach detail pages with maps
- [ ] Favorite events/beaches
- [ ] Search functionality
- [ ] Offline caching
- [ ] Push notifications for new events
- [ ] User reviews and ratings
- [ ] Navigation to Google Maps for locations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## API Data Source

Event and beach data is provided by the Albanian Tourism API. The app reverse-engineers the public endpoints to provide a mobile-first experience for exploring Albanian tourism opportunities.
