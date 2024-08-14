import { defaultConfig } from '@formkit/vue'
import { rootClasses } from './formkit.theme'
import { genesisIcons } from '@formkit/icons'

export default defaultConfig({
  config: {
    rootClasses,
  },
  icons: {
    ...genesisIcons
  }
})