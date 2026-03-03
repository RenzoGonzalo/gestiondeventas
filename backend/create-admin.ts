import { createClient } from '@supabase/supabase-js'
import * as bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

async function createSuperAdmin() {
  const email = 'renzoquispe@gmail.com'
  const password = '123456789'
  const hashedPassword = await bcrypt.hash(password, 10)

  console.log('Intentando crear Super Admin via HTTP API...')

  const { data, error } = await supabase
    .from('users')
    .insert([
      { 
        email: email, 
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
    .select()

  if (error) {
    if (error.code === '23505') {
       console.log('El usuario ya existe en la base de datos.')
    } else {
       console.error('Error al crear usuario:', error.message)
    }
  } else {
    console.log('¡Super Admin creado exitosamente!', data)
  }
}

createSuperAdmin()
