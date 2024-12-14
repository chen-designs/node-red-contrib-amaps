# node-red-contrib-amaps

基于 Node-RED 的高德地图的功能接口

### 节点介绍

| 名称           | 功能                  |
|---------------|-----------------------|
| amaps-convert  | 将用户输入的非高德坐标`gps 坐标`、`mapbar 坐标`、`baidu 坐标`转换成高德坐标    |
| amaps-distance | 计算两个坐标之间的距离，及驾车最快所需时长 |
| amaps-district | 根据用户输入的搜索条件可以帮助用户快速的查找特定的行政区域信息 |
| amaps-geocode | 提供结构化地址与经纬度之间的相互转化的能力 |
| amaps-pois | 提供多种场景的地点搜索能力，包括关键字搜索、周边搜索、多边形区域搜索 |
| amaps-routes | 提供了多种路线规划服务。支持驾车、公交、步行、骑行、电动车路线规划 |
| amaps-staticmap | 高德地图以图片形式嵌入自己的网页中。用户可以指定请求的地图位置、图片大小、以及在地图上添加覆盖物，如标签、标注、折线、多边形 |
| amaps-weather | 根据用户输入的 adcode，查询目标区域当前/未来的天气情况，数据来源是中国气象局 |


### 流程示例图
1. 坐标转换(amaps-convert)
	![图片](https://raw.githubusercontent.com/chen-designs/node-red-contrib-amaps/master/resources/flow-amaps-convert.png)

2. 距离测量(amaps-distance)
	![图片](https://raw.githubusercontent.com/chen-designs/node-red-contrib-amaps/master/resources/flow-amaps-distance.png)

3. 行政区域(amaps-district)
	![图片](https://raw.githubusercontent.com/chen-designs/node-red-contrib-amaps/master/resources/flow-amaps-geocode.png)

4. 地理编码(amaps-geocode)
	![图片](https://raw.githubusercontent.com/chen-designs/node-red-contrib-amaps/master/resources/flow-amaps-geocode.png)

5. POI 搜索(amaps-pois)
	![图片](https://raw.githubusercontent.com/chen-designs/node-red-contrib-amaps/master/resources/flow-amaps-pois.png)

6. 路线规划(amaps-routes)
	![图片](https://raw.githubusercontent.com/chen-designs/node-red-contrib-amaps/master/resources/flow-amaps-routes.png)

7. 静态地图(amaps-staticmap)
	![图片](https://raw.githubusercontent.com/chen-designs/node-red-contrib-amaps/master/resources/flow-amaps-staticmap.png)

8. 天气查询(amaps-weather)
	![图片](https://raw.githubusercontent.com/chen-designs/node-red-contrib-amaps/master/resources/flow-amaps-weather.png)

