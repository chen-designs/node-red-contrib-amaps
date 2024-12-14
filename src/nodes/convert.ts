import Apis from '@/libs/apis'
import { createNode, evaluateNodeProperty } from '@/libs/utils'

export default function (RED) {
  // 坐标转换
  RED.nodes.registerType('amaps-convert', function (config) {
    const {} = createNode(RED, this, config)
    // 获取配置信息
    const { apis } = RED.nodes.getNode(config.amaps) as { apis: Apis }
    if (!apis) this.error('没有配置正确的地图配置')
    // 监听输入
    this.on('input', async (msg, send, done) => {
      try {
        this.status({ fill: 'blue', shape: 'dot', text: 'Running' })
        // 获取原始坐标、原坐标系
        const locations = await evaluateNodeProperty(config.locations, config.locations_type, this, msg, RED)
        const coordsys = await evaluateNodeProperty(config.coordsys, config.coordsys_type, this, msg, RED)
        await apis
          .convert({ locations, coordsys })
          .then(res => send(Object.assign(msg, { payload: res.locations })))
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
