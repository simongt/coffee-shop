# Coffee Shop App Refactoring Guide

## Overview

This document provides a comprehensive step-by-step refactoring plan to modernize the Coffee Shop app using current industry best practices. The refactoring focuses on TypeScript adoption, performance optimization, and architectural improvements.

## Phase 1: Foundation Modernization

### Step 1: TypeScript Migration

**Goal**: Replace Flow with strict TypeScript for better type safety and developer experience.

#### 1.1 Install TypeScript Dependencies
```bash
npm install --save-dev typescript @types/react @types/react-native @types/jest
npm install --save-dev @babel/preset-typescript
```

#### 1.2 Create TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es2017",
    "lib": ["es2017"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-native"
  },
  "include": ["src/**/*", "App.tsx"],
  "exclude": ["node_modules", "android", "ios"]
}
```

#### 1.3 Define Core Types
```typescript
// src/types/index.ts
export interface MenuItem {
  id: string;
  name: string;
  duration: number;
  price?: number;
  description?: string;
}

export interface Order {
  id: string;
  name: string;
  duration: number;
  createdAt: number;
  status: 'queued' | 'preparing' | 'ready' | 'picked-up';
}

export interface OrdersState {
  queue: Order[];
  pickup: Order[];
}

export interface OrdersContextType {
  queue: Order[];
  pickup: Order[];
  setQueue: React.Dispatch<React.SetStateAction<Order[]>>;
  setPickup: React.Dispatch<React.SetStateAction<Order[]>>;
}

export type RootStackParamList = {
  Main: undefined;
};

export type MainTabParamList = {
  Order: undefined;
  Queue: undefined;
  Pickup: undefined;
};
```

#### 1.4 Convert App.js to TypeScript
```typescript
// App.tsx
import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from './src/navigation';
import { Theme } from './src/styles';
import { OrdersContext, OrdersContextType } from './src/types';

const App: React.FC = () => {
  const scheme = useColorScheme();
  const [queue, setQueue] = useState<Order[]>([]);
  const [pickup, setPickup] = useState<Order[]>([]);

  const contextValue: OrdersContextType = {
    queue,
    pickup,
    setQueue,
    setPickup,
  };

  return (
    <AppearanceProvider>
      <StatusBar barStyle={Theme.barStyle} translucent={true} animated={true} />
      <OrdersContext.Provider value={contextValue}>
        <NavigationContainer theme={Theme}>
          <StackNavigator />
        </NavigationContainer>
      </OrdersContext.Provider>
    </AppearanceProvider>
  );
};

export default App;
```

### Step 2: Fix Function Declarations

**Goal**: Ensure all functions are properly declared with const/let.

#### 2.1 Update MenuScreen
```typescript
// src/screens/MenuScreen.tsx
import React, { useState, useCallback, useContext } from 'react';
import { /* ... */ } from 'react-native';
import { OrdersContext } from '../hooks';
import { MenuItem, Order } from '../types';

const MenuScreen: React.FC = () => {
  const { setQueue } = useContext(OrdersContext);
  const [loading, setLoading] = useState(true);

  const onMenuItemPress = useCallback((item: MenuItem): void => {
    try {
      const order: Order = {
        id: `${item.id}--${uuidv4()}`,
        name: item.name,
        duration: item.duration,
        createdAt: Date.now(),
        status: 'queued',
      };
      
      setQueue(prevQueue => [...prevQueue, order]);
      Toast.show(`Order placed for ${item.name}.`, SHORT_TOAST);
    } catch (error) {
      Toast.show(`Could not place order for ${item.name}.`, LONG_TOAST);
    }
  }, [setQueue]);

  const renderItem = useCallback(({ item }: { item: MenuItem }) => (
    <MenuItem item={item} onPress={() => onMenuItemPress(item)} />
  ), [onMenuItemPress]);

  // ... rest of component
};
```

### Step 3: Implement Proper Error Handling

**Goal**: Add comprehensive error handling with error boundaries and proper logging.

#### 3.1 Create Error Boundary
```typescript
// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => this.setState({ hasError: false })}
          >
            <Text style={styles.buttonText}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
