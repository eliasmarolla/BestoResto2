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
.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  min-width: 200px;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.stat-card.animated {
  animation: pulse 0.5s ease-in-out;
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  color: white;
}

.stat-title {
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .stat-card {
    min-width: 150px;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .stat-icon {
    font-size: 1.5rem;
  }
}
</style>
