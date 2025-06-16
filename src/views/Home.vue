<template>
  <div class="home">
    <section class="hero">
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
        <router-link to="/menu" class="cta-button">Ver Menú</router-link>
      </div>

      <div class="feature-card">
        <h3>⚡ Pedidos Rápidos</h3>
        <p>Sistema de pedidos intuitivo y fácil de usar</p>
        <router-link to="/menu" class="cta-button">Hacer Pedido</router-link>
      </div>

      <div class="feature-card">
        <h3>📱 Gestión Simple</h3>
        <p>Revisa y gestiona todos tus pedidos en un solo lugar</p>
        <router-link to="/pedidos" class="cta-button">Mis Pedidos</router-link>
      </div>
    </section>
  </div>
</template>

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
