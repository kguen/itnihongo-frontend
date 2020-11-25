const tokenConfig = user => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
};

export default tokenConfig;
