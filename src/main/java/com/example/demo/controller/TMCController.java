package com.example.demo.controller;

import com.example.demo.domain.TMC;
import com.example.demo.service.TMCService;
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
@RequestMapping("/api/tmc")
public class TMCController {

    private final TMCService TMCService;

    @Autowired
    public TMCController(TMCService TMCService) {
        this.TMCService = TMCService;
    }

    @GetMapping
    public List<TMC> getAllTrafficCounts() {
        return TMCService.getAllTrafficCounts();
    }

    @GetMapping("/{id}")
    public TMC getTrafficCountById(@PathVariable Long id) {
//        return trafficCountService.getTrafficCountById(id);
        return TMCService.getZipTrafficCountById(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public TMC createTrafficCount(
            @RequestParam("projectName") String projectName,
            @RequestParam("projectNumber") String projectNumber,
            @RequestParam("year") Integer year,
            @RequestParam("startDate") @DateTimeFormat(pattern="yyyy-MM-dd") Date startDate,
            @RequestParam("days") Integer days,
            @RequestParam("fileData") MultipartFile fileData,
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude
    ) throws IOException {
        TMC TMC = new TMC();
        TMC.setProjectName(projectName);
        TMC.setProjectNumber(projectNumber);
        TMC.setYear(year);
        TMC.setStartDate(startDate);
        TMC.setDays(days);
        TMC.setLatitude(latitude);
        TMC.setLongitude(longitude);
        if (fileData != null && !fileData.isEmpty()) {
            TMC.setFileData(fileData.getBytes());
        }
        return TMCService.saveTrafficCount(TMC);
    }


    @PutMapping("/{id}")
    public TMC updateTrafficCount(@PathVariable Long id, @RequestBody TMC TMC) {
        TMC.setId(id);
        return TMCService.saveTrafficCount(TMC);
    }

    @DeleteMapping("/{id}")
    public void deleteTrafficCount(@PathVariable Long id) {
        TMCService.deleteTrafficCount(id);
    }

    /**
     * Endpoint to download the file data associated with a specific TrafficCount ID.
     *
     * @param id The ID of the TrafficCount whose file data is to be downloaded.
     * @return The file data as a byte array, or a 404 Not Found response if the TrafficCount or its file data is not found.
     */
    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadFileData(@PathVariable Long id) {
        TMC TMC = TMCService.getTrafficCountById(id);
        if (TMC != null && TMC.getFileData() != null) {
            byte[] fileData = TMC.getFileData();

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
