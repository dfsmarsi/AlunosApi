const TOKEN_KEY = 'alunos_token';
const USER_KEY = 'alunos_user';

export const saveAuth = (token, email) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, email);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getUser = () => localStorage.getItem(USER_KEY);

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => !!getToken();
