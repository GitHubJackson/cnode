<template>
    <div id="app">
		<x-header 
			@on-click-more="showMoreMenus"
		>
			CNode移动端社区
			<div slot="right" @click="showMoreMenus">
				<a class="vux-header-more"></a>
				<badge 
					v-if="badgeText"
					:text="badgeText" 
					style="margin-left: 3px;"
				>
				</badge>
			</div>
		</x-header>

		<router-view></router-view>
		<actionsheet 
			:menus="moreMenus" 
			v-model="isShowMoreMenus"
			@on-click-menu="handleClickMoreMenus"
		>
		</actionsheet>
		<!-- scroll组件无法使用回顶部组件 -->
		<vm-back-top></vm-back-top>
    </div>
</template>

<script>
import { XHeader, Actionsheet, Badge } from "vux";
import { mapState, mapGetters, mapMutations } from "vuex";
import VmBackTop from 'vue-multiple-back-top';

export default {
    name: 'app',

    data() {
        return {	
			badgeText: '',
        }
    },

	// 持久化登录
    created() {
		var loginStatus = window.localStorage.getItem('loginStatus');
		if(loginStatus) {
			this.mutationLogin();
			this.mutationLoginname(window.localStorage.getItem('loginname'));
			this.mutationAccessToken(window.localStorage.getItem('accesstoken'));
			this.mutationAuthorId(window.localStorage.getItem('author_id'));
		}
		// 定时操作，ajax获取未读消息个数
		this.getUnreadMsgCount();
		var app = this;
		window.setInterval(function(){ app.getUnreadMsgCount() },5*60*1000);
    },

    computed: {
		...mapState(['unLoginMenus', 'LoginMenus', 'isLogined' ]),
		// 数据要发生状态改变，需将isShowMoreMenus单独拉出来设置set属性触发mutation
		isShowMoreMenus: {
			get() {
				return this.$store.state.isShowMoreMenus
			},
			set(nval) {
				// 触发mutation
				this.$store.commit('mutationIsShowMoreMenus',nval)
			}
		},
		...mapGetters(['moreMenus']),
		
    },
    components: {
		XHeader,
		Actionsheet,
		VmBackTop,
		Badge
    },
    methods: {
		...mapMutations(['mutationLogin', 'mutationLoginname', 'mutationAccessToken', 'mutationAuthorId']),

		// 点击标题跳转到默认主页
		routeToHome() {
			this.$router.replace('/')
		},
		// 头部菜单更多的设置方法
		showMoreMenus(){
			this.isShowMoreMenus = true;
			// 不会直接赋值，而是将值传给isShowMoreMenus这个计算属性作为set的参数
		},
		handleClickMoreMenus(menukey,menuitem){
			this.$router.push('/'+menukey);
		},
		// 获取服务端未读消息个数
		getUnreadMsgCount() {
			var app = this;
			this.$http.get('/message/count',{
				params: {
					accesstoken: this.$store.state.accesstoken
				}
			}).then(resp => {
				if(resp.data.success) {
					app.badgeText = resp.data.data
				}
			})
		}
    }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

</style>
