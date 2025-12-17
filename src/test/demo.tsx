// 步行
<script type="text/javascript">
    var map = new AMap.Map("container", {
        center: [116.397559, 39.89621],
        zoom: 14
    });

    // 当前示例的目标是展示如何根据规划结果绘制路线，因此walkOption为空对象
    var walkingOption = {}

    // 步行导航
    var walking = new AMap.Walking(walkingOption)

    //根据起终点坐标规划步行路线
    walking.search([116.399028, 39.845042], [116.436281, 39.880719], function(status, result) {
        // result即是对应的步行路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_WalkingResult
        if (status === 'complete') {
            if (result.routes && result.routes.length) {
                drawRoute(result.routes[0])
                log.success('绘制步行路线完成')
            }
        } else {
            log.error('步行路线数据查询失败' + result)
        } 
    });

    function drawRoute (route) {
        var path = parseRouteToPath(route)

        var startMarker = new AMap.Marker({
            position: path[0],
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
            map: map
        })

        var endMarker = new AMap.Marker({
            position: path[path.length - 1],
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
            map: map
        })

        var routeLine = new AMap.Polyline({
            path: path,
            isOutline: true,
            outlineColor: '#ffeeee',
            borderWeight: 2,
            strokeWeight: 5,
            strokeColor: '#0091ff',
            lineJoin: 'round'
        })

        routeLine.setMap(map)

        // 调整视野达到最佳显示区域
        map.setFitView([ startMarker, endMarker, routeLine ])
    }

    // 解析WalkRoute对象，构造成AMap.Polyline的path参数需要的格式
    // WalkRoute对象的结构文档 https://lbs.amap.com/api/javascript-api/reference/route-search#m_WalkRoute
    function parseRouteToPath(route) {
        var path = []

        for (var i = 0, l = route.steps.length; i < l; i++) {
            var step = route.steps[i]

            for (var j = 0, n = step.path.length; j < n; j++) {
              path.push(step.path[j])
            }
        }

        return path
    }
</script>

// 驾车
<script type="text/javascript">
    var map = new AMap.Map("container", {
        center: [116.397559, 39.89621],
        zoom: 14
    });

    var drivingOption = {
        policy: AMap.DrivingPolicy.LEAST_TIME, // 其它policy参数请参考 https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingPolicy
        ferry: 1, // 是否可以使用轮渡
        province: '京', // 车牌省份的汉字缩写  
    }

    // 构造路线导航类
    var driving = new AMap.Driving(drivingOption)

    // 根据起终点经纬度规划驾车导航路线
    driving.search(new AMap.LngLat(116.379028, 39.865042), new AMap.LngLat(116.427281, 39.903719), function(status, result) {
        // result即是对应的驾车导航信息，相关数据结构文档请参考 https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
        if (status === 'complete') {
            if (result.routes && result.routes.length) {
                // 绘制第一条路线，也可以按需求绘制其它几条路线
                drawRoute(result.routes[0])
                log.success('绘制驾车路线完成')
            }
        } else {
            log.error('获取驾车数据失败：' + result)
        }
    });

    function drawRoute (route) {
        var path = parseRouteToPath(route)

        var startMarker = new AMap.Marker({
            position: path[0],
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
            map: map
        })

        var endMarker = new AMap.Marker({
            position: path[path.length - 1],
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
            map: map
        })

        var routeLine = new AMap.Polyline({
            path: path,
            isOutline: true,
            outlineColor: '#ffeeee',
            borderWeight: 2,
            strokeWeight: 5,
            strokeColor: '#0091ff',
            lineJoin: 'round'
        })

        routeLine.setMap(map)

        // 调整视野达到最佳显示区域
        map.setFitView([ startMarker, endMarker, routeLine ])
    }

    // 解析DrivingRoute对象，构造成AMap.Polyline的path参数需要的格式
    // DrivingResult对象结构参考文档 https://lbs.amap.com/api/javascript-api/reference/route-search#m_DriveRoute
    function parseRouteToPath(route) {
        var path = []

        for (var i = 0, l = route.steps.length; i < l; i++) {
            var step = route.steps[i]

            for (var j = 0, n = step.path.length; j < n; j++) {
              path.push(step.path[j])
            }
        }

        return path
    }
</script>

// 公交
<script type="text/javascript">
    var map = new AMap.Map("container", {
        center: [116.397559, 39.89621],
        zoom: 14
    });

    var transferOption = {
        city: '北京市',
        nightflag: true, // 是否计算夜班车
        policy: AMap.TransferPolicy.LEAST_TIME, // 其它policy取值请参照 https://lbs.amap.com/api/javascript-api/reference/route-search#m_TransferPolicy
    }

    var transfer = new AMap.Transfer(transferOption)

    //根据起、终点坐标查询公交换乘路线
    transfer.search(new AMap.LngLat(116.291035,39.907899), new AMap.LngLat(116.427281, 39.903719), function(status, result) {
        // result即是对应的公交路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_TransferResult
        if (status === 'complete') {
            if (result.plans && result.plans.length) {
                log.success('绘制公交路线完成')
                drawRoute(result.plans[0])
            }

        } else {
            log.error('公交路线数据查询失败' + result)
        }
    });

    function drawRoute (route) {
        var startMarker = new AMap.Marker({
            position: route.segments[0].transit.origin,
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
            map: map
        })

        var endMarker = new AMap.Marker({
            position: route.segments[route.segments.length - 1].transit.destination,
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
            map: map
        })

        var routeLines = []

        for (var i = 0, l = route.segments.length; i < l; i++) {
            var segment = route.segments[i]
            var line = null

            // 绘制步行路线
            if (segment.transit_mode === 'WALK') {
                line = new AMap.Polyline({
                    path: segment.transit.path,
                    isOutline: true,
                    outlineColor: '#ffeeee',
                    borderWeight: 2,
                    strokeWeight: 5,
                    strokeColor: 'grey',
                    lineJoin: 'round',
                    strokeStyle: 'dashed'
                })         

                
                line.setMap(map)
                routeLines.push(line)
            } else if (segment.transit_mode === 'SUBWAY' || segment.transit_mode === 'BUS') {
                line = new AMap.Polyline({
                    path: segment.transit.path,
                    isOutline: true,
                    outlineColor: '#ffeeee',
                    borderWeight: 2,
                    strokeWeight: 5,
                    strokeColor: '#0091ff',
                    lineJoin: 'round',
                    strokeStyle: 'solid'
                })                

                line.setMap(map)
                routeLines.push(line)
            } else {
                // 其它transit_mode的情况如RAILWAY、TAXI等，该示例中不做处理
            }
        }

        // 调整视野达到最佳显示区域
        map.setFitView([ startMarker, endMarker ].concat(routeLines))
    }

</script>