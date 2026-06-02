function normalizePath(pathname) {
  return pathname.replace(/\/+$/, '') || '/'
}

function normalizeBasePath(baseUrl) {
  const normalized = normalizePath(baseUrl)
  return normalized === '/' ? '' : normalized
}

export const basePath = normalizeBasePath(import.meta.env.BASE_URL)

export function getAppPath(pathname) {
  const normalizedPath = normalizePath(pathname)

  if (basePath && normalizedPath.startsWith(basePath)) {
    return normalizePath(normalizedPath.slice(basePath.length))
  }

  return normalizedPath
}

export function getPublicPath(appPath, hash) {
  const routedPath = !basePath ? appPath : appPath === '/' ? `${basePath}/` : `${basePath}${appPath}`
  return hash ? `${routedPath}#${hash}` : routedPath
}

export function getRouteState() {
  return {
    path: getAppPath(window.location.pathname),
    hash: window.location.hash.replace('#', ''),
  }
}

export function isModifiedClick(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0
}
