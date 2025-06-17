<template>
  <div class="stat-card" :class="{ animated: isAnimated }" @click="animate">
    <div class="stat-icon">{{ icon }}</div>
    <div class="stat-content">
      <h3 class="stat-value">{{ animatedValue }}</h3>
      <p class="stat-title">{{ title }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatCard',
  props: {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: [Number, String],
      required: true,
    },
    icon: {
      type: String,
      default: '📊',
    },
  },
  data() {
    return {
      isAnimated: false,
      animatedValue: 0,
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        this.animateValue(newVal)
      },
    },
  },
  methods: {
    animate() {
      this.isAnimated = true
      setTimeout(() => {
        this.isAnimated = false
      }, 500)
    },
    animateValue(targetValue) {
      const numericValue = typeof targetValue === 'number' ? targetValue : 0
      if (numericValue === 0) {
        this.animatedValue = targetValue
        return
      }

      const duration = 1000
      const steps = 50
      const stepValue = numericValue / steps
      const stepTime = duration / steps

      let currentStep = 0
      const timer = setInterval(() => {
        currentStep++
        this.animatedValue = Math.floor(stepValue * currentStep)

        if (currentStep >= steps) {
          this.animatedValue = targetValue
          clearInterval(timer)
        }
      }, stepTime)
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