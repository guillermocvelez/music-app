<script setup>
import { RouterLink } from 'vue-router';
import { useTheme } from '../../composables/useTheme';

const { theme, toggleTheme } = useTheme();
</script>

<template>
  <div class="main-layout">
    <header class="top-bar">
      <div class="logo">
        <svg width="150" height="42" viewBox="0 0 500 140" xmlns="http://www.w3.org/2000/svg">
          <path d="M85 20 C130 20 150 75 85 130 C20 75 40 20 85 20 Z" fill="#ff6b00"/>
          <text x="175" y="70" class="text-main" font-size="40" fill="currentColor">theMusic</text>
          <text x="175" y="110" class="text-main" font-size="40" fill="#ff6b00">Tools</text>
        </svg>
      </div>

      <nav class="main-nav">
        <RouterLink to="/metronome" class="nav-item" active-class="active">Metronome</RouterLink>
        <RouterLink to="/courses" class="nav-item" active-class="active">Cursos</RouterLink>
        <RouterLink to="/sheet-music" class="nav-item" active-class="active">Sheet Music</RouterLink>
      </nav>

      <div class="user-profile">
        <button class="theme-toggle" title="Toggle Theme" @click="toggleTheme">
          {{ theme === 'dark' ? '☀️' : '🌙' }}
        </button>
        <button class="google-login-btn" type="button" title="Próximamente">
          <span class="google-mark">G</span>
          Iniciar sesión con Google
        </button>
        <div class="avatar-card">
          <div class="avatar" aria-hidden="true">GT</div>
          <div class="account-meta">
            <span class="account-name">Invitado</span>
            <span class="account-status">Sin sesión</span>
          </div>
        </div>
      </div>
    </header>

    <div class="page-content">
      <slot />
    </div>
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
  position: relative;
  height: 64px;
  flex-shrink: 0;
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

.main-nav {
  display: flex;
  gap: var(--spacing-xl);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.nav-item {
  text-decoration: none;
  color: var(--color-text-secondary);
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.nav-item:hover,
.nav-item.active {
  color: var(--color-text-primary);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.google-login-btn {
  height: 38px;
  border-radius: 999px;
  border: 1px solid var(--color-panel-border);
  background: var(--color-panel);
  color: var(--color-text-primary);
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0 0.8rem;
  cursor: pointer;
  font-size: 0.8rem;
  transition: border-color 0.2s, transform 0.15s;
}

.google-login-btn:hover {
  border-color: var(--color-accent);
  transform: translateY(-1px);
}

.google-mark {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, #4285f4, #ea4335, #fbbc05, #34a853);
  color: #fff;
}

.avatar-card {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-accent), #ff9248);
  color: #111;
  font-size: 0.7rem;
  font-weight: 700;
  border: 1px solid rgba(255, 107, 0, 0.35);
}

.account-meta {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
}

.account-name {
  font-size: 0.78rem;
  color: var(--color-text-primary);
}

.account-status {
  font-size: 0.68rem;
  color: var(--color-text-muted);
}

.page-content {
  flex: 1;
  overflow: hidden;
  display: flex;
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
  font-family: var(--font-family-base);
  font-weight: 700;
  letter-spacing: -0.5px;
}
</style>
