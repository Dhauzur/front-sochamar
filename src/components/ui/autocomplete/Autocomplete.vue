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
			<li
				v-for="(result, i) in results"
				:key="i"
				class="autocomplete-result"
				:class="{ 'is-active': i === arrowCounter }"
				@click="setSelected(result)"
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
			itemselected: {},
			search: '',
			results: [],
			isOpen: false,
			arrowCounter: -1,
		};
	},
	mounted() {
		document.addEventListener('click', this.handleClickOutside);
	},
	destroyed() {
		document.removeEventListener('click', this.handleClickOutside);
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
			if (this.results[this.arrowCounter]) {
				this.setSelected(this.results[this.arrowCounter]);
				this.isOpen = false;
				this.arrowCounter = -1;
			}
		},
		handleClickOutside(event) {
			if (!this.$el.contains(event.target)) {
				this.isOpen = false;
				this.arrowCounter = -1;
			}
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

	background-color: transparent;
	background-image: linear-gradient(80deg, #676b76, #676b769e, #676b76);
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
	background-color: #c1c5d1;
	color: #3a3b3e;
}
</style>
