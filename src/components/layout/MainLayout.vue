<script setup>
import { ref } from 'vue';
import { useTheme } from '../../composables/useTheme';

const { theme, toggleTheme } = useTheme();

defineProps({
  currentView: {
    type: String,
    default: 'metronome'
  }
});

defineEmits(['update:currentView']);
</script>

<template>
  <div class="main-layout">
    <header class="top-bar">
      <div class="logo">
        <svg width="150" height="42" viewBox="0 0 500 140" xmlns="http://www.w3.org/2000/svg">


          <!-- Guitar Pick -->
          <path d="M85 20 
                   C130 20 150 75 85 130 
                   C20 75 40 20 85 20 Z" 
                fill="#ff6b00"/>

          <!-- Text -->
          <text x="175" y="70" 
                class="text-main" 
                font-size="40" 
                fill="currentColor">
            theMusic
          </text>

          <text x="175" y="110" 
                class="text-main" 
                font-size="40" 
                fill="#ff6b00">
            Tools
          </text>
        </svg>
      </div>
      <nav class="main-nav">
        <a 
          href="#" 
          class="nav-item" 
          :class="{ active: currentView === 'metronome' }"
          @click.prevent="$emit('update:currentView', 'metronome')"
        >
          Metronome
        </a>
        <a 
          href="#" 
          class="nav-item" 
          :class="{ active: currentView === 'eartraining' }"
          @click.prevent="$emit('update:currentView', 'eartraining')"
        >
          Ear Training
        </a>
        <a href="#" class="nav-item">Library</a>
        <a href="#" class="nav-item">Settings</a>
      </nav>
      <div class="user-profile">
        <button class="theme-toggle" @click="toggleTheme" title="Toggle Theme">
          {{ theme === 'dark' ? '☀️' : '🌙' }}
        </button>
        <div class="notification-icon">🔔</div>
        <div class="user-info">
          <span class="role">Pro Account</span>
          <span class="plan">PREMIUM PLAN</span>
        </div>
        <div class="avatar">👤</div>
      </div>
    </header>

    <div class="content-area">
      <aside class="left-sidebar">
        <!-- Sidebar Content Placeholder -->
        <slot name="sidebar"></slot>
      </aside>

      <main class="center-stage">
        <!-- Main Metronome Dial Placeholder -->
        <slot name="center"></slot>
      </main>

      <aside class="right-panel">
        <!-- Controls Placeholder -->
        <slot name="right-panel"></slot>
      </aside>
    </div>

    <footer class="bottom-bar">
      <!-- Playback Controls Placeholder -->
      <slot name="bottom-bar"></slot>
    </footer>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--color-bg);
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 var(--spacing-xl);
  border-bottom: 1px solid var(--color-panel-border);
  background-color: var(--color-bg);
}

.logo {
  font-weight: 700;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-primary);
}
.logo .icon {
  color: var(--color-accent);
  font-size: 1.5rem;
}

.main-nav {
  display: flex;
  gap: var(--spacing-xl);
}

.nav-item {
  text-decoration: none;
  color: var(--color-text-secondary);
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.nav-item:hover, .nav-item.active {
  color: var(--color-text-primary);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.content-area {
  display: grid;
  grid-template-columns: 260px 1fr 300px; /* Sidebar | Main | Right Panel */
  flex: 1;
  overflow: hidden;
}

.left-sidebar {
  border-right: 1px solid var(--color-panel-border);
  padding: var(--spacing-lg);
  overflow-y: auto;
}

.center-stage {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: radial-gradient(circle at center, rgba(255, 107, 0, 0.05) 0%, rgba(17, 17, 17, 0) 70%);
}

.right-panel {
  border-left: 1px solid var(--color-panel-border);
  padding: var(--spacing-lg);
  overflow-y: auto;
  background-color: var(--color-bg);
}

.bottom-bar {
  height: 80px;
  border-top: 1px solid var(--color-panel-border);
  background-color: var(--color-bg);
  padding: 0 var(--spacing-xl);
  display: flex;
  align-items: center;
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: var(--spacing-xs);
  border-radius: 50%;
  transition: background-color 0.2s;
  margin-right: var(--spacing-sm);
}

.theme-toggle:hover {
  background-color: var(--color-panel-border);
}

.text-main { 
  font-family: 'Poppins', 'Segoe UI', sans-serif; 
  font-weight: 700; 
  letter-spacing: -0.5px;
}
</style>
