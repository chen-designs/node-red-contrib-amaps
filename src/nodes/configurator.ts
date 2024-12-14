import Apis from '@/libs/apis'
import { createNode, STR_EMPTY } from '@/libs/utils'

export default function (RED) {
  const AmapsConfigurator = function (config) {
    const { credentials } = createNode(RED, this, config)
    this.apis = new Apis({
      key: RED.util.evaluateNodeProperty(credentials.key || STR_EMPTY, credentials.key_type, this),
      sig: RED.util.evaluateNodeProperty(credentials.sig || STR_EMPTY, credentials.sig_type, this)
    })
  }
  RED.nodes.registerType('amaps-configurator', AmapsConfigurator, {
    credentials: {
      key: { type: 'text', required: true },
      key_type: { value: 'str', type: 'text' },
      sig: { type: 'text' },
      sig_type: { value: 'str', type: 'text' }
    }
  })
}
