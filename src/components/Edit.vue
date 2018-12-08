<template>
	<div v-if="topic">
		<h5>发表新话题</h5>
        <group>
            <x-textarea 
                placeholder="标题" 
                :max="200" 
                :rows="1" 
                v-model="topic.title" 
            ></x-textarea>
            <!-- <x-textarea 
                placeholder="内容" 
                :rows="6" 
                v-model="topic.content"
            ></x-textarea> -->
        </group>
        <mavon-editor v-model="topic.content"></mavon-editor>
        <x-button 
            type="primary" 
            @click.native="editTopic"
        >
            修改话题
        </x-button>
	</div>
</template>

<script>
    import { Group, XTextarea, XButton } from 'vux';
    import { mavonEditor } from 'mavon-editor';
    import 'mavon-editor/dist/css/index.css'; 

	export default{
        name:"Edit",
        props: ['id'],
        components: {
            Group, 
            XTextarea, 
            XButton,
            mavonEditor
        },

        data() {
            return {
                topic: null
            }
        },

        // 获取原始主题内容，以供编辑
        beforeRouteEnter:function(to, from, next){
			next(function(vm){
                vm.$http.get('/topic/'+to.params.id)
                .then(resp => {
					vm.topic = resp.data.data;
				});
			})	
        },     
		beforeRouteUpdate:function(to, from, next){
			var app = this;
            this.$http.get('/topic/'+to.params.id)
            .then(function(resp){
				app.topic = resp.data.data;
            });
            next();
		},

        methods: {
            editTopic() {
                var app = this;
                this.$http.post('/topics/update',{
                    topic_id: this.topic.id,
                    title: this.topic.title,
                    content: this.topic.content,
                    accesstoken: this.$store.state.accesstoken,
                    tab: 'dev'
                }).then(resp => {
                    app.$router.back();
                })
            }
        }

	};
</script>

<style>
	
</style>