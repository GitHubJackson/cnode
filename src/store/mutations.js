const mutations ={
    mutationIsShowMoreMenus(state, payload) {
        // payload表示使用方传递的附加数据
        state.isShowMoreMenus = payload;
    },
    // 实现用户登录
    mutationLogin(state) {
        state.isLogined = true
    },
    mutationLoginname(state, payload) {
        state.loginname = payload
    },
    mutationAccessToken(state, payload) {
        state.accesstoken = payload
    },
    mutationLogout(state) {
        state.isLogined = false;
        state.loginname = '';
        state.accesstoken = '';
    },
    // 修改登录用户id
    mutationAuthorId(state, payload) {
        state.author_id = payload;
    }
} ;
export default mutations;