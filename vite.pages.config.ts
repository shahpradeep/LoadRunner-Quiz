import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';

export default defineConfig({
  base:'/LoadRunner-Quiz/',
  plugins:[react()],
  css:{postcss:{plugins:[tailwindcss()]}},
  build:{outDir:'pages-dist',emptyOutDir:true},
});
