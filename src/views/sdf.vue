<template>
  <b-row class="justify-content-center">
    <b-col md="10" class="ml-3" >
      <h4>Estadias</h4>
      <div id="app">
        <timeline ref="timeline"
        :items="items"
        :groups="groups"
        :options="options">
        </timeline>
        <h5>{{ items }}</h5>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import { Timeline }  from 'vue2vis';
import moment from "moment"

export default {
  components: {
    Timeline
  },
  data() {
    return {
      groups: [{
      	id: 0,
        content: 'Group 1'
      }, {
        id: 1,
        content: 'Group 2'
      }],
      items: [{
      	id: 0,
        group: 0,
        start: moment('2019-01-02'),
        end: moment('2019-01-31'),
        content: 'Item 1'
      }, {
      	id: 1,
        group: 0,
        start: moment('2019-01-01'),
        end: moment('2019-01-15'),
        content: 'Item 1'
      }],
      options: {
        editable: true,
        start: moment('2019-01-01'),
        end: moment('2019-03-15'),
        onUpdate: function(item, callback) {
          prettyPrompt("Update item", "Edit items text:", item.content, function(
            value
          ) {
            if (value) {
              item.content = value;
              callback(item); // send back adjusted item
            } else {
              callback(null); // cancel updating the item
            }
          });
        },
      }
    }
  },
  methods: {

  }
}
</script>

<style src="vue2vis/dist/vue2vis.css"/>;