```

#### 3.2 Create Logger Utility
```typescript
// src/utils/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
}

class Logger {
  private logs: LogEntry[] = [];

  private log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    this.logs.push(entry);
    
    if (__DEV__) {
      console[level](`[${entry.timestamp}] ${message}`, data);
    }
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }
}

export const logger = new Logger();
```

## Phase 2: Performance Optimization

### Step 4: Implement Memoization

**Goal**: Add React.memo and useMemo to prevent unnecessary re-renders.

#### 4.1 Optimize MenuItem Component
```typescript
// src/components/MenuItem.tsx
import React, { memo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { MenuItem as MenuItemType } from '../types';
import { Colors } from '../styles';

interface MenuItemProps {
  item: MenuItemType;
  onPress: (item: MenuItemType) => void;
  variant?: 'menu' | 'queue' | 'pickup';
}

const MenuItem: React.FC<MenuItemProps> = memo(({ 
  item, 
  onPress, 
  variant = 'menu' 
}) => {
  const handlePress = () => onPress(item);

  const getGradientColors = () => {
    switch (variant) {
      case 'queue':
        return [Colors.secondaryDark, Colors.gunmetal];
      case 'pickup':
        return [Colors.roseDust, Colors.eggplant];
      default:
        return [Colors.primaryLight, Colors.primaryDark];
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      style={styles.menuItem}
      accessible={true}
      accessibilityLabel={`Order ${item.name}`}
      accessibilityHint="Double tap to place order"
    >
      <LinearGradient
        colors={getGradientColors()}
        style={styles.menuItemGradient}
      >
        <Text style={styles.menuItemText}>{item.name}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
});

MenuItem.displayName = 'MenuItem';

export default MenuItem;
```

#### 4.2 Optimize FlatList Rendering
```typescript
// src/screens/MenuScreen.tsx
const MenuScreen: React.FC = () => {
  // ... existing code ...

  const keyExtractor = useCallback((item: MenuItem) => item.id, []);
  
  const getItemLayout = useCallback((data: MenuItem[] | null, index: number) => ({
    length: 80, // Fixed height for menu items
    offset: 80 * index,
    index,
  }), []);

  const ListHeaderComponent = useMemo(() => (
    <Text style={styles.screenHeaderText}>order menu</Text>
  ), []);

  const ListEmptyComponent = useMemo(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.menuItemText}>
        The menu has no orderable items.
      </Text>
    </View>
  ), []);

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primaryDark, '#2D2A43', Colors.primaryDark]}>
        <FlatList
          data={MENU}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={ListEmptyComponent}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={5}
        />
      </LinearGradient>
    </View>
  );
};
```

### Step 5: Split Context for Better Performance

**Goal**: Separate concerns into multiple contexts to prevent unnecessary re-renders.

#### 5.1 Create Separate Contexts
```typescript
// src/contexts/OrderQueueContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { Order } from '../types';

interface OrderQueueContextType {
  queue: Order[];
  addToQueue: (order: Order) => void;
  removeFromQueue: (orderId: string) => void;
  getCurrentOrder: () => Order | null;
}

const OrderQueueContext = createContext<OrderQueueContextType | undefined>(undefined);

export const OrderQueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queue, setQueue] = useState<Order[]>([]);

  const addToQueue = useCallback((order: Order) => {
    setQueue(prev => [...prev, order]);
  }, []);

  const removeFromQueue = useCallback((orderId: string) => {
    setQueue(prev => prev.filter(order => order.id !== orderId));
  }, []);

  const getCurrentOrder = useCallback(() => {
    return queue.length > 0 ? queue[0] : null;
  }, [queue]);

  const value = useMemo(() => ({
    queue,
    addToQueue,
    removeFromQueue,
    getCurrentOrder,
  }), [queue, addToQueue, removeFromQueue, getCurrentOrder]);

  return (
    <OrderQueueContext.Provider value={value}>
      {children}
    </OrderQueueContext.Provider>
  );
};

