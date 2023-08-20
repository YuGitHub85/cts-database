package com.example.demo.service;

import com.example.demo.domain.TMC;
import com.example.demo.repository.TMCRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TMCService {

    private final com.example.demo.repository.TMCRepository TMCRepository;

    @Autowired
    public TMCService(TMCRepository TMCRepository) {
        this.TMCRepository = TMCRepository;
    }

    public List<TMC> getAllTrafficCounts() {
        return TMCRepository.findAll();
    }

    public TMC getTrafficCountById(Long id) {
        return TMCRepository.findById(id).orElse(null);
    }

    public TMC getZipTrafficCountById(Long id) {
        TMC TMC = getTrafficCountById(id);
        if (TMC != null && isZipFile(TMC.getFileData())) {
            return TMC;
        } else {
            // Handle the case where the fileData is not a ZIP file
            // For example, you can log a warning or throw an exception
            return null;
        }
    }
    public TMC saveTrafficCount(TMC TMC) {
        return TMCRepository.save(TMC);
    }

    public void deleteTrafficCount(Long id) {
        TMCRepository.deleteById(id);
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

