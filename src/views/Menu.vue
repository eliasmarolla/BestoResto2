<script>
import PedidoForm from '@/components/PedidoForm.vue'
import { menuData } from '@/data/menuData.js'

export default {
  name: 'Menu',
  components: {
    PedidoForm,
  },
  data() {
    return {
      menu: menuData,
      opcionSeleccionada: null,
      categoriaSeleccionada: null,
    }
  },
  methods: {
    seleccionarOpcion(categoria, opcion) {
      this.categoriaSeleccionada = categoria
      this.opcionSeleccionada = opcion
    },
    cerrarFormulario() {
      this.opcionSeleccionada = null
      this.categoriaSeleccionada = null
    },
    onPedidoCreado() {
      this.cerrarFormulario()
      // Notificar éxito
      alert('¡Pedido creado exitosamente!')
    },
  },
}
</script>

<template>
  <div class="menu-page">
    <h2>Nuestro Menú</h2>

    <!-- Menú -->
    <div class="menu-grid">
      <div v-for="categoria in menu" :key="categoria.plato" class="categoria-card">
        <h3>{{ categoria.plato }}</h3>
        <img :src="categoria.img" :alt="categoria.plato" class="categoria-img" />
        <div class="opciones-list">
          <div v-for="opcion in categoria.opciones" :key="opcion.nombre" class="opcion-item">
            <h4>{{ opcion.nombre }}</h4>
            <p class="descripcion">{{ opcion.descripcion }}</p>
            <div class="precio-actions">
              <span class="precio">${{ opcion.precio }}</span>
              <button @click="seleccionarOpcion(categoria.plato, opcion)" class="btn-agregar">
                Agregar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulario de Pedido -->
    <PedidoForm :opcionSeleccionada="opcionSeleccionada" :categoriaSeleccionada="categoriaSeleccionada"
      @pedido-creado="onPedidoCreado" @cerrar-formulario="cerrarFormulario" />
  </div>
</template>


<style scoped>
.menu-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.menu-page h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #c0392b;
  margin-bottom: 2rem;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.categoria-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.categoria-card:hover {
  transform: translateY(-3px);
}

.categoria-card h3 {
  text-align: center;
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  text-transform: capitalize;
}

.categoria-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.opciones-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.opcion-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
  background: #fafafa;
}

.opcion-item h4 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.descripcion {
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

.precio-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.precio {
  font-size: 1.2rem;
  font-weight: bold;
  color: #c0392b;
}

.btn-agregar {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.btn-agregar:hover {
  background-color: #219a52;
}

@media (max-width: 768px) {
  .menu-grid {
    grid-template-columns: 1fr;
  }

  .menu-page h2 {
    font-size: 2rem;
  }
}
</style>
