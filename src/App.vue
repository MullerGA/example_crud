<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900">User Management System</h1>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <UserForm
          :user="currentUser"
          :is-editing="isEditing"
          @submit="handleFormSubmit"
          @cancel="resetForm"
          class="mb-8"
        />

        <UserTable
          :users="users"
          @edit="editUser"
          @delete="deleteUser"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userService } from './services/userService'
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
