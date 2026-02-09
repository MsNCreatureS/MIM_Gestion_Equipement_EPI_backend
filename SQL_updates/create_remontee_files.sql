-- 4. Create the remontee_files table
CREATE TABLE IF NOT EXISTS remontee_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    remontee_id INT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100),
    file_size INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (remontee_id) REFERENCES remontees(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
