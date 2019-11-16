<template>
  <Wrapper>
    <img :src="loaderImg" />
  </Wrapper>
</template>

<script>
  import styled from 'vue-styled-components';
  import loaderImg from 'img/loading.svg';

  const Wrapper = styled.div`
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 48px;
      height: 48px;
    }
  `;

  export default {
    name: 'Logo',
    components: {
      Wrapper,
    },
    data: function() {
      return {
        loaderImg,
      };
    },
  };
</script>