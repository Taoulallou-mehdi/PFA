# Système Intelligent de Gestion des Déchets Urbains

Projet de Fin d'Études (PFA) - Développement d'une application mobile MERN avec intelligence artificielle

## 1. Contexte et Problématique

La gestion des déchets en milieu urbain repose sur des systèmes de collecte statiques, où les camions suivent des itinéraires fixes sans tenir compte du niveau réel de remplissage des poubelles. Cela entraîne des trajets inutiles, des coûts élevés et une empreinte carbone accrue.

## 2. Objectifs du Projet

Développer une application mobile MERN qui intègre l'intelligence artificielle pour :
- Automatiser la surveillance des niveaux de remplissage des poubelles.
- Optimiser les trajets des camions de collecte pour réduire les coûts.
- Fournir une interface interactive aux agents et aux citoyens.
- Prédire les futurs besoins de collecte grâce à l’intelligence artificielle.

## 3. Fonctionnalités du Projet

### Application Mobile (React Native)
- Carte interactive affichant l’emplacement et le remplissage des poubelles.
- Tableau de bord pour la gestion des collectes.
- Système de notification et signalement pour les citoyens.

### Backend & API (Node.js, Express.js, MongoDB)
- API REST sécurisée avec JWT.
- Stockage des données relatives aux collectes.
- Algorithme d’optimisation des trajets avec Google Directions API.

## 4. Technologies Utilisées

| Composant                | Technologie                                                                         |
|--------------------------|-------------------------------------------------------------------------------------|
| Frontend Mobile          | React Native, Expo, Google Maps API                                                 |
| Backend & API            | Node.js, Express.js, MongoDB                                                        |
| Authentification         | JWT, bcrypt                                                                         |
| Base de Données          | MongoDB                                                                             |
| Capteurs IoT(optionnel)  | ESP32, capteurs ultrasons                                                           |
| Optimisation des trajets | Google Directions API, Algorithme Dijkstra / A*                                     |
| Prédiction IA            | Scikit-Learn (Régression linéaire multiple), xgboost (Régression linéaire multiple) |

## 5. Intelligence Artificielle

- Prédiction du remplissage des poubelles avec Machine Learning.
- Optimisation des trajets des camions avec Google Directions API ou intelligence artificielle.
- (Optionnel) Détection automatique des déchets avec vision par ordinateur.

## 6. Plan de Développement et Répartition du Travail

| Phase                | Tâches                                       |    Durée   |
|----------------------|----------------------------------------------|------------|
| Phase 1              | Développement du Backend et API              | 3 semaines |
| Phase 2              | Développement de l’Application Mobile        | 4 semaines |
| Phase 3              | Ajout de l’IA & Optimisation                 | 3 semaines |
| Phase 4              | Tests & Validation                           | 3 semaines |


## 7. Installation des Dépendances

### Backend 

1. Naviguez vers le répertoire backend :
    ```sh
    cd backend
    ```
2. Installez les dépendances :
    ```sh
    npm install
    ```

### Frontend

1. Naviguez vers le répertoire frontend :
    ```sh
    cd frontend
    ```
2. Installez les dépendances :
    ```sh
    npm install
    ```

## 8. Lancement de l'Application

### Backend 

1. Assurez-vous que les variables d'environnement sont correctement configurées dans un fichier `.env`.
2. Démarrez le serveur backend :
    ```sh
    npm start
    ```

### Frontend

1. Assurez-vous que les variables d'environnement sont correctement configurées dans un fichier `.env`.
2. Démarrez l'application mobile :
    ```sh
    npm start
    ```

## 9. Variables d'Environnement

Créez un fichier `.env` dans les répertoires `backend` et `frontend` avec les variables suivantes :

### Backend 

```
PORT=5000
MONGO_URI=mongodb+srv://etaoulallou:7NagnJgjZMsnlu5T@cluster0.2ndanyk.mongodb.net/db_GestionDechets?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=6969
GOOGLE_API_KEY=AIzaSyAKJ_vwMcRXiF-X5Ex_mqpR-loP8jGNHqY

```

### Frontend

```
BACKEND_URL=http://YOUR_LOCAL_IP:5000
```

# 10. Notes Importantes

- Collaboration : Chaque membre de l'équipe doit configurer son propre fichier .env en fonction de son environnement local.

## 11. Conclusion

Ce projet allie technologie mobile et intelligence artificielle pour améliorer l’efficacité et la durabilité de la gestion des déchets urbains. En combinant une application mobile intuitive et des algorithmes d’optimisation, nous proposons une solution moderne, scalable et écologique.
