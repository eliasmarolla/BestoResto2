<script>
    import StatCard from '@/components/StatCard.vue'
    import { menuData } from '@/data/menuData.js'

    export default {
      name: 'Home',
      components: {
        StatCard,
      },
      data() {
        return {
          pedidosRealizados: 0,
        }
      },
      computed: {
        totalPlatos() {
          return menuData.reduce((total, categoria) => total + categoria.opciones.length, 0)
        },
      },
      mounted() {
        this.cargarPedidosRealizados()
      },
      methods: {
        cargarPedidosRealizados() {
          try {
            const ordenes = JSON.parse(localStorage.getItem('ordenes') || '[]')
            this.pedidosRealizados = ordenes.length
          } catch (error) {
            console.error('Error al cargar pedidos:', error)
            this.pedidosRealizados = 0
          }
        },
      },
    }
</script>
<template>
  <div class="home">
    <section class="welcome">
      <h2>¡Bienvenido a BestoResto!</h2>
      <p>El mejor restaurante con pedidos al instante</p>
      <div class="stats">
        <StatCard title="Platos Disponibles" :value="totalPlatos" icon="🍽️" />
        <StatCard title="Pedidos Realizados" :value="pedidosRealizados" icon="📋" />
      </div>
    </section>

    <section class="features">
      <div class="feature-card">
        <h3>🍕 Menú Variado</h3>
        <p>Desde minutas hasta pizzas, pastas y postres deliciosos</p>
        <router-link to="/menu" class="cta-button animate__animated animate__tada">Ver Menú</router-link>
      </div>

      <div class="feature-card">
        <h3>⚡ Pedidos Rápidos</h3>
        <p>Sistema de pedidos intuitivo y fácil de usar</p>
        <router-link to="/menu" class="cta-button animate__animated animate__tada">Hacer Pedido</router-link>
      </div>

      <div class="feature-card">
        <h3>📱 Gestión Simple</h3>
        <p>Revisa y gestiona todos tus pedidos en un solo lugar</p>
        <router-link to="/pedidos" class="cta-button animate__animated animate__tada">Mis Pedidos</router-link>
      </div>
    </section>
  </div>
</template>


<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.welcome {
  text-align: center;
  margin-bottom: 3rem;
}

.welcome h2 {
  font-size: 3rem;
  color: #d35400;
  margin-bottom: 1rem;
}

.welcome p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.stats {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-top: 2rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.feature-card p {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.cta-button {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #e67e22;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: #d35400;
}

@media (max-width: 768px) {
  .stats {
    flex-direction: column;
    align-items: center;
  }

  .hero h2 {
    font-size: 2rem;
  }
}
</style>
