# Coffee Shop App Architecture

## Overview

The Coffee Shop app follows a simple but effective architecture pattern using React Native with React Context for state management. The application is structured around a single source of truth for order data that flows through three main screens.

## Architecture Pattern

### State Management Approach
- **React Context**: Single global context (`OrdersContext`) manages all order state
- **No External State Library**: Avoids Redux/Redux Toolkit complexity for this simple use case
- **Functional Components**: Modern React patterns with hooks throughout
- **Unidirectional Data Flow**: State flows down, actions flow up through context

## Data Flow Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   App.js        │    │  OrdersContext   │    │   Screens       │
│                 │    │                  │    │                 │
│ - Context       │───▶│ - queue[]        │───▶│ - MenuScreen    │
│   Provider      │    │ - pickup[]       │    │ - QueueScreen   │
│ - Navigation    │    │ - setQueue()     │    │ - PickupScreen  │
│   Container     │    │ - setPickup()    │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   Custom Hooks   │
                       │                  │
                       │ - useInterval()  │
                       │ - useFocusEffect │
                       └──────────────────┘
```

## Component Hierarchy

```
App.js
├── AppearanceProvider
├── StatusBar
├── OrdersContext.Provider
│   ├── NavigationContainer
│   │   └── StackNavigator
│   │       └── MainTabs
│   │           ├── MenuScreen
│   │           │   └── MenuItem
│   │           ├── QueueScreen
│   │           │   └── MenuItem (with progress)
│   │           └── PickupScreen
│   │               └── MenuItem
│   └── [Context Consumers]
└── [Global State]
```

## State Structure

### OrdersContext State
```javascript
{
  queue: [
    {
      id: "coffee-001--uuid",
      name: "cappuccino", 
      duration: 10,
      createdAt: 1640995200000
    }
  ],
  pickup: [
    {
      id: "coffee-002--uuid",
      name: "espresso",
      duration: 15,
      createdAt: 1640995200000
    }
  ],
  setQueue: (function),
  setPickup: (function)
}
```

### Menu Data Structure
```javascript
MENU: [
  {
    id: "coffee-001",
    name: "café au lait",
    duration: 4
  }
]
```

## Module Interactions

### 1. Navigation Module (`src/navigation/`)
- **StackNavigator**: Root navigation with header styling
- **MainTabs**: Tab-based navigation with badge counts
- **Integration**: Accesses OrdersContext for real-time badge updates

### 2. Screens Module (`src/screens/`)
- **MenuScreen**: Reads MENU data, writes to queue state
- **QueueScreen**: Reads queue state, writes to pickup state
- **PickupScreen**: Reads pickup state, removes from pickup state
- **Shared Patterns**: All screens use similar loading states and error handling

### 3. Hooks Module (`src/hooks/`)
- **useInterval**: Custom hook for progress tracking
- **OrdersContext**: Global state management
- **Integration**: Used by QueueScreen for real-time updates

### 4. Constants Module (`src/constants/`)
- **MENU**: Static menu data
- **Toast Configs**: Notification styling
- **Dimensions**: Screen size constants
- **Animation**: Progress update timing

### 5. Styles Module (`src/styles/`)
- **Colors**: Comprehensive color palette
- **Theme**: Navigation theme configuration
- **Consistency**: Centralized styling across components

## Data Flow Patterns

### Order Placement Flow
1. **User Action**: Tap menu item in MenuScreen
2. **State Update**: `setQueue()` adds order to queue
3. **UI Update**: Tab badge updates immediately
4. **Navigation**: User can switch to Queue tab to see order

### Order Processing Flow
1. **Timer**: `useInterval` hook runs every 100ms
2. **Progress Update**: Progress bar advances based on duration
3. **Completion Check**: When progress reaches 100%
4. **State Transfer**: Order moves from queue to pickup
5. **UI Update**: Badge counts update, toast notification shows

### Order Pickup Flow
1. **User Action**: Tap order in PickupScreen
2. **State Update**: `setPickup()` removes order from pickup
3. **UI Update**: Order disappears from list
4. **Feedback**: Toast notification confirms pickup

## Key Architectural Decisions

### 1. Context Over Redux
**Decision**: Use React Context instead of Redux
**Rationale**: 
- Simple state structure doesn't require Redux complexity
- Few state updates, no middleware needed
- Easier to understand and maintain
- Better performance for this use case

### 2. Functional Components
**Decision**: Use functional components with hooks
**Rationale**:
- Modern React patterns
- Better performance with hooks
- Easier testing and debugging
- Future-proof approach

### 3. Single Responsibility Screens
**Decision**: Each screen handles one specific workflow
**Rationale**:
- Clear separation of concerns
- Easy to understand and maintain
- Simple data flow between screens
- Reduced coupling between components

### 4. Custom Hook for Intervals
**Decision**: Create useInterval hook
**Rationale**:
- Reusable interval logic
- Proper cleanup to prevent memory leaks
- Stable callback references
- Better than setInterval in useEffect

## Performance Considerations

### Current Optimizations
- **useCallback**: Stable function references in useInterval
- **useLayoutEffect**: Prevents visual flicker in interval updates
- **FlatList**: Efficient list rendering for menu items
- **Memoization**: React.memo could be added for MenuItem components

### Potential Improvements
- **React.memo**: Memoize MenuItem components to prevent unnecessary re-renders
- **useMemo**: Memoize expensive calculations
- **Virtualization**: For larger menus, implement FlatList virtualization
- **State Normalization**: If menu grows, normalize state structure

## Error Handling

### Current Approach
- **Try-Catch Blocks**: Around state update operations
- **Toast Notifications**: User feedback for errors
- **Console Logging**: Developer debugging information
- **Graceful Degradation**: App continues working even if operations fail

### Areas for Improvement
- **Error Boundaries**: React error boundaries for component errors
- **Retry Logic**: Automatic retry for failed operations
- **Offline Handling**: Better offline state management
- **Validation**: Input validation for order data

## Testing Strategy

### Current Testing
- **Basic Snapshot**: App renders without crashing
- **No Unit Tests**: Missing component and hook tests
- **No Integration Tests**: Missing user flow tests

### Recommended Testing
- **Component Tests**: Test each screen component
- **Hook Tests**: Test useInterval and context usage
- **Integration Tests**: Test complete user flows
- **E2E Tests**: Test on real devices

## Scalability Considerations

### Current Limitations
- **Single Context**: All state in one context
- **No Persistence**: State lost on app restart
- **Limited Menu**: Static menu data
- **No Backend**: No server integration

### Scaling Strategies
- **Context Splitting**: Separate contexts for different domains
- **State Persistence**: AsyncStorage or database integration
- **API Integration**: Backend for menu and order management
- **State Normalization**: More complex state structure for larger apps

