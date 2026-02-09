import data from '@/router/modules/data.ts'
import asset from '@/router/modules/asset.ts'
import lease from '@/router/modules/lease.ts'
import property from '@/router/modules/property.ts'
import iot from '@/router/modules/iot.ts'
import management from '@/router/modules/management.ts'

const modules = [
  //
  ...data,
  ...asset,
  ...lease,
  ...property,
  ...iot,
  ...management,
]

export default modules
