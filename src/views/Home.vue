<template>
  <b-container class="bv-example-row">
    <b-row class="justify-content-md-center">
      <b-col col lg="10" class="minWidth">
        <table class="col-12 table-bordered ">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Lugar trabajado</th>
              <th>¿Qué se hizo?</th>
              <th>Numero de camas</th>
            </tr>
          </thead>
          <tbody v-for="(activities, index) in activities" :key="index">
            <tr >
              <td>{{ activities.date }}</td>
              <td>{{ activities.workPlace }}</td>
              <td>{{ activities.whatWasDone }}</td>
              <td>{{ activities.ncamas }}</td>
            </tr>
            <tr v-if="activities.result">
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
    this.$store.dispatch("CleanLiness/fetchActivities")
  },
  computed: mapGetters({
    activities: "CleanLiness/activities",
  }),
}
</script>

<style scoped>
  .minWidth {
    min-width: 650px !important;
    overflow-x: auto;
  }
</style>
