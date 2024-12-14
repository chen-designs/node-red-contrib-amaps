import Apis from '@/libs/apis'
import { createNode, evaluateNodeProperty } from '@/libs/utils'

export default function (RED) {
  // 地理编码
  RED.nodes.registerType('amaps-geocode', function (config) {
    const {} = createNode(RED, this, config)
    // 获取配置信息
    const { apis } = RED.nodes.getNode(config.amaps) as { apis: Apis }
    if (!apis) this.error('没有配置正确的地图配置')
    // 监听输入
    this.on('input', async (msg, send, done) => {
      try {
        this.status({ fill: 'blue', shape: 'dot', text: 'Running' })
        // 获取坐标、地址、城市
        const mode = await evaluateNodeProperty(config.mode, config.mode_type, this, msg, RED)
        const location = await evaluateNodeProperty(config.location, config.location_type, this, msg, RED)
        const address = await evaluateNodeProperty(config.address, config.address_type, this, msg, RED)
        const city = await evaluateNodeProperty(config.city, config.city_type, this, msg, RED)
        await apis
          .regeo(mode as any, { address, city, location })
          .then(res => send(Object.assign(msg, { payload: res.regeocode || res.geocodes })))
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
