# Coffee Shop App Style Guide

## Overview

This style guide establishes coding standards and best practices for the Coffee Shop app going forward. It covers React, TypeScript, and modern development patterns to ensure consistency, maintainability, and code quality.

## TypeScript Standards

### 1. Strict TypeScript Configuration

**Configuration**: Use strict TypeScript settings for maximum type safety
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### 2. Type Definitions

**Interfaces vs Types**: Prefer interfaces for object shapes, types for unions/primitives
```typescript
// ✅ Good: Interface for object shapes
interface MenuItem {
  id: string;
  name: string;
  duration: number;
  price?: number;
}

// ✅ Good: Type for unions
type OrderStatus = 'queued' | 'preparing' | 'ready' | 'picked-up';

// ❌ Avoid: Type for object shapes
type MenuItem = {
  id: string;
  name: string;
  duration: number;
};
```

### 3. Function Type Definitions

**Explicit Return Types**: Always define return types for functions
```typescript
// ✅ Good: Explicit return types
const calculateTotal = (items: MenuItem[]): number => {
  return items.reduce((total, item) => total + (item.price || 0), 0);
};

// ✅ Good: Async function types
const fetchMenuItems = async (): Promise<MenuItem[]> => {
  const response = await api.get('/menu');
  return response.data;
};

// ❌ Avoid: Implicit return types
const calculateTotal = (items: MenuItem[]) => {
  return items.reduce((total, item) => total + (item.price || 0), 0);
};
```

### 4. Generic Types

**Use Generics**: Leverage generics for reusable components and functions
```typescript
// ✅ Good: Generic component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

const List = <T,>({ items, renderItem, keyExtractor }: ListProps<T>) => {
  return (
    <FlatList
      data={items}
      renderItem={({ item }) => renderItem(item)}
      keyExtractor={keyExtractor}
    />
  );
};

// ✅ Good: Generic hook
const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue] as const;
};
```

## React Standards

### 1. Functional Components Only

**No Class Components**: Use functional components with hooks exclusively
```typescript
// ✅ Good: Functional component
const MenuScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { menuItems } = useMenuItems();

  return (
    <View style={styles.container}>
      {loading ? <LoadingSpinner /> : <MenuList items={menuItems} />}
    </View>
  );
};

// ❌ Avoid: Class components
class MenuScreen extends React.Component {
  state = { loading: true };
  
  render() {
    return <View />;
  }
}
```

### 2. Hook Usage Patterns

**Custom Hooks**: Extract reusable logic into custom hooks
```typescript
// ✅ Good: Custom hook for order management
const useOrderQueue = () => {
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
  
  return {
    queue,
    addToQueue,
    removeFromQueue,
    getCurrentOrder,
  };
};

// ✅ Good: Hook composition
const useOrderManagement = () => {
  const queue = useOrderQueue();
  const pickup = useOrderPickup();
  
  const moveToPickup = useCallback((orderId: string) => {
    const order = queue.getCurrentOrder();
    if (order && order.id === orderId) {
      queue.removeFromQueue(orderId);
      pickup.addToPickup(order);
    }
  }, [queue, pickup]);
  
  return {
    ...queue,
    ...pickup,
    moveToPickup,
  };
};
```

### 3. Memoization Best Practices

**Strategic Memoization**: Use React.memo, useMemo, and useCallback appropriately
```typescript
// ✅ Good: Memoized component with proper dependencies
const MenuItem = React.memo<MenuItemProps>(({ item, onPress, variant }) => {
  const handlePress = useCallback(() => {
    onPress(item);
  }, [item, onPress]);
  
  const gradientColors = useMemo(() => {
    return getGradientColors(variant);
  }, [variant]);
  
  return (
    <TouchableOpacity onPress={handlePress}>
      <LinearGradient colors={gradientColors}>
        <Text>{item.name}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
});

// ✅ Good: Memoized expensive calculations
const useFilteredMenuItems = (searchTerm: string) => {
  const { menuItems } = useMenuItems();
  
  return useMemo(() => {
    if (!searchTerm) return menuItems;
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [menuItems, searchTerm]);
};
```

### 4. Error Handling

**Error Boundaries**: Implement error boundaries for component error handling
```typescript
// ✅ Good: Error boundary component
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Error boundary caught error', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// ✅ Good: Hook for error handling
const useErrorHandler = () => {
  const [error, setError] = useState<Error | null>(null);
  
  const handleError = useCallback((error: Error) => {
    setError(error);
    logger.error('Application error', { error });
  }, []);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return { error, handleError, clearError };
};
```

