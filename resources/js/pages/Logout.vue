<template>
    <div></div>
</template>

<script setup>

import {computed, onMounted} from "vue";
import { useStore } from "vuex";
import {useRouter} from "vue-router";
const router = useRouter()
const store = useStore()

onMounted(async () => {
    await store.dispatch('auth/logout')
    await router.push({
        name: 'login'
    })
})
</script>
