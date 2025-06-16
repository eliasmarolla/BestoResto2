<template>
  <div class="pedidos-page">
    <h2>Mis Pedidos</h2>

    <div class="pedidos-controls">
      <div class="stats-summary">
        <div class="stat-item">
          <span class="stat-number">{{ ordenes.length }}</span>
          <span class="stat-label">Total Pedidos</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">${{ totalGastado.toLocaleString() }}</span>
          <span class="stat-label">Total Gastado</span>
        </div>
      </div>

      <div class="filter-controls">
        <input
          v-model="filtroNombre"
          type="text"
          placeholder="Buscar por nombre..."
          class="filter-input"
        />
        <button @click="limpiarFiltros" class="btn-clear">Limpiar</button>
      </div>
    </div>

    <div v-if="ordenesFiltradas.length === 0" class="no-pedidos">
      <p v-if="ordenes.length === 0">No tienes pedidos realizados aún.</p>
      <p v-else>No se encontraron pedidos con ese filtro.</p>
      <router-link to="/menu" class="btn-primary">Hacer mi primer pedido</router-link>
    </div>

    <div v-else class="pedidos-list">
      <div v-for="(orden, index) in ordenesFiltradas" :key="index" class="pedido-card">
        <div class="pedido-header">
          <h3>Pedido #{{ index + 1 }}</h3>
          <button @click="eliminarPedido(index)" class="btn-delete">Eliminar</button>
        </div>

        <div class="pedido-info">
          <div class="info-row"><strong>Cliente:</strong> {{ orden.nombre }}</div>
          <div class="info-row"><strong>Teléfono:</strong> {{ orden.telefono }}</div>
          <div class="info-row"><strong>Dirección:</strong> {{ orden.direccion }}</div>
        </div>

        <div class="pedido-items">
          <h4>Productos:</h4>
          <div v-for="item in orden.pedido" :key="item.opcion" class="item-detail">
            <div class="item-info">
              <span class="item-name">{{ item.opcion }}</span>
              <span class="item-quantity">x{{ item.cantidad }}</span>
            </div>
            <div class="item-price">${{ (item.valor * item.cantidad).toLocaleString() }}</div>
            <div v-if="item.observaciones" class="item-obs">
              <em>Obs: {{ item.observaciones }}</em>
            </div>
          </div>
        </div>

        <div class="pedido-total">
          <strong>Total: ${{ calcularTotalPedido(orden.pedido).toLocaleString() }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pedidos',
  data() {
    return {
      ordenes: [],
      filtroNombre: '',
    }
  },
  computed: {
    ordenesFiltradas() {
      if (!this.filtroNombre.trim()) {
        return this.ordenes
      }
      return this.ordenes.filter((orden) =>
        orden.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase()),
      )
    },
    totalGastado() {
      return this.ordenes.reduce((total, orden) => {
        return total + this.calcularTotalPedido(orden.pedido)
      }, 0)
    },
  },
  mounted() {
    this.cargarPedidos()
  },
  methods: {
    cargarPedidos() {
      try {
        const ordenesGuardadas = localStorage.getItem('ordenes')
        this.ordenes = ordenesGuardadas ? JSON.parse(ordenesGuardadas) : []
      } catch (error) {
        console.error('Error al cargar pedidos:', error)
        this.ordenes = []
      }
    },
    calcularTotalPedido(pedido) {
      return pedido.reduce((total, item) => total + item.valor * item.cantidad, 0)
    },
    eliminarPedido(index) {
      if (confirm('¿Estás seguro de que quieres eliminar este pedido?')) {
        this.ordenes.splice(index, 1)
        this.guardarPedidos()
      }
    },
    guardarPedidos() {
      try {
        localStorage.setItem('ordenes', JSON.stringify(this.ordenes))
      } catch (error) {
        console.error('Error al guardar pedidos:', error)
      }
    },
    limpiarFiltros() {
      this.filtroNombre = ''
    },
  },
}
</script>
