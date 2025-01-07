# Coffee Shop App Anti-Patterns & Technical Debt

## Overview

This document identifies the legacy patterns, code smells, and technical debt present in the Coffee Shop app. While the app demonstrates functional React Native development, it contains several anti-patterns that would be addressed in a modern refactoring.

## Critical Anti-Patterns

### 1. Inconsistent Function Declaration Patterns

**Problem**: Mixing arrow functions and traditional function declarations
```javascript
// ❌ Anti-pattern: Inconsistent function declarations
const MenuScreen = (props: Props): React$Node => {
  onMenuItemPress = item => { /* ... */ }  // Missing const/let
  renderItem = ({ item }) => { /* ... */ } // Missing const/let
}

// ✅ Modern pattern: Consistent arrow functions
const MenuScreen = (props: Props): React$Node => {
  const onMenuItemPress = (item) => { /* ... */ }
  const renderItem = ({ item }) => { /* ... */ }
}
```

**Impact**: 
- Causes global scope pollution
- Inconsistent code style
- Potential runtime errors
- Harder to debug and maintain

### 2. Missing TypeScript Strict Typing

**Problem**: Using Flow types with implicit `any` and loose typing
```javascript
// ❌ Anti-pattern: Loose typing
type Props = {
  children?: React.Node  // Optional but no default
}

// ✅ Modern pattern: Strict TypeScript
interface Props {
  children?: React.ReactNode;
}

// ❌ Anti-pattern: Implicit any in function parameters
onMenuItemPress = item => { /* ... */ }

// ✅ Modern pattern: Explicit typing
const onMenuItemPress = (item: MenuItem): void => { /* ... */ }
```

**Impact**:
- Runtime type errors
- Poor IDE support
- Harder refactoring
- No compile-time safety

### 3. Inefficient Re-rendering Patterns

**Problem**: Missing memoization and stable references
```javascript
// ❌ Anti-pattern: New function on every render
renderItem = ({ item }) => (
  <MenuItem item={item} onPress={() => this.onMenuItemPress(item)} />
)

// ✅ Modern pattern: Stable callback with useCallback
const renderItem = useCallback(({ item }) => (
  <MenuItem item={item} onPress={() => onMenuItemPress(item)} />
), [onMenuItemPress])
```

**Impact**:
- Unnecessary re-renders
- Performance degradation
- Poor user experience
- Battery drain on mobile

### 4. Prop Drilling Through Context

**Problem**: Passing unused props through multiple levels
```javascript
// ❌ Anti-pattern: Unused props being passed
<Stack.Screen
  name='Main'
  children={() => <MainTabs {...props} />}  // props never used
/>

// ✅ Modern pattern: Only pass what's needed
<Stack.Screen
  name='Main'
  component={MainTabs}
/>
```

**Impact**:
- Unclear data flow
- Harder to track dependencies
- Potential performance issues
- Confusing component interfaces

## Code Smells

### 1. Magic Numbers and Hardcoded Values

**Problem**: Hardcoded values throughout the codebase
```javascript
// ❌ Anti-pattern: Magic numbers
useInterval(() => { /* ... */ }, 100);  // Why 100ms?
setProgress(progress + (ANIMATION_SPEED * 10) / currentOrder.duration);

// ✅ Modern pattern: Named constants
const PROGRESS_UPDATE_INTERVAL = 100;
const PROGRESS_MULTIPLIER = 10;
```

### 2. Console.log Debugging

**Problem**: Production code with debug statements
```javascript
// ❌ Anti-pattern: Debug code in production
console.log('====================================');
console.log(`[MenuScreen] Menu item pressed for ${item.name}`);
console.table(queue);

// ✅ Modern pattern: Proper logging
import { logger } from '../utils/logger';
logger.info('Menu item pressed', { itemName: item.name });
```

### 3. Inconsistent Error Handling

**Problem**: Inconsistent try-catch patterns
```javascript
// ❌ Anti-pattern: Generic error handling
try {
  Orders.setQueue(orders => { /* ... */ });
} catch (error) {
  Toast.show(`Could not place order for ${item.name}.`, LONG_TOAST);
}

// ✅ Modern pattern: Specific error handling
try {
  Orders.setQueue(orders => { /* ... */ });
} catch (error) {
  logger.error('Failed to place order', { error, itemName: item.name });
  Toast.show(`Could not place order for ${item.name}.`, LONG_TOAST);
}
```

