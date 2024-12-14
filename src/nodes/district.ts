import Apis from '@/libs/apis'
import { createNode, evaluateNodeProperty } from '@/libs/utils'

export default function (RED) {
  RED.nodes.registerType('amaps-district', function (config) {
     const {  } = createNode(RED, this, config)
    // 获取配置信息
    const { apis } = RED.nodes.getNode(config.amaps) as { apis: Apis }
    if (!apis) this.error('没有配置正确的地图配置')
    // 监听输入
    this.on('input', async (msg, send, done) => {
      try {
        this.status({ fill: 'blue', shape: 'dot', text: 'Running' })
        // 查询关键字
        const keywords = await evaluateNodeProperty(config.keywords, config.keywords_type, this, msg, RED)
        const subdistrict = await evaluateNodeProperty(config.subdistrict, config.subdistrict_type, this, msg, RED, value => value ?? 1)
        await apis
          .search({ keywords, subdistrict })
          .then(res => send(Object.assign(msg, { payload: res.districts })))
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
