import { copyFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const distDir = 'dist'
const routes = ['policies', 'delete-account']

for (const route of routes) {
  const routeDir = join(distDir, route)
  mkdirSync(routeDir, { recursive: true })
  copyFileSync(join(distDir, 'index.html'), join(routeDir, 'index.html'))
}

copyFileSync(join(distDir, 'index.html'), join(distDir, '404.html'))
