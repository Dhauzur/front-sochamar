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
				@click="setResult(result)"
			>
				{{ result }}
			</li>
		</ul>
		<b-badge v-for="(item, i) in selected" :key="i" pill variant="secondary" target="_blank"
			>{{ item }}
		</b-badge>
	</div>
</template>

<script>
import functionHelper from '../../plugins/FunctionHelper';

export default {
	name: 'Autocomplete',
	props: {
		items: {
			type: Array,
			required: false,
			default: () => [],
		},
		isAsync: {
			type: Boolean,
			required: false,
			default: false,
		},
		placeholder: {
			type: String,
			required: false,
			default: 'Search',
		},
	},
	data() {
		return {
			debouncedSearch: null,
			isLoading: false,
			search: '',
			results: [],
			selected: [],
			isOpen: false,
			arrowCounter: -1,
		};
	},
	watch: {
		// Once the items content changes, it means the parent component
		// provided the needed data
		items(value) {
			// we want to make sure we only do this when it's an async request
			if (this.isAsync) {
				this.results = value;
				this.isOpen = true;
				this.isLoading = false;
			}
		},
	},
	methods: {
		onChange() {
			// Let's warn the parent that a change was made
			if (this.isAsync) {
				// we want to make sure we only do this when it's an async request
				// emit event to parent component to start serach in the api
				// apply debounce to funtcion
				if (!this.debouncedSearch) {
					this.debouncedSearch = functionHelper.debounce(
						() => this.$emit('input', this.search),
						400
					);
				}
				this.debouncedSearch();
			} else {
				this.$emit('input', this.search);
			}

			// Is the data given by an outside ajax request?
			if (this.isAsync) {
				this.isLoading = true;
			} else {
				// Data is sync, we can search our flat array
				this.filterResults();
				this.isOpen = true;
			}
		},
		filterResults() {
			this.results = this.items.filter(
				item => item.toLowerCase().indexOf(this.search.toLowerCase()) > -1
			);
		},
		setResult(result) {
			this.search = result;
			this.selected.push(this.search);
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
			this.search = this.results[this.arrowCounter];
			this.selected.push(this.search);
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
	background-color: #4aae9b;
	color: white;
}
</style>
