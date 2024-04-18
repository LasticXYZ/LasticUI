import { SubstrateChain } from '@poppyseed/lastic-sdk'

/**
 * Switches the chain name in a given path.
 * @param {string} path - The current path, e.g., '/rococo/teleport'.
 * @param {string} newChain - The new chain name to replace, e.g., 'kusama'.
 * @returns {string} - The updated path with the new chain name.
 */
export const switchChainInPath = (path: string, newChain: string | SubstrateChain): string => {
  // Split the path by '/'
  const segments = path.split('/')

  // Assuming the chain name is always the second segment after the initial '/'
  if (segments.length > 1 && segments[1]) {
    segments[1] = newChain as string // Replace the second segment with the new chain name
  }

  // Join the segments back into a string with '/'
  return segments.join('/')
}

/**
 * Get the chain name from a given url/path.
 * @param {string} path - The current path, e.g., '/rococo/teleport'.
 * @returns {string} - The chain name extracted from the path. e.g., 'rococo'.
 */
export const getChainFromPath = (path: string): string => {
  // Split the path by '/'
  const segments = path.split('/')

  // Assuming the chain name is always the second segment after the initial '/'
  if (segments.length > 1 && segments[1]) {
    return segments[1]
  }

  return ''
}

/**
 * Go to specific route but keep the chain name in the path.
 * @param {string} path - The current path, e.g., '/rococo/teleport'.
 * @param {string} route - The route to go to, e.g., '/bulkore1'.
 * @returns {string} - The updated path with the new route. e.g., '/rococo/bulkore1'.
 */
export const goToChainRoute = (path: string, route: string): string => {
  const chain = getChainFromPath(path)
  return `/${chain}${route}`
}
