<template>
  <div v-if="opcionSeleccionada" class="pedido-form-overlay" @click.self="cerrar">
    <div class="pedido-form">
      <div class="form-header">
        <h3>Crear Pedido</h3>
        <button @click="cerrar" class="btn-close">×</button>
      </div>

      <div class="producto-seleccionado">
        <h4>{{ opcionSeleccionada.nombre }}</h4>
        <p>{{ opcionSeleccionada.descripcion }}</p>
        <span class="precio">${{ opcionSeleccionada.precio }}</span>
      </div>

      <form @submit.prevent="procesarPedido" class="form-content">
        <!-- Datos del cliente -->
        <div class="form-section">
          <h4>Datos de Entrega</h4>
          <div class="form-group">
            <label for="nombre">Nombre completo:</label>
            <input
              type="text"
              id="nombre"
              v-model="orden.nombre"
              :class="{ error: errores.nombre }"
              required
            />
          </div>

          <div class="form-group">
            <label for="telefono">Teléfono:</label>
            <input
              type="tel"
              id="telefono"
              v-model="orden.telefono"
              :class="{ error: errores.telefono }"
              required
            />
          </div>

          <div class="form-group">
            <label for="direccion">Dirección:</label>
            <input
              type="text"
              id="direccion"
              v-model="orden.direccion"
              :class="{ error: errores.direccion }"
              required
            />
          </div>
        </div>

        <!-- Detalles del producto -->
        <div class="form-section">
          <h4>Detalles del Pedido</h4>
          <div class="form-group">
            <label for="cantidad">Cantidad:</label>
            <div class="cantidad-controls">
              <button type="button" @click="decrementarCantidad" :disabled="cantidad <= 1">
                -
              </button>
              <input
                type="number"
                id="cantidad"
                v-model.number="cantidad"
                min="1"
                max="10"
                @input="validarCantidad"
              />
              <button type="button" @click="incrementarCantidad" :disabled="cantidad >= 10">
                +
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="observaciones">Observaciones especiales:</label>
            <textarea
              id="observaciones"
              v-model="observaciones"
              placeholder="Ej: Sin cebolla, extra salsa..."
              maxlength="200"
            ></textarea>
            <small>{{ observaciones.length }}/200 caracteres</small>
          </div>
        </div>

        <!-- Total y acciones -->
        <div class="form-footer">
          <div class="total-section">
            <span class="total-label">Total:</span>
            <span class="total-value">${{ totalCalculado.toLocaleString() }}</span>
          </div>

          <div v-if="errores.general.length > 0" class="error-messages">
            <ul>
              <li v-for="error in errores.general" :key="error">{{ error }}</li>
            </ul>
          </div>

          <div class="form-actions">
            <button type="button" @click="cerrar" class="btn-cancelar">Cancelar</button>
            <button type="submit" class="btn-confirmar" :disabled="!formularioValido">
              Confirmar Pedido
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PedidoForm',
  props: {
    opcionSeleccionada: {
      type: Object,
      default: null,
    },
    categoriaSeleccionada: {
      type: String,
      default: '',
    },
  },
  emits: ['pedido-creado', 'cerrar-formulario'],
  data() {
    return {
      orden: {
        nombre: '',
        telefono: '',
        direccion: '',
      },
      cantidad: 1,
      observaciones: '',
      errores: {
        nombre: false,
        telefono: false,
        direccion: false,
        general: [],
      },
    }
  },
  computed: {
    totalCalculado() {
      return this.opcionSeleccionada ? this.opcionSeleccionada.precio * this.cantidad : 0
    },
    formularioValido() {
      return (
        this.orden.nombre.trim() !== '' &&
        this.orden.telefono.trim() !== '' &&
        this.orden.direccion.trim() !== '' &&
        this.cantidad > 0
      )
    },
  },
  methods: {
    cerrar() {
      this.limpiarFormulario()
      this.$emit('cerrar-formulario')
    },
    incrementarCantidad() {
      if (this.cantidad < 10) {
        this.cantidad++
      }
    },
    decrementarCantidad() {
      if (this.cantidad > 1) {
        this.cantidad--
      }
    },
    validarCantidad() {
      if (this.cantidad < 1) this.cantidad = 1
      if (this.cantidad > 10) this.cantidad = 10
    },
    validarFormulario() {
      this.errores.general = []
      this.errores.nombre = false
      this.errores.telefono = false
      this.errores.direccion = false

      if (!this.orden.nombre.trim()) {
        this.errores.nombre = true
        this.errores.general.push('El nombre es obligatorio')
      }

      if (!this.orden.telefono.trim()) {
        this.errores.telefono = true
        this.errores.general.push('El teléfono es obligatorio')
      } else if (!/^\d{8,15}$/.test(this.orden.telefono.replace(/\D/g, ''))) {
        this.errores.telefono = true
        this.errores.general.push('El teléfono debe tener entre 8 y 15 dígitos')
      }

      if (!this.orden.direccion.trim()) {
        this.errores.direccion = true
        this.errores.general.push('La dirección es obligatoria')
      }

      return this.errores.general.length === 0
    },
    procesarPedido() {
      if (!this.validarFormulario()) {
        return
      }

      try {
        // Crear el objeto de pedido
        const nuevoPedido = {
          nombre: this.orden.nombre.trim(),
          telefono: this.orden.telefono.trim(),
          direccion: this.orden.direccion.trim(),
          pedido: [
            {
              opcion: this.opcionSeleccionada.nombre,
              cantidad: this.cantidad,
              observaciones: this.observaciones.trim(),
              valor: this.opcionSeleccionada.precio,
            },
          ],
        }

        // Obtener pedidos existentes
        const ordenesExistentes = JSON.parse(localStorage.getItem('ordenes') || '[]')

        // Agregar el nuevo pedido
        ordenesExistentes.push(nuevoPedido)

        // Guardar en localStorage
        localStorage.setItem('ordenes', JSON.stringify(ordenesExistentes))

        // Emitir evento de éxito
        this.$emit('pedido-creado')

        // Limpiar formulario
        this.limpiarFormulario()
      } catch (error) {
        console.error('Error al guardar el pedido:', error)
        this.errores.general.push('Error al guardar el pedido. Intenta nuevamente.')
      }
    },
    limpiarFormulario() {
      this.orden = {
        nombre: '',
        telefono: '',
        direccion: '',
      }
      this.cantidad = 1
      this.observaciones = ''
      this.errores = {
        nombre: false,
        telefono: false,
        direccion: false,
        general: [],
      }
    },
  },
}
</script>
