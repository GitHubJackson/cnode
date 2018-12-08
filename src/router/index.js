import Vue from 'vue'
import VueRouter from 'vue-router'
import TopicList from '../components/TopicList.vue'
import Topic from '../components/Topic.vue'
import Login from '../components/Login.vue'
import Logout from '../components/Logout.vue'
import Msg from '../components/Msg.vue'
import Center from '../components/Center.vue'
import User from '../components/User.vue'
import Create from '../components/Create.vue'
import Edit from '../components/Edit.vue'

// 全局注册路由
Vue.use(VueRouter)

// 定义路由信息对象
const routes = [
  // 路由重定向，即默认主页
  { path: '/', redirect: '/topiclist/all' },
  // props属性可以实现路由传参
  // ？？一个组件要根据name展示不同内容
  {
		path: "/topiclist/:name",
		name: "topiclist",
		component: TopicList,
		props: true,
  },
  
  {
		path:"/topic/:id",
		name:"topic",
		component:Topic,
		props:true,
  },
  
  { path: '/login', name: 'login', component: Login },
  { path: '/msg', name: 'msg', component: Msg },
  { path: '/logout', name: 'logout', component: Logout },
  { path: '/create', name: 'create', component: Create },

  { 
    path: '/center', 
    name: 'center', 
    component: Center 
  },

  { 
    path: '/user/:loginname', 
    name: 'user', 
    component: User,
    props: true
  },

  { 
    path: '/topic/:id/edit', 
    name: 'edit', 
    component: Edit,
    props: true
  },

]

// 创建路由管理器
const router = new VueRouter({
  routes
})

// 对外输出路由对象（路由管理器）
export default router