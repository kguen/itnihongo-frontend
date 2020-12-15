import { createContext } from 'react';

const UserContext = createContext({
  token: localStorage.getItem('token'),
  data: null,
  liked: [],
  avatar: null,
});

export default UserContext;
