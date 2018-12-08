<template>
	<div>
		Center 
	</div>
</template>

<script>
	// import { mapState } from 'vuex';

	export default{
		name:"center",

		computed: {
			loginname() {
				return this.$store.state.loginname
			}
		},

		created() {
			// 注意router跟route的区别
			this.$router.replace('/user/'+this.loginname)
		}

	};
</script>

<style>
	
</style>