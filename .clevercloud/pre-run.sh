#!/bin/bash

echo "Démarrage du script pre-run.sh"

# Afficher l'environnement
echo "Version de Node.js:"
node -v
echo "Version de npm:"
npm -v

# Vérifier le répertoire courant
echo "Répertoire courant:"
pwd
echo "Contenu du répertoire:"
ls -la

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
  echo "Installation des dépendances..."
  npm install
fi

# Construire l'application
echo "Construction de l'application..."
npm run build

# Vérifier si le build a réussi
if [ -d "dist" ]; then
  echo "Build réussi! Contenu du répertoire dist:"
  ls -la dist
else
  echo "ERREUR: Le build a échoué, le répertoire dist n'existe pas"
  exit 1
fi

echo "Script pre-run.sh terminé avec succès"
