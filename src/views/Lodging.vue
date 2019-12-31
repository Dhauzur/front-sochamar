<template>
  <b-row class="justify-content-center">
    <b-col md="10" class="ml-3">
      <h4>Hospedaje</h4>
      <div>
        <timeline ref="timeline"
        v-if="rooms.length > 0 && lodgings.length > 0"
        @rangechanged="rangechanged"
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
            <td>ALOJAMIENTO</td>
            <td v-for="(p, index) in proyectionTable" :key="index">
              <span v-if="!editMode">{{ p.service.accommodation }}</span>
              <input v-if="editMode && p.service.accommodation"
                     type="number"
                     class="inputService"
                     name="accommodation"
                     :value="p.service.accommodation">
            </td>
          </tr>
          <tr>
            <td>DESAYUNO</td>
            <td v-for="(p, index) in proyectionTable" :key="index">
              <span v-if="!editMode">{{ p.service.breakfast }}</span>
              <input v-if="editMode && p.service.breakfast"
                     type="number"
                     class="inputService"
                     name="breakfast"
                     :value="p.service.breakfast">
            </td>
          </tr>
          <tr>
            <td>ALMUERZO</td>
            <td v-for="(p, index) in proyectionTable" :key="index">
              <span v-if="!editMode">{{ p.service.lunch }}</span>
              <input v-if="editMode && p.service.lunch"
                     type="number"
                     class="inputService"
                     name="lunch"
                     :value="p.service.lunch">
            </td>
          </tr>
          <tr>
            <td>CENA</td>
            <td v-for="(p, index) in proyectionTable" :key="index">
              <span v-if="!editMode">{{ p.service.dinner }}</span>
              <input v-if="editMode && p.service.dinner"
                     type="number"
                     class="inputService"
                     name="dinner"
                     :value="p.service.dinner">
            </td>
          </tr>
        </tbody>
      </table>
      <button v-if="!editMode" type="button" class="btn btn-primary mt-2" @click="enableEdit()">
        Editar servicios
      </button>
      <button v-else  type="button" class="btn btn-primary mt-2 ml-2" @click="saveLodging()">
        Guardar
      </button>
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
    this.setRangeDate({
      start: moment(),
      end: moment().add(15, 'day'),
    })
  },
  computed: {
    ...mapGetters({
      rooms: 'Lodging/rooms',
      rangeDate: 'Lodging/rangeDate',
      lodgings: 'Lodging/lodgings',
      listLodgings: 'Lodging/listLodgings'
    }),
    proyectionTable() {
      var proyectionTable = []
      var daysLodging = []
      for (var i = 0; i < 7; i++) daysLodging.push({
        date: moment(this.rangeDate.start).add(i, 'day').format('YYYY-MM-DD'),
        service: []
      })
      this.lodgings.forEach((l, il) => {
        var index = 0
        daysLodging.forEach((day) => {
          if(moment(day.date).isSameOrAfter(moment(l.start).format('YYYY-MM-DD')) && moment(day.date).isSameOrBefore(moment(l.end).format('YYYY-MM-DD'))) {
            var service = JSON.parse(l.service[0])
            day.service = {
              breakfast: day.service.breakfast ? service[index][0] + day.service.breakfast : service[index][0],
              lunch: day.service.lunch ? service[index][1] + day.service.lunch : service[index][1] ,
              dinner: day.service.dinner ? service[index][2] + day.service.dinner : service[index][2] ,
              accommodation: day.service.accommodation ? service[index][3] + day.service.accommodation : service[index][3]
            }
            index++
          }
        })
      })
      return daysLodging
    },
    rangeDateTable() {
      var dates = []
      var numberDays = this.rangeDate.end.diff(this.rangeDate.start, 'days')
      if(numberDays >= 7) numberDays = 7
      for (var i = 0; i < numberDays; i++) dates.push({
        numberDay: moment(this.rangeDate.start).add(i, 'day').format('DD MMM'),
        nameDay: moment(this.rangeDate.start).add(i, 'day').format('ddd')
      })
      return dates
    },

  },
  data() {
    return {
      editMode: false,
      options: {
        stack: true,
        editable: true,
        start: moment(),
        end: moment().add(7, 'day'),
        zoomMin: 604800000,
        zoomMax: 5184000000,
        editable: true,
        hiddenDates: {
          start: '2019-01-01 12:00:00',
          end: '2019-01-01 11:00:00',
          repeat:'daily'
        },
        onAdd: function(item, callback) {
          item.group = item.group
          item.start = moment(item.start).hours(16)
          item.end = moment(item.start).hours(12).add(1, 'day')
          item.content = item.group + 'Hab.'
          item.service = ["[[1,1,1,1],[1,1,1,1]]"]
          callback(item); // send back adjusted new item
        },
        onMove: function(item, callback) {
          item.start = moment(item.start).hours(16)
          item.end = moment(item.end).hours(12)
          callback(item); // send back adjusted item
        },
      }
    }
  },
  methods: {
    enableEdit() {
      this.editMode = !this.editMode
    },
    saveLodging() {
      this.editMode = !this.editMode
      this.$store.dispatch("Lodging/createLodging")
    },
    rangechanged(payload) {
      if(payload) {
        this.setRangeDate({
          start: moment(payload.start),
          end: moment(payload.end).add(7, 'day'),
        })
      }
    },
    itemUpdate(payload) {
      this.updateLodgings({
        id: payload.properties.data[0].id,
        payload: payload.properties.data[0]
      })
    },
    ...mapMutations({
      updateLodgings: 'Lodging/updateLodgings',
      setRangeDate: 'Lodging/setRangeDate',
      addLodging: 'Lodging/addLodging'
    }),
  }
}
</script>

<style src="vue2vis/dist/vue2vis.css"/>;
<style lang="css">
.vis-time-axis .vis-grid.vis-odd {
  background: #f5f5f5;
}

.vis-time-axis .vis-grid.vis-saturday,
.vis-time-axis .vis-grid.vis-sunday {
  background: #8080808f;
}
.vis-time-axis .vis-text.vis-saturday,
.vis-time-axis .vis-text.vis-sunday {
  color: white;
}
.inputService {
  max-width: 60px;
}
td, th {
  padding: 2px !important;
}
</style>
