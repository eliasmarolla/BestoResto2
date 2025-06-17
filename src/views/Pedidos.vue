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

<style scoped>
.pedidos-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
}

.pedidos-page h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.pedidos-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.stats-summary {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #e67e22;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.filter-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.btn-clear {
  background-color: #95a5a6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-clear:hover {
  background-color: #7f8c8d;
}

.no-pedidos {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}

.no-pedidos p {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.btn-primary {
  display: inline-block;
  background-color: #e67e22;
  color: white;
  padding: 1rem 2rem;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #d35400;
}

.pedidos-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.pedido-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #eee;
}

.pedido-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.pedido-header h3 {
  margin: 0;
  color: #2c3e50;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.btn-delete:hover {
  background-color: #c0392b;
}

.pedido-info {
  margin-bottom: 1rem;
}

.info-row {
  margin-bottom: 0.5rem;
  color: #555;
}

.pedido-items h4 {
  margin: 1rem 0 0.5rem 0;
  color: #2c3e50;
}

.item-detail {
  background: #f8f9fa;
  padding: 0.8rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.item-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.3rem;
}

.item-name {
  font-weight: 500;
  color: #2c3e50;
}

.item-quantity {
  background: #e67e22;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-size: 0.8rem;
}

.item-price {
  font-weight: bold;
  color: #c0392b;
  text-align: right;
}

.item-obs {
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.pedido-total {
  text-align: right;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #eee;
  font-size: 1.2rem;
  color: #c0392b;
}

@media (max-width: 768px) {
  .pedidos-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .stats-summary {
    justify-content: center;
  }
  
  .filter-controls {
    justify-content: center;
  }
  
  .pedido-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .item-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>