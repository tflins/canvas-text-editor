import { defineConfig } from 'vite'
import { resolve, join } from 'path'

export default defineConfig({
  root: resolve(__dirname, './packages/web-site')
})
