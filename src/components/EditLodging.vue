<template lang="html">
  <b-row class="">
    <b-col class="borderEdit m-3">
      <h4>
        Edición de "{{ lodgingSelect.content }}"
      </h4>
      <b-row>
        <b-col md="4">
          <b-form-group
            id="input-group-1"
            label="Fecha inicio"
            label-for="input-1"
            description="Selecione la fecha que desea cambiar." >
          <b-form-input
            id="input-1"
            type="date"
            class="col-xs-2 "
            style="text-align: center; text-align-last:center;"
            v-model="dateStart"
            required/>
          </b-form-group>
        </b-col>
        <b-col md="4">
          <b-form-group
            id="input-group-1"
            label="Fecha fin"
            label-for="input-1"
            description="Selecione la fecha que desea cambiar." >
          <b-form-input
            id="input-1"
            type="date"
            class="col-xs-2 "
            style="text-align: center; text-align-last:center;"
            v-model="dateEnd"
            required/>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row >
        <b-col md="4">
          <b-form-group
            id="input-group-1"
            label="Espacio de trabajo:"
            label-for="input-1"
            description="Selecione el lugar de donde enviará información." >
          <b-form-select
            id="input-1"
            class="col-xs-2"
            style="text-align: center; text-align-last:center;"
            v-model="serviceSelected"
            :options="services"
            required/>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row >
        <b-col >
          <button disabled type="button" class="float-left btn btn-primary btn-md mt-2 col-xs-12" @click="saveLodging()">
            Agregar un pasajero todos los dias a {{ serviceSelected }}
          </button>
          <button disabled  type="button" class="float-left btn btn-primary btn-md mt-2 ml-md-2 col-xs-12" @click="saveLodging()">
            Disminuir un pasajero todos los dias a {{ serviceSelected }}
          </button>
          <button   type="button" class="float-left btn btn-danger btn-md mt-2 ml-md-2 col-xs-12 d-block" @click="saveLodging()">
            Guardar
          </button>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import moment from "moment"

export default {
  props: ['lodgingSelect'],
  data() {
    return {
      dateStart: moment(this.lodgingSelect.start).format('YYYY-MM-DD'),
      dateEnd: moment(this.lodgingSelect.end).format('YYYY-MM-DD'),
      services: [
        { text: 'Todos los servicios', value: 'todos los servicios' },
        { text: 'Desayuno', value: 'desayuno' },
        { text: 'Almuerzo', value: 'almuerzo' },
        { text: 'Cena', value: 'cena' },
        { text: 'Alojamiento', value: 'alojamiento' },
      ],
      serviceSelected: 'todos los servicios'
    }
  }
}
</script>

<style lang="css" scoped>
.borderEdit {
  border: 1px solid #dee2e6;
  padding: 15px;
}
</style>
