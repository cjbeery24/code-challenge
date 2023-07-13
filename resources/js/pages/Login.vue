<template>
    <v-row>
        <v-col cols="12" sm="6" offset="3">
            <v-card>
                <v-card-text>
                    <v-form @submit.prevent v-model="valid">
                        <v-text-field
                            v-model="email"
                            :rules="[
                                validation.isEmail,
                                validation.isRequired
                            ]"
                            label="Email"
                        ></v-text-field>
                        <v-text-field
                            type="password"
                            v-model="password"
                            :rules="[
                                validation.isRequired
                            ]"
                            label="Password"
                        ></v-text-field>
                        <div v-if="authError" class="text-center text-red">{{ authError }}</div>
                        <v-btn
                            block
                            color="primary"
                            class="mt-2"
                            @click="onLogin"
                            :loading="isLoading"
                            :disabled="!valid"
                        >Login</v-btn>
                        <v-divider class="my-3"/>
                        <div class="d-flex justify-center">
                            <v-btn variant="text" @click="onRegister">Register</v-btn>
                        </div>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup>
import {computed, ref} from 'vue'
import { useValidation } from "../composables/validation.js"
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const validation = useValidation()
const store = useStore()
let valid = ref(true)
let email = ref(null)
let password = ref(null)
let isLoading = ref(false)
const authError = computed(() => {
    return store.getters['auth/error']
})

async function onLogin() {
    isLoading.value = true
    await store.dispatch('auth/login', {
        email: email.value,
        password: password.value
    })
    isLoading.value = false
    if (store.getters['auth/authenticated']) {
        await router.push({
            name: 'dashboard'
        })
    }
}

function onRegister() {
    router.push({
        name: 'register'
    })
}

</script>
