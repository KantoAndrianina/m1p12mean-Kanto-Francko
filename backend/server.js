const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connecté"))
.catch(err => console.log(err));

// Routes
// test
app.get('/', (req, res) => {
    res.send('Bienvenue sur mon API ! 🚀');
});

// USER
const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

// VEHICULE
const vehiculeRoutes = require('./routes/vehiculeRoutes');
app.use('/vehicules', vehiculeRoutes);

// const bcrypt = require('bcryptjs');

// const hashedPassword = "$2b$10$Lben9w.mBPg7eTVSQousA.DXjeBXRnQ6oJOAKG8lxTLwfLKp1ahAy";
// const enteredPassword = "123456";

// bcrypt.compare(enteredPassword, hashedPassword).then(console.log);

app.listen(PORT, () => console.log(`Serveur démarré sur le port
${PORT}`));