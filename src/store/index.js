import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    college: ""
  },
  mutations: {
    getUserCollegeId(state,id) {
      state.college = id; 
     }
  },
  actions: {
  },
  modules: {
  }
})
