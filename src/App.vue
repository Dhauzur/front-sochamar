<template>
	<v-app id="app">
		<component :is="layout">
			<router-view />
		</component>
	</v-app>
</template>

<script>
export default {
	computed: {
		layout() {
			return this.$route.meta.layout || 'default';
		},
	},
};
</script>

<style lang="css">
@import '../node_modules/vue2vis/dist/vue2vis.css';
</style>
<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Kanit|Poppins|Righteous&display=swap');
#app {
	font-family: 'Poppins', sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	overflow-x: hidden;
	height: 100vh;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
	opacity: 0;
}

/* width */
::-webkit-scrollbar {
	width: 4px;
}

/* Track */
::-webkit-scrollbar-track {
	background: transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
	background: transparent;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
	background: transparent;
}

.pointer {
	cursor: pointer;
}
</style>
