// Definición del modelo de usuario en la capa de Dominio
export interface User {
  id: string;
  email: string;
  password?: string; // Opcional para cuando consultamos datos generales
  nombre: string;
  activo: boolean;
  empresaId?: string | null;
}

// Interfaz para definir qué operaciones puede hacer nuestro repositorio de usuarios
export interface UserRepository {
  // Buscar un usuario por su correo electrónico
  findByEmail(email: string): Promise<User | null>;
  // Buscar un usuario por su ID
  findById(id: string): Promise<User | null>;
  // Opcional: Podríamos tener un método para guardar usuarios si el registro fuera parte de este flujo
  // save(user: User): Promise<User>;
}
