//https://github.com/subscan-explorer/projects-info

interface ParaIdType {
  [key: number]: string
}

const paraID: ParaIdType = {
  1000: 'statemint',
  2000: 'acala',
  2002: 'clover-clv',
  2004: 'moonbeam',
  2006: 'astar',
  2008: 'crust-parachain',
  2011: 'equilibrium',
  2012: 'parallel',
  2019: 'composable',
  2021: 'efinity',
  2026: 'nodle',
  2030: 'bifrost-p',
  2031: 'centrifuge-parachain',
  2032: 'interlay',
  2034: 'hydradx',
  2035: 'phala',
  2037: 'unique',
  2040: 'polkadex-parachain',
  2043: 'origintrail',
  2046: 'darwinia2',
  2086: 'spiritnet',
  2090: 'OAK Network',
  2092: 'zeitgeist',
  2104: 'manta',
}

export function getParachainName(paraId: number) {
  if (paraId in paraID) {
    return paraID[paraId]
  }

  return paraId.toString()
}
