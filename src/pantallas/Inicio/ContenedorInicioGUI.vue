<template>
  <div class="contenedor-inicio">
    <slot></slot>
  </div>
</template>

<style scoped>
.contenedor-inicio {
  background: white;
  padding: 4rem 3rem;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  width: 400px;
  min-height: 300px;
  text-align: center;
}
</style>
