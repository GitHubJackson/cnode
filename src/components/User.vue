<template>
	<div v-if="userinfo">
        <!-- 加了v-if避免渲染延迟的问题 -->
        <card :header="{ title: userinfo.loginname }" :footer="{ title: userinfo.create_at }">
            <div slot="content" class="card_content">
                <p>
                    <img :src="userinfo.avatar_url" alt="">
                </p>
                <p>
                    用户积分：{{ userinfo.score }}
                </p>
                <p>
                    <a href="/#/collect/">{{collect_topics.length}}个话题被收藏</a>
                </p>
                <p>
                    <a href="'https://github.com/'+userinfo.githubUsername">@{{ userinfo.githubUsername }}</a>
                </p>
            </div>
        </card>

        <card :header="{ title: '最近发表的话题' }">
            <group slot="content">
                <cell
                    v-for="(item, index) in userinfo.recent_topics"
                    :key="index"
                    :title="item.title"
                    is-link
                    :link="'/topic/'+item.id"
                >
                
                </cell>
            </group>
        </card>
		
	</div>
</template>

<script>
    import { Card, Group, Cell } from 'vux';
	export default{
        name:"User",
        props: ['loginname'],
        components: {
            Card,
            Group, 
            Cell
        },

        data() {
            return {
                userinfo: null,
                collect_topics: []
            }
        },

        beforeRouteEnter(to, from, next) {
            next(function(vm) {
                // 这里为什么不能用vm，而是用to.params
                vm.$http.get('/user/'+to.params.loginname)
                .then(resp => {
                    vm.userinfo = resp.data.data
                })
                // 获取用户收藏的主题信息
                vm.$http.get('/topic_collect/'+to.params.loginname)
                .then(resp => {
                    vm.collect_topics = resp.data.data
                })
            });
           
        },

        beforeRouteUpdate(to, from, next) {
            var app = this;
            this.$http.get('/user/'+to.params.loginname)
            .then(resp => {
                app.userinfo = resp.data.data
            });
            // 获取用户收藏的主题信息
            app.$http.get('/topic_collect/'+to.params.loginname)
            .then(resp => {
                app.collect_topics = resp.data.data
            })
            next();
        },

        methods: {

        },


	};
</script>

<style lang="less" scoped>
	.card_content {
        P {
            padding: 10px;
            color: #CCC;
        }
        img {
            width: 60px;
            height: 60px;
        }
        
    }


</style>