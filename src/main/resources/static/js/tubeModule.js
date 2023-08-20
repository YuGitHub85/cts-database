
// let tubeCurrentInfoWindow = null; // 在文件的开始部分定义这个变量
// 从数据库加载TubeCount标记
function loadTubeCountMarkersFromDatabase() {
    fetch('/api/tubecount')  // 注意：这里的API路径可能需要根据实际情况进行修改
        .then(response => response.json())
        .then(markers => {
            markers.forEach(marker => {
                const markerObj = new google.maps.Marker({
                    position: {lat: marker.latitude, lng: marker.longitude},
                    map: map,
                    icon: window.circleSymbol
                });

                const infoContent = `
                    <div>
                        <strong>Project Name:</strong> ${marker.projectName}<br>
                        <strong>Project Number:</strong> ${marker.projectNumber}<br>
                        <strong>Year:</strong> ${marker.year}<br>
                        <strong>Start Date:</strong> ${marker.startDate}<br>
                        <strong>Duration:</strong> ${marker.days} <strong>days</strong><br>
                        <strong>Data Source: </strong><a href="/api/tubecount/download/${marker.id}">download data</a>
                    </div>
                `;

                const infoWindow = new google.maps.InfoWindow({
                    content: infoContent
                });

                markerObj.addListener('click', function () {
                    infoWindow.open(map, markerObj);
                });
            });
        });
}

// 保存TubeCount标记
function saveTubeCountMarker(projectName, projectNumber, year, startDate, days, fileData, lat, lng, marker, infoWindow) {
    // ... (与saveMarker函数类似，但是API路径和其他相关内容应该针对TubeCount进行修改)
    const formData = new FormData();
    formData.append('projectName', projectName);
    formData.append('projectNumber', projectNumber);
    formData.append('year', year);
    formData.append('startDate', startDate);
    formData.append('days', days);
    formData.append('fileData', fileData);
    formData.append('latitude', lat);
    formData.append('longitude', lng);

    fetch('/api/tubecount', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log('Marker saved with ID:', data.id);
            marker.id = data.id;  // 更新标记的id属性

            // 更新标记的点击事件监听器
            google.maps.event.clearListeners(marker, 'click');
            marker.addListener('click', function () {
                const savedInfoContent = `
                    <div>
                        <strong>Project Name:</strong> ${projectName}<br>
                        <strong>Project Number:</strong> ${projectNumber}<br>
                        <strong>Year:</strong> ${year}<br>
                        <strong>Start Date:</strong> ${startDate}<br>
                        <strong>Duration:</strong> ${days} <strong>days</strong><br>
                        <strong>Data Source: </strong><a href="/api/tubecount/download/${marker.id}">download data</a>
                    </div>
                `;

                const savedInfoWindow = new google.maps.InfoWindow({
                    content: savedInfoContent
                });

                savedInfoWindow.open(map, marker);
                tubeCurrentInfoWindow = savedInfoWindow; // 更新当前打开的信息窗口
            });

            // 立即更新当前打开的信息窗口的内容
            if (tubeCurrentInfoWindow) {
                tubeCurrentInfoWindow.close();
            }
            infoWindow.setContent(`
                <div>
                    <strong>Project Name:</strong> ${projectName}<br>
                    <strong>Project Number:</strong> ${projectNumber}<br>
                    <strong>Year:</strong> ${year}<br>
                    <strong>Start Date:</strong> ${startDate}<br>
                    <strong>Duration:</strong> ${days} <strong>days</strong><br>
                    <strong>Data Source: </strong><a href="/api/tubecount/download/${marker.id}">download data</a>
                </div>
            `);
            tubeCurrentInfoWindow = infoWindow; // 更新当前打开的信息窗口
        });
}


// 显示TubeCount信息输入框
function showTubeCountInfoInput(marker) {
    // ... (与showInfoInput函数类似，但是内容应该针对TubeCount进行修改)
    const infoInputHTML = `
        <div>
            <label for="projectName">Project Name:</label>
            <input type="text" id="projectName" placeholder="输入项目名称...">
            
            <label for="projectNumber">Project Number:</label>
            <input type="text" id="projectNumber" placeholder="输入项目编号...">
            
            <label for="year">Year:</label>
            <input type="number" id="year" placeholder="输入年份...">
            
            <label for="startDate">Start Date:</label>
            <input type="date" id="startDate">
            
            <label for="days">Duration:</label>
            <input type="number" id="days" placeholder="输入天数...">
            
            <label for="fileData">Upload Data:</label>
            <input type="file" id="fileData">
            
            <button id="saveTubeCountMarkerBtn">SAVE</button>
        </div>
    `;

    const infoWindow = new google.maps.InfoWindow({
        content: infoInputHTML
    });

    let isSaved = false; // 用于跟踪标记是否已保存

    // 修改showInfoInput函数中的保存按钮点击事件
    infoWindow.addListener('domready', () => {
        document.getElementById('saveTubeCountMarkerBtn').addEventListener('click', function (event) {
            // ... 其他代码 ...
            event.stopPropagation(); // 阻止事件冒泡

            const projectName = document.getElementById('projectName').value;
            const projectNumber = document.getElementById('projectNumber').value;
            const year = parseInt(document.getElementById('year').value);
            const startDate = document.getElementById('startDate').value;
            const days = parseInt(document.getElementById('days').value);
            const fileData = document.getElementById('fileData').files[0]; // 获取文件

            const latitude = marker.getPosition().lat();
            const longitude = marker.getPosition().lng();

            saveTubeCountMarker(projectName, projectNumber, year, startDate, days, fileData, latitude, longitude, marker, infoWindow); // 保存标记

            google.maps.event.clearListeners(marker, 'click');
            isSaved = true; // 标记已保存
            infoWindow.close();

            // 更新标记的点击事件监听器，使其显示已保存的信息
            marker.addListener('click', function () {
                const savedInfoContent = `
                <div>
                    <strong>Project Name:</strong> ${projectName}<br>
                    <strong>Project Number:</strong> ${projectNumber}<br>
                    <strong>Year:</strong> ${year}<br>
                    <strong>Start Date:</strong> ${startDate}<br>
                    <strong>Duration:</strong> ${days} <strong>days</strong><br>
                    <strong>Data Source: </strong><a href="/api/tubecount/download/${marker.id}">download data</a>
                </div>
            `;

                const savedInfoWindow = new google.maps.InfoWindow({
                    content: savedInfoContent
                });

                savedInfoWindow.open(map, marker);
            });
        });
    });

// 添加infoWindow关闭事件监听器
    google.maps.event.addListener(infoWindow, 'closeclick', function () {
        if (!isSaved) {
            marker.setMap(null); // 如果标记未保存，则移除标记
        }
    });

    infoWindow.open(map, marker);
    marker.addListener('click', function () {
        infoWindow.open(map, marker);
    });
}

loadTubeCountMarkersFromDatabase();