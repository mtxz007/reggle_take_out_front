import Vue from 'vue'
import VueRouter from 'vue-router'
import login from "@/views/Login";
import main from "@/views/Main";
import AddOrder from "@/views/AddOrder";
import AddressEdit from "@/views/AddressEdit";
import PaySuccess from "@/views/PaySuccess";
import AddRess from "@/views/AddRess";
import order from "@/views/Order";
import User from "@/views/User";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: login
  },
  {
    path: '/index',
    component: main
  },
  {
    path: '/add-order',
    component: AddOrder
  },
  {
    path: '/address-edit',
    component: AddressEdit
  },
  {
    path: '/pay-success',
    component: PaySuccess
  },
  {
    path: '/address',
    component: AddRess
  },
  {
    path: '/order',
    component: order
  },
  {
    path: '/user',
    component: User
  }
]

const router = new VueRouter({
  routes
})

export default router