## State Management Standards

### 1. Context Usage

**Split Contexts**: Use multiple contexts for different concerns
```typescript
// ✅ Good: Separate contexts for different domains
const OrderQueueContext = createContext<OrderQueueContextType>();
const OrderPickupContext = createContext<OrderPickupContextType>();
const UserContext = createContext<UserContextType>();

// ✅ Good: Context provider with proper typing
const OrderQueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queue, setQueue] = useState<Order[]>([]);
  
  const value = useMemo(() => ({
    queue,
    addToQueue: (order: Order) => setQueue(prev => [...prev, order]),
    removeFromQueue: (orderId: string) => setQueue(prev => prev.filter(o => o.id !== orderId)),
  }), [queue]);
  
  return (
    <OrderQueueContext.Provider value={value}>
      {children}
    </OrderQueueContext.Provider>
  );
};
```

### 2. Redux Toolkit (When Needed)

**Slice Pattern**: Use Redux Toolkit slices for complex state management
```typescript
// ✅ Good: Redux Toolkit slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addToQueue: (state, action: PayloadAction<Order>) => {
      state.queue.push(action.payload);
    },
    removeFromQueue: (state, action: PayloadAction<string>) => {
      state.queue = state.queue.filter(order => order.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.queue = action.payload;
      });
  },
});

// ✅ Good: Async thunk
export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async (menuItem: MenuItem, { rejectWithValue }) => {
    try {
      const response = await api.post('/orders', menuItem);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

## Component Architecture

### 1. Component Structure

**Consistent File Structure**: Follow consistent file organization
```typescript
// ✅ Good: Component file structure
// src/components/MenuItem/MenuItem.tsx
import React, { memo, useCallback, useMemo } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { MenuItemProps } from './MenuItem.types';
import { styles } from './MenuItem.styles';
import { useMenuItem } from './useMenuItem';

const MenuItem: React.FC<MenuItemProps> = memo(({ item, onPress, variant }) => {
  const { handlePress, gradientColors } = useMenuItem({ item, onPress, variant });
  
  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <Text style={styles.text}>{item.name}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
});

MenuItem.displayName = 'MenuItem';

export default MenuItem;
```

### 2. Component Composition

**Composition Over Inheritance**: Use composition for component reuse
```typescript
// ✅ Good: Component composition
const MenuList: React.FC<MenuListProps> = ({ items, onItemPress }) => {
  const renderItem = useCallback(({ item }: { item: MenuItem }) => (
    <MenuItem item={item} onPress={onItemPress} />
  ), [onItemPress]);
  
  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

// ✅ Good: Higher-order component
const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error }>
) => {
  return (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
};
```

## Testing Standards

### 1. Component Testing

**Comprehensive Testing**: Test components thoroughly
```typescript
// ✅ Good: Component test
describe('MenuItem', () => {
  const mockOnPress = jest.fn();
  const mockItem: MenuItem = {
    id: 'test-1',
    name: 'Test Coffee',
    duration: 5,
  };

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('renders correctly', () => {
    render(<MenuItem item={mockItem} onPress={mockOnPress} />);
    
    expect(screen.getByText('Test Coffee')).toBeInTheDocument();
  });

  it('calls onPress when pressed', () => {
    render(<MenuItem item={mockItem} onPress={mockOnPress} />);
    
    fireEvent.press(screen.getByText('Test Coffee'));
    
    expect(mockOnPress).toHaveBeenCalledWith(mockItem);
  });

  it('applies correct styles based on variant', () => {
    render(<MenuItem item={mockItem} onPress={mockOnPress} variant="queue" />);
    
    const container = screen.getByText('Test Coffee').parent;
    expect(container).toHaveStyle({ backgroundColor: Colors.secondaryDark });
  });
});
```

### 2. Hook Testing

**Hook Testing**: Test custom hooks thoroughly
```typescript
// ✅ Good: Hook test
describe('useOrderQueue', () => {
  it('manages queue state correctly', () => {
    const { result } = renderHook(() => useOrderQueue());
    
    expect(result.current.queue).toEqual([]);
    
    act(() => {
      result.current.addToQueue({ id: '1', name: 'Coffee', duration: 5 });
    });
    
    expect(result.current.queue).toHaveLength(1);
    expect(result.current.queue[0].name).toBe('Coffee');
  });

  it('removes items from queue', () => {
    const { result } = renderHook(() => useOrderQueue());
    
    act(() => {
      result.current.addToQueue({ id: '1', name: 'Coffee', duration: 5 });
      result.current.addToQueue({ id: '2', name: 'Tea', duration: 3 });
    });
    
    expect(result.current.queue).toHaveLength(2);
    
    act(() => {
      result.current.removeFromQueue('1');
    });
    
    expect(result.current.queue).toHaveLength(1);
    expect(result.current.queue[0].name).toBe('Tea');
  });
});
```

## Performance Standards

### 1. Render Optimization

**Performance Budgets**: Maintain performance budgets
```typescript
// ✅ Good: Performance monitoring
const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    
    if (renderCount.current > 10) {
      logger.warn(`${componentName} has rendered ${renderCount.current} times`);
    }
  });
};

