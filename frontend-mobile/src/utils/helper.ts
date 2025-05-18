/**
 * Validates an email address format
 * @param {string} email - The email address to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Gets initials from a full name (up to 2 characters)
 * @param {string} name - The full name to get initials from
 * @returns {string} - The initials in uppercase
 */
export const getInitials = (name: string): string => {
  if (!name) return "";
  
  const words = name.trim().split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    if (words[i][0]) {
      initials += words[i][0];
    }
  }

  return initials.toUpperCase();
}; 