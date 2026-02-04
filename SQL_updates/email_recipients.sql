USE mim_feedback;

CREATE TABLE IF NOT EXISTS email_recipients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default recipient if not exists
INSERT IGNORE INTO email_recipients (email, name) VALUES ('erwan.gimenez@foselev.fr', 'Erwan Gimenez');
