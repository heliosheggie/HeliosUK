@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Outfit", sans-serif;

  --color-brand-black: #0d0d0d;
  --color-brand-yellow: #facc15;
  --color-brand-yellow-dark: #eab308;
  --color-brand-grey-light: #e5e7eb;
  --color-brand-grey: #9ca3af;
  --color-brand-blue: #3b82f6;
  --color-brand-blue-dark: #2563eb;
}

@layer base {
  body {
    @apply antialiased text-brand-black dark:text-white bg-white dark:bg-brand-black transition-colors duration-300;
  }
}

.glass {
  @apply bg-white/80 dark:bg-brand-black/80 backdrop-blur-md border border-brand-grey-light dark:border-white/10;
}

.card-hover {
  @apply transition-all duration-300 hover:shadow-xl hover:-translate-y-1;
}
