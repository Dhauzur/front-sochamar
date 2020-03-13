<template>
	<b-container id="nav">
		<b-row
			class="justify-content-center overflow-auto"
			style="max-height: 500px; overflow-y: auto;"
		>
			<b-col v-if="loading">
				<Loading :msj="loading" />
			</b-col>
			<b-col v-else>
				<h5>Filtrar lugar de trabajos {{ totalFilter }}</h5>
				<input
					v-model="filterWord"
					type="text"
					name="filterWorkplace"
					@keyup="filterWorkplace"
				/>
				<h4 v-if="activitiesFilter == 0">No existen trabajos</h4>
				<table v-else class="table  table-hover mt-2">
					<thead>
						<tr>
							<th>Fecha</th>
							<th>Lugar trabajado</th>
							<th>Numero de camas</th>
							<th>¿Qué se hizo?</th>
						</tr>
					</thead>
					<tbody v-for="(act, index) in activitiesFilter" :key="index">
						<tr :class="{ bgRepeat: act.repeat, endWeek: endWeek(act, index) }">
							<td style="min-width: 90px;">{{ act.date }}</td>
							<td style="min-width: 120px;">{{ act.workPlace }}</td>
							<td>{{ act.ncamas }}</td>
							<td>
								<div
									v-for="(acti, key) in act.whatWasDone"
									:key="key"
									class="listActivities"
								>
									<ul v-for="(a, i) in acti.split(',')" :key="i">
										<li>{{ a }}</li>
									</ul>
									<ul style="color: grey">
										<li>
											{{ act._id }}
										</li>
									</ul>
								</div>
							</td>
						</tr>
						<tr v-if="act.result" :class="{}">
							<td colspan="2">CANTIDAD DE CAMAS: {{ act.numbersOfBeds }}</td>
							<td colspan="2">VALOR: {{ act.valueOfBeds }}</td>
						</tr>
						<tr
							v-if="act.result"
							:class="{ 'bg-warning': !act.state, 'bg-primary': act.state }"
						>
							<td colspan="4">{{ !activities.state ? 'PAGADO' : 'VALOR' }}</td>
						</tr>
					</tbody>
				</table>
			</b-col>
		</b-row>
		<h1 class="secondary--text">Welcome</h1>
		<h3 class="secondary--text">Home view</h3>
	</b-container>
</template>

<script>
// @ is an alias to /src
import { mapGetters, mapMutations } from 'vuex';
import Loading from '@/components/Loading';

export default {
	components: {
		Loading,
	},
	data() {
		return {
			filterWord: '',
		};
	},
	computed: {
		...mapGetters({
			activities: 'Maintenance/activities',
			loading: 'Maintenance/loading',
		}),
		totalFilter() {
			var totalFilter = 0;
			if (this.activitiesFilter && this.filterWord) {
				this.activitiesFilter.forEach(
					actFilter => (totalFilter = totalFilter + actFilter.ncamas)
				);
				return totalFilter;
			} else return '';
		},
		activitiesFilter() {
			if (this.filterWord)
				return this.activities.filter(act =>
					(act.date.toLowerCase() + ' ' + act.workPlace.toLowerCase()).includes(
						this.filterWord.toLowerCase()
					)
				);
			else return this.activities;
		},
	},
	mounted() {
		this.$store.dispatch('Maintenance/fetchActivities');
	},
	methods: {
		endWeek(act, index) {
			if (index >= 1) return act.date != this.activities[index - 1].date ? true : false;
			else return false;
		},
		...mapMutations({
			filterWorkplace: 'Maintenance/filterWorkplace',
		}),
	},
};
</script>

<style scoped>
.minWidth {
	min-width: 650px !important;
}
.bgRepeat {
	background-color: #ff00001f;
}

.endWeek {
	border-top: 2px solid black;
}

ul {
	font-size: 14px;
	margin: 0px;
	list-style-type: none;
}

.listActivities {
	max-height: 50px;
	overflow-y: auto;
}
</style>
