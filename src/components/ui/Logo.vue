<template>
  <Wrapper>
    <router-link
      to="/"
    >
      Explorador Energético
    </router-link>
  </Wrapper>
</template>

<script>
  import styled from 'vue-styled-components';

  const Wrapper = styled.div`
    display: flex;
    color: var(--primary-color);
    font-size: 16px;
    width: 140px;
    text-transform: uppercase;
    font-family: 'Signika Negative';
    letter-spacing: 2px;
    font-weight: bold;
  `;

  export default {
    name: 'Logo',
    components: {
      Wrapper,
    },
  };
</script>