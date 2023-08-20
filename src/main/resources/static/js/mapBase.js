// Initialize and add the map
let map;
let currentInfoWindow; // 用于存储当前打开的信息窗口.(tmc)
let tubeCurrentInfoWindow; // 用于存储当前打开的信息窗口.(tube)

let isAddingTubeCountMarker = false; // 在文件的开始部分定义这个变量
let isAddingMarker = false; // 在文件的开始部分定义这个变量
// The location of Florida
const position = {lat: 27.9944024, lng: -81.7602544}; // 这是佛罗里达州的大致中心点

// Define the boundaries for the map to restrict the panning
const strictBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(24.396308, -87.634643), // Southwest corner of Florida
    new google.maps.LatLng(31.001056, -79.937500)  // Northeast corner of Florida
);

// window.starSymbol = {
//     path: 'M 0,-50 15,-15 50,0 15,15 0,50 -15,15 -50,0 -15,-15 z',
//     fillColor: 'red',
//     fillOpacity: 1,
//     strokeColor: 'blue',
//     strokeWeight: 1,
//     scale: 10  // 你可能需要调整这个值以获得合适的大小
// };

window.starSymbol = {
    url: '../images/star.png',
    // path: google.maps.SymbolPath.CIRCLE,
    fillColor: '#6699FF',
    fillOpacity: 1,
    strokeColor: 'blue',
    strokeWeight: 1,
    // scale: 10  // 你可能需要调整这个值以获得合适的大小
    scaledSize: new google.maps.Size(30, 30),  // 设置图像的宽度和高度
};

window.circleSymbol = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: '#6699FF',
    fillOpacity: 1,
    strokeColor: 'blue',
    strokeWeight: 1,
    scale: 10
};


// Custom map styles
const customStyles = [
    {
        "featureType": "all",
        "elementType": "labels",
        "stylers": [
            {"visibility": "off"} // 隐藏所有标签
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {"visibility": "on"} // 仅显示道路标签
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {"color": "#ffffff"} // 设置道路颜色为白色
        ]
    },
    {
        "featureType": "landscape",
        "stylers": [
            {"color": "#f2f2f2"} // 设置景观颜色为浅灰色
        ]
    }
];


// 初始化地图
async function initMap() {

    // Request needed libraries.
    //@ts-ignore
    const {Map} = await google.maps.importLibrary("maps");

    // The map, centered at Florida
    map = new Map(
        document.getElementById('map'),
        {
            zoom: 7.5,
            center: position,
            styles: customStyles  // Apply the custom styles
        }
    );

    // Listen for the dragend event
    google.maps.event.addListener(map, 'dragend', function () {
        if (strictBounds.contains(map.getCenter())) return;

        // We're out of bounds - Move the map back within the bounds
        const c = map.getCenter();
        let x = c.lat(),
            y = c.lng(),
            maxY = strictBounds.getNorthEast().lng(),
            maxX = strictBounds.getNorthEast().lat(),
            minY = strictBounds.getSouthWest().lng(),
            minX = strictBounds.getSouthWest().lat();

        if (y < minY) y = minY;
        if (y > maxY) y = maxY;
        if (x < minX) x = minX;
        if (x > maxX) x = maxX;

        map.setCenter(new google.maps.LatLng(x, y));
    });


    document.getElementById('addMarkerBtn').addEventListener('click', function () {
        isAddingMarker = true;
        isAddingTubeCountMarker = false; // 确保只有一个操作在进行
    });

    document.getElementById('addTubeCountBtn').addEventListener('click', function () {
        isAddingTubeCountMarker = true;
        isAddingMarker = false; // 确保只有一个操作在进行
    });

// 修改map的click事件监听器
    map.addListener('click', function (event) {
        let marker;
        if (isAddingMarker) {
            marker = new google.maps.Marker({
                position: event.latLng,
                map: map,
                draggable: true // 允许用户拖动标记
            });

            // 显示信息输入框
            showInfoInput(marker);

            isAddingMarker = false; // 重置标志位
        } else if (isAddingTubeCountMarker) {
            marker = new google.maps.Marker({
                position: event.latLng,
                map: map,
                draggable: true, // 允许用户拖动标记
            });

            // 显示信息输入框
            showTubeCountInfoInput(marker);

            isAddingTubeCountMarker = false; // 重置标志位
        }
    });
}

initMap();