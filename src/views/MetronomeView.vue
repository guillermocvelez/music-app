<script setup>
import BpmDial from '../components/metronome/BpmDial.vue';
import BottomControls from '../components/metronome/BottomControls.vue';
import RightPanel from '../components/panels/RightPanel.vue';
import StylePresets from '../components/sidebar/StylePresets.vue';
</script>

<template>
  <div class="metronome-view">
    <div class="metronome-content">
      <aside class="metronome-sidebar">
        <StylePresets />
      </aside>

      <main class="metronome-center">
        <BpmDial />
      </main>

      <aside class="metronome-right">
        <RightPanel />
      </aside>
    </div>

    <footer class="metronome-footer">
      <BottomControls />
    </footer>
  </div>
</template>

<style scoped>
.metronome-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.metronome-content {
  flex: 1;
  display: grid;
  grid-template-columns: 260px 1fr 300px;
  overflow: hidden;
}

.metronome-sidebar {
  border-right: 1px solid var(--color-panel-border);
  padding: var(--spacing-lg);
  overflow-y: auto;
}

.metronome-center {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: radial-gradient(circle at center, rgba(255, 107, 0, 0.05) 0%, transparent 70%);
}

.metronome-right {
  border-left: 1px solid var(--color-panel-border);
  padding: var(--spacing-lg);
  overflow-y: auto;
  background-color: var(--color-bg);
}

.metronome-footer {
  height: 80px;
  flex-shrink: 0;
  border-top: 1px solid var(--color-panel-border);
  background-color: var(--color-bg);
  padding: 0 var(--spacing-xl);
  display: flex;
  align-items: center;
}
</style>
