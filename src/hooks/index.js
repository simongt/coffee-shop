import * as React from 'react';

// use interval hook
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

export const OrdersContext = React.createContext();
