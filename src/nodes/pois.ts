import Apis from '@/libs/apis'
import { createNode, evaluateNodeProperty } from '@/libs/utils'

export default function (RED) {
  // 路径规划
  RED.nodes.registerType('amaps-pois', function (config) {
    const {} = createNode(RED, this, config)
    // 获取配置信息
    const { apis } = RED.nodes.getNode(config.amaps) as { apis: Apis }
    if (!apis) this.error('没有配置正确的地图配置')
    // 监听输入
    this.on('input', async (msg, send, done) => {
      try {
        this.status({ fill: 'blue', shape: 'dot', text: 'Running' })
        // 获取地点关键字、类型、区域、中心点坐标、搜索半径、多边形区域、POI唯一标识
        const mode = await evaluateNodeProperty(config.mode, config.mode_type, this, msg, RED)
        const keywords = await evaluateNodeProperty(config.keywords, config.keywords_type, this, msg, RED)
        const types = await evaluateNodeProperty(config.types, config.types_type, this, msg, RED)
        const region = await evaluateNodeProperty(config.region, config.region_type, this, msg, RED)
        const location = await evaluateNodeProperty(config.location, config.location_type, this, msg, RED)
        const radius = await evaluateNodeProperty(config.radius, config.radius_type, this, msg, RED)
        const polygon = await evaluateNodeProperty(config.polygon, config.polygon_type, this, msg, RED)
        const id = await evaluateNodeProperty(config.pois, config.pois_type, this, msg, RED)
        await apis
          .pois(mode, { keywords, types, region, location, radius, polygon, id, city_limit: !!region, sortrule: 'distance' })
          .then(res => send(Object.assign(msg, { payload: res.pois })))
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
