import moment from "moment-timezone";

function searchChildren(task, newTask) {
    if (task.id === newTask.parent_id) {
        task.all_children.push(newTask)
    } else {
        task.all_children.forEach(child => {
            searchChildren(child, newTask)
        })
    }
}
function startWithChildren(task, startedTask) {
    if (task.id === startedTask.id) {
        task.started_at = startedTask.started_at
    } else {
        task.all_children = task.all_children.map(childTask => {
            return startWithChildren(childTask, startedTask)
        })
    }
    return task
}

function completeWithChildren(task, completedTask) {
    if (task.id === completedTask.id) {
        task.completed_at = completedTask.completed_at
    } else {
        task.all_children = task.all_children.map(childTask => {
            return completeWithChildren(childTask, completedTask)
        })
    }
    return task
}

function deleteFromChildren(task, deletedTask) {
    task.all_children = task.all_children.filter(childTask => childTask.id !== deletedTask.id).map(childTask => {
        return deleteFromChildren(childTask, deletedTask)
    })
    return task
}
export default {
    namespaced: true,
    state: {
        tasks: [],
    },
    getters: {
        tasks(state) {
            return state.tasks
        },
    },
    mutations: {
        SET_TASKS (state, value) {
            state.tasks = value
        },
        ADD_TASK (state, newTask) {
            if (!newTask.parent_id) {
                state.tasks.push(newTask)
            } else {
                state.tasks.forEach(task => {
                    searchChildren(task, newTask)
                })
            }
        },
        START_TASK (state, task) {
            state.tasks = state.tasks.map(eachTask => {
                return startWithChildren(eachTask, task)
            })
        },
        COMPLETE_TASK (state, task) {
            state.tasks = state.tasks.map(eachTask => {
                return completeWithChildren(eachTask, task)
            })
        },
        REMOVE_TASK (state, deletedTask) {
            state.tasks = state.tasks.filter(task => task.id !== deletedTask.id).map(task => {
                return deleteFromChildren(task, deletedTask)
            })
        }
    },
    actions: {
        async loadTasks({ commit }) {
            try {
                const { data } = await axios.get('/api/tasks')
                commit('SET_TASKS', data.data)
            } catch({ response: { data }}) {
                commit('SET_TASKS', [])
            }
        },
        async addTask({ commit }, payload) {
            const { data } = await axios.post('/api/tasks', payload)
            commit('ADD_TASK', data)
        },
        async startTask({ commit }, task) {
            const startedTask = {
                ...task,
                started_at: moment.utc().format()
            }
            await axios.put(`/api/tasks/${startedTask.id}`, startedTask)
            commit('START_TASK', startedTask)
        },
        async completeTask({ commit }, task) {
            const completedTask = {
                ...task,
                completed_at: moment.utc().format()
            }
            await axios.put(`/api/tasks/${completedTask.id}`, completedTask)
            commit('COMPLETE_TASK', completedTask)
        },
        async removeTask({ commit }, task) {
            await axios.delete(`/api/tasks/${task.id}`)
            commit('REMOVE_TASK', task)
        }
    }
}
