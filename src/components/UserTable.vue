<template>
  <div class="bg-white shadow-lg rounded-lg overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.id }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.name }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'">
              {{ user.role }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
              {{ user.status }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(user.created_at) }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
            <button @click="$emit('edit', user)" class="btn btn-warning text-xs">
              Edit
            </button>
            <button @click="handleDelete(user.id)" class="btn btn-danger text-xs">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { userService } from '@/services/userService'

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  created_at: Date;
}

const props = defineProps<{
  users: User[]
}>()

const emit = defineEmits(['edit', 'delete'])

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await userService.delete(id)
      emit('delete', id)
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString()
}
</script> 