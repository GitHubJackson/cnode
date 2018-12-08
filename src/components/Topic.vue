<template>
	<!-- 只有topic为真时才显示主题信息 -->
	<div v-if="topic">
		<article class="weui-article">
			<section>
				<h1>
					{{topic.title}}
					<x-button 
						v-if="topic.author_id == $store.state.author_id"
						type="primary"
						:mini="true"
						:link="'/topic/'+topic.id+'/edit'"
					>
						编辑
					</x-button>
					<x-button 
						v-if="topic.is_collect==false" 
						:mini="true" 
						type="primary" 
						@click.native="collect"
					>
						收藏
					</x-button>	
					<x-button 
						v-else 
						:mini="true" 
						@click.native="decollect"
					>
						取消收藏	
					</x-button>	
				</h1>
			</section>
			<section>
				<!-- /#/代表路由路径 -->
				<span>作者:<a :href="'/#/user/'+topic.author.loginname">{{topic.author.loginname}}</a></span>
				<span>{{ topic.visit_count }}次浏览</span>
				<span>来自:<a :href="'/#/topiclist/'+topic.tab">{{topic.tab}}</a></span>
			</section>	
			<section v-html="topic.content"></section>
		</article>
		<group>
			<cell-box v-for="(item,index) in topic.replies" :key="index">
				<flexbox>
					<!-- :span是划分区域面积 -->
					<flexboxItem :span="1/10">
						<img :src="item.author.avatar_url" width="30" height="30" alt="">
					</flexboxItem>
					<flexboxItem>
						<section>
							<div>
								<a :href="'/#/user/'+item.author.loginname">{{item.author.loginname}}</a>
								{{index+1}}楼
							</div>
							<div v-html="item.content"></div>
						</section>
					</flexboxItem>
					<flexboxItem :span="1/4">
						<span @click="upOrDown(item.id)">
							<wechat-emotion>强</wechat-emotion>
							{{item.ups.length}}
						</span>
						<span v-if="isLogined" @click="showPopup(item.id, item.author.loginname)">回复</span>
					</flexboxItem>
				</flexbox>
			</cell-box>
		</group>
		<group>
			<x-textarea v-model="replyContent" placeholder="评论新内容"></x-textarea>
		</group>
		<x-button :mini="true" type="primary" @click.native="addReply(1)">回复</x-button>
		<!-- 对评论的评论 -->
		<div v-transfer-dom>
			<popup v-model="isShowPopup" @on-hide="hidePopup">
				<group>
					<x-textarea v-model="replyContent" placeholder="请输入评论内容"></x-textarea>
				</group>
				<x-button :mini="true" type="primary" @click.native="addReply(2)">回复</x-button>
			</popup>
		</div>
	</div>
</template>

<script>
import { CellBox, Group, FlexboxItem, Flexbox, WechatEmotion, XButton, XTextarea, Popup, TransferDom } from 'vux';
import { mapState } from 'vuex';
	export default{
		name:"Topic",
		// 接收父组件(路由组件)的id值
		props:['id'],

		data() {
			return {
				topic: null,
				replyContent: '',
				isShowPopup: false,
				reply_id: null,
				reply_loginname: ''
			}
		},

		computed:{
			...mapState(['isLogined'])
		},
		
		components:{
			Group,
			XButton, 
			XTextarea,
			CellBox,
			FlexboxItem,
			Flexbox,
			WechatEmotion,
			Popup
		},
		directives: {
			TransferDom
		},
		// ajax获取的数据应赋值给一个自定义的变量来调用
		beforeRouteEnter:function(to,from,next){
			next(function(vm){
				vm.$http.get('/topic/'+to.params.id,{
					params: {
						accesstoken: vm.$store.state.accesstoken
					}
				}).then(function(resp){
					// console.log(resp.data);
					// 注意区别data和data.data的区别
					vm.topic = resp.data.data;
				});
			})	
		},
		// 动态路由切换时，导航守卫
		beforeRouteUpdate:function(to,from,next){
			var app = this;
			this.$http.get('/topic/'+to.params.id,{
				params: {
					accesstoken: this.$store.state.accesstoken
				}
			}).then(function(resp){
				app.topic = resp.data.data;
			});
			next();
		},
		
		methods: {
			// 新建评论,还没理解透？？
			addReply(replyTab) {
				// 根据replyTab值实现不同的评论功能
				var params = {
					accesstoken: this.$store.state.accesstoken,
					content: this.replyContent,
				};
				if(replyTab == 2) {
					params.reply_id = this.reply_id;
					// 构建@用户名形式的回复信息
					params.content = '@'+this.reply_loginname+' '+params.content;
				};
				// 发送ajax请求
				var app = this;
				this.$http.post('/topic/'+this.topic.id+'/replies', params)
				.then(resp => {
					if(resp.data && resp.data.success){
						var reply = {
							"id": resp.data.reply_id,
							"author": {
								"loginname": app.$store.state.loginname,
								"avatar_url":""
							},
							"content": params.content,
							"ups": [],
							"create_at":"2014-10-07",
							"reply_id": null,
							"is_uped": false
						};
						if(replyTab == 2) {
							reply.reply_id = app.reply_id;

						}
						app.topic.replies.push(reply);
						app.replyContent = '';	
						app.reply_id = null;
						app.isShowPopup  = false;
						app.reply_loginname = '';
					}
				})
			},
			// 点击回复显示弹出框
			showPopup(reply_id, loginname) {
				this.isShowPopup = true;
				this.reply_id = reply_id;
				this.reply_loginname = loginname;
			},
			hidePopup() {
				this.reply_id = '';
				app.reply_loginname = '';
			},
			// 实现点赞或取消点赞
			upOrDown(reply_id) {
				var app = this;
				this.$http.post('/reply/'+reply_id+'/ups',{
					accesstoken: this.$store.state.accesstoken
				}).then(resp => {
					if(resp && resp.data && resp.data.success) {
						var type = resp.data.action;
						var reply;
						// 先获取到当前评论
						for(var i=0;i<=app.topic.replies.length;i++) {
							if(app.topic.replies[i].id==reply_id) {
								// 找到了指定评论
								reply = app.topic.replies[i];
								break;
							}
						}
						// 实现点赞功能
						if(type=='up') {
							// 在ups中添加当前用户的id值
							reply.ups.push(app.$store.state.accesstoken);
						}
						// 取消点赞功能
						else if(type=='down') {
							// ？？实际过程中应该先找到指定元素的下标，然后再使用splice删除指定元素
							reply.ups.pop();
						}
					}
				})
			},
			// 实现收藏功能
			// ？？此处有bug,500状态码错误,服务器内部错误
			collect() {
				var app = this;
				this.$http.post('/topic_collect/collect',{
					accesstoken: this.$store.state.accesstoken,
					topic_id: this.topic_id	
				}).then(resp => {
					if(resp.data && resp.data.success) {
						app.topic.is_collect = true;
					}
				})
			},
			// 取消收藏
			decollect() {
				var app = this;
				this.$http.post('/topic_collect/de_collect',{
					accesstoken: this.$store.state.accesstoken,
					topic_id: this.topic_id	
				}).then(resp => {
					if(resp.data && resp.data.success) {
						app.topic.is_collect = false;
					}
				})
			},
		},
		
	};
</script>

<style lang="less" scoped>
// 使用weui库
@import '~vux/src/styles/weui/weui.less';


</style>