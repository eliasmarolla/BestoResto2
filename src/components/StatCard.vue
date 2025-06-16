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
