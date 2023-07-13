<template>
    <v-row>
        <v-col cols="12" sm="6" offset="3">
            <v-card>
                <v-card-text>
                    <v-form @submit.prevent v-model="valid">
                        <v-text-field
                            v-model="name"
                            :rules="[
                                validation.isRequired
                            ]"
                            label="Name"
                        ></v-text-field>
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
                        <v-btn
                            block
                            color="primary"
                            class="mt-2"
                            @click="onRegister"
                            :loading="isLoading"
                            :disabled="!valid"
                        >Register</v-btn>
                        <v-divider class="my-3"/>
                        <div class="d-flex justify-center">
                            <v-btn variant="text" @click="onLogin">Login</v-btn>
                        </div>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup>
import { ref } from 'vue'
import { useValidation } from "../composables/validation.js"
import { useRouter } from 'vue-router'
import {useStore} from "vuex";

const router = useRouter()
const validation = useValidation()
const store = useStore()
let valid = ref(true)
let name = ref(null)
let email = ref(null)
let password = ref(null)
let isLoading = ref(false)

function onLogin() {
    router.push({
        name: 'login'
    })
}

async function onRegister() {
    isLoading.value = true
    await store.dispatch('auth/register', {
        name: name.value,
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

</script>
