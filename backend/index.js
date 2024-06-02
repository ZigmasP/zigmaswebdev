require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cors = require("cors");
const helmet = require("helmet");
const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Klaida jungiantis prie duomenų bazės:", err);
    return;
  }
  console.log("Sėkmingai prisijungta prie MariaDB duomenų bazės.");
});

// Ensure the uploads directory exists
if (!fs.existsSync('uploads/')) {
  fs.mkdirSync('uploads/');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get("/gallery", (req, res) => {
  fs.readdir("uploads/", (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to load gallery" });
    }
    res.status(200).json(files);
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  res.json({ accessToken });
});

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

app.post("/send", authenticateToken, async (req, res) => {
  const { name, phone, service, message } = req.body;
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: "New Contact Form Submission",
      text: `
        Vardas: ${name}
        Telefono nr.: ${phone}
        Paslauga: ${service}
        Žinutė: ${message}
      `,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "El. laiškas išsiųstas sėkmingai!" });
  } catch (error) {
    console.error("Klaida siunčiant el. laišką:", error);
    res.status(500).json({ error: "Įvyko klaida siunčiant el. laišką." });
  }
});

// CRUD operacijos failams
app.post("/files", authenticateToken, upload.single("file"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "Failas neįkeltas" });
  }

  const sql = "INSERT INTO files (filename, filepath) VALUES (?, ?)";
  db.query(sql, [file.filename, file.path], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Klaida išsaugant failą duomenų bazėje" });
    }
    res
      .status(201)
      .json({ message: "Failas įkeltas ir sėkmingai išsaugotas", file });
  });
});

app.get("/files", (req, res) => {
  const sql = "SELECT * FROM files";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to load files" });
    }
    res.status(200).json(results);
  });
});

app.get("/files/:id", (req, res) => {
  const sql = "SELECT * FROM files WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to load file" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }
    res.status(200).json(result[0]);
  });
});

app.put("/files/:id", authenticateToken, (req, res) => {
  const { filename } = req.body;
  const sql = "UPDATE files SET filename = ? WHERE id = ?";
  db.query(sql, [filename, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to update file" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "File not found" });
    }
    res.staturequire("dotenv").config();
    const express = require("express");
    const mysql = require("mysql2");
    const bodyParser = require("body-parser");
    const multer = require("multer");
    const nodemailer = require("nodemailer");
    const cors = require("cors");
    const helmet = require("helmet");
    const { google } = require("googleapis");
    const jwt = require("jsonwebtoken");
    const fs = require("fs");
    const path = require("path");
    
    const app = express();
    const port = process.env.PORT || 5000;
    
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    
    const db = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    
    db.connect((err) => {
      if (err) {
        console.error("Klaida jungiantis prie duomenų bazės:", err);
        return;
      }
      console.log("Sėkmingai prisijungta prie MariaDB duomenų bazės.");
    });
    
    // Ensure the uploads directory exists
    if (!fs.existsSync('uploads/')) {
      fs.mkdirSync('uploads/');
    }
    
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "uploads/");
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    });
    const upload = multer({ storage });
    
    const authenticateToken = (req, res, next) => {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      if (token == null) return res.sendStatus(401);
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
      });
    };
    
    app.get("/gallery", (req, res) => {
      fs.readdir("uploads/", (err, files) => {
        if (err) {
          return res.status(500).json({ error: "Failed to load gallery" });
        }
        res.status(200).json(files);
      });
    });
    
    app.post("/login", (req, res) => {
      const username = req.body.username;
      const user = { name: username };
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.json({ accessToken });
    });
    
    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
    
    app.post("/send", authenticateToken, async (req, res) => {
      const { name, phone, service, message } = req.body;
      try {
        const accessToken = await oAuth2Client.getAccessToken();
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: process.env.EMAIL_USER,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken.token,
          },
        });
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.RECEIVER_EMAIL,
          subject: "New Contact Form Submission",
          text: `
            Vardas: ${name}
            Telefono nr.: ${phone}
            Paslauga: ${service}
            Žinutė: ${message}
          `,
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "El. laiškas išsiųstas sėkmingai!" });
      } catch (error) {
        console.error("Klaida siunčiant el. laišką:", error);
        res.status(500).json({ error: "Įvyko klaida siunčiant el. laišką." });
      }
    });
    
    // CRUD operacijos failams
    app.post("/files", authenticateToken, upload.single("file"), (req, res) => {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "Failas neįkeltas" });
      }
    
      const sql = "INSERT INTO files (filename, filepath) VALUES (?, ?)";
      db.query(sql, [file.filename, file.path], (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Klaida išsaugant failą duomenų bazėje" });
        }
        res
          .status(201)
          .json({ message: "Failas įkeltas ir sėkmingai išsaugotas", file });
      });
    });
    
    app.get("/files", (req, res) => {
      const sql = "SELECT * FROM files";
      db.query(sql, (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Failed to load files" });
        }
        res.status(200).json(results);
      });
    });
    
    app.get("/files/:id", (req, res) => {
      const sql = "SELECT * FROM files WHERE id = ?";
      db.query(sql, [req.params.id], (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Failed to load file" });
        }
        if (result.length === 0) {
          return res.status(404).json({ message: "File not found" });
        }
        res.status(200).json(result[0]);
      });
    });
    
    app.put("/files/:id", authenticateToken, (req, res) => {
      const { filename } = req.body;
      const sql = "UPDATE files SET filename = ? WHERE id = ?";
      db.query(sql, [filename, req.params.id], (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Failed to update file" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "File not found" });
        }
        res.status(200).json({ message: "File updated successfully" });
      });
    });
    
    app.delete("/files/:id", authenticateToken, (req, res) => {
      const sql = "DELETE FROM files WHERE id = ?";
      db.query(sql, [req.params.id], (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Failed to delete file" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "File not found" });
        }
        res.status(200).json({ message: "File deleted successfully" });
      });
    });
    
    // CRUD operacijos darbams
    app.post("/works", authenticateToken, upload.single("image"), (req, res) => {
      const { title, description } = req.body;
      const image = req.file;
    
      if (!image) {
        return res.status(400).json({ message: "Nuotrauka neįkelta" });
      }
    
      const sql = "INSERT INTO works (title, description, image_path) VALUES (?, ?, ?)";
      db.query(sql, [title, description, image.path], (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Klaida išsaugant darbą duomenų bazėje" });
        }
        res.status(201).json({ message: "Darbas įkeltas ir sėkmingai išsaugotas", work: { title, description, image_path: image.path } });
      });
    });
    
    app.get("/works", (req, res) => {
      const sql = "SELECT * FROM works";
      db.query(sql, (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Failed to load works" });
        }
        res.status(200).json(results);
      });
    });
    
    app.get("/works/:id", (req, res) => {
      const sql = "SELECT * FROM works WHERE id = ?";
      db.query(sql, [req.params.id], (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Failed to load work" });
        }
        if (result.length === 0) {
          return res.status(404).json({ message: "Work not found" });
        }
        res.status(200).json(result[0]);
      });
    });
    
    app.put("/works/:id", authenticateToken, upload.single("image"), (req, res) => {
      const { title, description } = req.body;
      const image = req.file;
    
      const sqlSelect = "SELECT * FROM works WHERE id = ?";
      db.query(sqlSelect, [req.params.id], (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Failed to load work" });
        }
        if (result.length === 0) {
          return res.status(404).json({ message: "Work not found" });
        }
    
        const work = result[0];
        const updatedTitle = title || work.title;
        const updatedDescription = description || work.description;
        const updatedImagePath = image ? image.path : work.image_path;
    
        const sqlUpdate = "UPDATE works SET title = ?, description = ?, image_path = ? WHERE id = ?";
        db.query(sqlUpdate, [updatedTitle, updatedDescription, updatedImagePath, req.params.id], (err, result) => {
          if (err) {
            return res.status(500).json({ error: "Failed to update work" });
          }
          res.status(200).json({ message: "Work updated successfully", work: { title: updatedTitle, description: updatedDescription, image_path: updatedImagePath } });
        });
      });
    });
    
    app.delete("/works/:id", authenticateToken, (req, res) => {
      const sql = "DELETE FROM works WHERE id = ?";
      db.query(sql, [req.params.id], (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Failed to delete work" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Work not found" });
        }
        res.status(200).json({ message: "Work deleted successfully" });
      });
    });
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    s(200).json({ message: "File updated successfully" });
  });
});

