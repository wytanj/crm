<script setup lang="ts">
import { LogIn } from '@lucide/vue'
import { createClient } from '@supabase/supabase-js'

const email = ref('')
const sent = ref(false)
const error = ref('')
const runtime = useRuntimeConfig()

async function signIn() {
  error.value = ''

  if (!runtime.public.supabaseUrl || !runtime.public.supabaseKey) {
    sent.value = true
    return
  }

  try {
    const supabase = createClient(
      String(runtime.public.supabaseUrl),
      String(runtime.public.supabaseKey)
    )
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: `${runtime.public.siteUrl}/confirm`
      }
    })

    if (authError) {
      throw authError
    }

    sent.value = true
  } catch (signInError) {
    error.value = signInError instanceof Error ? signInError.message : 'Unable to send sign-in link.'
  }
}
</script>

<template>
  <div class="auth-page">
    <form class="auth-panel" @submit.prevent="signIn">
      <p class="eyebrow">Workspace access</p>
      <h2>Sign in to your CRM workspace</h2>
      <label>
        <span>Email</span>
        <input v-model="email" type="email" placeholder="you@company.com" required />
      </label>
      <button class="primary-button" type="submit">
        <LogIn :size="17" />
        <span>Send magic link</span>
      </button>
      <p v-if="sent" class="notice-text">Check your email for the sign-in link. In demo mode this confirms the auth flow shape.</p>
      <p v-if="error" class="form-error">{{ error }}</p>
    </form>
  </div>
</template>
