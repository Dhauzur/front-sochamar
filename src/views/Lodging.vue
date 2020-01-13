<template>
  <b-row class="justify-content-center">
    <b-col class="m-3 p-3">
    <Loading v-if="loading" />
    <template v-else >
      <div>
        <label>Selecione empresa</label>
        <b-form-select v-model="selectCompany"
                       @change="setCompany"
                       :options="companies"
                       size="sm"
                       class="col-5 m-3"/>

         <b-button v-if="lodgings.length == 0 && company" @click="createFirstLodging" size="sm">Crear hospedaje</b-button>
      </div>
      <b-row>
        <b-col>
        <timeline class="p-2"
          v-if="rooms.length > 0 && lodgings.length > 0"
          @rangechanged="rangechanged"
          @click="enableEdit"
          :items="lodgings"
          :events="['rangechanged', 'click']"
          :groups="rooms"
          :options="options"/>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="px-4 overflow-auto">
          <table class="table table-bordered ">
            <thead>
              <tr>
                <td>Actividad</td>
                <td v-if="company">Precios</td>
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
                <td v-if="company">{{ prices.prices[3] }}</td>
                <td v-for="(p, index) in proyectionTable" :key="index">
                  <span v-if="!editMode">{{ p.service.accommodation }}</span>
                  <input v-if="editMode && p.service.accommodation !== null"
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
                <td v-if="company">{{ prices.prices[0] }}</td>
                <td v-for="(p, index) in proyectionTable" :key="index">
                  <span v-if="!editMode">{{ p.service.breakfast }}</span>
                  <input v-if="editMode && p.service.breakfast !== null"
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
                <td v-if="company">{{ prices.prices[1] }}</td>
                <td v-for="(p, index) in proyectionTable" :key="index">
                  <span v-if="!editMode">{{ p.service.lunch }}</span>
                  <input v-if="editMode && p.service.lunch !== null"
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
                <td v-if="company">{{ prices.prices[2] }}</td>
                <td v-for="(p, index) in proyectionTable" :key="index">
                  <span v-if="!editMode">{{ p.service.dinner }}</span>
                  <input v-if="editMode && p.service.dinner !== null"
                         type="number"
                         class="inputService"
                         name="dinner"
                         :id="p.id + ',' + p.date"
                         @change="detectInputChange"
                         v-model="p.service.dinner"
                         :placeholder="p.service.dinner">
                </td>
              </tr>
              <tr>
                <td v-if="company" colspan="2">TOTAL</td>
                <td v-if="company">{{ finalyPrice[0] }}</td>
                <td v-if="company">{{ finalyPrice[1] }}</td>
                <td v-if="company">{{ finalyPrice[2] }}</td>
                <td v-if="company">{{ finalyPrice[3] }}</td>
                <td v-if="company">{{ finalyPrice[4] }}</td>
                <td v-if="company">{{ finalyPrice[5] }}</td>
                <td v-if="company">{{ finalyPrice[6] }}</td>
              </tr>
            </tbody>
          </table>
        </b-col>
      </b-row>

      <b-row>
        <b-col class=" px-4">
          <button v-if="editMode"  type="button" class="btn btn-primary mt-2 ml-2" @click="saveLodging()">
            Guardar
          </button>
        </b-col>
      </b-row>
      <b-row>
        <b-col class=" px-4">
          <EditLodging v-if="lodgingSelect"/>
        </b-col>
      </b-row>
    </template>

  </b-col>
  </b-row>
</template>

<script>
import { Timeline, DataSet }  from 'vue2vis';
import moment from "moment"
import { mapGetters, mapMutations } from 'vuex';
import Loading from '@/components/Loading'
import EditLodging from '@/components/EditLodging'

export default {
  components: {
    Timeline,
    Loading,
    EditLodging
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
      lodgingSelect: 'Lodging/lodgingSelect',
      loading: 'Lodging/loading',
      rooms: 'Lodging/rooms',
      rangeDate: 'Lodging/rangeDate',
      lodgings: 'Lodging/lodgings',
      companies: 'Lodging/companies',
      company: 'Lodging/company',
      editMode: 'Lodging/editMode',
    }),
    finalyPrice() {
      var prices = []
      var dayPrice = 0
      this.proyectionTable.forEach((dailyService) => {
        dayPrice =  (dailyService.service.breakfast * this.prices.prices[0]) +
                    (dailyService.service.lunch * this.prices.prices[1]) +
                    (dailyService.service.dinner * this.prices.prices[2]) +
                    (dailyService.service.accommodation * this.prices.prices[3])
        prices.push(dayPrice)
      })
      return prices
    },
    prices() {
      return this.companies.find((c) => c.value == this.company)
    },
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
        if(this.editMode && this.lodgingSelect.id == l.id) {
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
          this.setModeEdit(true)
          if(this.company) {
            callback(item)
            this.$store.commit("Lodging/updateService", item)
          }
        },
        onMoving: (item, callback) => {
          this.setModeEdit(false)
          if(this.company) callback(item)
        },
        onRemove: (item, callback) => {
          if(this.lodgings.length > 1 && this.company) {
            this.setModeEdit(true)
            callback(item)
          }
        },
        onAdd: (item, callback) => {
          if(this.company) {
            this.setModeEdit(false)
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
          this.setModeEdit(true)
          if(this.company) {
            this.$store.commit("Lodging/updateService", item)
            callback(item);
          }
        },
      }
    }
  },
  methods: {
    setCompany(payload) {
      this.setCompanyLodging(payload)
      this.setModeEdit(false)
      this.$store.dispatch("Lodging/fetchCompany")
    },
    detectInputChange(payload) {
      if(payload.target.value == '' || payload.target.value == 0) payload.target.value = 0
      this.updateService(payload.target)
    },
    enableEdit(payload) {
      if(this.company && payload.item) {
        this.setLodgingSelect(this.lodgings.get(payload.item))
        this.setModeEdit(true)
      }
      else this.setModeEdit(false)
    },
    saveLodging() {
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
      setLodgingSelect: 'Lodging/setLodgingSelect',
      setRangeDate: 'Lodging/setRangeDate',
      updateService: 'Lodging/updateService',
      setCompanyLodging: 'Lodging/setCompanyLodging',
      createFirstLodging: 'Lodging/createFirstLodging',
      setModeEdit: 'Lodging/setModeEdit'
    }),
  }
}
</script>

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
