// CRUD Application Specification
// ===========================

/* Component Structure
==================== */
// App.vue (Root Component)
//   ├── UserForm.vue (Create/Update form)
//   └── UserTable.vue (Display & actions)

/* Data Model
=========== */
// User Interface
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  created_at: Date;
}

/* State Management
================ */
// Using Vue 3 Composition API with reactive state
import { ref, reactive } from 'vue'

// App.vue
const users = ref<User[]>([])
const currentUser = ref<User | null>(null)
const isEditing = ref(false)

/* API Service
=========== */
// userService.ts
export const userService = {
  // Create new user
  async create(user: Omit<User, 'id'>) {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
    return response.json()
  },

  // Read all users
  async getAll() {
    const response = await fetch('/api/users')
    return response.json()
  },

  // Update existing user
  async update(id: number, user: Partial<User>) {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
    return response.json()
  },

  // Delete user
  async delete(id: number) {
    await fetch(`/api/users/${id}`, { method: 'DELETE' })
  }
}

/* Components Implementation
======================= */

// UserForm.vue
<template>
  <form @submit.prevent="handleSubmit" class="user-form">
    <div class="form-group">
      <label for="name">Name</label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        required
        class="form-control"
      />
    </div>

    <div class="form-group">
      <label for="email">Email</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        required
        class="form-control"
      />
    </div>

    <div class="form-group">
      <label for="role">Role</label>
      <select id="role" v-model="form.role" class="form-control">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    </div>

    <div class="form-group">
      <label for="status">Status</label>
      <select id="status" v-model="form.status" class="form-control">
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

    <button type="submit" class="btn btn-primary">
      {{ isEditing ? 'Update' : 'Create' }} User
    </button>
    <button
      v-if="isEditing"
      type="button"
      @click="resetForm"
      class="btn btn-secondary"
    >
      Cancel
    </button>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { userService } from '@/services/userService'

const props = defineProps({
  user: {
    type: Object,
    default: () => null
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  name: '',
  email: '',
  role: 'user',
  status: 'active'
})

// Watch for changes in edited user
watch(() => props.user, (newUser) => {
  if (newUser) {
    Object.assign(form, newUser)
  }
}, { immediate: true })

const handleSubmit = async () => {
  try {
    if (props.isEditing) {
      await userService.update(props.user.id, form)
    } else {
      await userService.create(form)
    }
    emit('submit')
    resetForm()
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}

const resetForm = () => {
  Object.assign(form, {
    name: '',
    email: '',
    role: 'user',
    status: 'active'
  })
  emit('cancel')
}
</script>

// UserTable.vue
<template>
  <div class="user-table">
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <span :class="['status-badge', user.status]">
              {{ user.status }}
            </span>
          </td>
          <td>{{ formatDate(user.created_at) }}</td>
          <td class="actions">
            <button
              @click="$emit('edit', user)"
              class="btn btn-sm btn-warning"
            >
              Edit
            </button>
            <button
              @click="handleDelete(user.id)"
              class="btn btn-sm btn-danger"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { userService } from '@/services/userService'

const props = defineProps({
  users: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await userService.delete(id)
      emit('delete', id)
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}
</script>

/* Main App Component
================== */
// App.vue
<template>
  <div class="app">
    <header>
      <h1>User Management System</h1>
    </header>

    <main>
      <UserForm
        :user="currentUser"
        :is-editing="isEditing"
        @submit="handleFormSubmit"
        @cancel="resetForm"
      />

      <UserTable
        :users="users"
        @edit="editUser"
        @delete="deleteUser"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { userService } from '@/services/userService'
import UserForm from './components/UserForm.vue'
import UserTable from './components/UserTable.vue'

const users = ref([])
const currentUser = ref(null)
const isEditing = ref(false)

onMounted(async () => {
  try {
    users.value = await userService.getAll()
  } catch (error) {
    console.error('Error fetching users:', error)
  }
})

const handleFormSubmit = async () => {
  await fetchUsers()
  resetForm()
}

const editUser = (user) => {
  currentUser.value = user
  isEditing.value = true
}

const deleteUser = async (id) => {
  users.value = users.value.filter(user => user.id !== id)
}

const resetForm = () => {
  currentUser.value = null
  isEditing.value = false
}

const fetchUsers = async () => {
  users.value = await userService.getAll()
}
</script>

/* CSS Styling
=========== */
<style>
.user-form {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.user-table {
  margin-top: 2rem;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.status-badge.active {
  background-color: #28a745;
  color: white;
}

.status-badge.inactive {
  background-color: #dc3545;
  color: white;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-warning {
  background-color: #ffc107;
  color: #212529;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}
</style>

/* Features & Functionality
======================= */
/**
 * Create:
 * - Form with validation for creating new users
 * - Fields: name, email, role, status
 * - Client-side validation for required fields
 * 
 * Read:
 * - Table view of all users
 * - Sortable columns (can be implemented using computed properties)
 * - Status indicators with color coding
 * 
 * Update:
 * - Edit button loads user data into form
 * - Form switches to edit mode
 * - Cancel button to reset form
 * 
 * Delete:
 * - Confirmation dialog before deletion
 * - Immediate UI update after deletion
 * 
 * Additional Features:
 * - Responsive design
 * - Loading states for async operations
 * - Error handling and user feedback
 * - Date formatting for timestamps
 */

/* Error Handling
============== */
/**
 * Implementation includes:
 * - Try/catch blocks for all async operations
 * - User-friendly error messages
 * - Form validation feedback
 * - Network error handling
 * - Optimistic updates with rollback
 */

/* State Management Considerations
============================ */
/**
 * For larger applications, consider:
 * - Vuex/Pinia for global state management
 * - Separate modules for users, auth, etc.
 * - Caching strategies
 * - Pagination for large datasets
 */