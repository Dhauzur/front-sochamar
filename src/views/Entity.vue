<template lang="html">
  <b-row id="nav" class="justify-content-center">
    <b-col >
      <b-row class="mx-1">
        <div>
          <label class="text-white">Selecione empresa</label>
          <b-form-select v-model="selectCompany"
                       @change="setCompany"
                       :options="companies"
                       size="sm"
                       class="col-5 m-3"/>
          <b-button v-if="lodgings.length == 0 && company"
                  @click="createLodging()"
                  size="sm"
                  variant="primary" >
                  Crear hospedaje
          </b-button>
        </div>
        <div>
          <b-dropdown class="m-3"  variant="primary" id="dropdown-1" text="Acciones" size="sm">
            <b-dropdown-item @click="createLodging()">Agregar hospedaje</b-dropdown-item>
            <b-dropdown-item @click="$router.push({ name: 'grupos' })">Gestionar grupos</b-dropdown-item>
            <b-dropdown-item @click="$router.push({ name: 'entidades' })">Gestionar entidades</b-dropdown-item>
          </b-dropdown>
        </div>
      </b-row>
    </b-col >
  </b-row >
</template>

<script>
export default {
}
</script>

<style lang="css" scoped>
</style>
