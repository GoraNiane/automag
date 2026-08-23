import mysql from 'mysql2';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool to MariaDB
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '2004',
  database: process.env.DB_DATABASE || 'automag',
  port: parseInt(process.env.DB_PORT || '3308'),
  connectionLimit: 10,
  multipleStatements: true
});

// Check database connection at startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Failed to connect to MariaDB database:', err.message);
    console.error('Full connection error object:', err);
  } else {
    console.log(`Connected to MariaDB database successfully.`);
    connection.release();
    initializeDatabase();
  }
});

// SQLite-compatible callback wrapper for mysql2
const db = {
  serialize(callback: () => void) {
    // MySQL handles parallel execution automatically; we run the callback immediately
    callback();
  },

  run(sql: string, params?: any[] | any, callback?: (err: Error | null) => void) {
    let actualParams = params;
    let actualCallback = callback;
    if (typeof params === 'function') {
      actualCallback = params;
      actualParams = [];
    }

    pool.query(sql, actualParams || [], function (err, results: any) {
      if (err) {
        if (actualCallback) actualCallback.call({}, err);
        return;
      }
      const context = {
        changes: results.affectedRows || 0,
        lastID: results.insertId || null
      };
      if (actualCallback) actualCallback.call(context, null);
    });
  },

  get(sql: string, params?: any[] | any, callback?: (err: Error | null, row: any) => void) {
    let actualParams = params;
    let actualCallback = callback;
    if (typeof params === 'function') {
      actualCallback = params;
      actualParams = [];
    }

    pool.query(sql, actualParams || [], (err, results: any) => {
      if (err) {
        if (actualCallback) actualCallback(err, null);
        return;
      }
      const row = results && results.length > 0 ? results[0] : undefined;
      if (actualCallback) actualCallback(null, row);
    });
  },

  all(sql: string, params?: any[] | any, callback?: (err: Error | null, rows: any[]) => void) {
    let actualParams = params;
    let actualCallback = callback;
    if (typeof params === 'function') {
      actualCallback = params;
      actualParams = [];
    }

    pool.query(sql, actualParams || [], (err, results: any) => {
      if (err) {
        if (actualCallback) actualCallback(err, []);
        return;
      }
      if (actualCallback) actualCallback(null, results);
    });
  }
};

function initializeDatabase() {
  db.serialize(() => {
    // 1. Users Table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        avatar VARCHAR(255),
        location VARCHAR(255),
        createdAt VARCHAR(100) NOT NULL
      )
    `);

    // 2. Vehicles Table
    db.run(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id VARCHAR(255) PRIMARY KEY,
        brand VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        year INT NOT NULL,
        price INT NOT NULL,
        mileage INT NOT NULL,
        fuel VARCHAR(50) NOT NULL,
        transmission VARCHAR(50) NOT NULL,
        bodyType VARCHAR(50) NOT NULL,
        color VARCHAR(100),
        location VARCHAR(100) NOT NULL,
        power VARCHAR(50),
        description TEXT,
        equipments TEXT, -- Comma-separated options
        images TEXT, -- Comma-separated URLs
        primaryImage VARCHAR(255) NOT NULL,
        \`condition\` VARCHAR(100) NOT NULL,
        isFeatured INT DEFAULT 0,
        isPromo INT DEFAULT 0,
        availability VARCHAR(100) DEFAULT 'Disponible'
      )
    `);

    // 3. Listings Table
    db.run(`
      CREATE TABLE IF NOT EXISTS listings (
        id VARCHAR(255) PRIMARY KEY,
        vehicleId VARCHAR(255) UNIQUE NOT NULL,
        sellerId VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        createdAt VARCHAR(100) NOT NULL,
        views INT DEFAULT 0,
        isPromoted INT DEFAULT 0,
        FOREIGN KEY (vehicleId) REFERENCES vehicles(id) ON DELETE CASCADE,
        FOREIGN KEY (sellerId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 3.5 Sales Table
    db.run(`
      CREATE TABLE IF NOT EXISTS sales (
        id VARCHAR(255) PRIMARY KEY,
        vehicleId VARCHAR(255) NOT NULL,
        salePrice INT NOT NULL,
        buyerName VARCHAR(255) NOT NULL,
        buyerPhone VARCHAR(50),
        saleDate VARCHAR(100) NOT NULL,
        invoiceNumber VARCHAR(255) UNIQUE NOT NULL,
        FOREIGN KEY (vehicleId) REFERENCES vehicles(id) ON DELETE CASCADE
      )
    `);

    // 4. Contact Requests Table
    db.run(`
      CREATE TABLE IF NOT EXISTS contact_requests (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) NOT NULL,
        createdAt VARCHAR(100) NOT NULL
      )
    `);

    // Migration : s'assurer que toutes les catégories (availability) sont valides
    db.run(`
      UPDATE vehicles 
      SET availability = 'Disponible' 
      WHERE availability NOT IN ('Disponible', 'Sous douane', 'Sur commande') OR availability IS NULL
    `, (err: any) => {
      if (err) {
        console.error('Failed to run categories migration:', err.message);
      } else {
        console.log('Categories migration checked/applied successfully.');
      }
    });

    // Seed Data
    seedData();
  });
}

function seedData() {
  db.get('SELECT COUNT(*) as count FROM users', (err: any, row: any) => {
    if (err) return console.error(err);

    if (!row || row.count === 0) {
      console.log('Seeding database tables...');
      
      // 1. Admin Account
      const adminId = 'usr-admin';
      const adminEmail = 'admin@autoelite.sn';
      bcrypt.hash('adminpassword', 10, (hashErr, hashedPassword) => {
        if (hashErr || !hashedPassword) return console.error('Hashing password failed');
        
        db.run(
          `INSERT INTO users (id, email, password, firstName, lastName, role, avatar, location, createdAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            adminId,
            adminEmail,
            hashedPassword,
            'Ibrahima',
            'Diallo',
            'ADMIN',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            'Dakar',
            new Date().toISOString()
          ],
          (insertErr) => {
            if (insertErr) return console.error('Failed to insert seed admin user:', insertErr.message);
            insertSeedVehicles(adminId);
          }
        );
      });
    }
  });
}

