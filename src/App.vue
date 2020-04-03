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
@import url('https://fonts.googleapis.com/css?family=Montserrat&display=swap');
#app {
	font-family: 'Montserrat', sans-serif !important;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	overflow-x: hidden;
	height: 100vh;
	line-height: 1.2;
}

td {
	border: none !important;
	padding: 1px !important;
	padding-right: 2px !important;
	min-width: 60px;
	border-radius: 5px;
	background-color: #80808014;
	transition: all ease-in-out 0.3s;
}

td:hover {
	background-color: #80808047 !important;
	box-shadow: 0px 2px 3px -2px rgba(0, 0, 0, 0.75);
	transition: all ease-in-out 0.3s;
}
table {
	border-spacing: 5px !important;
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
	height: 4px;
}

/* Track */
::-webkit-scrollbar-track {
	background: transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
	background: #818181d9;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
	background: #8181816e;
}

.pointer {
	cursor: pointer;
}
</style>
