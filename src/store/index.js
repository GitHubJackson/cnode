import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'


Vue.use(Vuex)

// 创建store对象
const store = new Vuex.Store({
    // 状态数据
    state: {
        topics:[
            { name: "all", desc: "全部" },
            { name: "good", desc: "精华" },
            { name: "share", desc: "分享" },
            { name: "ask", desc: "问答" },
            { name: "job", desc: "招聘" },
            { name: "dev", desc: "测试" },
        ], 
        unLoginMenus: {
            login: '登录'
        },
        LoginMenus: {
            create: '发表新话题',
            center: '个人中心',
            msg: '消息通知',
            logout: '退出',
        },
        isLogined: false,
        // 还没在本地存储和vuex设置好id值
        loginId: '',
        // 登录用户id
        author_id: '',
        loginname: '',
        accesstoken: '',
        isShowMoreMenus: false
    },

    // 状态数据的计算属性
    getters: {
        moreMenus(state) {
            if(state.isLogined){
                return state.LoginMenus;
            }
            return state.unLoginMenus;
        },
        getTopicDescByTab(state) {
            // 返回一个函数结构
            return tab => {
                for (var index = 0; index < state.topics.length; index++) {
                    if(state.topics[index].name == tab) {
                        return state.topics[index].desc;
                    }
                }
            }
        }
    },

    // 行为描述
    mutations,

    // 行为触发
    actions

})

export default store;