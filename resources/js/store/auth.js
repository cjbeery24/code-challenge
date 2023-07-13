export default {
    namespaced: true,
    state: {
        authenticated: false,
        user: {},
        error: null,
    },
    getters: {
        authenticated(state) {
            return state.authenticated
        },
        user(state) {
            return state.user
        },
        error(state) {
            return state.error
        },
    },
    mutations: {
        SET_AUTHENTICATED (state, value) {
            state.authenticated = value
        },
        SET_USER (state, value) {
            state.user = value
        },
        SET_ERROR (state, value) {
            state.error = value
        }
    },
    actions: {
        async register({ commit }, credentials) {
            try {
                await axios.get('/sanctum/csrf-cookie')
                const { data } = await axios.post('/register', credentials)
                commit('SET_USER', data)
                commit('SET_AUTHENTICATED', true)
                commit('SET_ERROR', null)
            } catch({ response: { data }}) {
                commit('SET_USER',{})
                commit('SET_AUTHENTICATED', false)
                commit('SET_ERROR', data.message)
            }
        },
        async login({ commit }, credentials) {
            try {
                await axios.get('/sanctum/csrf-cookie')
                const { data } = await axios.post('/login', credentials)
                commit('SET_USER', data)
                commit('SET_AUTHENTICATED', true)
                commit('SET_ERROR', null)
            } catch({ response: { data }}) {
                commit('SET_USER',{})
                commit('SET_AUTHENTICATED', false)
                commit('SET_ERROR', data.message)
            }
        },
        async logout({commit}){
            await axios.post('/api/logout')
            commit('SET_USER',{})
            commit('SET_AUTHENTICATED',false)
        }
    }
}
