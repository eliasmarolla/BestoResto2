<template>
  <div id="app">
    <header>
      <nav class="navbar">
        <div class="nav-brand">
          <h1>BestoResto</h1>
          <p>Tus pedidos al instante</p>
        </div>
        <ul class="nav-links">
          <li><router-link to="/">Inicio</router-link></li>
          <li><router-link to="/menu">Menú</router-link></li>
          <li><router-link to="/pedidos">Mis Pedidos</router-link></li>
        </ul>
      </nav>
    </header>

    <main>
      <router-view />
    </main>

    <footer>
      <p>Proyecto realizado por Diego Asensio y Elias Marolla</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.nav-brand h1 {
  margin: 0;
  font-size: 2rem;
  color: #d35400;
}

.nav-brand p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav-links a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  background-color: #e67e22;
  color: white;
}

footer {
  text-align: center;
  margin-top: 3rem;
  padding: 2rem;
  color: #888;
  border-top: 1px solid #eee;
}
</style>
