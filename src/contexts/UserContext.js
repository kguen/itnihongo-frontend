import { createContext } from 'react';

const UserContext = createContext({
  token: localStorage.getItem('token'),
  data: null,
  liked: [],
});

export default UserContext;
