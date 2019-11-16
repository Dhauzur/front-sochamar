<template>
  <b-row class="justify-content-center">
    <b-col md="5" class="ml-3" >
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
        <b-form-group
          id="input-group-1"
          label="Espacio de trabajo:"
          label-for="input-1"
          description="Selecione el lugar de donde enviará información." >
        <b-form-select
          id="input-1"
          class="col-xs-2"
          v-model="form.lugardetrabajo"
          :options="spaces"
          required/>
        </b-form-group>

        <b-form-group
          v-if="form.lugardetrabajo && form.lugardetrabajo.includes('Habitación')"
          id="input-group-1"
          label="¿Cúantas camas se hicieron?"
          label-for="input-1" >
          <b-form-group>
            <b-form-radio v-model="form.ncamas" name="some-radios" value="1">1</b-form-radio>
            <b-form-radio v-model="form.ncamas" name="some-radios" value="2">2</b-form-radio>
            <b-form-radio v-model="form.ncamas" name="some-radios" value="3">3</b-form-radio>
            <b-form-radio v-model="form.ncamas" name="some-radios" value="4">4</b-form-radio>
            <b-form-radio v-model="form.ncamas" name="some-radios" value="5">5</b-form-radio>
            <b-form-radio v-model="form.ncamas" name="some-radios" value="6">6</b-form-radio>
          </b-form-group>
        </b-form-group>

        <b-form-group
          id="input-group-1"
          v-if="form.lugardetrabajo"
          label="¿Qué se hizo?"
          label-for="input-1" >
          <b-form-checkbox-group v-model="form.quesehizo" id="checkboxes-4">
            <b-form-checkbox v-if="form.lugardetrabajo.includes('Habitación')" value="Hacer la cama">Hacer la cama</b-form-checkbox>
            <b-form-checkbox v-if="form.lugardetrabajo.includes('Habitación')" value="Cambio de sábanas">Cambio de sábanas</b-form-checkbox>
            <b-form-checkbox v-if="form.lugardetrabajo.includes('Habitación')" value="Cambio funda almohada">Cambio funda almohada</b-form-checkbox>
            <b-form-checkbox value="Limpieza ventana">Limpieza ventana</b-form-checkbox>
            <b-form-checkbox value="Limpieza muebles">Limpieza muebles</b-form-checkbox>
            <b-form-checkbox value="Barrido de piso">Barrido de piso</b-form-checkbox>
            <b-form-checkbox value="Trapeado de piso">Trapeado de piso </b-form-checkbox>
            <b-form-checkbox v-if="form.lugardetrabajo.includes('Habitación')" value="Trapeado piso baño">Trapeado piso baño</b-form-checkbox>
            <b-form-checkbox v-if="form.lugardetrabajo.includes('Habitación')" value="Limpieza espejo baño">Limpieza espejo baño</b-form-checkbox>
            <b-form-checkbox v-if="form.lugardetrabajo.includes('Habitación')" value="Limpieza ducha">Limpieza ducha</b-form-checkbox>
            <b-form-checkbox v-if="form.lugardetrabajo.includes('Habitación')" value="Limpieza tasa de baño">Limpieza tasa de baño</b-form-checkbox>
            <b-form-checkbox v-if="form.lugardetrabajo.includes('Habitación')" value="Limpieza lavamanos">Limpieza lavamanos</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>

        <!-- <b-form-group id="input-group-2" label="Your Name:" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="form.name"
            required
            placeholder="Enter name"
          ></b-form-input>
        </b-form-group> -->

        <b-button class="m-2" type="submit" variant="primary">Enviar</b-button>
        <b-button class="m-2" type="reset" variant="danger">Borrar todo</b-button>
      </b-form>
      <b-card class="mt-3"  header="Datos a enviar">
        <pre class="m-0" >{{ form.lugardetrabajo }}</pre>
        <pre class="m-0" v-if="form.ncamas">N° de camas {{ form.ncamas }}</pre>
        ==========================
        <pre class="m-0" v-for="(q, index) in form.quesehizo" v-bind:key="index">{{ q }}</pre>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          lugardetrabajo: '',
          quesehizo: '',
          ncamas: null,

        },
        spaces: [
          { text: 'Selecione uno', value: '', disabled: true},
          'Habitación 1',
          'Habitación 2',
          'Habitación 3',
          'Habitación 4',
          'Habitación 5',
          'Habitación 6',
          'Habitación 7',
          'Living',
          'Comedor',
          'Patio trasero',
          'Patio delantero',
          'Camarines'],
        show: true
      }
    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault()
        alert(JSON.stringify(this.form))
      },
      onReset(evt) {
        evt.preventDefault()
        // Reset our form values
        this.form.lugardetrabajo = ''
        this.form.quesehizo = ''
        this.form.ncamas = null
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      }
    }
  }
</script>
