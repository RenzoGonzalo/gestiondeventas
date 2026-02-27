import bcrypt from "bcryptjs";

// Número de rondas de salting para el hash (mientras más alto, más seguro pero más lento)
const SALT_ROUNDS = 10;

// Función para crear un hash seguro a partir de una contraseña en texto plano
export const hashPassword = async (password: string): Promise<string> => {
  // Se genera un salt y se aplica el hash
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

// Función para comparar una contraseña en texto plano con un hash almacenado
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  // Retorna true si coinciden, false de lo contrario
  return bcrypt.compare(password, hash);
};
