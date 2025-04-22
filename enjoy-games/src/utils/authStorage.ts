export interface AuthInfo {
  token: string;
  gameType: string;
  jti: string;
  nickName: string;
}

// Save auth info to localStorage
export const saveAuthInfo = (data: AuthInfo) => {
  localStorage.setItem('authInfo', JSON.stringify(data));
};

// Get auth info from localStorage
export const getAuthInfo = (): AuthInfo | null => {
  const raw = localStorage.getItem('authInfo');
  return raw ? JSON.parse(raw) : null;
};

// Remove auth info (for logout or reset)
export const clearAuthInfo = () => {
  localStorage.removeItem('authInfo');
};
