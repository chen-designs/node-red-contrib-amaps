import Apis from '@/libs/apis'
import { evaluateNodeProperty } from '@/libs/utils'
import { createNode } from '@/libs/utils'

export default function (RED) {
  RED.nodes.registerType('amaps-weather', function (config) {
    const {} = createNode(RED, this, config)
    // 获取配置信息
    const { apis } = RED.nodes.getNode(config.amaps) as { apis: Apis }
    if (!apis) this.error('没有配置正确的地图配置')
    // 监听输入
    this.on('input', async (msg, send, done) => {
      try {
        this.status({ fill: 'blue', shape: 'dot', text: 'Running' })
        const city = await evaluateNodeProperty(config.city, config.city_type, this, msg, RED)
        const extensions = await evaluateNodeProperty(config.extensions, config.extensions_type, this, msg, RED)
        // 请求接口
        await apis
          .weather({ city, extensions })
          .then(res => send(Object.assign(msg, { payload: res.lives || res.forecasts })))
          .then(() => this.status({ fill: 'green', shape: 'dot', text: 'Success' }))
          .finally(done)
      } catch (error: any) {
        if (done) done(error)
        this.status({ fill: 'red', shape: 'dot', text: error.message })
      }
    })
    this.on('close', () => this.status({}))
  })
}