app.delete("/files/:id", authenticateToken, (req, res) => {
  const sql = "DELETE FROM files WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete file" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "File not found" });
    }
    res.status(200).json({ message: "File deleted successfully" });
  });
});

// CRUD operacijos darbams
app.post("/works", authenticateToken, upload.single("image"), (req, res) => {
  const { title, description } = req.body;
  const image = req.file;

  if (!image) {
    return res.status(400).json({ message: "Nuotrauka neįkelta" });
  }

  const sql = "INSERT INTO works (title, description, image_path) VALUES (?, ?, ?)";
  db.query(sql, [title, description, image.path], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Klaida išsaugant darbą duomenų bazėje" });
    }
    res.status(201).json({ message: "Darbas įkeltas ir sėkmingai išsaugotas", work: { title, description, image_path: image.path } });
  });
});

app.get("/works", (req, res) => {
  const sql = "SELECT * FROM works";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to load works" });
    }
    res.status(200).json(results);
  });
});

app.get("/works/:id", (req, res) => {
  const sql = "SELECT * FROM works WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to load work" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Work not found" });
    }
    res.status(200).json(result[0]);
  });
});

app.put("/works/:id", authenticateToken, upload.single("image"), (req, res) => {
  const { title, description } = req.body;
  const image = req.file;

  const sqlSelect = "SELECT * FROM works WHERE id = ?";
  db.query(sqlSelect, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to load work" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Work not found" });
    }

    const work = result[0];
    const updatedTitle = title || work.title;
    const updatedDescription = description || work.description;
    const updatedImagePath = image ? image.path : work.image_path;

    const sqlUpdate = "UPDATE works SET title = ?, description = ?, image_path = ? WHERE id = ?";
    db.query(sqlUpdate, [updatedTitle, updatedDescription, updatedImagePath, req.params.id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update work" });
      }
      res.status(200).json({ message: "Work updated successfully", work: { title: updatedTitle, description: updatedDescription, image_path: updatedImagePath } });
    });
  });
});

app.delete("/works/:id", authenticateToken, (req, res) => {
  const sql = "DELETE FROM works WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete work" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Work not found" });
    }
    res.status(200).json({ message: "Work deleted successfully" });
  });
});

app.listen(port, () => {
  console.log(`Serveris veikia ant ${port}.`);
});
