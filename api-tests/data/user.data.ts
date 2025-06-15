// Generate a unique timestamp-based email
const timestamp = Date.now();

export const validUser = {
  email: `qa.user.${timestamp}@example.com`,
  password: 'SecurePass123'
};

// Reuses the same email to simulate duplicate registration
export const duplicateUser = {
  email: validUser.email,
  password: validUser.password
};

// Uses same email but wrong password
export const invalidUser = {
  email: validUser.email,
  password: 'WrongPassword'
};
