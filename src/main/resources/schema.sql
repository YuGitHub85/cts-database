CREATE TABLE IF NOT EXISTS tmc_count(
    id INT AUTO_INCREMENT PRIMARY KEY,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    project_number VARCHAR(255) NOT NULL,
    year YEAR NOT NULL,
    start_date DATE NOT NULL,
    days TINYINT NOT NULL,
    file_data LONGBLOB NOT NULL
);

CREATE TABLE IF NOT EXISTS tube_count(
    id INT AUTO_INCREMENT PRIMARY KEY,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    project_number VARCHAR(255) NOT NULL,
    year YEAR NOT NULL,
    start_date DATE NOT NULL,
    days TINYINT NOT NULL,
    file_data LONGBLOB NOT NULL
    );