function insertSeedVehicles(adminId: string) {
  // 2. Initial Seed Vehicles
  const initialVehicles = [
    {
      id: 'veh-1',
      brand: 'Mercedes-Benz',
      model: 'Classe C 200',
      year: 2021,
      price: 18500000,
      mileage: 45000,
      fuel: 'Diesel',
      transmission: 'Automatique',
      bodyType: 'Berline',
      color: 'Noir Obsidienne',
      location: 'Dakar',
      power: '197 ch',
      description: 'Mercedes-Benz Classe C 200 de 2021 dans un état irréprochable. Entretien exclusif chez le concessionnaire. Pack AMG intérieur et extérieur, phares LED intelligents, grand écran multimédia tactile MBUX avec navigation, radars de recul 360°, régulateur de vitesse adaptatif, toit ouvrant panoramique.',
      equipments: 'Climatisation,GPS,Caméra de recul,Bluetooth,Jantes alliage,Démarrage sans clé,Toit panoramique,Radars 360,Aide au parking,Régulateur de vitesse',
      images: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1617531653310-9c2bbf5697d2?auto=format&fit=crop&q=80&w=800',
      primaryImage: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800',
      condition: 'Occasion Europe',
      isFeatured: 1,
      isPromo: 0,
      availability: 'Disponible'
    },
    {
      id: 'veh-2',
      brand: 'Toyota',
      model: 'RAV4 Hybrid',
      year: 2022,
      price: 22000000,
      mileage: 28000,
      fuel: 'Hybride',
      transmission: 'Automatique',
      bodyType: 'SUV',
      color: 'Gris Métallisé',
      location: 'Dakar',
      power: '218 ch',
      description: 'Superbe Toyota RAV4 Hybride 2022 finition Limited. Consommation très faible idéale pour la ville et les longs trajets. Climatisation automatique bi-zone, grand écran tactile avec Apple CarPlay and Android Auto, sièges en cuir ventilés et chauffants, coffre électrique, jantes 18 pouces.',
      equipments: 'Climatisation,GPS,Caméra de recul,Bluetooth,Jantes alliage,Démarrage sans clé,Apple CarPlay,Sièges chauffants,Coffre électrique',
      images: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800',
      primaryImage: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800',
      condition: 'Occasion Sénégal',
      isFeatured: 1,
      isPromo: 1,
      availability: 'Sous douane'
    },
    {
      id: 'veh-3',
      brand: 'Ford',
      model: 'Ranger Wildtrak',
      year: 2020,
      price: 16800000,
      mileage: 72000,
      fuel: 'Diesel',
      transmission: 'Automatique',
      bodyType: '4x4',
      color: 'Orange Sablé',
      location: 'Mbour',
      power: '213 ch',
      description: 'Ford Ranger Wildtrak 2.0 Bi-Turbo 4x4. Idéal pour les pistes du Sénégal. Double cabine, rideau de benne électrique, intérieur cuir Wildtrak avec surpiqûres orange, climatisation bizone, caméra et radars de recul, contrôle de descente, attelage de remorque.',
      equipments: 'Climatisation,GPS,Caméra de recul,Bluetooth,Jantes alliage,Démarrage sans clé,Régulateur de vitesse,Attelage,Aide à la descente',
      images: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=800',
      primaryImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
      condition: 'Occasion Sénégal',
      isFeatured: 0,
      isPromo: 0,
      availability: 'Sur commande'
    },
    {
      id: 'veh-4',
      brand: 'Hyundai',
      model: 'Tucson',
      year: 2023,
      price: 24500000,
      mileage: 5000,
      fuel: 'Essence',
      transmission: 'Automatique',
      bodyType: 'SUV',
      color: 'Blanc Intense',
      location: 'Dakar',
      power: '180 ch',
      description: 'Hyundai Tucson 2023 flambant neuf, sous garantie concessionnaire au Sénégal. Version haut de gamme avec tableau de bord digital 10.25", toit ouvrant panoramique, éclairage d\'ambiance LED, chargeur smartphone par induction, hayon mains libres, jantes alu 19 pouces.',
      equipments: 'Climatisation,GPS,Caméra de recul,Bluetooth,Jantes alliage,Démarrage sans clé,Toit panoramique,Cockpit digital,Chargeur induction',
      images: 'https://images.unsplash.com/photo-1644781467475-3507d4b4a1b0?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1644781467406-896894d0c9f1?auto=format&fit=crop&q=80&w=800',
      primaryImage: 'https://images.unsplash.com/photo-1644781467475-3507d4b4a1b0?auto=format&fit=crop&q=80&w=800',
      condition: 'Neuf',
      isFeatured: 1,
      isPromo: 0,
      availability: 'Disponible'
    },
    {
      id: 'veh-5',
      brand: 'BMW',
      model: 'M4 Coupé',
      year: 2021,
      price: 35000000,
      mileage: 18000,
      fuel: 'Essence',
      transmission: 'Automatique',
      bodyType: 'Coupé',
      color: 'Bleu Yas Marina',
      location: 'Dakar',
      power: '431 ch',
      description: 'Magnifique BMW M4 Coupé de 2021 dans un état impeccable. Entièrement d\'origine, carnet d\'entretien complet. Affichage tête haute, système audio Harman Kardon, sièges sport M électriques à mémoire, caméras 360°.',
      equipments: 'Climatisation,GPS,Caméra de recul,Bluetooth,Jantes alliage,Sellerie cuir,Radars 360,Toit carbone',
      images: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800',
      primaryImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800',
      condition: 'Occasion Europe',
      isFeatured: 0,
      isPromo: 0,
      availability: 'Disponible',
      status: 'Vendue',
      sale: {
        salePrice: 34000000,
        buyerName: 'Mamadou Diop',
        buyerPhone: '+221 77 543 21 09',
        saleDate: '2025-06-15T14:30:00Z',
        invoiceNumber: 'FAC-2025-001'
      }
    },
    {
      id: 'veh-6',
      brand: 'Peugeot',
      model: '3008 GT Line',
      year: 2020,
      price: 14500000,
      mileage: 62000,
      fuel: 'Diesel',
      transmission: 'Automatique',
      bodyType: 'SUV',
      color: 'Gris Platinium',
      location: 'Dakar',
      power: '130 ch',
      description: 'Peugeot 3008 GT Line de 2020 en parfait état. Toit ouvrant panoramique, i-Cockpit digital, régulateur adaptatif, caméra de recul 180°, CarPlay et Android Auto.',
      equipments: 'Climatisation,GPS,Caméra de recul,Bluetooth,Jantes alliage,Toit panoramique,Apple CarPlay,Cockpit digital',
      images: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800',
      primaryImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800',
      condition: 'Occasion Sénégal',
      isFeatured: 0,
      isPromo: 0,
      availability: 'Disponible',
      status: 'Vendue',
      sale: {
        salePrice: 14500000,
        buyerName: 'Awa Ndiaye',
        buyerPhone: '+221 77 654 32 10',
        saleDate: '2025-06-20T10:15:00Z',
        invoiceNumber: 'FAC-2025-002'
      }
    }
  ];

  initialVehicles.forEach((v) => {
    db.run(
      `INSERT INTO vehicles (id, brand, model, year, price, mileage, fuel, transmission, bodyType, color, location, power, description, equipments, images, primaryImage, \`condition\`, isFeatured, isPromo, availability) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        v.id, v.brand, v.model, v.year, v.price, v.mileage, v.fuel, v.transmission, v.bodyType, v.color, v.location, v.power, v.description, v.equipments, v.images, v.primaryImage, v.condition, v.isFeatured, v.isPromo, v.availability
      ],
      (errVeh) => {
        if (errVeh) return console.error('Failed to seed vehicle:', errVeh.message);

        const status = (v as any).status || 'Publiée';
        db.run(
          `INSERT INTO listings (id, vehicleId, sellerId, status, createdAt, views, isPromoted) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            `lst-${v.id.split('-')[1]}`,
            v.id,
            adminId,
            status,
            new Date().toISOString(),
            Math.floor(Math.random() * 500) + 50,
            v.isFeatured
          ],
          (errList) => {
            if (!errList && status === 'Vendue' && (v as any).sale) {
              const sale = (v as any).sale;
              db.run(
                `INSERT INTO sales (id, vehicleId, salePrice, buyerName, buyerPhone, saleDate, invoiceNumber)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                  `sal-${v.id.split('-')[1]}`,
                  v.id,
                  sale.salePrice,
                  sale.buyerName,
                  sale.buyerPhone,
                  sale.saleDate,
                  sale.invoiceNumber
                ]
              );
            }
          }
        );
      }
    );
  });

  console.log('Database seeding completed successfully.');
}

export default db;
