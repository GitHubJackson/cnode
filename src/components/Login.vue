<template>
	<div>
		<h5>用户登录</h5>
		<group>
			<!-- 哪些需要在group要分辨清 -->
			<x-input placeholder="请输入access token" v-model="accesstoken"></x-input>
		</group>
		<div style="height:10px"></div>
		<!-- click事件要添加.native -->
		<x-button type="primary" @click.native="dologin">登录</x-button>
		<toast type="text" v-model="isShowToast">{{ toastText }}</toast>
	</div>
</template>

<script>
	import { Group, XInput, XButton, Toast } from 'vux';
	import { mapMutations } from 'vuex';

	export default{
		name:"login",

		components:{
			Group,
			XInput,
			XButton,
			Toast
		},

		data:function(){
			return {
				accesstoken: '',
				toastText: '',
				isShowToast: false
			}
		},
		
		methods: {
			// mapMutations放在methods中使用
			...mapMutations(['mutationLogin', 'mutationLoginname', 'mutationAccessToken', 'mutationAuthorId']),
			
			dologin() {
				var app = this;
				this.$http.post('/accesstoken',{
					accesstoken: this.accesstoken
				}).then(resp => {
					// vuex中的数据保存于内存中，当前应用程序的生命周期结束vuex的数据就会丢失
					// 用户持久化登录，localStorage或sessionStorage
					if(resp&&resp.data&&resp.data.success){
						// 保存数据到vuex
						app.mutationLogin();
						app.mutationAccessToken(app.accesstoken);
						app.mutationLoginname(resp.data.loginname);
						app.mutationAuthorId(resp.data.id);
						//保存数据到localstorage
						window.localStorage.setItem("loginStatus",true);
						window.localStorage.setItem("accesstoken",app.accesstoken);
						window.localStorage.setItem("loginname",resp.data.loginname);
						window.localStorage.setItem("author_id",resp.data.id);
						// 页面跳转
						app.$router.push('/user/'+resp.data.loginname);
					}
				}).catch(err => {
					// 显示错误信息
					app.isShowToast = true;
					app.toastText = err.response.data.error_msg;
				})
			}
		}

	}
</script>

<style lang="less" scoped>
	
</style>