const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const UserRoutes = require('./src/routes/UserRoutes');
const PoubelleRoutes = require('./src/routes/PoubelleRoutes');
const CollecteRoutes = require('./src/routes/CollecteRoutes');
const TrajetRoutes = require('./src/routes/TrajetRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connecté ✅'))
.catch(err => console.error('Erreur MongoDB:', err));

// Routes
app.use('/api/users', UserRoutes);
app.use('/api/poubelles', PoubelleRoutes);
app.use('/api/collectes', CollecteRoutes);
app.use('/api/trajets', TrajetRoutes);

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
