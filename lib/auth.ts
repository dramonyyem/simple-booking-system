import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 12);
};

export const checkPassword = async (password: string, hashed: string) => {
  return bcrypt.compare(password, hashed);
};
