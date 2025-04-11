require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const UserRoutes = require('./src/routes/UserRoutes');
const PoubelleRoutes = require('./src/routes/PoubelleRoutes');
const CollecteRoutes = require('./src/routes/CollecteRoutes');
const TrajetRoutes = require('./src/routes/TrajetRoutes');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middlewares
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(helmet());
app.use(morgan('dev'));

// Connexion à MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connecté'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Routes de base
app.get('/', (req, res) => {
    res.send('API Gestion Déchets en cours de développement');
});

app.use('/api/users', UserRoutes);
app.use('/api/poubelles', PoubelleRoutes);
app.use('/api/collectes', CollecteRoutes);
app.use('/api/trajets', TrajetRoutes);
app.use(notFoundHandler);

app.use(errorHandler);

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
