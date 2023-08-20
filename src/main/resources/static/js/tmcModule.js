function loadMarkersFromDatabase() {
    fetch('/api/tmc')  // 注意：我已经修改了API路径
        .then(response => response.json())
        .then(markers => {
            markers.forEach(marker => {
                const markerObj = new google.maps.Marker({
                    position: {lat: marker.latitude, lng: marker.longitude},
                    map: map,
                    icon: window.starSymbol
                });

                const infoContent = `
                    <div>
                        <strong>Project Name:</strong> ${marker.projectName}<br>
                        <strong>Project Number:</strong> ${marker.projectNumber}<br>
                        <strong>Year:</strong> ${marker.year}<br>
                        <strong>Start Date:</strong> ${marker.startDate}<br>
                        <strong>Duration:</strong> ${marker.days} <strong>days</strong><br>
                        <strong>Data Source: </strong><a href="/api/tmc/download/${marker.id}">download data</a>
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

function saveMarker(projectName, projectNumber, year, startDate, days, fileData, lat, lng, marker, infoWindow) {
    const formData = new FormData();
    formData.append('projectName', projectName);
    formData.append('projectNumber', projectNumber);
    formData.append('year', year);
    formData.append('startDate', startDate);
    formData.append('days', days);
    formData.append('fileData', fileData);
    formData.append('latitude', lat);
    formData.append('longitude', lng);

    fetch('/api/tmc', {
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
                        <strong>Data Source: </strong><a href="/api/tmc/download/${marker.id}">download data</a>
                    </div>
                `;

                const savedInfoWindow = new google.maps.InfoWindow({
                    content: savedInfoContent
                });

                savedInfoWindow.open(map, marker);
                currentInfoWindow = savedInfoWindow; // 更新当前打开的信息窗口
            });

            // 立即更新当前打开的信息窗口的内容
            if (currentInfoWindow) {
                currentInfoWindow.close();
            }
            infoWindow.setContent(`
                <div>
                    <strong>Project Name:</strong> ${projectName}<br>
                    <strong>Project Number:</strong> ${projectNumber}<br>
                    <strong>Year:</strong> ${year}<br>
                    <strong>Start Date:</strong> ${startDate}<br>
                    <strong>Duration:</strong> ${days} <strong>days</strong><br>
                    <strong>Data Source: </strong><a href="/api/tmc/download/${marker.id}">download data</a>
                </div>
            `);
            currentInfoWindow = infoWindow; // 更新当前打开的信息窗口
        });
}

// 显示信息输入框
function showInfoInput(marker) {
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
            
            <button id="saveMarkerBtn">SAVE</button>
        </div>
    `;

    const infoWindow = new google.maps.InfoWindow({
        content: infoInputHTML
    });

    let isSaved = false; // 用于跟踪标记是否已保存

    // 修改showInfoInput函数中的保存按钮点击事件
    infoWindow.addListener('domready', () => {
        document.getElementById('saveMarkerBtn').addEventListener('click', function (event) {
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

            saveMarker(projectName, projectNumber, year, startDate, days, fileData, latitude, longitude, marker, infoWindow); // 保存标记

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
                    <strong>Data Source: </strong><a href="/api/tmc/download/${marker.id}">download data</a>
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

loadMarkersFromDatabase();