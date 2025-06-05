const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5136;

app.use(cors());
app.use(express.json());


// MySQL Database connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'C#@ndu123',
    database: 'demo'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    } else {
        console.log('Connected to MySQL database');
    }
});

// Secret key for JWT (should be stored securely in production)
const JWT_SECRET = 'your_jwt_secret_key';

// Register Route
app.post('/register', async (req, res) => {
    const { name, username, password, dob } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
        'INSERT INTO users (name, username, password, dob) VALUES (?, ?, ?, ?)',
        [name, username, hashedPassword, dob],
        (err, result) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(400).send('Error registering user');
            }
            res.status(201).send('User registered');
        }
    );
});
// Register Admin Route (Optional)
app.post('/register=admin', async (req, res) => {
    const { name, username, password, dob } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
        'INSERT INTO admins (name, username, password, dob) VALUES (?, ?, ?, ?)',
        [name, username, hashedPassword, dob],
        (err, result) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(400).send('Error registering user');
            }
            res.status(201).send('User registered');
        }
    );
});

// Add New Product (Admin Action)
app.post('/add-product', async (req, res) => {
    const { title, price, username } = req.body;
  
    // Create a new table with the username if it doesn't exist
    db.query(
      `CREATE TABLE IF NOT EXISTS ${username} (
        id INT AUTO_INCREMENT,
        product_id INT,
        price INT,
        PRIMARY KEY (id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      )`,
      (err, result) => {
        if (err) {
          console.error('Error creating table:', err);
          return res.status(400).send('Error creating table');
        }
  
        // Insert data into the products table
        db.query(
          'INSERT INTO products (title, price ,sellername) VALUES (?, ?, ?)',
          [title, price, username],
          (err, result) => {
            if (err) {
              console.error('Error adding product:', err);
              return res.status(400).send('Error adding product');
            }
  
            // Insert data into the username table
            const productId = result.insertId;
            db.query(
              `INSERT INTO ${username} (product_id,title,price) VALUES (? ,? ,?)`,
              [productId, title , price],
              (err, result) => {
                if (err) {
                  console.error('Error inserting into username table:', err);
                  return res.status(400).send('Error inserting into username table');
                }
  
                res.status(201).send('Product added successfully');
              }
            );
          }
        );
      }
    );
  });



// Login Route
app.post('/login', async (req, res) => {
    const { username, password, type } = req.body;
    let tableName = '';

    // Determine which table to query: 'users' or 'admins'
    if (type === 'user') {
        tableName = 'users';
    } else if (type === 'admin') {
        tableName = 'admins';
    } else {
        return res.status(400).send('Invalid user type');
    }

    // Query the respective table based on user type
    db.query(
        `SELECT * FROM ${tableName} WHERE ${type === 'user' ? 'username' : 'adminname'} = ?`,
        [username],
        async (err, results) => {
            if (err) {
                console.error('Error querying:', err);
                return res.status(500).send('Server error');
            }

            if (results.length > 0) {
                const user = results[0];
                // Compare provided password with hashed password in DB
                const isMatch = await bcrypt.compare(password, user.password);

                if (isMatch) {
                    // Generate JWT token after successful login
                    const token = jwt.sign({ id: user.id, type }, 'secretKey', { expiresIn: '1h' });
                    return res.status(200).json({ token });
                }
            }

            // If credentials are invalid
            res.status(400).send('Invalid credentials');
        }
    );
});


// Middleware to authenticate users using JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).send('Access denied');
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }

        req.user = user;
        next();
    });
};

// Fetch User Details Route
app.get('/user-details', (req, res) => {
    const { username } = req.body;

    // Query the database for the user details
    db.query(
        `SELECT * FROM users WHERE username= ${username}`,
        (err, results) => {
            if (err) {
                console.error('Error fetching user details:', err);
                return res.status(500).send('Error fetching user details');
            }

            if (results.length > 0) {
                return res.json(result);
            } else {
                return res.status(404).send('User not found');
            }
        }
    );
});

// Fetch Products for Dashboard (for both User and Admin)
app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, result) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).send('Error fetching products');
        }
        else{
            res.send(result);
        }
    });
});

// Fetch All Users (Admin Dashboard)
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, result) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).send('Error fetching users');
        }
        res.send(result);
    });
});



// Purchase Product (User Action)
app.post('/buy', (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id; // Use authenticated user's id

    db.query('INSERT INTO asserts (user_id, product_id) VALUES (?, ?)', [userId, productId], (err, result) => {
        if (err) {
            console.error('Error buying product:', err);
            return res.status(500).send('Error buying product');
        }
        res.status(201).send('Product purchased');
    });
});

// userassert
app.get('/userassert', (req, res) => {
    const { username } = req.query; // Get username from query parameters
    console.log('Received username:', username); // Debugging log

    if (!username) {
        return res.status(400).send('Username is required');
    }

    // Query the table corresponding to the username
    const query = `SELECT id, product_id, title, price FROM ${username}`; // Assuming each user has a table named after their username
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching asserts:', err);
            return res.status(500).send('Error fetching asserts');
        }
        console.log('Query executed:',result);
        res.json(result); // Send the result back to the client
    });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