### 4. Duplicate Code Patterns

**Problem**: Repeated styling and component patterns
```javascript
// ❌ Anti-pattern: Duplicate styles across screens
const styles = StyleSheet.create({
  container: { /* same styles in 3 files */ },
  menuItem: { /* same styles in 3 files */ },
  menuItemText: { /* same styles in 3 files */ }
});

// ✅ Modern pattern: Shared components and styles
import { MenuItem } from '../components/MenuItem';
import { commonStyles } from '../styles/common';
```

## Performance Anti-Patterns

### 1. Inefficient List Rendering

**Problem**: Missing FlatList optimizations
```javascript
// ❌ Anti-pattern: Missing FlatList optimizations
<FlatList
  data={MENU}
  renderItem={this.renderItem}
  keyExtractor={item => `${item.id}`}
/>

// ✅ Modern pattern: Optimized FlatList
<FlatList
  data={MENU}
  renderItem={renderItem}
  keyExtractor={useCallback((item) => item.id, [])}
  getItemLayout={getItemLayout}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
/>
```

### 2. Unstable Callback References

**Problem**: New functions created on every render
```javascript
// ❌ Anti-pattern: Unstable callbacks
onPress={() => this.onMenuItemPress(item)}

// ✅ Modern pattern: Stable callbacks
const handlePress = useCallback((item) => {
  onMenuItemPress(item);
}, [onMenuItemPress]);
```

### 3. Missing Loading State Management

**Problem**: Inconsistent loading patterns
```javascript
// ❌ Anti-pattern: Loading state based on data availability
useFocusEffect(() => {
  if (Array.isArray(Orders.queue) && Array.isArray(Orders.pickup) && MENU) {
    setLoading(false);
  }
}, [loading]);

// ✅ Modern pattern: Proper loading state
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const initializeData = async () => {
    try {
      // Validate data
      setIsLoading(false);
    } catch (err) {
      setError(err);
    }
  };
  initializeData();
}, []);
```

## State Management Anti-Patterns

### 1. Single Context for Everything

**Problem**: All state in one context
```javascript
// ❌ Anti-pattern: Monolithic context
const OrdersContext = React.createContext();

// ✅ Modern pattern: Split contexts
const OrderQueueContext = React.createContext();
const OrderPickupContext = React.createContext();
```

### 2. Direct State Mutations

**Problem**: Complex state updates in components
```javascript
// ❌ Anti-pattern: Complex state logic in component
Orders.setQueue(previousQueue => {
  const queue = previousQueue.filter(order => order.id !== currentOrder.id);
  return queue;
});

// ✅ Modern pattern: State logic in custom hooks
const { removeFromQueue, addToPickup } = useOrderActions();
```

### 3. Missing State Validation

**Problem**: No validation of state updates
```javascript
// ❌ Anti-pattern: No validation
const order = {
  id: item.id + '--' + uuidv4(),
  name: item.name,
  duration: item.duration,
  createdAt: Date.now()
};

// ✅ Modern pattern: Validation
const order = validateOrder({
  id: `${item.id}--${uuidv4()}`,
  name: item.name,
  duration: item.duration,
  createdAt: Date.now()
});
```

## Navigation Anti-Patterns

### 1. Inline Navigation Options

**Problem**: Navigation configuration mixed with component logic
```javascript
// ❌ Anti-pattern: Inline navigation options
<Tab.Screen
  name='Queue'
  children={() => <Queue {...props} />}
  options={{
    tabBarLabel: 'queue',
    tabBarBadge: Orders.queue.length === 0 ? null : `${Orders.queue.length}`,
    // ... more inline options
  }}
/>

// ✅ Modern pattern: Separated navigation config
const queueScreenOptions = (ordersCount) => ({
  tabBarLabel: 'queue',
  tabBarBadge: ordersCount === 0 ? null : `${ordersCount}`,
});
```

### 2. Missing Type Safety in Navigation

