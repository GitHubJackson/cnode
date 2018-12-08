<template>
	<div>
		<msg v-if="isShowMsg" title="操作失败" description="未登录用户不允许访问该页面，请先登录" icon="warn" :buttons="buttons">

		</msg>
	</div>
</template>

<script>
import { Msg } from 'vux';
	export default{
		name:"logout",
		components: {
			Msg
		},
		data() {
			return {
				isShowMsg: false,
				buttons: [
					{
						type:'primary',
						text:'跳转到登录页面',
						link:'/login'
					}
				]
			}
		},

		created() {
			// 防止用户未登录访问注销操作
			if(this.$store.state.isLogined==false) {
				this.isShowMsg = true;
				return;
			}
			// 恢复vux原始数据,使用原生形式触发mutation
			this.$store.commit('mutationLogout');
			// 清空本地存储
			window.localStorage.clear();
			// 页面跳转
			this.$router.push('/topiclist/all')
		},

	};
</script>

<style>
	
</style>