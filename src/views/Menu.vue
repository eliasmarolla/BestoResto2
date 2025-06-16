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
    <PedidoForm
      :opcionSeleccionada="opcionSeleccionada"
      :categoriaSeleccionada="categoriaSeleccionada"
      @pedido-creado="onPedidoCreado"
      @cerrar-formulario="cerrarFormulario"
    />
  </div>
</template>

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
