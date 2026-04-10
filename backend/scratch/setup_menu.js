const db = require('../config/db');

const createTableSql = `
    CREATE TABLE IF NOT EXISTS mess_menu (
        id INT AUTO_INCREMENT PRIMARY KEY,
        day VARCHAR(15) UNIQUE NOT NULL,
        breakfast TEXT,
        lunch TEXT,
        evening_snacks TEXT,
        dinner TEXT,
        milk VARCHAR(50)
    )
`;

const menuData = [
    ['SUNDAY', 'IDLI SAMBHAR', 'MATAR PANEER, AALOO JHOL, RAITA, POORI, SALAD, PICKLE', 'TEA', 'CHHOLE, PULAO, VEGETABLES, CHAPATI, SALAD, PICKLE', '1 GLASS'],
    ['MONDAY', 'AALOO PARATHA, PICKLE, TEA', 'ARHAR DAL, VEGETABLES, RICE, CHAPATI, SALAD, PICKLE', 'BISCUIT, TEA', 'CHANA DAAL, VEGETABLES, CHAPATI, SALAD, PICKLE', '1 GLASS'],
    ['TUESDAY', 'MACARONI, TEA', 'CHHOLE SABJI, RICE, CHAPATI, SALAD, PICKLE', 'BURGER, TEA', 'MOONG MASOOR DAL, VEGETABLES, CHAPATI, SALAD, PICKLE', '1 GLASS'],
    ['WEDNESDAY', 'POORI, SABJI, TEA', 'DAL MAKHNI, VEGETABLES, RICE, CHAPATI, SALAD, PICKLE', 'BISCUIT, TEA', 'KALI URAD + CHANA DAAL, VEGETABLES, CHAPATI, SALAD', '1 GLASS'],
    ['THURSDAY', 'POHA/ CHOWMEIN', 'RAJMA, VEGETABLES, FRIED RICE, CHAPATI, SALAD, PICKLE', 'BREAD PAKORA, TEA', 'MIX DAAL, VEGETABLES, CHAPATI, SALAD, PICKLE', '1 GLASS'],
    ['FRIDAY', 'SANDWICH, BREAD JAM, TEA', 'CURRY PAKORA, JEERA AALOO, RICE, CHAPATI, SALAD, PICKLE', 'NAMKEEN, TEA', 'ARHAR DAAL, VEGETABLES, CHAPATI, SALAD, PICKLE', '1 GLASS'],
    ['SATURDAY', 'CHHOLE BHATURE/ PARATHA, TEA', 'BLACK CHANA, VEGETABLES, RICE, CHAPATI, SALAD, PICKLE', 'MOMOS, TEA', 'DHULI URAD + CHANA DAAL, VEGETABLES, CHAPATI, SALAD, PICKLE', '1 GLASS']
];

const insertSql = `
    INSERT INTO mess_menu (day, breakfast, lunch, evening_snacks, dinner, milk) 
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
        breakfast = VALUES(breakfast), 
        lunch = VALUES(lunch), 
        evening_snacks = VALUES(evening_snacks), 
        dinner = VALUES(dinner), 
        milk = VALUES(milk)
`;

db.query(createTableSql, (err) => {
    if (err) {
        console.error('Error creating table:', err);
        process.exit(1);
    }
    console.log('Table mess_menu created or already exists.');

    let completed = 0;
    menuData.forEach((row) => {
        db.query(insertSql, row, (err) => {
            if (err) {
                console.error(`Error inserting data for ${row[0]}:`, err);
            } else {
                console.log(`Data for ${row[0]} inserted/updated.`);
            }
            completed++;
            if (completed === menuData.length) {
                console.log('Menu setup complete.');
                db.end();
            }
        });
    });
});
