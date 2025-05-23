// Function to determine password strength and set the appropriate class
const getPasswordStrength = (password: string): string => {
  if (password.length < 8 && password.length > 0) {
    return 'red'; // Very weak password
  }

  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Check if password has at least one lowercase letter, one uppercase letter, one number, and one special character
  const meetsCharacterRequirements = hasLowerCase && hasUpperCase && hasNumbers && hasSpecialChars;

  // Strong (must have letters, numbers, special characters, and length >= 14)
  if (meetsCharacterRequirements && password.length >= 14) {
    return 'green'; // Strong password
  }

  // Moderate (length >= 14 and meets at least one of the character requirements)
  if (password.length >= 10 && (hasLowerCase || hasUpperCase || hasNumbers)) {
    return 'yellow'; // Moderate password
  }

  // Medium (length >= 6 and meets character requirements)
  if (password.length >= 6 && (hasLowerCase || hasUpperCase || hasNumbers)) {
    return 'orange'; // Medium password
  }

  return ''; // No strength if it doesn't meet any condition
};

// Check if the passwords equal to provide correct authorization
function comparePasswords(
  password: string,
  confirmedPassword: string,
  setIsPasswordEqual: React.Dispatch<React.SetStateAction<boolean>>,
  setThirdErrorMessage: React.Dispatch<React.SetStateAction<string>>
): void {
  if (password === confirmedPassword) {
    setIsPasswordEqual(true);
  } else {
    setIsPasswordEqual(false);
    setThirdErrorMessage('Паролі не збігаються');
  }
}

export { getPasswordStrength, comparePasswords };