// ✅ Good: Performance wrapper
const withPerformanceMonitoring = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  return (props: P) => {
    usePerformanceMonitor(componentName);
    return <Component {...props} />;
  };
};
```

### 2. Memory Management

**Memory Leaks**: Prevent memory leaks
```typescript
// ✅ Good: Proper cleanup
const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);
  
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  
  useEffect(() => {
    if (delay === null) return;
    
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
};

// ✅ Good: Event listener cleanup
const useEventListener = (eventName: string, handler: EventListener) => {
  useEffect(() => {
    document.addEventListener(eventName, handler);
    return () => document.removeEventListener(eventName, handler);
  }, [eventName, handler]);
};
```

## Code Organization

### 1. File Naming

**Consistent Naming**: Use consistent file naming conventions
```
src/
├── components/
│   ├── MenuItem/
│   │   ├── MenuItem.tsx
│   │   ├── MenuItem.types.ts
│   │   ├── MenuItem.styles.ts
│   │   ├── useMenuItem.ts
│   │   └── index.ts
│   └── index.ts
├── hooks/
│   ├── useOrderQueue.ts
│   ├── useOrderPickup.ts
│   └── index.ts
├── utils/
│   ├── validation.ts
│   ├── formatting.ts
│   └── index.ts
└── types/
    ├── order.ts
    ├── menu.ts
    └── index.ts
```

### 2. Import Organization

**Import Order**: Organize imports consistently
```typescript
// ✅ Good: Organized imports
// 1. React and React Native
import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// 2. Third-party libraries
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

// 3. Internal components
import { MenuItem } from '../components/MenuItem';
import { LoadingSpinner } from '../components/LoadingSpinner';

// 4. Hooks and utilities
import { useOrderQueue } from '../hooks/useOrderQueue';
import { formatPrice } from '../utils/formatting';

// 5. Types
import { MenuItem as MenuItemType } from '../types/menu';

// 6. Styles
import { styles } from './MenuScreen.styles';
```

## Documentation Standards

### 1. JSDoc Comments

**Comprehensive Documentation**: Document all public APIs
```typescript
/**
 * Custom hook for managing order queue state and operations.
 * 
 * Provides functionality to add, remove, and query orders in the queue.
 * Uses React Context internally for state management.
 * 
 * @returns {Object} Object containing queue state and operations
 * @returns {Order[]} returns.queue - Current queue of orders
 * @returns {Function} returns.addToQueue - Function to add order to queue
 * @returns {Function} returns.removeFromQueue - Function to remove order from queue
 * @returns {Function} returns.getCurrentOrder - Function to get current order being processed
 * 
 * @example
 * ```typescript
 * const { queue, addToQueue, removeFromQueue } = useOrderQueue();
 * 
 * addToQueue({ id: '1', name: 'Coffee', duration: 5 });
 * const currentOrder = getCurrentOrder();
 * ```
 */
const useOrderQueue = () => {
  // Implementation
};
```

### 2. README Documentation

**Project Documentation**: Maintain comprehensive project documentation
```markdown
# Component Name

Brief description of what this component does.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| item | MenuItem | Yes | - | The menu item to display |
| onPress | (item: MenuItem) => void | Yes | - | Callback when item is pressed |
| variant | 'menu' \| 'queue' \| 'pickup' | No | 'menu' | Visual variant of the component |

## Usage

```typescript
import { MenuItem } from '../components/MenuItem';

<MenuItem 
  item={menuItem} 
  onPress={handleItemPress}
  variant="queue"
/>
```

## Examples

- Basic usage
- With custom styling
- In different contexts
```

This style guide ensures consistent, maintainable, and high-quality code across the Coffee Shop app development team.

