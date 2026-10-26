import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

// Logo đã có nền đỏ + bo góc nên icon maskable/apple không cần thêm padding
export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, padding: 0, resizeOptions: { background: '#d3262d' } },
    apple: { ...minimal2023Preset.apple, padding: 0, resizeOptions: { background: '#d3262d' } },
  },
  images: ['public/logo.svg'],
})
