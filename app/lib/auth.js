import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id,
      email: user.email,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const comparePasswords = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const checkPermissions = (userRole, requiredRole) => {
  const roles = ['Viewer', 'Editor', 'Admin'];
  const userRoleIndex = roles.indexOf(userRole);
  const requiredRoleIndex = roles.indexOf(requiredRole);
  
  return userRoleIndex >= requiredRoleIndex;
};