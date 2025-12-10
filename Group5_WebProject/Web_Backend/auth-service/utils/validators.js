export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateUsername = (username) => {
  return username.length >= 3 && username.length <= 30;
};

export const validateRole = (role) => {
  const validRoles = ['resident', 'municipal_staff', 'community_advocate', 'admin'];
  return validRoles.includes(role);
};