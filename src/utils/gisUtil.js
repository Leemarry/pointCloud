export default {
    PI: 3.14159265358979324,
    // 计算两个经纬度的距离，单位米
    getDistance(lat1, lng1, alt1, lat2, lng2, alt2) {
        var radLat1 = lat1 * Math.PI / 180.0;
        var radLat2 = lat2 * Math.PI / 180.0;
        var a = radLat1 - radLat2;
        var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137; // EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000 * 1000
        return s
    },
    outOfChina(lat, lng) {
        if (lng < 72.004 || lng > 137.8347)
            return true
        if (lat < 0.8293 || lat > 55.8271)
            return true
        return false
    },
    // 高德坐标 转 GPS坐标
    ConvertAmapToGps(lat, lon) {
        const latlng = this.ConvertPostion(lat, lon)
            // return { lat: parseFloat((lat - latlng.lat).toFixed(8)), lng: parseFloat((lon - latlng.lng).toFixed(8)) }
        return { lat: lat - latlng.lat, lng: lon - latlng.lng }
    },
    // 转换GPS 为 高德坐标
    ConvertGpsToAmap(lat, lon) {
        const latlng = this.ConvertPostion(lat, lon)
            // return { lat: parseFloat((lat + latlng.lat).toFixed(8)), lng: parseFloat((lon + latlng.lng).toFixed(8)) }
        return { lat: lat + latlng.lat, lng: lon + latlng.lng }
    },
    // 转换坐标，获得差值
    ConvertPostion(lat, lon) {
        if (this.outOfChina(lat, lon)) {
            return { lat: 0, lng: 0 }
        } else {
            const PI = 3.14159265358979324
            var a = 6378245.0 //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
            var ee = 0.00669342162296594323 //  ee: 椭球的偏心率。
            var dLat = this.transformLat(lon - 105.0, lat - 35.0)
            var dLon = this.transformLon(lon - 105.0, lat - 35.0)
            const radLat = lat / 180.0 * PI
            var magic = Math.sin(radLat)
            magic = 1 - ee * magic * magic
            const sqrtMagic = Math.sqrt(magic)
            dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI)
            dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI)
            return { lat: dLat, lng: dLon }
        }
    },
    // 转换纬度
    transformLat(x, y) {
        const PI = 3.14159265358979324
        let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
        ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
        ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0
        ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0
        return ret
    },
    // 转换经度
    transformLon(x, y) {
        const PI = 3.14159265358979324
        let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
        ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
        ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0
        ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0
        return ret
    },
    /**
     * 根据区域自动生成航线,返回航点数组
     * @param {*} listGrid 单项格式：["Q": 30.459815411503644, "R": 114.46483035050966, "lng": 114.46483, "lat": 30.459815]
     * @param {*} homepos 
     * @param {*} spacing 
     * @param {*} headSpacing 
     * @param {*} yaw 
     * @param {*} outlineDistance 
     */
    GenerationWaypointsByGrid(listGrid, homepos, spacing, headSpacing, yaw, outlineDistance) {
        let rad2deg = (180 / Math.PI);
        let deg2rad = (1.0 / rad2deg);
        let arearect = this.getPolyMinMax(listGrid, outlineDistance);
        let topLeft = arearect.LocationTopLeft;
        let rightBottom = arearect.LocationRightBottom;
        let topright = { lat: topLeft.lat, lng: rightBottom.lng };
        let bottomleft = { lat: rightBottom.lat, lng: topLeft.lng };
        let p1 = [topLeft.lng, topLeft.lat];
        let p2 = [rightBottom.lng, rightBottom.lat];
        let diagdist = AMap.GeometryUtil.distance(p1, p2);
        p1 = [topLeft.lng, topLeft.lat];
        p2 = [bottomleft.lng, bottomleft.lat];
        let heightdist = AMap.GeometryUtil.distance(p1, p2);
        p1 = [topLeft.lng, topLeft.lat];
        p2 = [topright.lng, topright.lat];
        let widthdist = AMap.GeometryUtil.distance(p1, p2);
        // console.log(" diagdist 距离为：" + diagdist + " 米。");
        // console.log(" heightdist 距离为：" + heightdist + " 米。");
        // console.log(" widthdist 距离为：" + widthdist + " 米。");
        // get x y components
        let DefaultAngle = yaw;
        if (DefaultAngle > 180) DefaultAngle = DefaultAngle - 180;
        let x1 = Math.cos((DefaultAngle) * deg2rad); // needs to mod for long scale
        let y1 = Math.sin((DefaultAngle) * deg2rad);
        // get x y step amount in lat lng from m
        let lat1M = arearect.heightLat / heightdist;
        let lng1M = arearect.widthLng / widthdist;
        let latDistance = (spacing / (Math.sin((DefaultAngle) * deg2rad)));
        let lngDistance = (spacing / (Math.cos((DefaultAngle) * deg2rad)));
        let latdiff = arearect.heightLat / ((heightdist / latDistance));
        let lngdiff = arearect.widthLng / ((widthdist / lngDistance));

        let fulllatdiff = arearect.heightLat * x1 * 2;
        let fulllngdiff = arearect.widthLng * y1 * 2;
        let TheLeftDiff = (heightdist * Math.tan(DefaultAngle * deg2rad)) * lng1M;
        let TheTopDiff = (widthdist / Math.tan(DefaultAngle * deg2rad)) * lat1M;

        let overshootdist = 0; // (int)(double.Parse(overshoot) / MainV2.cs.multiplierdist);
        let overshootdistlng = arearect.widthLng / widthdist * overshootdist;
        let count = 0;

        let StartLat = bottomleft.lat;
        let StartLng = bottomleft.lng - Math.abs(TheLeftDiff);

        let dt = Date.now();
        let intTemp = 0;
        let dicPoints = [];
        let listTemp;
        if (DefaultAngle === 0 || DefaultAngle === 180) { // 竖线
            StartLat = topLeft.lat;
            StartLng = topLeft.lng;
            StartLng = topLeft.lng + lngdiff / 2;
        } else if ((DefaultAngle > 0 && DefaultAngle <= 45)) {
            StartLat = bottomleft.lat;
            StartLng = bottomleft.lng - TheLeftDiff;
        } else if ((DefaultAngle > 45 && DefaultAngle <= 90)) {
            StartLat = topLeft.lat;
            StartLat = topLeft.lat - latdiff / 2;
            StartLng = topLeft.lng;
        } else if ((DefaultAngle > 135 && DefaultAngle < 180)) {
            StartLat = topLeft.lat;
            StartLng = topLeft.lng + TheLeftDiff;
        } else {
            StartLat = topLeft.lat - TheTopDiff;
            StartLng = topLeft.lng;
        }
        // 自动生成航线
        while (true) {
            intTemp++;
            let closestlatlong = { lat: 0, lng: 0 };
            let farestlatlong = { lat: 0, lng: 0 };
            let noc = 1.7976931348623157e+308;
            let nof = 4.9e-324;

            let ax = StartLat;
            let ay = StartLng;
            let bx = 0; // StartLat + fulllatdiff;
            let by = 0;
            if (DefaultAngle === 0 || DefaultAngle === 180) {
                bx = StartLat - arearect.heightLat;
                by = StartLng;
                StartLng += Math.abs(lngdiff);
            } else if (DefaultAngle > 0 && DefaultAngle <= 45) {
                bx = topLeft.lat;
                by = StartLng + TheLeftDiff;
                StartLng += Math.abs(lngdiff);
            } else if (DefaultAngle > 135 && DefaultAngle < 180) {
                bx = bottomleft.lat;
                by = StartLng - TheLeftDiff;
                StartLng += Math.abs(lngdiff);
            } else {
                bx = StartLat + TheTopDiff;
                by = topright.lng;
                StartLat -= latdiff;
            }
            if (ay > topright.lng && by > topright.lng) break;
            if (ax < bottomleft.lat && bx < bottomleft.lat) break;

            let newlatlong = { lat: 0, lng: 0 };
            // 遍历循环区域边界线条，计算交叉点
            for (let a = 1; a < arearect.Points.length; a++) {
                newlatlong = this.FindLineIntersection(arearect.Points[a - 1], arearect.Points[a], { lat: ax, lng: ay }, { lat: bx, lng: by });
                if (newlatlong.lat !== 0 && newlatlong.lng !== 0) {
                    p1 = [ay, ax];
                    p2 = [newlatlong.lng, newlatlong.lat];
                    let distance = AMap.GeometryUtil.distance(p1, p2);
                    if (noc > distance) {
                        closestlatlong = { lat: newlatlong.lat, lng: newlatlong.lng };
                        noc = distance;
                    }
                    if (nof < distance) {
                        farestlatlong = { lat: newlatlong.lat, lng: newlatlong.lng };
                        nof = distance;
                    }
                }
            }
            listTemp = [];
            if (closestlatlong.lat !== 0 && closestlatlong.lng !== 0) {
                listTemp.push(closestlatlong);
            }
            if (farestlatlong.lat !== 0 && farestlatlong.lng !== 0) {
                listTemp.push(farestlatlong);
            }
            if (listTemp.length > 0) {
                dicPoints.push({ key: intTemp, value: listTemp });
            }
            count++;
        }
        let listAutoWps = this.AddOnMap(dicPoints, homepos);
        return listAutoWps;
    },



    /**
     * 按照与Home点的距离添加到地图上
     * @param {键值对数组} dicPoints
     * @param {LatLng} HomeMarker 进入点坐标{lat,lng}
     */
    AddOnMap(dicPoints, HomeMarker) {
        let listmission = [];
        if (dicPoints.length > 0) {
            let listTemp;
            let listFirst = dicPoints[0].value;
            let listLast = dicPoints[dicPoints.length - 1].value;
            let dicPointsTemp = [];
            // 找出与Home点最近的点
            let nearest = 0; // 0 1 2 3
            let FirstLineWpReverse = false;
            let distanceMax = 1.7976931348623157e+308;
            let distance1 = 1.7976931348623157e+308;
            let distance2 = 1.7976931348623157e+308;
            let distance3 = 1.7976931348623157e+308;
            let distance4 = 1.7976931348623157e+308;
            let p1 = [HomeMarker.lng, HomeMarker.lat];
            let p2 = [0, 0];
            if (listFirst.length > 0) {
                p2 = [listFirst[0].lng, listFirst[0].lat];
                distance1 = AMap.GeometryUtil.distance(p1, p2);
                p2 = [listFirst[listFirst.length - 1].lng, listFirst[listFirst.length - 1].lat];
                distance2 = AMap.GeometryUtil.distance(p1, p2);
            }
            if (listLast.length > 0) {
                p2 = [listLast[0].lng, listLast[0].lat];
                distance3 = AMap.GeometryUtil.distance(p1, p2);
                p2 = [listLast[listLast.length - 1].lng, listLast[listLast.length - 1].lat];
                distance4 = AMap.GeometryUtil.distance(p1, p2);
            }
            // console.log("距离第一个线条 起点：" + distance1 + "米，结束点：" + distance2 + "米。");
            // console.log("距离最后一个线条 起点：" + distance3 + "米，结束点：" + distance4 + "米。");
            if (distance1 < distanceMax) {
                nearest = 0;
                distanceMax = distance1;
            }
            if (distance2 < distanceMax) {
                nearest = 1;
                distanceMax = distance2;
            }
            if (distance3 < distanceMax) {
                nearest = 2;
                distanceMax = distance3;
            }
            if (distance4 < distanceMax) {
                nearest = 3;
                distanceMax = distance4;
            }
            if (nearest === 2 || nearest === 3) {
                // 倒叙插入
                for (let index = dicPoints.length - 1; index >= 0; index--) {
                    dicPointsTemp.push({ key: dicPoints[index].key, value: dicPoints[index].value });
                }
            } else {
                dicPoints.forEach(entry => {
                    dicPointsTemp.push(entry);
                });
            }
            if (nearest === 1 || nearest === 3) {
                FirstLineWpReverse = true;
            }
            listmission = [];
            dicPointsTemp.forEach(item => {
                // dicPoints.push({ key: intTemp, value: listTemp });
                listTemp = item.value;
                if (listTemp != null && listTemp.length > 0) {
                    if (FirstLineWpReverse) {
                        listTemp.reverse();
                    }
                    FirstLineWpReverse = !FirstLineWpReverse;
                    listTemp.forEach(wp => {
                        if (listmission.length > 0) {
                            if (listmission[listmission.length - 1].lat === wp.lat && listmission[listmission.length - 1].lng === wp.lng) {
                                return; // return语句跳出本次循环，执行下一次循环
                            }
                        }
                        listmission.push(wp);
                    });
                }
            });
        }
        return listmission;
    },
    /**
     * 获得当前区域的最小多边形
     * @param {*} listGrid 边界航点集合
     * @param {*} outlineDistance 外扩距离
     * @returns 最小多边形
     */
    getPolyMinMax(listGrid, outlineDistance) {
        if (listGrid.length === 0) return null;
        let minx, miny, maxx, maxy, centetLat, centerLng;
        minx = maxx = listGrid[0].lng;
        miny = maxy = listGrid[0].lat;
        centetLat = 0;
        centerLng = 0;
        listGrid.forEach(pnt => {
            minx = Math.min(minx, pnt.lng);
            maxx = Math.max(maxx, pnt.lng);
            miny = Math.min(miny, pnt.lat);
            maxy = Math.max(maxy, pnt.lat);
            centetLat += pnt.lat;
            centerLng += pnt.lng;
        });
        centetLat = centetLat / listGrid.length;
        centerLng = centerLng / listGrid.length; // 整个区域的中心点坐标
        let gridPointYawList = []; // 计算每个边界点相对于中心点的方位角度值
        let gridPointDistanceList = []; // 计算每个边界点相对于中心点的距离值

        let pCenter = { lat: centetLat, lng: centerLng }; // 用于
        let pGrid = { lat: 0, lng: 0 };

        let p1 = [centerLng, centetLat]; // 用于计算距离，数组内容[经度，纬度]
        let p2 = [0, 0];

        listGrid.forEach((pnt, index) => {
            pGrid = { lat: pnt.lat, lng: pnt.lng };
            let yaw = this.GetBearing(pCenter, pGrid);
            gridPointYawList.push(yaw);
            p2 = [pnt.lng, pnt.lat];
            let distance = AMap.GeometryUtil.distance(p1, p2); // 与区域中心点距离
            gridPointDistanceList.push(distance);
            console.log("点" + index + "相对于中心点(" + p1 + ")坐标为：" + yaw + "度，距离为 " + distance + " 米");
        });
        // 计算外扩过后的边界点坐标
        let listGridTemp = [];
        let newGridPoint = { lat: 0, lng: 0 };
        if (outlineDistance !== 0) {
            let newDistance = outlineDistance;
            gridPointYawList.forEach((pnt, index) => {
                newDistance = gridPointDistanceList[index] + outlineDistance;
                newGridPoint = this.FindPointAtDistanceFrom(pCenter, gridPointYawList[index], newDistance);
                console.log("点" + index + " 新的距离为 " + newDistance + " 米");
                listGridTemp.push(newGridPoint);
            });
            listGridTemp.forEach(pnt => {
                minx = Math.min(minx, pnt.lng);
                maxx = Math.max(maxx, pnt.lng);
                miny = Math.min(miny, pnt.lat);
                maxy = Math.max(maxy, pnt.lat);
            });
        }
        // 生成航线区域对象
        let arearect = {
            Points: (outlineDistance === 0 ? listGrid : listGridTemp),
            LocationTopLeft: { lat: maxy, lng: minx },
            LocationRightBottom: { lat: miny, lng: maxx },
            heightLat: Math.abs(maxx - minx),
            widthLng: Math.abs(miny - maxy)
        };
        if (arearect.Points.length > 0) {
            arearect.Points.push(arearect.Points[0]);
        }
        return arearect;
    },

    /**
     * 判断两条线段的交点
     * @param {*} start1 
     * @param {*} end1 
     * @param {*} start2 
     * @param {*} end2 
     * @returns  交点 { lat: 0, lng: 0 };
     */
    FindLineIntersection(start1, end1, start2, end2) {
        let denom = ((end1.lng - start1.lng) * (end2.lat - start2.lat)) - ((end1.lat - start1.lat) * (end2.lng - start2.lng));
        //  AB & CD are parallel
        if (denom === 0)
            return { lat: 0, lng: 0 };
        let numer = ((start1.lat - start2.lat) * (end2.lng - start2.lng)) - ((start1.lng - start2.lng) * (end2.lat - start2.lat));
        let r = numer / denom;
        let numer2 = ((start1.lat - start2.lat) * (end1.lng - start1.lng)) - ((start1.lng - start2.lng) * (end1.lat - start1.lat));
        let s = numer2 / denom;
        if ((r < 0 || r > 1) || (s < 0 || s > 1))
            return { lat: 0, lng: 0 };
        return { lat: start1.lat + (r * (end1.lat - start1.lat)), lng: start1.lng + (r * (end1.lng - start1.lng)) };
    },
    /**
     * 获取一个坐标相对于另外一个坐标的朝向
     * @param {*} p1 基准参考坐标点
     * @param {*} p2 需要计算的坐标点
     * @returns p2相对于p1的绝对角度值
     */
    GetBearing(p1, p2) {
        var latitude1 = this.DegreesToRadians(p1.lat);
        var latitude2 = this.DegreesToRadians(p2.lat);
        var longitudeDifference = this.DegreesToRadians(p2.lng - p1.lng);
        var y = Math.sin(longitudeDifference) * Math.cos(latitude2);
        var x = Math.cos(latitude1) * Math.sin(latitude2) - Math.sin(latitude1) * Math.cos(latitude2) * Math.cos(longitudeDifference);
        return (this.RadiansToDegrees(Math.atan2(y, x)) + 360) % 360;
    },
    /**
     * 已知一个点坐标，求另外一个点坐标
     * @param {*} startPoint 已知点坐标{lat,lng}
     * @param {*} initialBearing 目标点的朝向
     * @param {*} distanceMetres 距离值
     * @returns 新坐标点{lat,lng}
     */
    FindPointAtDistanceFrom(startPoint, initialBearing, distanceMetres) {
        let radiusEarthKilometres = 6371.01; // 地球半径
        let initialBearingRadians = this.DegreesToRadians(initialBearing);
        var distRatio = (distanceMetres / 1000) / radiusEarthKilometres;
        var distRatioSine = Math.sin(distRatio);
        var distRatioCosine = Math.cos(distRatio);
        var startLatRad = this.DegreesToRadians(startPoint.lat);
        var startLonRad = this.DegreesToRadians(startPoint.lng);
        var startLatCos = Math.cos(startLatRad);
        var startLatSin = Math.sin(startLatRad);
        var endLatRads = Math.asin((startLatSin * distRatioCosine) + (startLatCos * distRatioSine * Math.cos(initialBearingRadians)));
        var endLonRads = startLonRad + Math.atan2(Math.sin(initialBearingRadians) * distRatioSine * startLatCos, distRatioCosine - startLatSin * Math.sin(endLatRads));
        return { lat: this.RadiansToDegrees(endLatRads), lng: this.RadiansToDegrees(endLonRads) };
    },
    getKmlMission(wpsInfo, kmlString) {
        var xmlDoc = null;
        var keyValue = [];

        //Parse the kml 
        try {
            //Internet Explorer 
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(kmlString);
        } catch (e) {
            try {
                //Firefox, etc. 
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(kmlString, "text/xml");
            } catch (e) {
                //Failed to parse 
                alert(e.message);
                return;
            }
        }
        let points = []
        let missionName, missionOpen;
        var documentXml = xmlDoc.getElementsByTagName("Document");
        if (documentXml && documentXml.length > 0) {
            let missionNames = documentXml[0].getElementsByTagName("name");
            if (missionNames && missionNames.length > 0) {
                missionName = missionNames[0].firstChild.nodeValue;
                wpsInfo.wpsName = missionName
            }
            let missionOpens = documentXml[0].getElementsByTagName("open");
            if (missionOpens && missionOpens.length > 0) {
                missionOpen = missionOpens[0].firstChild.nodeValue;
            }
            let Folders = documentXml[0].getElementsByTagName("Folder");
            if (Folders && Folders.length > 0) {
                // 所有航点
                let PlacemarkWp = Folders[0].getElementsByTagName("Placemark");
                if (PlacemarkWp && PlacemarkWp.length > 0) {
                    for (let i = 0; i < PlacemarkWp.length; i++) {
                        let wp = this.getKmlPlacemark(PlacemarkWp[i])
                        if (wp != null) {
                            wp.wpIndex = points.length
                            points.push(wp)
                        }
                    }
                }
            }
            let PlacemarkLines = documentXml[0].getElementsByTagName("Placemark");
            if (PlacemarkLines && PlacemarkLines.length > 0) {
                // 航线
                // let description = PlacemarkLines[0].getElementsByTagName("description")[0].firstChild.nodeValue;
                // let visibility = PlacemarkLines[0].getElementsByTagName("visibility")[0].firstChild.nodeValue;
                let ExtendedDatas = PlacemarkLines[PlacemarkLines.length - 1].getElementsByTagName("ExtendedData");
                if (ExtendedDatas.length > 0) {
                    if (ExtendedDatas[0].getElementsByTagName("mis:autoFlightSpeed").length > 0) {
                        let autoFlightSpeed = ExtendedDatas[0].getElementsByTagName("mis:autoFlightSpeed")[0].firstChild.nodeValue;
                        wpsInfo.wpsSpeed = autoFlightSpeed
                    }
                    if (ExtendedDatas[0].getElementsByTagName("mis:actionOnFinish").length > 0) {
                        let actionOnFinish = ExtendedDatas[0].getElementsByTagName("mis:actionOnFinish")[0].firstChild.nodeValue;
                        if (actionOnFinish === 'GoHome') {
                            wpsInfo.wpsFinishedAction = 1
                        } else {
                            wpsInfo.wpsFinishedAction = 1
                        }
                    }
                    if (ExtendedDatas[0].getElementsByTagName("mis:headingMode").length > 0) {
                        let headingMode = ExtendedDatas[0].getElementsByTagName("mis:headingMode")[0].firstChild.nodeValue;
                        if (headingMode === 'UsePointSetting') {
                            wpsInfo.wpsHeadingMode = 3
                        } else {
                            wpsInfo.wpsHeadingMode = 0
                        }
                    }
                    // let safeDistance = ExtendedDatas[0].getElementsByTagName("mis:safeDistance")[0].firstChild.nodeValue;
                    if (ExtendedDatas[0].getElementsByTagName("mis:droneInfo").length > 0) {
                        let droneInfoArray = ExtendedDatas[0].getElementsByTagName("mis:droneInfo")[0]
                            // if (droneInfoArray[0].getElementsByTagName("mis:droneType").length > 0) {
                            //     let droneType = droneInfoArray.getElementsByTagName("mis:droneType")[0].firstChild.nodeValue;
                            // }
                            // if (droneInfoArray[0].getElementsByTagName("mis:advanceSettings").length > 0) {
                            //     let advanceSettings = droneInfoArray.getElementsByTagName("mis:advanceSettings")[0].firstChild.nodeValue;
                            // }
                            // let droneCameras = droneInfoArray.getElementsByTagName("mis:droneCameras")
                        let droneHeightArray = droneInfoArray.getElementsByTagName("mis:droneHeight")
                        if (droneHeightArray.length > 0) {
                            if (droneHeightArray[0].getElementsByTagName("mis:useAbsolute").length > 0) {
                                let useAbsolute = droneHeightArray[0].getElementsByTagName("mis:useAbsolute")[0].firstChild.nodeValue;
                                wpsInfo.wpsAltMode = (useAbsolute.toLowerCase() === 'true')
                            }
                            if (droneHeightArray[0].getElementsByTagName("mis:hasTakeoffHeight").length > 0) {
                                let hasTakeoffHeight = droneHeightArray[0].getElementsByTagName("mis:hasTakeoffHeight")[0].firstChild.nodeValue;
                                wpsInfo.wpsUseThisHomeAltAbs = (hasTakeoffHeight.toLowerCase() === 'true')
                            }
                            if (droneHeightArray[0].getElementsByTagName("mis:takeoffHeight").length > 0) {
                                let takeoffHeight = droneHeightArray[0].getElementsByTagName("mis:takeoffHeight")[0].firstChild.nodeValue;
                                wpsInfo.wpsHomeAltAbs = takeoffHeight
                            }
                        }
                    }

                }
                let LineString = PlacemarkLines[PlacemarkLines.length - 1].getElementsByTagName("LineString"); // 航线路径
            }
        }
        // wpsInfo.wpsAlt = 1
        // wpsInfo.wpsAltAbs = 1
        wpsInfo.wpsMaxSpeed = 15
        wpsInfo.wpsVersion = 0 //航线版本： V1 ,V2
        wpsInfo.wpsType = 1
        wpsInfo.wpsGimbalPitchRotationEnabled = false;
        wpsInfo.wpsRepeatTimes = 1
        wpsInfo.wpsHeadingMode = 1 // 机头朝向设置为固定 ,V2版本可设置为使用航点参数朝向
        wpsInfo.wpsRcSignalLost = 0 // 遥控信号丢失
        wpsInfo.wpsFinishedAction = 1 // 任务结束后执行动作
        wpsInfo.wpsFlightPathMode = 0 // 航点或曲线航点
        wpsInfo.wpsGotoWaypointMode = 0 // 如何飞到第一个航点
        return points
    },
    getKmlPlacemark(xml) {
        let wp = null
        let name = xml.getElementsByTagName("name")[0].firstChild.nodeValue;
        let description = xml.getElementsByTagName("description")[0].firstChild.nodeValue;
        let visibility = xml.getElementsByTagName("visibility")[0].firstChild.nodeValue;
        let ExtendedDatas = xml.getElementsByTagName("ExtendedData");
        if (ExtendedDatas && ExtendedDatas.length > 0) {
            wp = { wpParm1: 0, wpParm2: 0, wpParm3: 0, wpParm4: 0 }
                // 具体航点内容
            if (ExtendedDatas[0].getElementsByTagName("mis:heading").length > 0) {
                wp.wpParm2 = ExtendedDatas[0].getElementsByTagName("mis:heading")[0].firstChild.nodeValue;
            }
            if (ExtendedDatas[0].getElementsByTagName("mis:speed").length > 0) {
                // wp.xxxx = ExtendedDatas[0].getElementsByTagName("mis:speed")[0].firstChild.nodeValue;
            }
            if (ExtendedDatas[0].getElementsByTagName("mis:shootingDistance").length > 0) {
                // wp.xxxx = ExtendedDatas[0].getElementsByTagName("mis:shootingDistance")[0].firstChild.nodeValue;
            }
            if (ExtendedDatas[0].getElementsByTagName("mis:shootingPointCoordinates").length > 0) {
                // wp.xxxx = ExtendedDatas[0].getElementsByTagName("mis:shootingPointCoordinates")[0].firstChild.nodeValue;
            }
            if (ExtendedDatas[0].getElementsByTagName("mis:gimbalPitch").length > 0) {
                wp.wpParm1 = ExtendedDatas[0].getElementsByTagName("mis:gimbalPitch")[0].firstChild.nodeValue;
            }
            wp.wpDjiActions = ''
            let actions = '' // 5,0|6,1|7,5
            let actionsArray = ExtendedDatas[0].getElementsByTagName("mis:actions");
            if (actionsArray && actionsArray.length > 0) {
                for (let i = 0; i < actionsArray.length; i++) {
                    let param = 0
                    if (actionsArray[i].getAttribute("param") !== null) {
                        param = actionsArray[i].getAttribute("param")
                    }
                    let action = actionsArray[i].firstChild.nodeValue;
                    if (action === 'ShootPhoto') {
                        actions += '0,1000|1,' + param + '|'
                    } else if (action === 'GimbalYaw') {

                    } else if (action === 'GimbalPitch') {
                        actions += '5,' + param + '|'
                    } else if (action === 'AircraftYaw') {
                        actions += '4,' + param + '|'
                    } else if (action === 'CameraZoom') {} else if (action === 'CameraFocus') {} else if (action === 'StartRecording') {
                        actions += '2,' + param + '|'
                    } else if (action === 'StopRecording') {
                        actions += '3,' + param + '|'
                    } else if (action === 'STAY') {
                        actions += '0,' + param + '|'
                    }
                }
            }
            if (actions.length > 0) {
                actions = actions.substring(0, actions.length - 1)
            }
            wp.wpDjiActions = actions
        }
        let Points = xml.getElementsByTagName("Point");
        if (Points && Points.length > 0) {
            if (wp === null) {
                wp = {}
            }
            if (Points[0].getElementsByTagName("altitudeMode").length > 0) {
                let altitudeMode = Points[0].getElementsByTagName("altitudeMode")[0].firstChild.nodeValue; // absolute or relative?
            }
            // 航点坐标
            if (Points[0].getElementsByTagName("coordinates").length > 0) {
                let coordinates = Points[0].getElementsByTagName("coordinates")[0].firstChild.nodeValue;
                const temp = coordinates.split(',') // 102.51723175417328,25.506897722183894,1726.1050381880427
                if (temp.length === 3) {
                    wp.wpLat = Number(temp[1])
                    wp.wpLng = Number(temp[0])
                    wp.wpAlt = Number(temp[2]).toFixed(3)
                    wp.wpAltAbs = Number(temp[2]).toFixed(3)
                    wp.wpDjiActionRepeatTimes = 1 // 默认就为1
                }
            }
        }
        return wp
    },
    getKmlData(kmlString) {
        var xmlDoc = null;
        var keyValue = [];
        //Parse the kml 
        try {
            //Internet Explorer 
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(kmlString);
        } catch (e) {
            try {
                //Firefox, etc. 
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(kmlString, "text/xml");
            } catch (e) {
                //Failed to parse 
                alert(e.message);
                return;
            }
        }
        var coordinatesXml = xmlDoc.getElementsByTagName("coordinates");
        let points = [{ lat: 0, lng: 0, alt: 0 }]
        points = []
        console.log('解析Kml文件航点路径: ')
        for (var i = 0; i < coordinatesXml.length; i++) {
            let item = coordinatesXml[i].innerHTML // item.textContent 或者 item.innerHTML
            let tempArr = item.split(' ')
            for (let j = 0; j < tempArr.length; j++) {
                const temp = tempArr[j].split(',') // 113.88522842,30.45215678,0
                if (temp.length === 3) {
                    points.push({
                        lng: Number.parseFloat(temp[0]),
                        lat: Number.parseFloat(temp[1]),
                        alt: Number.parseFloat(temp[2])
                    })
                    console.log(temp[0] + ',' + temp[1] + ',' + temp[2])
                }
            }
        }
        return points
            // // Get all the named elements 
            // var data = xmlDoc.getElementsByTagName("Data");
            // // Iterate through the data elements 
            // for (var i = 0; i < data.length; i++) {
            //     if (data[i].getAttribute("name") &&
            //         data[i].getElementsByTagName("value").length > 0) {
            //         // Get the name and value 
            //         var name = data[i].getAttribute("name");
            //         var value = data[i].getElementsByTagName("value")[0].firstChild.data;
            //         // Assign them to the keyValue object 
            //         keyValue[name] = value;
            //     }
            // }
            // return keyValue;
    },

    /**
     * 度转弧度
     * @param {double} degrees 
     * @returns 
     */
    DegreesToRadians(degrees) {
        let degToRadFactor = Math.PI / 180;
        return degrees * degToRadFactor;
    },
    /**
     * 弧度转度
     * @param {double} radians 
     * @returns 
     */
    RadiansToDegrees(radians) {
        let radToDegFactor = 180 / Math.PI;
        return radians * radToDegFactor;
    }
}