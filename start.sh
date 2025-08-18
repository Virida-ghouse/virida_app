#!/bin/bash

echo "=== DÉBUT DU SCRIPT DE DÉMARRAGE ==="
echo "Répertoire courant: $(pwd)"
echo "Contenu du répertoire: $(ls -la)"

echo "=== EXÉCUTION DU BUILD ==="
export NODE_OPTIONS="--max-old-space-size=2048"
export NODE_ENV="production"
npm run build --verbose
BUILD_EXIT_CODE=$?
echo "Code de sortie du build: $BUILD_EXIT_CODE"
echo "Build terminé"

echo "=== VÉRIFICATION DU DOSSIER DIST ==="
if [ -d "dist" ]; then
    echo "✅ Le dossier dist existe"
    echo "Contenu du dossier dist: $(ls -la dist/)"
    if [ -f "dist/index.html" ]; then
        echo "✅ index.html trouvé dans dist/"
    else
        echo "❌ index.html NOT FOUND dans dist/"
    fi
else
    echo "❌ Le dossier dist N'EXISTE PAS"
fi

echo "=== DÉMARRAGE DU SERVEUR ==="
echo "Lancement de node server.js..."
node server.js
