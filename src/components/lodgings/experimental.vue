<template lang="html">
	<v-row>
		<v-col cols="12" class="overflow-x-auto">
			<table>
				<div class="d-inline-flex  pb-3 ">
					<div v-for="(date, id) in rangeDateTable" :key="id" class="itemNull">
						{{ date.numberDay }}
					</div>
				</div>
				<div
					v-for="(lodging, lodIndex) in lodgings"
					:key="lodIndex"
					class="d-inline-flex  pb-3 "
				>
					<div v-for="(date, id) in rangeDateTable" :key="id" class="itemNull">
						<template v-for="(day, idDay) in lodging.days">
							<span v-if="day.date == date.numberDay" :key="idDay">{{
								day.services[0].quantity
							}}</span>
						</template>
					</div>
				</div>
			</table>
		</v-col>
		<v-col cols="12">
			<v-row class="d-inline-flex  pb-3 ">
				<v-col
					v-for="(lodging, lodIndex) in lodgings"
					:key="lodIndex"
					cols="12"
					class="overflow-x-auto microCard"
				>
					<div>
						<div
							v-for="(day, dayIndex) in lodging.days"
							:key="dayIndex"
							style="min-width: max-content;"
						>
							{{ day.date }}
							<table>
								<tbody>
									<tr
										v-for="(service, serviceIndex) in day.services"
										:key="serviceIndex"
									>
										<td>
											<input
												:id="day.date + day.services[serviceIndex]"
												:value="service.quantity"
												type="number"
												class="inputService"
											/>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</v-col>
			</v-row>
		</v-col>
	</v-row>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

let moment = extendMoment(Moment);
export default {
	computed: {
		rangeDateTable() {
			var dates = [];
			var numberDays = this.rangeDate.end.diff(this.rangeDate.start, 'days');
			// if(numberDays >= 7) numberDays = 7
			for (var i = 0; i <= numberDays; i++)
				dates.push({
					numberDay: moment(this.rangeDate.start)
						.add(i, 'day')
						.format('DD-MM-YY'),
					nameDay: moment(this.rangeDate.start)
						.add(i, 'day')
						.format('DD-MM-YY'),
				});
			return dates;
		},
		...mapGetters({
			lodgings: 'Lodging/lodgings',
			rangeDate: 'Lodging/rangeDate',
		}),
	},
	created() {
		this.setRangeDate({
			start: moment(),
			end: moment().add(15, 'day'),
		});
	},
	methods: {
		// ...mapActions({
		// }),
		...mapMutations({
			setRangeDate: 'Lodging/setRangeDate',
		}),
	},
};
</script>

<style lang="css" scoped>
.itemNull {
	height: 100px !important;
	width: 100px !important;
	margin-right: 10px;
	margin-bottom: 5px;
	background-color: red;
}
</style>
