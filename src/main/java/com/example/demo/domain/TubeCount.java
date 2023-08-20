package com.example.demo.domain;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;
@Data
@Entity
@Table(name = "tube_count")
public class TubeCount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double latitude;

    private Double longitude;

    @Column(name = "project_name")
    private String projectName;

    @Column(name = "project_number")
    private String projectNumber;

    private Integer year;

    @Temporal(TemporalType.DATE)
    @Column(name = "start_date")
    private Date startDate;

    private Integer days;

    @Lob
    @Column(name = "file_data")
    private byte[] fileData;

    public TubeCount() {
    }

    public TubeCount(Long id, Double latitude, Double longitude, String projectName, String projectNumber, Integer year, Date startDate, Integer days, byte[] fileData) {
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.projectName = projectName;
        this.projectNumber = projectNumber;
        this.year = year;
        this.startDate = startDate;
        this.days = days;
        this.fileData = fileData;
    }
}


