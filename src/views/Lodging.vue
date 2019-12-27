<template>
  <b-row class="justify-content-center">
    <b-col md="10" class="ml-3" >
      <h4>Hospedaje</h4>
      <div>
        <timeline ref="timeline"
        v-if="rooms.length > 0"
        @items-update="itemUpdate"
        :items="lodgings"
        :groups="rooms"
        :options="options">
        </timeline>
      </div>
      <table class="table table-bordered mt-2">
        <thead>
          <tr>
            <td>Actividad</td>
            <td v-for="(d, index) in rangeDateTable" :key="index">
              {{ d.numberDay }}
              <br>
              {{ d.nameDay }}
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>

          </tr>
        </tbody>
      </table>
      <table class="table table-bordered table-md m-2">
        <thead>
          <tr>
            <th>Habitación</th>
            <th>Pasajeros</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Pension</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(l, index) in lodgings._data" :key="index">
            <td>{{ l.group }}</td>
            <td>{{ l.numberPassanger }}</td>
            <td>{{ l.start }}</td>
            <td>{{ l.end }}</td>
            <td>{{ l.typePension }}</td>
          </tr>
        </tbody>
      </table>
    </b-col>
  </b-row>
</template>

<script>
import { Timeline, DataSet }  from 'vue2vis';
import moment from "moment"
import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    Timeline
  },
  created() {
    this.$store.dispatch("Lodging/fetchRooms")
    this.$store.dispatch("Lodging/fetchLodgings")
    this.setRangeDate({
      start: moment(),
      end: moment().add(15, 'day'),
    })
  },
  computed: {
    ...mapGetters({
      rooms: 'Lodging/rooms',
      rangeDate: 'Lodging/rangeDate',
      lodgings: 'Lodging/lodgings'
    }),
    rangeDateTable() {
      var dates = []
      var numberDays = this.rangeDate.end.diff(this.rangeDate.start, 'days')
      if(numberDays >= 7) numberDays = 7
      for (var i = 0; i < numberDays; i++) dates.push({
        numberDay: moment(this.rangeDate.start).add(i, 'day').format('MM/DD'),
        nameDay: moment(this.rangeDate.start).add(i, 'day').format('ddd')
      })
      return dates
    }
  },
  data() {
    return {
      options: {
        stack: true,
        editable: true,
        start: moment(),
        end: moment().add(7, 'day'),
        zoomMin: 259200000,
        zoomMax: 5184000000,
        editable: true,
        hiddenDates: {
          start: '2019-01-01 12:00:00',
          end: '2019-01-01 11:00:00',
          repeat:'daily'
        },
        onAdd: function(item, callback) {
          item.group = item.group
          item.start = moment(item.start).hours(12)
          item.end = moment(item.start).hours(12).add(1, 'day')
          item.content = 'Habitación ' + item.group
          callback(item); // send back adjusted new item
        },
        onMove: function(item, callback) {
          item.start = moment(item.start).hours(12)
          item.end = moment(item.end).hours(12)
          callback(item); // send back adjusted item
        },
      }
    }
  },
  methods: {
    itemUpdate(payload) {
      console.log("upd");
      this.updateLodgings({
        id: payload.properties.data[0].id,
        payload: payload.properties.data[0]
      })
      // this.items[payload.properties.data[0].id] = payload.properties.data[0]
    },
    ...mapMutations({
      updateLodgings: 'Lodging/updateLodgings',
      setRangeDate: 'Lodging/setRangeDate'
    }),
  }
}
</script>

<style src="vue2vis/dist/vue2vis.css"/>;
