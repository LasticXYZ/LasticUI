/**
 * Returns the supported chains from the environment variables.
 * If the environment variable is not set, it returns the default chain.
 */
import { ChainConfig } from './types'

export const getSupportedChains = (): ChainConfig[] => {
  let parsedChains: ChainConfig[] = []
  try {
    const envChains = process.env.NEXT_PUBLIC_SUPPORTED_CHAINS?.replace(/'/g, '"')
    parsedChains = envChains ? (JSON.parse(envChains) as ChainConfig[]) : []
  } catch (error) {
    console.error('Failed to parse NEXT_PUBLIC_SUPPORTED_CHAINS:', error)
  }

  const defaultChain = process.env.NEXT_PUBLIC_DEFAULT_CHAIN
  const relayChain = process.env.NEXT_PUBLIC_RELAY_CHAIN

  return parsedChains || [{ coretime: defaultChain, relay: relayChain }]
}
