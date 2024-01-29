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
