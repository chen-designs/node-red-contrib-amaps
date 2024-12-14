import Apis from '@/libs/apis'
import { evaluateNodeProperty } from '@/libs/utils'
import { createNode } from '@/libs/utils'

export default function (RED) {
  RED.nodes.registerType('amaps-staticmap', function (config) {
    const { id, type, scale, traffic } = createNode(RED, this, config)
    // 获取配置信息
    const { apis } = RED.nodes.getNode(config.amaps) as { apis: Apis }
    if (!apis) this.error('没有配置正确的地图配置')
    // 监听输入
    this.on('input', async (msg, send, done) => {
      try {
        this.status({ fill: 'blue', shape: 'dot', text: 'Running' })
        // 获取坐标、缩放级别、地图大小、标注、标签、折线
        const location = await evaluateNodeProperty(config.location, config.location_type, this, msg, RED)
        const zoom = await evaluateNodeProperty(config.zoom, config.zoom_type, this, msg, RED)
        const size = await evaluateNodeProperty(config.size, config.size_type, this, msg, RED)
        const markers = await evaluateNodeProperty(config.markers, config.markers_type, this, { location, ...msg }, RED)
        const labels = await evaluateNodeProperty(config.labels, config.labels_type, this, { location, ...msg }, RED)
        const paths = await evaluateNodeProperty(config.paths, config.paths_type, this, { location, ...msg }, RED)
        // 请求接口
        await apis
          .staticmap({ location, zoom, size, markers, labels, paths, scale, traffic })
          .then(res => (send(Object.assign(msg, { payload: res })), res))
          .then(res => RED.comms.publish(type, Object.assign({ id }, res)))
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