**Problem**: No typed navigation parameters
```javascript
// ❌ Anti-pattern: No navigation typing
type Props = {
  children?: React.Node
};

// ✅ Modern pattern: Typed navigation
type RootStackParamList = {
  Main: undefined;
};

type MainTabParamList = {
  Order: undefined;
  Queue: undefined;
  Pickup: undefined;
};
```

## Testing Anti-Patterns

### 1. Minimal Testing Coverage

**Problem**: Only basic snapshot testing
```javascript
// ❌ Anti-pattern: Minimal testing
it('renders correctly', () => {
  renderer.create(<App />);
});

// ✅ Modern pattern: Comprehensive testing
describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
  });

  it('provides order context', () => {
    render(<App />);
    expect(screen.getByTestId('order-context')).toBeInTheDocument();
  });
});
```

### 2. Missing Component Tests

**Problem**: No individual component testing
```javascript
// ❌ Anti-pattern: No component tests
// Missing tests for MenuScreen, QueueScreen, PickupScreen

// ✅ Modern pattern: Component tests
describe('MenuScreen', () => {
  it('displays menu items', () => {
    render(<MenuScreen />);
    expect(screen.getByText('café au lait')).toBeInTheDocument();
  });

  it('handles order placement', () => {
    render(<MenuScreen />);
    fireEvent.press(screen.getByText('cappuccino'));
    expect(mockSetQueue).toHaveBeenCalled();
  });
});
```

## Security Anti-Patterns

### 1. No Input Validation

**Problem**: No validation of user inputs or data
```javascript
// ❌ Anti-pattern: No validation
const order = {
  id: item.id + '--' + uuidv4(),
  name: item.name,  // Could be malicious
  duration: item.duration,  // Could be negative
};

// ✅ Modern pattern: Input validation
const order = {
  id: validateId(`${item.id}--${uuidv4()}`),
  name: validateName(item.name),
  duration: validateDuration(item.duration),
};
```

### 2. Hardcoded Sensitive Data

**Problem**: Sensitive configuration in code
```javascript
// ❌ Anti-pattern: Hardcoded values
export const ANIMATION_SPEED = 4; // cuz aint nobody got time

// ✅ Modern pattern: Environment-based configuration
export const ANIMATION_SPEED = process.env.ANIMATION_SPEED || 4;
```

## Accessibility Anti-Patterns

### 1. Missing Accessibility Props

**Problem**: No accessibility support
```javascript
// ❌ Anti-pattern: No accessibility
<TouchableOpacity onPress={onPress} style={styles.menuItem}>

// ✅ Modern pattern: Accessibility support
<TouchableOpacity 
  onPress={onPress} 
  style={styles.menuItem}
  accessible={true}
  accessibilityLabel={`Order ${item.name}`}
  accessibilityHint="Double tap to place order"
>
```

### 2. No Screen Reader Support

**Problem**: Missing screen reader announcements
```javascript
// ❌ Anti-pattern: No screen reader support
Toast.show(`Order placed for ${item.name}.`, SHORT_TOAST);

// ✅ Modern pattern: Screen reader support
Toast.show(`Order placed for ${item.name}.`, SHORT_TOAST);
AccessibilityInfo.announceForAccessibility(`Order placed for ${item.name}`);
```

## Recommendations for Modernization

### Immediate Fixes (High Priority)
1. **Fix function declarations** - Add missing const/let
2. **Add TypeScript** - Replace Flow with strict TypeScript
3. **Implement proper error handling** - Add error boundaries
4. **Add input validation** - Validate all user inputs
5. **Fix accessibility** - Add accessibility props

### Medium Priority
1. **Split contexts** - Separate concerns into multiple contexts
2. **Add comprehensive testing** - Unit and integration tests
3. **Optimize performance** - Add memoization and stable callbacks
4. **Extract shared components** - Reduce code duplication
5. **Add proper logging** - Replace console.log with proper logging

### Long-term Improvements
1. **Add state persistence** - AsyncStorage or database
2. **Implement offline support** - Service workers or offline-first
3. **Add analytics** - User behavior tracking
4. **Implement push notifications** - Order status updates
5. **Add payment integration** - Real payment processing

