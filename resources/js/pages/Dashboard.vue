<template>
    <div>
        <v-row class="mb-3 d-flex align-center">
            <v-col>
                <span class="text-lg-h4">My Tasks</span>
            </v-col>
            <v-col>
                <div class="d-flex">
                    <v-text-field
                        label="Add New Task"
                        variant="solo"
                        density="compact"
                        class="flex-grow-1"
                        v-model="newTaskName"
                        append-inner-icon="fas fa-plus"
                        @click:append-inner="onAddTask"
                        @keydown.enter="onAddTask"
                        hide-details
                    ></v-text-field>
                </div>
            </v-col>
        </v-row>
        <div v-if="!tasks.length" class="text-center">No Tasks Yet!</div>
        <div v-for="task in tasks">
            <Task :task="task" />
        </div>
    </div>
</template>

<script setup>

import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import Task from "../components/Task.vue";
const store = useStore()

let isAddingNewTask = ref(false)
let newTaskName = ref('')

const tasks = computed(() => store.getters['tasks/tasks'])

onMounted(() => {
    store.dispatch('tasks/loadTasks')
})

async function onAddTask() {
    if (!newTaskName.value || newTaskName.value === '' || isAddingNewTask.value) {
        return
    }
    isAddingNewTask.value = true
    try {
        await store.dispatch('tasks/addTask', {
            name: newTaskName.value
        })
        newTaskName.value = ''
    } catch (err) {

    }
    isAddingNewTask.value = false
}
</script>
