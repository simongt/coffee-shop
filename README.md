# The Coffee Shop (React Native App)

A React Native demonstration application that simulates a coffee shop ordering system. This project serves as both a functional app and a case study in legacy codebase analysis and modernization.

## 📱 App Overview

The Coffee Shop app provides a complete customer journey from menu browsing to order pickup:

- **Menu Browsing**: View available coffee items with preparation times
- **Order Placement**: Tap items to add them to the preparation queue
- **Progress Tracking**: Real-time progress bars show order preparation status
- **Order Pickup**: Collect completed orders from the pickup counter

### Current Features
- Three coffee items: Café au lait (4s), Cappuccino (10s), Espresso (15s)
- Real-time order queue management with progress tracking
- Tab-based navigation with badge counts
- Toast notifications for user feedback
- Responsive design with gradient styling

## 🏗️ Architecture Analysis

### What Worked Well
- **Functional Components**: Modern React patterns with hooks throughout
- **Context-Based State**: Simple but effective state management for this use case
- **Custom Hooks**: Well-implemented `useInterval` hook with proper cleanup
- **Navigation Structure**: Clean tab-based navigation with React Navigation 5
- **Visual Design**: Consistent coffee shop theming with thoughtful color palette

### Where It Aged Poorly
- **Type Safety**: Using Flow instead of TypeScript with loose typing
- **Performance**: Missing memoization causing unnecessary re-renders
- **Code Quality**: Inconsistent function declarations and missing error handling
- **Testing**: Minimal test coverage with only basic snapshot tests
- **Accessibility**: No accessibility support for screen readers

### How We'd Do It Today
- **TypeScript**: Strict typing with proper interfaces and generics
- **Performance Optimization**: React.memo, useMemo, and optimized FlatList
- **State Management**: Split contexts or Redux Toolkit for complex state
- **Testing**: Comprehensive unit and integration tests
- **Accessibility**: Full WCAG 2.1 AA compliance
- **Error Handling**: Error boundaries and proper logging

## 📚 Documentation Set

This codebase has been thoroughly analyzed and documented. Here's what we found and how to modernize it:

### [FEATURES.md](FEATURES.md) - App Features & User Flows
Detailed breakdown of what the app does, user journeys, and technical features. Covers the complete order lifecycle from menu browsing to pickup.

### [ARCHITECTURE.md](ARCHITECTURE.md) - Data Flow & State Management
Comprehensive analysis of the app's architecture, data flow patterns, and state management approach. Includes component hierarchy and module interactions.

### [ANTIPATTERNS.md](ANTIPATTERNS.md) - Legacy Patterns & Technical Debt
Identifies critical anti-patterns, code smells, and performance issues. Covers everything from inconsistent function declarations to missing accessibility support.

### [REFACTORING.md](REFACTORING.md) - Modernization Roadmap
Step-by-step refactoring plan with modern best practices. Includes TypeScript migration, performance optimization, and testing implementation.

### [PERFORMANCE.md](PERFORMANCE.md) - Performance Analysis & Optimization
Detailed performance characteristics, bottlenecks, and optimization strategies. Covers render optimization, memory management, and monitoring.

### [STYLE_GUIDE.md](STYLE_GUIDE.md) - Coding Standards
Comprehensive style guide for React, TypeScript, and modern development patterns. Establishes standards for future development.

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ and npm/yarn
- React Native development environment
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation
```bash
# Clone the repository
git clone git@github.com:simongt/coffee-shop.git
cd coffee-shop

# Install dependencies
yarn install

# iOS (requires macOS)
yarn ios

# Android
yarn android
```

### Development
```bash
# Start Metro bundler
yarn start

# Run tests
yarn test

# Lint code
yarn lint
```

## 🛠️ Tech Stack

### Current Stack
- **React Native**: 0.63.2
- **React**: 16.13.1
- **React Navigation**: 5.x (Stack + Material Bottom Tabs)
- **State Management**: React Context
- **Styling**: React Native StyleSheet + Linear Gradients
- **Icons**: React Native Vector Icons (FontAwesome)
- **Notifications**: React Native Root Toast
- **Progress**: React Native Progress

### Recommended Modern Stack
- **React Native**: 0.72+
- **React**: 18.x
- **TypeScript**: 5.x with strict configuration
- **React Navigation**: 6.x with typed navigation
- **State Management**: Redux Toolkit or Zustand
- **Styling**: Styled Components or NativeWind
- **Testing**: React Native Testing Library + Jest
- **Performance**: React DevTools Profiler + Flipper

## 📊 Code Quality Metrics

### Current State
- **Type Safety**: 0% (Flow with loose typing)
- **Test Coverage**: <5% (basic snapshot tests only)
- **Performance**: Moderate (missing optimizations)
- **Accessibility**: 0% (no accessibility support)
- **Error Handling**: Basic (try-catch blocks only)

### Target State (After Refactoring)
- **Type Safety**: 100% (strict TypeScript)
- **Test Coverage**: 80%+ (comprehensive testing)
- **Performance**: Optimized (60-70% improvement)
- **Accessibility**: WCAG 2.1 AA compliant
- **Error Handling**: Comprehensive (error boundaries + logging)

## 🔧 Key Improvements Needed

### High Priority
1. **TypeScript Migration**: Replace Flow with strict TypeScript
2. **Performance Optimization**: Add memoization and optimize FlatList
3. **Error Handling**: Implement error boundaries and proper logging
4. **Testing**: Add comprehensive unit and integration tests

### Medium Priority
1. **State Management**: Split contexts or migrate to Redux Toolkit
2. **Accessibility**: Add screen reader support and accessibility props
3. **Code Quality**: Fix function declarations and add input validation
4. **Documentation**: Add JSDoc comments and component documentation

### Low Priority
1. **Bundle Optimization**: Code splitting and tree shaking
2. **Performance Monitoring**: Add performance tracking and monitoring
3. **Offline Support**: Implement offline-first architecture
4. **Analytics**: Add user behavior tracking

## 🤝 Contributing

This project serves as a learning resource for React Native development and legacy codebase modernization. Contributions are welcome in the form of:

- **Bug Fixes**: Address issues identified in the anti-patterns analysis
- **Performance Improvements**: Implement optimizations from the performance guide
- **Testing**: Add comprehensive tests following the testing standards
- **Documentation**: Improve and expand the documentation set

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **React Native Community**: For the excellent framework and ecosystem
- **React Navigation**: For the robust navigation solution
- **Coffee Shop Theme**: Inspired by real coffee shop experiences

---

*This codebase analysis was conducted as part of a comprehensive legacy codebase modernization project. The documentation provides a roadmap for bringing this app up to modern React Native development standards while maintaining its core functionality and user experience.*
