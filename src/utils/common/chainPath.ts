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
