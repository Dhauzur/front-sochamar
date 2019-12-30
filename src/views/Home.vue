<template>
  <b-container class="bv-example-row">
    <b-row class="justify-content-md-center">
      <b-col col lg="10" class="minWidth">
        <h4 v-if="activities == 0">No existen trabajos</h4>
        <table v-else class="col-12 table-bordered table-hover ">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Lugar trabajado</th>
              <th>¿Qué se hizo?</th>
              <th>Numero de camas</th>
            </tr>
          </thead>
          <tbody v-for="(act, index) in activities" :key="index">
            <tr :class="{ 'bgRepeat': act.repeat, 'endWeek': endWeek(act, index)  }">
              <td style="min-width: 90px;">{{ act.date }}</td>
              <td style="min-width: 120px;"><span v-if="act.repeat">Rep: </span>{{ act.workPlace }}</td>
              <td>
                <span v-for="(act, index) in act.whatWasDone" :key="index">
                  <ul v-for="(a, index) in act.split(',')" :key="index">
                    <li >{{ a }}</li>
                  </ul>
                </span>
              </td>
              <td>{{ act.ncamas }}</td>
            </tr>
            <tr v-if="act.result" :class="{   }">
              <td colspan="2">CANTIDAD DE CAMAS: {{ act.numbersOfBeds }}</td>
              <td colspan="2">VALOR: {{ act.valueOfBeds }}</td>
            </tr>
            <tr v-if="act.result" :class="{ 'bg-warning': !act.state, 'bg-primary': act.state  }">
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
  mounted() {
    this.$store.dispatch("Maintenance/fetchActivities")
  },
  computed: mapGetters({
    activities: "Maintenance/activities",
  }),
  methods: {
    endWeek(act, index) {
      if(index >= 1) {
        console.log(act.date);
        console.log(this.activities[index-1].date);
        console.log("lllll");
        return act.date != this.activities[index-1].date ? true : false
      }
      else return false
    }
  }
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
    border-top: 2px solid black;
  }

  ul {
    font-size: 12px;
    margin: 0px;
    list-style-type: none;
  }
</style>
