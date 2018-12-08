<template>
	<div>
		<h5>发表新话题</h5>
        <group>
            <x-textarea 
                placeholder="标题" 
                :max="200" 
                :rows="1" 
                v-model="title" 
            ></x-textarea>
            <!-- <x-textarea 
                placeholder="内容" 
                :max="2000" 
                :rows="6" 
                v-model="content"
            ></x-textarea> -->
        </group>
        <mavon-editor v-model="content"></mavon-editor>
        <!-- ？？完善上传本地图片功能 -->
        <x-button type="primary" @click.native="createTopic">添加新话题</x-button>
	</div>
</template>

<script>
    import { Group, XTextarea, XButton } from 'vux';
    import { mavonEditor } from 'mavon-editor';
    import 'mavon-editor/dist/css/index.css';

	export default{
        name:"Create",
        
        components: {
            Group, 
            XTextarea, 
            XButton, 
            mavonEditor
        },

        data() {
            return {
                title: '',
                content: '',
                toolbars: {
                    bold: true, // 粗体
                    italic: true, // 斜体
                    header: true, // 标题
                    underline: true, // 下划线
                    ol: true, // 有序列表
                    ul: true, // 无序列表
                    link: true, // 链接
                    imagelink: true, // 图片链接
                    code: true, // code
                    fullscreen: true, // 全屏编辑
                    htmlcode: true, // 展示html源码
                    help: true, // 帮助
                    alignleft: true, // 左对齐
                    aligncenter: true, // 居中
                    alignright: true, // 右对齐
                    preview: true, // 预览
                }
            }
        },

        methods: {
            createTopic() {
                var app = this;
                this.$http.post('/topics', {
                    title: this.title,
                    content: this.content,
                    tab: 'dev',
                    accesstoken: this.$store.state.accesstoken
                }).then(resp => {
                    if(resp.data && resp.data.success){
                        app.$router.replace('/topiclist/dev');
                    }
                    
                })
            }
        },

	};
</script>

<style>
	
</style>