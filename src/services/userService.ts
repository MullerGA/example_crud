const API_URL = import.meta.env.PROD 
  ? 'https://votre-url-vercel.vercel.app/api'  // Remplacez par l'URL fournie par Vercel
  : '/api'

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  created_at: Date;
}

export const userService = {
  // Create new user
  async create(user: Omit<User, 'id' | 'created_at'>) {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
    return response.json()
  },

  // Read all users
  async getAll(): Promise<User[]> {
    const response = await fetch(`${API_URL}/users`)
    return response.json()
  },

  // Update existing user
  async update(id: number, user: Partial<User>) {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
    return response.json()
  },

  // Delete user
  async delete(id: number) {
    await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' })
  }
} 