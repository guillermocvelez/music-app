import { ref, watch, onMounted } from "vue";

const theme = ref("dark");

export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === "dark" ? "light" : "dark";
  };

  const applyTheme = () => {
    if (theme.value === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
    localStorage.setItem("user-theme", theme.value);
  };

  onMounted(() => {
    const savedTheme = localStorage.getItem("user-theme");
    if (savedTheme) {
      theme.value = savedTheme;
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      theme.value = "light";
    }
    applyTheme();
  });

  watch(theme, applyTheme);

  return {
    theme,
    toggleTheme,
  };
}
