import Apis from '@/libs/apis'
import { createNode, evaluateNodeProperty } from '@/libs/utils'

export default function (RED) {
  // 距离测量
  RED.nodes.registerType('amaps-distance', function (config) {
    const { calctype } = createNode(RED, this, config)
    // 获取配置信息
    const { apis } = RED.nodes.getNode(config.amaps) as { apis: Apis }
    if (!apis) this.error('没有配置正确的地图配置')
    // 监听输入
    this.on('input', async (msg, send, done) => {
      try {
        this.status({ fill: 'blue', shape: 'dot', text: 'Running' })
        // 获取起点坐标、终点坐标
        const origins = await evaluateNodeProperty(config.origins, config.origins_type, this, msg, RED)
        const destination = await evaluateNodeProperty(config.destination, config.destination_type, this, msg, RED)
        await apis
          .distance({ origins, destination, type: calctype })
          .then(res => send(Object.assign(msg, { payload: res.results })))
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
