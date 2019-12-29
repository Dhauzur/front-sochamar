<template>
  <b-container class="bv-example-row">
    <b-row class="justify-content-md-center">
      <b-col col lg="10" class="minWidth">
        <h4 v-if="activities == 0">No existen trabajos</h4>
        <table class="col-12 table-bordered table-hover ">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Lugar trabajado</th>
              <th>¿Qué se hizo?</th>
              <th>Numero de camas</th>
            </tr>
          </thead>
          <tbody v-for="(activities, index) in activities" :key="index">
            <tr :class="{ 'bgRepeat': activities.repeat  }">
              <td style="min-width: 90px;">{{ activities.date }}</td>
              <td style="min-width: 120px;">{{ activities.workPlace }}</td>
              <td>
                <span v-for="(act, index) in activities.whatWasDone" :key="index">
                  {{ act }}
                </span>
              </td>
              <td>{{ activities.ncamas }}</td>
            </tr>
            <tr v-if="activities.result" :class="{ 'endWeek': activities.result  }">
              <td colspan="2">CANTIDAD DE CAMAS: {{ activities.numbersOfBeds }}</td>
              <td colspan="2">VALOR: {{ activities.valueOfBeds }}</td>
            </tr>
            <tr v-if="activities.result" :class="{ 'bg-warning': !activities.state, 'bg-primary': activities.state  }">
              <td colspan="4">{{ activities.state ? 'PAGADO' : 'PENDIENTE' }}</td>
            </tr>
          </tbody>
        </table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import { mapGetters } from "vuex"

export default {
  name: 'home',
  beforeCreate() {
    this.$store.dispatch("Maintenance/fetchActivities")
  },
  data() {
    return {
      beds: new Set()
    }
  },
  computed: mapGetters({
    activities: "Maintenance/activities",
  })
}
</script>

<style scoped>
  .minWidth {
    min-width: 650px !important;
    overflow-x: auto;
  }
  .bgRepeat {
    background-color: #ff00001f;
  }

  .endWeek {
    border-bottom: 2px solid black;
  }
</style>
