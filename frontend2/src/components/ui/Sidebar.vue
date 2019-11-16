<template>
  <Wrapper
    :open="open"
    :width="width"
  >
    <div>
      <slot />
    </div>

    <Flap @click="onToggle">
      <img :src="open ? chevronLeft : chevronRight" width="12" />
    </Flap>
  </Wrapper>
</template>

<script>
  import styled from 'vue-styled-components';
  import chevronLeft from '../../img/chevron-left.svg';
  import chevronRight from '../../img/chevron-right.svg';

  const Wrapper = styled('div', {
    open: Boolean,
    width: Number,
  })`
    width: ${props => props.open ? `${props.width}px` : 0};
    height: 100vh;
    background-color: white;
    box-shadow: 5px 0px 20px #0000000D;
    position: relative;

    & > div {
      overflow: hidden;
    }
  `;

  const Flap = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 48px;
    background-color: white;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    position: absolute;
    right: -20px;
    top: 24px;
    z-index: 9;
    box-shadow: 5px 0px 20px #0000000D inset;

    & > img {
      position: relative;
      left: -2px;
    }
  `;

  export default {
    name: 'Sidebar',
    props: ['open', 'width'],
    data: () => ({
      chevronLeft,
      chevronRight,
    }),
    methods: {
      onToggle: function() {
        this.$emit('onToggle');
      },
    },
    components: {
      Wrapper,
      Flap,
    },
  }
</script>