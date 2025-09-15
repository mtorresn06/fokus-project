<template>
  <div class="logo">
    <img src="/logo.png" alt="Logo" />
    <h2>Regístrate</h2>
  </div>
</template>

<script>
export default {
  name: "RegistroLogo",
};
</script>

<style scoped>
.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.logo img {
  width: 80px;
  height: auto;
  margin-bottom: 0.5rem;
}

.logo h2 {
  font-size: 1.8rem;
  color: #333;
}
</style>
