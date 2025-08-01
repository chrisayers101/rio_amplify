# Technology Stack Analysis

## Frontend Framework & Build Tools
- **Vue.js 3.5.13** - Modern reactive framework with Composition API
- **TypeScript 5.8.3** - Static typing and enhanced developer experience
- **Vite 6.0.11** - Fast build tool and dev server with Vue plugin
- **Vue Router 4.5.0** - Client-side routing with authentication guards
- **Pinia 2.3.1** - State management with TypeScript support

## AWS Amplify Integration
- **AWS Amplify 6.15.4** - Full-stack development platform
- **@aws-amplify/ui-vue 4.2.30** - Pre-built UI components
- **@aws-amplify/backend 1.16.1** - Backend-as-a-Service
- **Authentication** - Email-based login with Cognito User Pools
- **Data Storage** - DynamoDB integration with GraphQL schema
- **File Storage** - S3 bucket with authenticated access patterns

## AWS Services Integration
- **DynamoDB** - NoSQL database for entity storage
- **S3 Storage** - File upload/download with presigned URLs
- **Cognito** - User authentication and management
- **AWS SDK v3** - Multiple service clients (Bedrock, SES, SSM, Scheduler)



## Styling & UI
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Heroicons 2.2.0** - SVG icon library
- **Custom CSS** - Mobile optimizations and responsive design
- **PostCSS 8.4.35** - CSS processing

## Development Tools
- **ESLint 9.18.0** - Code linting with Vue and TypeScript rules
- **Prettier 3.4.2** - Code formatting
- **Vitest 3.0.5** - Unit testing framework
- **Vue Test Utils 2.4.6** - Vue component testing

## Key Features & Architecture

### Authentication System
- Email-based authentication using AWS Cognito
- Route guards for protected pages
- Automatic redirects based on auth state
- Sign-out functionality with navigation

### Data Management
- **Entity Store** - CRUD operations for DynamoDB entities
- **Auth Store** - User authentication state management
- **Session Store** - Session tracking (placeholder for future features)

### File Storage System
- S3 integration for file uploads/downloads
- Presigned URL generation for secure file access
- File listing and management interface
- Support for multiple file types

### Mobile-First Design
- Responsive layout with mobile optimizations
- Viewport handling for mobile browsers
- Touch-friendly interface elements
- iOS Safari compatibility fixes

### Performance Optimizations
- Code splitting with manual chunks
- Lazy loading for route components
- Optimized build configuration
- Mobile viewport height calculations

### Development Experience
- Hot module replacement with Vite
- TypeScript strict mode configuration
- ESLint and Prettier integration
- Comprehensive testing setup

## Project Structure
```
src/
├── components/     # Reusable Vue components
├── stores/        # Pinia state management
├── views/         # Route components
├── utils/         # Utility functions
├── interfaces/    # TypeScript interfaces
├── assets/        # CSS and static assets
└── router/        # Vue Router configuration
```

## Backend Configuration
- **Amplify Backend** - Infrastructure as code
- **Auth Resource** - Cognito configuration
- **Data Resource** - DynamoDB schema definition
- **Storage Resource** - S3 bucket configuration

## Notable Dependencies
- **AJV** - JSON Schema validation
- **Lambda Stream** - AWS Lambda utilities

- **MCP Knowledge Graph** - AI knowledge management

## Summary

This is a modern full-stack web application built with **Vue.js 3** and **TypeScript**, powered by **AWS Amplify** for backend services. The application features a comprehensive authentication system using AWS Cognito, DynamoDB for data storage, and S3 for file management. The frontend utilizes **Pinia** for state management, **Vue Router** for navigation with authentication guards, and **Tailwind CSS** for responsive, mobile-first styling. The project includes comprehensive development tooling including ESLint, Prettier, and Vitest for testing. The architecture is designed for scalability with code splitting, lazy loading, and optimized build configurations, making it a robust foundation for modern web applications with cloud-native backend services. 