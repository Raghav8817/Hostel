-- Hostel Management Database Schema for MySQL / Aiven DB

CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    middlename VARCHAR(100),
    lastname VARCHAR(100) NOT NULL,
    gender VARCHAR(20),
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'student',
    profile_pic LONGTEXT,
    bio LONGTEXT,
    fathername VARCHAR(255),
    fatherphone VARCHAR(15),
    course VARCHAR(50),
    year INT,
    room_number VARCHAR(20),
    status VARCHAR(20) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    middlename VARCHAR(100),
    lastname VARCHAR(100) NOT NULL,
    gender VARCHAR(20),
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    middlename VARCHAR(100),
    lastname VARCHAR(100) NOT NULL,
    gender VARCHAR(20),
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'staff',
    work_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students_profile_pic (
    username VARCHAR(255) PRIMARY KEY,
    profile_pic LONGTEXT
);

CREATE TABLE IF NOT EXISTS admin_profile_pics (
    admin_username VARCHAR(255) PRIMARY KEY,
    image_data LONGTEXT
);

CREATE TABLE IF NOT EXISTS staff_profile_pics (
    staff_username VARCHAR(255) PRIMARY KEY,
    image_data LONGTEXT
);

CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(10) UNIQUE NOT NULL,
    room_type VARCHAR(50) DEFAULT 'Double',
    capacity INT NOT NULL,
    current_occupancy INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Available'
);

CREATE TABLE IF NOT EXISTS room_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    room_number VARCHAR(10) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students_complaint (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    room_number VARCHAR(10),
    description TEXT,
    photo LONGTEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    admin_remark TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students_leave (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    room_number VARCHAR(10),
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    destination VARCHAR(255),
    reason TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students_notification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students_food_review (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    rating INT NOT NULL,
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mess_menu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day VARCHAR(15) UNIQUE NOT NULL,
    breakfast TEXT,
    lunch TEXT,
    evening_snacks TEXT,
    dinner TEXT,
    milk VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS otp_verifications (
    email VARCHAR(255) PRIMARY KEY,
    otp VARCHAR(6) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed Mess Menu
INSERT INTO mess_menu (day, breakfast, lunch, evening_snacks, dinner, milk) 
VALUES 
('SUNDAY', 'IDLI SAMBHAR', 'MATAR PANEER, AALOO JHOL, RAITA, POORI, SALAD, PICKLE', 'TEA', 'CHHOLE, PULAO, VEGETABLES, CHAPATI, SALAD, PICKLE', '1 GLASS'),
('MONDAY', 'AALOO PARATHA, PICKLE, TEA', 'ARHAR DAL, VEGETABLES, RICE, CHAPATI, SALAD, PICKLE', 'BISCUIT, TEA', 'CHANA DAAL, VEGETABLES, CHAPATI, SALAD, PICKLE', '1 GLASS'),
('TUESDAY', 'MACARONI, TEA', 'CHHOLE SABJI, RICE, CHAPATI, SALAD, PICKLE', 'BURGER, TEA', 'MOONG MASOOR DAL, VEGETABLES, CHAPATI, SALAD, PICKLE', '1 GLASS'),
('WEDNESDAY', 'POORI, SABJI, TEA', 'DAL MAKHNI, VEGETABLES, RICE, CHAPATI, SALAD, PICKLE', 'BISCUIT, TEA', 'KALI URAD + CHANA DAAL, VEGETABLES, CHAPATI, SALAD', '1 GLASS'),
('THURSDAY', 'POHA/ CHOWMEIN', 'RAJMA, VEGETABLES, FRIED RICE, CHAPATI, SALAD, PICKLE', 'BREAD PAKORA, TEA', 'MIX DAAL, VEGETABLES, CHAPATI, SALAD, PICKLE', '1 GLASS'),
('FRIDAY', 'SANDWICH, BREAD JAM, TEA', 'CURRY PAKORA, JEERA AALOO, RICE, CHAPATI, SALAD, PICKLE', 'NAMKEEN, TEA', 'ARHAR DAAL, VEGETABLES, CHAPATI, SALAD, PICKLE', '1 GLASS'),
('SATURDAY', 'CHHOLE BHATURE/ PARATHA, TEA', 'BLACK CHANA, VEGETABLES, RICE, CHAPATI, SALAD, PICKLE', 'MOMOS, TEA', 'DHULI URAD + CHANA DAAL, VEGETABLES, CHAPATI, SALAD, PICKLE', '1 GLASS')
ON DUPLICATE KEY UPDATE breakfast=VALUES(breakfast), lunch=VALUES(lunch), evening_snacks=VALUES(evening_snacks), dinner=VALUES(dinner), milk=VALUES(milk);

-- Seed Initial Sample Rooms
INSERT INTO rooms (room_number, room_type, capacity, current_occupancy, status)
VALUES
('101', 'Double', 2, 0, 'Available'),
('102', 'Double', 2, 0, 'Available'),
('103', 'Single AC', 1, 0, 'Available'),
('104', 'Double AC', 2, 0, 'Available'),
('105', 'Triple', 3, 0, 'Available')
ON DUPLICATE KEY UPDATE room_type=VALUES(room_type);
