export type RegionDetailItem = {
  begin: string
  core: string
  mask: string
}

export type RegionDetail = RegionDetailItem[]

export type RegionOwner = {
  end: string
  owner: string
  paid: string
}

export type Region = {
  detail: RegionDetail
  owner: RegionOwner
}

export type RegionsType = Region[]

export interface RegionIdProps {
  begin: string
  core: string
  mask: string
}

export interface RegionId {
  begin: number
  core: number
  mask: Uint8Array
}
