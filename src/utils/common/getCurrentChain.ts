import { env } from '@/config/environment'
import Cookies from 'js-cookie'

export const getCurrentChain = () => {
  const cookiesChain = Cookies.get('activeChain')
  const cookiesRelayChain = Cookies.get('activeRelayChain')

  const defaultChain = cookiesChain ? cookiesChain : env.defaultChain
  const relayChain = cookiesRelayChain ? cookiesRelayChain : env.relayChain

  return { defaultChain, relayChain }
}
