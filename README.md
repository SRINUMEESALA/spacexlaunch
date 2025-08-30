# SpaceX Launch Explorer

A React Native mobile app for exploring SpaceX launches with interactive maps. Built with Expo SDK 53 and TypeScript.

## Getting Started

### Installation

```bash
npm install
```

### Running the App

```bash
npx expo start
```

Then scan the QR code with Expo Go on your phone or press `i` for iOS simulator / `a` for Android emulator.

## Features

- Browse all SpaceX launches with search functionality
- View detailed launch information including mission patches
- Interactive maps showing launchpad locations
- Get directions to launchpads via native maps
- Location-based distance calculations
- Pull-to-refresh and smooth scrolling

## Map Implementation

### Libraries Used

- **react-native-maps**: Interactive map component with Google Maps (Android) and Apple Maps (iOS)
- **expo-location**: Device location services and permissions
- **expo-linking**: Deep linking to native map applications

### Map Features

- Real-time launchpad locations with custom markers
- User location display when permission granted
- Platform-specific navigation (Google Maps on Android, Apple Maps on iOS)
- Distance calculation between user and launchpad

### Important Note about Maps

**No actual Google Maps API key is configured in this project.** Maps may not be fully visible on real devices. For the best experience with maps functionality, please use iOS Simulator or Android Emulator where maps work without API keys.

All other features (launch data, search, navigation) work perfectly on real devices.

## Permission Flows

### Location Permissions

The app requests location permissions when you tap the location button:

1. **First time**: Shows system permission dialog
2. **Permission granted**: Gets your location and calculates distance
3. **Permission denied**: Shows helpful message with retry option

### Handled Gracefully

- App works fully without location permissions
- Clear error messages when permissions are denied
- Easy retry mechanism for permission requests

## Technical Stack

- **Expo SDK 53** - React Native framework
- **TypeScript** - Type safety and better development experience
- **React Navigation** - App navigation and routing
- **Axios** - HTTP client for API requests
- **React Native Maps** - Interactive maps
- **Expo Location** - Location services

## API Integration

Uses the public SpaceX API:

- Launches: `https://api.spacexdata.com/v5/launches`
- Launchpads: `https://api.spacexdata.com/v4/launchpads/:id`

## App Screenshots

![Alt Text](https://private-user-images.githubusercontent.com/114816381/483851637-2f4de763-d8e5-4af8-9dfb-912584ae82e0.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTY1MzMyMTUsIm5iZiI6MTc1NjUzMjkxNSwicGF0aCI6Ii8xMTQ4MTYzODEvNDgzODUxNjM3LTJmNGRlNzYzLWQ4ZTUtNGFmOC05ZGZiLTkxMjU4NGFlODJlMC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwODMwJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDgzMFQwNTQ4MzVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1lZGVmYTU3MjU2MzQxMTExYjAzNmY1NjYyMGMwMTE3OTM3MmY0ODI1OWFlMjc5ZjVhZDVjNzNkMjllNTI0ODUyJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.Asp7l6UaE28kSB2FQFx3O1BHh7D0ApNsckJEhYP4QSQ)

![Alt Text](https://private-user-images.githubusercontent.com/114816381/483851671-e6353def-1125-4b83-be98-1b62a08c1662.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTY1MzMyMTUsIm5iZiI6MTc1NjUzMjkxNSwicGF0aCI6Ii8xMTQ4MTYzODEvNDgzODUxNjcxLWU2MzUzZGVmLTExMjUtNGI4My1iZTk4LTFiNjJhMDhjMTY2Mi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwODMwJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDgzMFQwNTQ4MzVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1hNzY0MGJlZDJhMDk2YmMwZjI5OTk1NDE4ZTQwN2Q0YjU5MzliZWM2MTVlNmRhYzgyMjVjNmM3YjU1MTU5ZDRiJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.Gf-lKS6lhHuHN9rUacFNB7LVA2OMqZ5_flzjls7qVPc)

![Alt Text](https://private-user-images.githubusercontent.com/114816381/483851696-d99fc07e-853f-4785-a489-f73e4fc800ac.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTY1MzMyMTUsIm5iZiI6MTc1NjUzMjkxNSwicGF0aCI6Ii8xMTQ4MTYzODEvNDgzODUxNjk2LWQ5OWZjMDdlLTg1M2YtNDc4NS1hNDg5LWY3M2U0ZmM4MDBhYy5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwODMwJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDgzMFQwNTQ4MzVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT01YzQwZjJjYzk3NjIzOWQ4ZTYxYmZiMzkyY2ViN2IyODJkNzYzODkzYzU4MmZkM2I4NGEzN2ZmM2U0OTY1MGZjJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.M-cK2OBAuQZBvKwJ9DG2JuaX5sRGTCOazxdWJLa4LLk)

![Alt Text](https://private-user-images.githubusercontent.com/114816381/483851706-305159f5-8dae-4b8b-8082-fca8ff73dfe0.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTY1MzMyMTUsIm5iZiI6MTc1NjUzMjkxNSwicGF0aCI6Ii8xMTQ4MTYzODEvNDgzODUxNzA2LTMwNTE1OWY1LThkYWUtNGI4Yi04MDgyLWZjYThmZjczZGZlMC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwODMwJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDgzMFQwNTQ4MzVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0wZDk5ZmRmMTlmNDgwM2I1MDM3YmJiNzJmNmY0MTVkZTY0ZWMwNTBkNjdjNjA4NmI4OWFkOTI2OTYxODg2N2UwJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.Kmu55kJAGc1ENi2JO5cAaRWe3K0Gmr-Q-ccd4yq6jLw)

![Alt Text](https://private-user-images.githubusercontent.com/114816381/483851728-c582e0fd-229e-401b-ac63-1b85d12bd346.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTY1MzMyMTUsIm5iZiI6MTc1NjUzMjkxNSwicGF0aCI6Ii8xMTQ4MTYzODEvNDgzODUxNzI4LWM1ODJlMGZkLTIyOWUtNDAxYi1hYzYzLTFiODVkMTJiZDM0Ni5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwODMwJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDgzMFQwNTQ4MzVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT03ZGUwMzAzZjA3ZGVmYThlZjViYzQxNGM5ODEzOGNmYTVkYTNkMmVhMzg1NjMxYmQ4ZWM1OWYwMzIxNjE1ZGZjJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.hF8qwXZUmw9eoKT6sz4oqNNUi7DxMpJPQu5ttcXLnhU)

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # App screens
├── services/       # API and location services
├── navigation/     # Navigation setup
├── types/          # TypeScript definitions
├── utils/          # Helper functions
└── config/         # App configuration
```

## Known Limitations

- Maps require API key for full functionality on real devices
- Location services need device permissions
