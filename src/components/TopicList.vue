<template>
	<div>
		<tab :line-width="1">
			<tab-item
				v-for="(item, index) in topics" 
				:key="index" 
				:selected="$route.path=='/topiclist/'+item.name"
				@on-item-click="routeto"
			>
				{{ item.desc }}
			</tab-item>
		</tab>
		
		<scroller 
			height="-46"
			lock-x
			scrollbarY
			use-pullup
			use-pulldown
			:pullup-config="pullupConfig"
			:pulldown-config="pulldownConfig"
			@on-pullup-loading="loadMoreData"
			@on-pulldown-loading="freshData"
			ref="pullup"
		>
			<div>
				<group>
					<cell 
						v-for="(item,index) in lists" 
						:key="index" 
						:title="item.title" 
						is-link
						:link="'/topic/'+item.id"
					>
						<!-- 插槽 -->
						<span slot="icon" class="author_avatar">
							<img :src="item.author.avatar_url" alt="">
						</span>
						<span slot="title" class="cell_title">
							
							<span class="reply_count">{{item.reply_count}}</span>
							/
							<span class="visit_count">{{item.visit_count}}</span>
							<span v-if="item.top" class="top">
								置顶
							</span>
							<span class="tab" v-if="$route.path=='/topiclist/all'">
								{{getDescByTab(item.tab)}}
							</span>
							<span class="title">
								{{item.title}}
							</span>
						</span>

					</cell>
				</group>
			</div>
		</scroller>
	</div>
</template>

<script>
import { Tab, TabItem, Group, Cell, Scroller } from 'vux';
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
	name: 'TopicList',
	// props接收父组件传过来的值，此处指url中的:name
	props: ['name'],

	components: {
		Tab,
		TabItem,
		Group,
		Cell,
		Scroller
	},

	data () {
		return {  
			lists: [],
			// 当前页数,实现数据分页
			page: 1,
			//每页最大数量，两者要加于ajax请求中
			limit: 15,
			// 上拉加载更多
			pullupConfig: {
				content: "上拉加载更多",
				downContent: "松开加载更多",
				upContent: "上拉加载更多",
				loadingContent: "加载中..."
			},
			// 下拉刷新页面
			pulldownConfig: {
				content: "下拉刷新",
				downContent: "松开刷新数据",
				upContent: "下拉刷新数据",
				loadingContent: "加载中..."
			}
		}
	},

	computed: {
		...mapState(['topics']),
	},

	methods: {
		routeto(index) {
			// 编程式路由导航
			this.$router.push('/topiclist/'+this.topics[index].name);
		},

		// 根据tab获取topic.desc	
		getDescByTab(tab) {
			return this.$store.getters.getTopicDescByTab(tab);
		},
		// 上拉加载
		loadMoreData() {
			var app = this;
			this.page = this.page + 1;
			this.$http.get('/topics',{
				params:{
					// 注意此时的name不用切换，为当前组件的name
					tab: this.name,
					page: this.page,
					limit: this.limit
				}
			}).then(function(resp){
				if(resp.data.success){
					for(var i=0;i<resp.data.data.length;i++){
						app.lists.push(resp.data.data[i]);
					}
					// 手动结束刷新
					// 父组件获取子组件，使用$refs对象
					app.$refs.pullup.donePullup();
				}
			});
		},
		// 下拉刷新
		freshData() {
			var app = this;
			this.$http.get('/topics',{
				params: {
					tab: this.name,
					page: 1,
					limit: this.limit
				}
			}).then(resp => {
				if(resp.data && resp.data.success) {
					app.lists = resp.data.data;
					app.$refs.pullup.donePulldown();
				}
			})
		}
	},

	beforeRouteEnter(to,from,next) {
		// ？？三个参数得去学习学习用法
		// 进入组件之前的回调操作，此处不能使用this对象
		// to表示待进入的路由组件
		// next表示函数钩子，执行下一步操作
		next(function(vm){
			vm.$http.get('/topics',{
				params: {
					tab: to.params.name,
					page: vm.page,
					limit: vm.limit
				}
			}).then(resp => {
				vm.lists = resp.data.data
			})
		})
	},

	beforeRouteUpdate(to,from,next) {
		// this指向当前组件对象
		var app = this;
		this.$http.get('/topics',{
			params: {
				tab: to.params.name,
				page: this.page,
				limit: this.limit
			}
			}).then(resp => {
			if(resp.data.success) {
				// ??异步请求，此时this不再是指向当前组件对象
				app.lists = resp.data.data
			}
		})
		// 记得执行next操作,否则再点击全部无法正常显示
		next();
	}
	

}
</script>

<style lang="less" scoped>
  	.cell_title{
		font-size: .8em;
		.reply_count{
			color: #9e78c0;
		}
		.visit_count{
			color: #b4b4b4;
		}
		.top{
			background: #80bd01;
			padding: 2px 4px;
			border-radius: 3px;
			color: #fff;
			font-size: 12px;	
		}
		.tab{
			background: #e5e5e5;
			color: #999;
			padding: 2px 4px;
			border-radius: 3px;
			font-size: 12px;
		}
	}
	.author_avatar{
		img{
			width: 30px;
			height: 30px;
			border-radius: 3px;
			margin-right: 5px;
		}
	}
</style>
