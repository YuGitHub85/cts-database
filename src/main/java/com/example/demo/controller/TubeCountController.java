package com.example.demo.controller;

import com.example.demo.domain.TubeCount;
import com.example.demo.service.TubeCountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/tubecount")
public class TubeCountController {

    private final TubeCountService tubeCountService;

    @Autowired
    public TubeCountController(TubeCountService tubeCountService) {
        this.tubeCountService = tubeCountService;
    }

    @GetMapping
    public List<TubeCount> getAllTrafficCounts() {
        return tubeCountService.getAllTrafficCounts();
    }

    @GetMapping("/{id}")
    public TubeCount getTrafficCountById(@PathVariable Long id) {
        return tubeCountService.getZipTrafficCountById(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public TubeCount createTrafficCount(
            @RequestParam("projectName") String projectName,
            @RequestParam("projectNumber") String projectNumber,
            @RequestParam("year") Integer year,
            @RequestParam("startDate") @DateTimeFormat(pattern="yyyy-MM-dd") Date startDate,
            @RequestParam("days") Integer days,
            @RequestParam("fileData") MultipartFile fileData,
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude
    ) throws IOException {
        TubeCount tubeCount = new TubeCount();
        tubeCount.setProjectName(projectName);
        tubeCount.setProjectNumber(projectNumber);
        tubeCount.setYear(year);
        tubeCount.setStartDate(startDate);
        tubeCount.setDays(days);
        tubeCount.setLatitude(latitude);
        tubeCount.setLongitude(longitude);
        if (fileData != null && !fileData.isEmpty()) {
            tubeCount.setFileData(fileData.getBytes());
        }
        return tubeCountService.saveTrafficCount(tubeCount);
    }

    @PutMapping("/{id}")
    public TubeCount updateTrafficCount(@PathVariable Long id, @RequestBody TubeCount tubeCount) {
        tubeCount.setId(id);
        return tubeCountService.saveTrafficCount(tubeCount);
    }

    @DeleteMapping("/{id}")
    public void deleteTrafficCount(@PathVariable Long id) {
        tubeCountService.deleteTrafficCount(id);
    }

    /**
     * Endpoint to download the file data associated with a specific TrafficCount ID.
     *
     * @param id The ID of the TrafficCount whose file data is to be downloaded.
     * @return The file data as a byte array, or a 404 Not Found response if the TrafficCount or its file data is not found.
     */
    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadFileData(@PathVariable Long id) {
        TubeCount tubeCount = tubeCountService.getTrafficCountById(id);
        if (tubeCount != null && tubeCount.getFileData() != null) {
            byte[] fileData = tubeCount.getFileData();

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=trafficData-" + id + ".zip");  // 设置文件名为.zip格式
            headers.add(HttpHeaders.CONTENT_TYPE, "application/zip");  // 设置文件类型为ZIP

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(fileData);
        } else {
            return ResponseEntity.notFound().build();  // 如果找不到文件或文件数据为空，则返回404 Not Found
        }
    }
}
