<template>
  <div class="bg-white shadow-lg rounded-lg p-6">
    <h2 class="text-2xl font-bold mb-6">{{ isEditing ? 'Edit' : 'Create' }} User</h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="form-group">
        <label for="name" class="form-label">Name</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          class="form-control"
          placeholder="Enter name"
        />
      </div>

      <div class="form-group">
        <label for="email" class="form-label">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="form-control"
          placeholder="Enter email"
        />
      </div>

      <div class="form-group">
        <label for="role" class="form-label">Role</label>
        <select id="role" v-model="form.role" class="form-control">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div class="form-group">
        <label for="status" class="form-label">Status</label>
        <select id="status" v-model="form.status" class="form-control">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div class="flex gap-4">
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
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
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
  role: 'user' as 'admin' | 'user',
  status: 'active' as 'active' | 'inactive'
})

watch(() => props.user, (newUser) => {
  if (newUser) {
    Object.assign(form, newUser)
  }
}, { immediate: true })

const handleSubmit = async () => {
  try {
    if (props.isEditing && props.user) {
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