<template lang="html">
  <b-row id="nav" class="justify-content-center">
    <b-col >
      <b-row class="mx-1">
        <div>
          <b-dropdown class="m-3"  variant="primary" id="dropdown-1" text="Acciones" size="sm">
            <b-dropdown-item @click="$router.push({ name: 'grupos' })">Gestionar grupos</b-dropdown-item>
            <b-dropdown-item @click="$router.push({ name: 'hospedaje' })">Hospedajes</b-dropdown-item>
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
