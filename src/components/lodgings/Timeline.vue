<template lang="html">
	<v-row>
		<v-col cols="3" md="2" class="overflow-x-auto" style="margin-top: 48px;">
			<div v-for="(lodging, lodIndex) in items" :key="lodIndex" class="itemPerson mb-1">
				{{ lodging.group }}
			</div>
		</v-col>
		<v-col cols="6" md="8" class="overflow-x-auto">
			<div class="d-inline-flex  pb-1 ">
				<div v-for="(date, id) in rangeDateTable" :key="id" class="itemMonthHead">
					<div v-if="date.nameDay == '01'" class="nameMonth">
						{{ convertDate(date.numberDay) }}
					</div>
				</div>
			</div>
			<div class="d-inline-flex  pb-1 ">
				<div v-for="(date, id) in rangeDateTable" :key="id" class="itemDateHead">
					{{ date.nameDay }}
				</div>
			</div>
			<div v-for="(lodging, lodIndex) in items" :key="lodIndex" class="d-inline-flex ">
				<div v-for="(date, id) in rangeDateTable" :key="id" class="itemEmpty">
					<template v-for="(day, idDay) in lodging.days">
						<div
							v-if="day.date == date.numberDay"
							:key="idDay"
							:class="{ itemUsed: day.date == date.numberDay }"
						></div>
					</template>
				</div>
			</div>
		</v-col>
		<v-col cols="3" md="2">sdfsdf </v-col>
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
												v-model="service.quantity"
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
	props: {
		items: {
			type: Array,
			required: true,
		},
	},
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
						.format('DD'),
				});
			return dates;
		},
		...mapGetters({
			rangeDate: 'Lodging/rangeDate',
		}),
	},
	created() {
		this.setRangeDate({
			start: moment().date(1),
			end: moment()
				.date(0)
				.add(1, 'M'),
		});
	},
	methods: {
		convertDate(value) {
			return moment(value).format('dddd MMMM YYYY');
		},
		// ...mapActions({
		// }),
		...mapMutations({
			setRangeDate: 'Lodging/setRangeDate',
		}),
	},
};
</script>

<style lang="scss" scoped>
.itemPerson {
	height: 20px;
	width: 300px;
	background-color: #8080801c;
	border-right: 1px solid white;
	text-align: left;
	padding-left: 5px;
}
.itemMonthHead {
	height: 20px;
	width: 30px;
	background-color: transparent;
}
.nameMonth {
	width: 300px;
	text-align: left;
}
.itemEmpty,
.itemDateHead,
.itemUsed,
.itemPerson {
	border-radius: 3px;
}
.itemUsed {
	width: calc(100% + 1px);
	height: 100%;
	background-color: #a786fd;
	border-right: 1px solid #a786fd;
}
.itemEmpty,
.itemDateHead {
	height: 20px;
	width: 30px;
	background-color: #8080801c;
	border-right: 1px solid white;
}

.itemDateHead {
	background-color: #6a31ff;
	color: white;
}
</style>
