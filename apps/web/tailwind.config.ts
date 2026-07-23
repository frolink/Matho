import type { Config } from 'tailwindcss';
import preset from '@matho/config/tailwind-preset.js';

const config: Config = {
  presets: [preset],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
};

export default config;
