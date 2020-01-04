<template>
  <b-col  >
    <h4>Hospedaje</h4>
    <div>
      <label>Selecione empresa</label>
      <b-form-select v-model="selectCompany"
                     @change="setCompany"
                     :options="companies"
                     size="sm"
                     class="col-5 m-3"/>

       <b-button v-if="lodgings.length == 0 && company" @click="createFirstLodging" size="sm">Crear hospedaje</b-button>
    </div>
    <div>
      <timeline ref="timeline"
      v-if="rooms.length > 0 && lodgings.length > 0"
      @rangechanged="rangechanged"
      @click="enableEdit"
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
                   :id="p.id + ',' + p.date"
                   @change="detectInputChange"
                   v-model="p.service.accommodation"
                   :placeholder="p.service.accommodation">
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
                   :id="p.id + ',' + p.date"
                   @change="detectInputChange"
                   v-model="p.service.breakfast"
                   :placeholder="p.service.breakfast">
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
                   :id="p.id + ',' + p.date"
                   @change="detectInputChange"
                   v-model="p.service.lunch"
                   :placeholder="p.service.lunch">
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
                   :id="p.id + ',' + p.date"
                   @change="detectInputChange"
                   v-model="p.service.dinner"
                   :placeholder="p.service.dinner">
          </td>
        </tr>
      </tbody>
    </table>
    <button v-if="editMode"  type="button" class="btn btn-primary mt-2 ml-2" @click="saveLodging()">
      Guardar
    </button>
  </b-col>
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
    this.$store.dispatch("Lodging/fetchCompany")
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
      companies: 'Lodging/companies',
      company: 'Lodging/company',
    }),
    proyectionTable() {
      var proyectionTable = []
      var daysLodging = []
      for (var i = 0; i < 7; i++) daysLodging.push({
        date: moment(this.rangeDate.start).add(i, 'day').format('YYYY-MM-DD'),
        service: [],
        id: null
      })

      this.lodgings.forEach((l, il) => {
        var index = 0
        if(!this.editMode) daysLodging.forEach((day) => {
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
        if(this.editMode && this.lodgingSelect == l.id) {
          daysLodging.forEach((day) => {
            if(moment(day.date).isSameOrAfter(moment(l.start).format('YYYY-MM-DD')) && moment(day.date).isSameOrBefore(moment(l.end).format('YYYY-MM-DD'))) {
              var service = JSON.parse(l.service[0])
              day.service = {
                breakfast:  service[index][0],
                lunch: service[index][1] ,
                dinner:  service[index][2] ,
                accommodation:  service[index][3]
              }
              day.id = l.id
              index++
            }
          })
        }
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
      selectCompany: null,
      editMode: false,
      lodgingSelect: null,
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
        onUpdate: (item, callback) => {
          if(this.company) callback(item)
        },
        onMoving: (item, callback) => {
          if(this.company) callback(item)
        },
        onRemove: (item, callback) => {
          if(this.lodgings.length > 1 && this.company) callback(item)
        },
        onAdd: (item, callback) => {
          if(this.company) {
            item.group = item.group
            item.start = moment(item.start).hours(16)
            item.end = moment(item.start).hours(12).add(1, 'day')
            item.content = item.group + 'Hab.'
            item.service = ["[[1,1,1,1],[1,1,1,1]]"]
            callback(item); // send back adjusted new item
          }
        },
        onMove: (item, callback) => {
          var service = []
          var numberDays = moment(item.end).diff(moment(item.start).format('YYYY-MM-DD'), 'days')
          var oldService = JSON.parse(item.service[0])
          for (var i = 0; i <= (numberDays); i++)
            service.push([
              oldService[i] ? oldService[i][0] : 1,
              oldService[i] ? oldService[i][1] : 1,
              oldService[i] ? oldService[i][2] : 1,
              oldService[i] ? oldService[i][3] : 1
            ])
          var itemService = []
          itemService.push(JSON.stringify(service))
          item.start = moment(item.start).hours(16)
          item.end = moment(item.end).hours(12)
          item.service = itemService
          if(this.company) callback(item);
        },
      }
    }
  },
  methods: {
    setCompany(payload) {
      this.setCompanyLodging(payload)
      this.$store.dispatch("Lodging/fetchCompany")
    },
    detectInputChange(payload) {
      this.updateService(payload.target, payload.target.value)
    },
    enableEdit(payload) {
      if(this.company) {
        this.lodgingSelect = payload.item
        if(payload.item) this.editMode = true
        else this.editMode = false
      }
    },
    saveLodging() {
      this.editMode = !this.editMode
      if(this.company) this.$store.dispatch("Lodging/createLodging")
    },
    rangechanged(payload) {
      if(payload) {
        this.setRangeDate({
          start: moment(payload.start),
          end: moment(payload.end).add(7, 'day'),
        })
      }
    },
    ...mapMutations({
      setRangeDate: 'Lodging/setRangeDate',
      updateService: 'Lodging/updateService',
      setCompanyLodging: 'Lodging/setCompanyLodging',
      createFirstLodging: 'Lodging/createFirstLodging'
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
