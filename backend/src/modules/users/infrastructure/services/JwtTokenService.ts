import jwt from "jsonwebtoken";

// Se obtiene la clave secreta desde las variables de entorno para mayor seguridad
const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

// Función para generar un nuevo token JWT a partir de un ID de usuario
export const generateToken = (userId: string): string => {
  // El token expira en 8 horas por defecto
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "8h" });
};

// Función para verificar si un token JWT es válido y obtener los datos contenidos
export const verifyToken = (token: string): any => {
  try {
    // Si es válido, retorna el payload decodificado
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    // Si no es válido o ha expirado, retorna null
    return null;
  }
};
