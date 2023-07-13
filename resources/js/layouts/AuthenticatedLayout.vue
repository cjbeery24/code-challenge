<template>
    <v-container>
        <div class="d-flex justify-end">
            <v-btn variant="text" @click="onLogout">Logout</v-btn>
        </div>
        <router-view></router-view>
    </v-container>
</template>

<script setup>
import {useRouter} from "vue-router";

const router = useRouter()

function onLogout() {
    router.push({
        name: 'logout'
    })
}
</script>
