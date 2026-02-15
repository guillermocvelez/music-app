<script setup>
import { ref } from 'vue'
import MainLayout from './components/layout/MainLayout.vue'
import BpmDial from './components/metronome/BpmDial.vue'
import BottomControls from './components/metronome/BottomControls.vue'
import RightPanel from './components/panels/RightPanel.vue'
import StylePresets from './components/sidebar/StylePresets.vue'
import EarTrainingView from './components/eartraining/EarTrainingView.vue'

const currentView = ref('metronome')
</script>

<template>
  <MainLayout :currentView="currentView" @update:currentView="currentView = $event">
    <template #sidebar>
      <StylePresets v-if="currentView === 'metronome'" />
    </template>

    <template #center>
      <BpmDial v-if="currentView === 'metronome'" />
      <EarTrainingView v-else-if="currentView === 'eartraining'" />
    </template>

    <template #right-panel>
      <RightPanel v-if="currentView === 'metronome'" />
    </template>

    <template #bottom-bar>
      <BottomControls v-if="currentView === 'metronome'" />
    </template>
  </MainLayout>
</template>

<style scoped>
.placeholder-text {
  color: var(--color-text-muted);
  border: 1px dashed var(--color-panel-border);
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  width: 100%;
}
</style>
