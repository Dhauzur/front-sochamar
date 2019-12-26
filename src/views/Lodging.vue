<template>
  <b-row class="justify-content-center">
    <b-col md="10" class="ml-3" >
      <h4>Hospedaje</h4>
      <div>
        <timeline ref="timeline"
        @items-update="itemUpdate"
        :items="lodgings"
        :groups="groups"
        :options="options">
        </timeline>
      </div>
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
    this.$store.dispatch("Lodging/fetchLodgings")
  },
  computed: {
    ...mapGetters({
      lodgings: 'Lodging/lodgings',
    })
  },
  data() {
    return {
      groups: new DataSet([{
      	id: 0,
        content: 'Habitación 1'
      }, {
        id: 1,
        content: 'Habitación 2'
      }, {
        id: 2,
        content: 'Habitación 3'
      }, {
        id: 3,
        content: 'Habitación 4'
      }, {
        id: 4,
        content: 'Habitación 5'
      }]),
      items: null,
      options: {
        stack: true,
        editable: true,
        start: moment('2019-01-01'),
        end: moment('2019-01-07'),
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
    }),
  }
}
</script>

<style src="vue2vis/dist/vue2vis.css"/>;