export const useOrderQueue = () => {
  const context = useContext(OrderQueueContext);
  if (!context) {
    throw new Error('useOrderQueue must be used within OrderQueueProvider');
  }
  return context;
};
```

## Phase 3: State Management Modernization

### Step 6: Implement Redux Toolkit (Optional)

**Goal**: For larger applications, consider Redux Toolkit for more complex state management.

#### 6.1 Install Redux Toolkit
```bash
npm install @reduxjs/toolkit react-redux
```

#### 6.2 Create Order Slice
```typescript
// src/store/slices/orderSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order, MenuItem } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface OrderState {
  queue: Order[];
  pickup: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  queue: [],
  pickup: [],
  loading: false,
  error: null,
};

export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async (menuItem: MenuItem) => {
    const order: Order = {
      id: `${menuItem.id}--${uuidv4()}`,
      name: menuItem.name,
      duration: menuItem.duration,
      createdAt: Date.now(),
      status: 'queued',
    };
    return order;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    moveToPickup: (state, action: PayloadAction<string>) => {
      const orderIndex = state.queue.findIndex(order => order.id === action.payload);
      if (orderIndex !== -1) {
        const order = state.queue[orderIndex];
        order.status = 'ready';
        state.pickup.push(order);
        state.queue.splice(orderIndex, 1);
      }
    },
    pickupOrder: (state, action: PayloadAction<string>) => {
      state.pickup = state.pickup.filter(order => order.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.queue.push(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to place order';
      });
  },
});

export const { moveToPickup, pickupOrder } = orderSlice.actions;
export default orderSlice.reducer;
```

## Phase 4: Testing Implementation

### Step 7: Add Comprehensive Testing

**Goal**: Implement unit tests, integration tests, and E2E tests.

#### 7.1 Install Testing Dependencies
```bash
npm install --save-dev @testing-library/react-native @testing-library/jest-native
npm install --save-dev @testing-library/react-hooks
```

#### 7.2 Create Component Tests
```typescript
// src/screens/__tests__/MenuScreen.test.tsx
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { OrderQueueProvider } from '../../contexts/OrderQueueContext';
import MenuScreen from '../MenuScreen';

const mockSetQueue = jest.fn();

jest.mock('../../contexts/OrderQueueContext', () => ({
  ...jest.requireActual('../../contexts/OrderQueueContext'),
  useOrderQueue: () => ({
    queue: [],
    addToQueue: mockSetQueue,
    removeFromQueue: jest.fn(),
    getCurrentOrder: jest.fn(),
  }),
}));

describe('MenuScreen', () => {
  beforeEach(() => {
    mockSetQueue.mockClear();
  });

  it('renders menu items', () => {
    render(
      <OrderQueueProvider>
        <MenuScreen />
      </OrderQueueProvider>
    );

    expect(screen.getByText('café au lait')).toBeInTheDocument();
    expect(screen.getByText('cappuccino')).toBeInTheDocument();
    expect(screen.getByText('espresso')).toBeInTheDocument();
  });

  it('handles order placement', () => {
    render(
      <OrderQueueProvider>
        <MenuScreen />
      </OrderQueueProvider>
    );

    fireEvent.press(screen.getByText('cappuccino'));
    
    expect(mockSetQueue).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'cappuccino',
        duration: 10,
      })
    );
  });
});
```

#### 7.3 Create Hook Tests
```typescript
// src/hooks/__tests__/useInterval.test.ts
import { renderHook } from '@testing-library/react-hooks';
import { useInterval } from '../useInterval';

