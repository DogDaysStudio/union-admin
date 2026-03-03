import data from '@/router/modules/data'
import asset from '@/router/modules/asset'
import lease from '@/router/modules/lease'
import property from '@/router/modules/property'
import iot from '@/router/modules/iot'
import management from '@/router/modules/management'

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
