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

<style scoped>
.pedido-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.pedido-form {
  background: white;
  border-radius: 15px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
  border-radius: 15px 15px 0 0;
}

.form-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.btn-close:hover {
  background-color: #e74c3c;
  color: white;
}

.producto-seleccionado {
  padding: 1.5rem;
  background: #f1c40f;
  color: #2c3e50;
  text-align: center;
}

.producto-seleccionado h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
}

.producto-seleccionado p {
  margin: 0.5rem 0;
  opacity: 0.8;
}

.precio {
  font-size: 1.4rem;
  font-weight: bold;
  color: #c0392b;
}

.form-content {
  padding: 1.5rem;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
  border-bottom: 2px solid #e67e22;
  padding-bottom: 0.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #e67e22;
}

.form-group input.error {
  border-color: #e74c3c;
}

.cantidad-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 150px;
}

.cantidad-controls button {
  background: #e67e22;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background-color 0.3s ease;
}

.cantidad-controls button:hover:not(:disabled) {
  background: #d35400;
}

.cantidad-controls button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.cantidad-controls input {
  text-align: center;
  width: 60px;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.form-group small {
  color: #666;
  font-size: 0.8rem;
}

.form-footer {
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
}

.total-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.total-label {
  font-size: 1.2rem;
  font-weight: 500;
  color: #2c3e50;
}

.total-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #c0392b;
}

.error-messages {
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.error-messages ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #c0392b;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancelar,
.btn-confirmar {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-cancelar {
  background: #95a5a6;
  color: white;
}

.btn-cancelar:hover {
  background: #7f8c8d;
}

.btn-confirmar {
  background: #27ae60;
  color: white;
}

.btn-confirmar:hover:not(:disabled) {
  background: #219a52;
}

.btn-confirmar:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .pedido-form-overlay {
    padding: 0.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .total-section {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}</style>