import { createContext } from 'react';

const AlertContext = createContext({
  hasAlert: false,
  message: null,
  error: false,
});

export default AlertContext;