describe('useInterval', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('calls callback at specified interval', () => {
    const callback = jest.fn();
    
    renderHook(() => useInterval(callback, 1000));
    
    expect(callback).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
    
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('cleans up interval on unmount', () => {
    const callback = jest.fn();
    const { unmount } = renderHook(() => useInterval(callback, 1000));
    
    unmount();
    
    jest.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled();
  });
});
```

## Phase 5: Accessibility & UX Improvements

### Step 8: Implement Accessibility Features

**Goal**: Make the app accessible to users with disabilities.

#### 8.1 Add Accessibility Props
```typescript
// src/components/MenuItem.tsx
const MenuItem: React.FC<MenuItemProps> = memo(({ item, onPress, variant }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      style={styles.menuItem}
      accessible={true}
      accessibilityLabel={`Order ${item.name}`}
      accessibilityHint="Double tap to place order"
      accessibilityRole="button"
      accessibilityState={{ selected: false }}
    >
      {/* ... rest of component */}
    </TouchableOpacity>
  );
});
```

#### 8.2 Add Screen Reader Support
```typescript
// src/utils/accessibility.ts
import { AccessibilityInfo } from 'react-native';

export const announceForAccessibility = (message: string) => {
  AccessibilityInfo.announceForAccessibility(message);
};

export const announceOrderPlaced = (itemName: string) => {
  announceForAccessibility(`Order placed for ${itemName}`);
};

export const announceOrderReady = (itemName: string) => {
  announceForAccessibility(`${itemName} is ready for pickup`);
};
```

## Phase 6: Performance Monitoring

### Step 9: Add Performance Monitoring

**Goal**: Monitor app performance and identify bottlenecks.

#### 9.1 Install Performance Monitoring
```bash
npm install react-native-performance
```

#### 9.2 Implement Performance Tracking
```typescript
// src/utils/performance.ts
import { PerformanceObserver, PerformanceEntry } from 'react-native-performance';

export const trackScreenLoad = (screenName: string) => {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry: PerformanceEntry) => {
      if (entry.entryType === 'measure') {
        console.log(`${screenName} load time:`, entry.duration);
      }
    });
  });
  
  observer.observe({ entryTypes: ['measure'] });
};

export const measureOrderPlacement = () => {
  const start = performance.now();
  
  return () => {
    const end = performance.now();
    console.log('Order placement time:', end - start);
  };
};
```

## Implementation Timeline

### Week 1: Foundation
- [ ] TypeScript migration
- [ ] Fix function declarations
- [ ] Add error boundaries

### Week 2: Performance
- [ ] Implement memoization
- [ ] Optimize FlatList
- [ ] Split contexts

### Week 3: Testing
- [ ] Add component tests
- [ ] Add hook tests
- [ ] Add integration tests

### Week 4: Polish
- [ ] Add accessibility features
- [ ] Implement performance monitoring
- [ ] Final testing and bug fixes

## Success Metrics

### Performance Improvements
- **Render Time**: Reduce component render time by 50%
- **Memory Usage**: Reduce memory footprint by 30%
- **Bundle Size**: Optimize bundle size by 20%

### Code Quality
- **Type Safety**: 100% TypeScript coverage
- **Test Coverage**: 80%+ test coverage
- **Accessibility**: WCAG 2.1 AA compliance

### Developer Experience
- **Build Time**: Reduce build time by 40%
- **Hot Reload**: Improve hot reload performance
- **IDE Support**: Better autocomplete and error detection

## Rollback Plan

### If Issues Arise
1. **Feature Flags**: Use feature flags for gradual rollout
2. **Branch Strategy**: Maintain separate branches for each phase
3. **Monitoring**: Monitor app performance and crash rates
4. **Quick Rollback**: Ability to revert to previous version within 1 hour

This refactoring plan provides a comprehensive approach to modernizing the Coffee Shop app while maintaining functionality and improving performance, maintainability, and user experience.

