<template>
	<div>
		<v-toolbar dark color="secondary">
			<v-btn icon @click="() => $router.back()">
				<v-icon>mdi-arrow-left</v-icon>
			</v-btn>
			<v-toolbar-title>{{ $route.meta.subtitle }}</v-toolbar-title>
			<template v-slot:extension>
				<v-tabs align-with-title>
					<v-tab to="lodgings">Hospedajes</v-tab>
					<v-tab to="places">Lugares</v-tab>
					<v-tab to="persons">Personas</v-tab>
				</v-tabs>
			</template>
		</v-toolbar>
		<router-view></router-view>
	</div>
</template>

<script>
export default {};
</script>
