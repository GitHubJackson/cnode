<template>
	<div>
		<div style="margin-top: 10px">
			<button-tab v-model="selectedTabIndex">
				<button-tab-item>未读消息</button-tab-item>
				<button-tab-item>已读消息</button-tab-item>
			</button-tab>
		</div>	
		<group v-if="selectedTabIndex==0">
			<cell v-for="(item, index) in hasNotReadMsgs" :key="index">
				<span slot="title">
					<a :href="'/#/user/'+item.author.loginname">{{ item.author.loginname }}</a>
					回复了你的话题
					<a :href="'/#/topic/'+item.topic.id">{{ item.topic.title }}</a>
				</span>
			</cell>
		</group>
		<group v-if="selectedTabIndex==1">
			<cell v-for="(item, index) in hasReadMsgs" :key="index">
				<span slot="title">
					<a :href="'/#/user/'+item.author.loginname">{{ item.author.loginname }}</a>
					回复了你的话题
					<a :href="'/#/topic/'+item.topic.id">{{ item.topic.title }}</a>
				</span>
			</cell>
		</group>
	</div>
</template>

<script>
	import { ButtonTab, ButtonTabItem, Group, Cell } from 'vux';
	export default{
		name:"msg",

		components: {
			ButtonTab, 
			ButtonTabItem,
			Group, 
			Cell
		},

		data() {
			return {
				selectedTabIndex: 0,
				hasNotReadMsgs: null,
				hasReadMsgs: null
			}
		},

		// ？？ajax显示消息列表待完善
		created() {
			var app = this;
			this.$http.get('/messages',{
				params: {
					accesstoken: this.$store.state.accesstoken
				}
			}).then(resp => {
				if(resp.data && resp.data.success) {
					console.log(resp.data);
					app.hasReadMsgs = resp.data.data.has_read_messages;
					app.hasNotReadMsgs = resp.data.data.hasnot_read_messages;
				}
			})
		}


	};
</script>

<style>
	
</style>