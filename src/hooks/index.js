import * as React from 'react';

/**
 * Custom hook that provides a stable interval mechanism for periodic operations.
 * 
 * This hook is used primarily in the QueueScreen to update progress bars
 * for order preparation. It ensures the callback is always up-to-date and
 * properly cleans up intervals to prevent memory leaks.
 * 
 * @param {Function} callback - Function to execute on each interval
 * @param {number|null} delay - Interval delay in milliseconds, null to stop
 */
export const useInterval = (callback, delay) => {
  const savedCallback = React.useRef();

  React.useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useLayoutEffect(() => {
    tick = () => {
      savedCallback.current();
    };

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

/**
 * React Context for managing global order state across the application.
 * 
 * This context provides access to:
 * - queue: Array of orders currently being prepared
 * - setQueue: Function to update the queue state
 * - pickup: Array of completed orders ready for pickup
 * - setPickup: Function to update the pickup state
 * 
 * Used throughout the app to maintain consistent order state between
 * the Menu, Queue, and Pickup screens.
 */
export const OrdersContext = React.createContext();
