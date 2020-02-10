<template>
	<div class="autocomplete">
		<b-input
			v-model="search"
			type="text"
			:placeholder="placeholder"
			@input="onChange"
			@keydown.down="onArrowDown"
			@keydown.up="onArrowUp"
			@keydown.enter="onEnter"
		/>
		<ul v-show="isOpen" class="autocomplete-results">
			<li v-if="isLoading">
				<b-spinner variant="secondary" label="Loading..." class="mt-2 mb-2"></b-spinner>
			</li>
			<li
				v-for="(result, i) in results"
				v-else
				:key="i"
				class="autocomplete-result"
				:class="{ 'is-active': i === arrowCounter }"
				@click="setSelected(result)"
				@keydown.enter="onEnter"
			>
				{{ result.search }}
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'Autocomplete',
	props: {
		items: {
			type: Array,
			required: false,
			default: () => [],
		},
		placeholder: {
			type: String,
			required: false,
			default: 'Search',
		},
		selected: {
			type: Function,
			required: false,
		},
	},
	data() {
		return {
			id: null,
			debouncedSearch: null,
			isLoading: false,
			search: '',
			results: [],
			isOpen: false,
			arrowCounter: -1,
		};
	},
	methods: {
		onChange() {
			this.isOpen = true;
			this.filterResult();
		},
		filterResult() {
			this.results = this.items.filter(
				item => item.search.toLowerCase().indexOf(this.search.toLowerCase()) > -1
			);
		},
		setSelected(selected) {
			this.selected(selected);
			this.search = '';
			this.isOpen = false;
		},
		onArrowDown() {
			if (this.arrowCounter < this.results.length) {
				this.arrowCounter = this.arrowCounter + 1;
			}
		},
		onArrowUp() {
			if (this.arrowCounter > 0) {
				this.arrowCounter = this.arrowCounter - 1;
			}
		},
		onEnter() {
			// this.selected(this.results[this.arrowCounter]);
			this.search = this.results[this.arrowCounter];
			this.isOpen = false;
			this.arrowCounter = -1;
		},
	},
};
</script>

<style>
.autocomplete {
	position: relative;
}

.autocomplete-results {
	position: absolute;
	z-index: 1;
	background-color: #ffffff;
	padding: 0;
	margin: 0;
	max-height: 120px;
	overflow: auto;
	width: 100%;
}

.autocomplete-result {
	list-style: none;
	text-align: left;
	padding: 4px 2px;
	cursor: pointer;
}

.autocomplete-result.is-active,
.autocomplete-result:hover {
	background-color: #8b8ac7d9;
	color: #ffffff;
}
</style>
