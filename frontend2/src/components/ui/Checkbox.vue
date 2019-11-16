<template>
  <PCheckbox
    color="primary"
    @change="onChange"
  >
    {{ label }}
  </PCheckbox>
</template>

<script>
  import PCheckbox from 'pretty-checkbox-vue/check';
  import 'pretty-checkbox/dist/pretty-checkbox.min.css';

  export default {
    name: 'Checkbox',
    props: ['label'],
    methods: {
      onChange(value) {
        this.$emit('change', value);
      },
    },
    components: {
      PCheckbox,
    },
  };
</script>
