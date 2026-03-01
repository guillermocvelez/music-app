<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    default: "top",
    validator: (value) => ["top", "bottom", "left", "right"].includes(value),
  },
});
</script>

<template>
  <span class="tooltip-wrapper">
    <slot />
    <span class="tooltip-bubble" :class="`is-${props.position}`" role="tooltip">
      {{ props.text }}
    </span>
  </span>
</template>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-flex;
}

.tooltip-bubble {
  position: absolute;
  z-index: 50;
  opacity: 0;
  pointer-events: none;
  transform: translateY(6px);
  transition: opacity 0.18s ease, transform 0.18s ease;
  background: var(--color-text-primary);
  color: var(--color-panel);
  border: 1px solid var(--color-panel-border);
  border-radius: 6px;
  padding: 0.45rem 0.6rem;
  font-size: 0.75rem;
  line-height: 1.2;
  min-width: 180px;
  max-width: 260px;
  text-align: left;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2);
}

.tooltip-wrapper:hover .tooltip-bubble,
.tooltip-wrapper:focus-within .tooltip-bubble {
  opacity: 1;
  transform: translateY(0);
}

.tooltip-bubble.is-top {
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translate(-50%, 6px);
}

.tooltip-wrapper:hover .tooltip-bubble.is-top,
.tooltip-wrapper:focus-within .tooltip-bubble.is-top {
  transform: translate(-50%, 0);
}

.tooltip-bubble.is-bottom {
  top: calc(100% + 10px);
  left: 50%;
  transform: translate(-50%, -6px);
}

.tooltip-wrapper:hover .tooltip-bubble.is-bottom,
.tooltip-wrapper:focus-within .tooltip-bubble.is-bottom {
  transform: translate(-50%, 0);
}

.tooltip-bubble.is-left {
  right: calc(100% + 10px);
  top: 50%;
  transform: translate(6px, -50%);
}

.tooltip-wrapper:hover .tooltip-bubble.is-left,
.tooltip-wrapper:focus-within .tooltip-bubble.is-left {
  transform: translate(0, -50%);
}

.tooltip-bubble.is-right {
  left: calc(100% + 10px);
  top: 50%;
  transform: translate(-6px, -50%);
}

.tooltip-wrapper:hover .tooltip-bubble.is-right,
.tooltip-wrapper:focus-within .tooltip-bubble.is-right {
  transform: translate(0, -50%);
}

@media (prefers-reduced-motion: reduce) {
  .tooltip-bubble {
    transition: none;
  }
}
</style>
