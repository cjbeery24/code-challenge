<template>
    <v-alert
        border="start"
        color="white"
        border-color="primary"
        elevation="0"
        :title="task.name"
        class="mb-2 pb-1"
    >
        <template v-slot:title>
            <div class="d-flex mb-3 align-center">
                <div :class="task.parent_id ? 'text-body-1' : 'text-body'">{{ task.name }}</div>
                <div class="ml-4 d-flex">
                    <v-fade-transition>
                        <v-btn
                            icon
                            size="sm"
                            class="mr-1"
                            :style="{cursor: task.completed_at ? 'default' : 'pointer'}"
                            @click="onAction"
                            :disabled="isStarting || isCompleting"
                            :ripple="!task.completed_at"
                        >
                            <v-icon :color="task.completed_at ? 'green' : 'default'">far {{ actionIcon }}</v-icon>
                            <v-tooltip
                                v-if="!task.completed_at"
                                activator="parent"
                                location="top"
                            >{{ !task.started_at ? 'Start Task' : 'Complete Task' }}</v-tooltip>
                        </v-btn>
                    </v-fade-transition>
                    <v-btn icon size="sm" class="mr-1" :disabled="isDeleting" @click="showConfirmDelete = true">
                        <v-icon>fas fa-ban</v-icon>
                        <v-tooltip
                            activator="parent"
                            location="top"
                        >Delete Task</v-tooltip>
                    </v-btn>
                    <div v-if="isOverdue" class="text-red font-weight-bold ml-2">
                        Overdue!
                    </div>
                </div>
            </div>
        </template>
        <v-row :class="{'mb-2': task.all_children.length, 'mb-1': !task.all_children.length}">
            <v-col cols="12" sm="6">
                <v-text-field
                    label="Add Sub Task"
                    variant="solo"
                    density="compact"
                    class="flex-grow-1 ml-1"
                    v-model="newTaskName"
                    append-inner-icon="fas fa-plus"
                    @click:append-inner="onAddTask"
                    @keydown.enter="onAddTask"
                    hide-details
                ></v-text-field>
            </v-col>
        </v-row>
        <div v-for="childTask in task.all_children">
            <task :task="childTask"></task>
        </div>

        <v-dialog
            v-model="showConfirmDelete"
            width="400px"
        >
            <v-card>
                <v-card-text>
                    Are you sure you want to delete: {{ task.name }}?<br/>
                    This will also delete any subtasks.
                </v-card-text>
                <v-card-actions class="d-flex justify-end">
                    <v-btn color="default" @click="showConfirmDelete = false">Cancel</v-btn>
                    <v-btn variant="outlined" color="error" @click="onDelete">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-alert>
</template>

<script setup>
    import { useStore } from "vuex";
    import { computed, ref } from "vue";
    import moment from "moment-timezone";

    const props = defineProps({
        task: Object,
    })
    const store = useStore()
    let isAddingNewTask = ref(false)
    let newTaskName = ref('')
    let isStarting = ref(false)
    let isCompleting = ref(false)
    let isDeleting = ref(false)
    let showConfirmDelete = ref(false)

    let actionIcon = computed(() => {
        if (!props.task.started_at) {
            return 'fa-play-circle'
        } else if (props.task.started_at) {
            return 'fa-check-circle'
        }
    })

    let isOverdue = computed(() => {
        if (props.task.started_at && !props.task.completed_at) {
            const now = moment.utc()
            const started = moment.utc(props.task.started_at)
            return started.add(1, 'day').isBefore(now)
        } else {
            return false
        }
    })

    async function onAddTask() {
        if (!newTaskName.value || newTaskName.value === '' || isAddingNewTask.value) {
            return
        }
        isAddingNewTask.value = true
        try {
            await store.dispatch('tasks/addTask', {
                name: newTaskName.value,
                parent_id: props.task.id,
            })
            newTaskName.value = ''
        } catch (err) {

        }
        isAddingNewTask.value = false
    }
    async function onAction() {
        if (!props.task.started_at) {
            await onStart()
        } else if (!props.task.completed_at) {
            await onComplete()
        }
    }
    async function onStart() {
        isStarting.value = true
        await store.dispatch('tasks/startTask', props.task)
        isStarting.value = false
    }
    async function onComplete() {
        isCompleting.value = true
        await store.dispatch('tasks/completeTask', props.task)
        isCompleting.value = false
    }
    async function onDelete() {
        isDeleting.value = true
        await store.dispatch('tasks/removeTask', props.task)
        isDeleting.value = false
    }
</script>
