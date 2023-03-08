import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    AddRessEditId: undefined,   //修改地址的Id，无则为添加
    beforeLayout:'',            //address界面是从user还是add-order界面进入的
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
