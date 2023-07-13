import { createStore } from 'vuex'
import VuexPersistence from "vuex-persist"
import auth from './auth'
import tasks from './tasks'

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    modules: [
        'auth',
    ],
})

const store = createStore({
    modules: {
        auth,
        tasks,
    },
    plugins: [
        vuexLocal.plugin
    ]
})

export default store
