/*
 * @Descripttion: 
 * @version: 
 * @Author: Eugene
 * @Date: 2024-03-26 17:13:35
 * @LastEditors: Andy
 * @LastEditTime: 2024-03-26 17:13:35
 */
export function calculateSquareCoordinates(lat0, lon0, squareSize) {
    // 地球的平均周长（以米为单位）
    const earthCircumference = 40075000;

    // 一度纬度对应的距离（以米为单位）
    const degreeLatDistance = earthCircumference / 360;

    // 计算纬度差（以度为单位）
    const deltaLatitude = squareSize / degreeLatDistance;

    // 以中心点为中心的正方形四个角的经纬度坐标
    const northeast = {
        latitude: lat0 + deltaLatitude,
        longitude: lon0 + (squareSize / (degreeLatDistance * Math.cos(lat0 * Math.PI / 180)))
    };

    const southeast = {
        latitude: lat0 - deltaLatitude,
        longitude: lon0 + (squareSize / (degreeLatDistance * Math.cos(lat0 * Math.PI / 180)))
    };

    const northwest = {
        latitude: lat0 + deltaLatitude,
        longitude: lon0 - (squareSize / (degreeLatDistance * Math.cos(lat0 * Math.PI / 180)))
    };

    const southwest = {
        latitude: lat0 - deltaLatitude,
        longitude: lon0 - (squareSize / (degreeLatDistance * Math.cos(lat0 * Math.PI / 180)))
    };

    return { northeast, southeast, northwest, southwest };
}

