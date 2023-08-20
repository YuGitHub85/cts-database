package com.example.demo.service;

import com.example.demo.domain.TubeCount;
import com.example.demo.repository.TubeCountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TubeCountService {

    private final TubeCountRepository tubeCountRepository;

    @Autowired
    public TubeCountService(TubeCountRepository tubeCountRepository) {
        this.tubeCountRepository = tubeCountRepository;
    }

    public List<TubeCount> getAllTrafficCounts() {
        return tubeCountRepository.findAll();
    }

    public TubeCount getTrafficCountById(Long id) {
        return tubeCountRepository.findById(id).orElse(null);
    }

    public TubeCount getZipTrafficCountById(Long id) {
        TubeCount tubeCount = getTrafficCountById(id);
        if (tubeCount != null && isZipFile(tubeCount.getFileData())) {
            return tubeCount;
        } else {
            // Handle the case where the fileData is not a ZIP file
            // For example, you can log a warning or throw an exception
            return null;
        }
    }

    public TubeCount saveTrafficCount(TubeCount tubeCount) {
        return tubeCountRepository.save(tubeCount);
    }

    public void deleteTrafficCount(Long id) {
        tubeCountRepository.deleteById(id);
    }

    public boolean isZipFile(byte[] fileData) {
        if (fileData == null || fileData.length < 4) {
            return false;
        }

        // ZIP文件的字节签名
        byte[] zipSignature = {0x50, 0x4B, 0x03, 0x04};

        for (int i = 0; i < 4; i++) {
            if (fileData[i] != zipSignature[i]) {
                return false;
            }
        }

        return true;
    }
}
