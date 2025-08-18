#!/bin/bash

echo "=== DÉBUT DU SCRIPT DE DÉMARRAGE ==="
echo "Répertoire courant: $(pwd)"
echo "Contenu du répertoire: $(ls -la)"

echo "=== EXÉCUTION DU BUILD ==="
# Augmenter encore plus le timeout pour Three.js
timeout 600 npm run build --verbose
BUILD_EXIT_CODE=$?

if [ $BUILD_EXIT_CODE -eq 124 ]; then
    echo "Build timeout après 10 minutes, continuons..."
elif [ $BUILD_EXIT_CODE -ne 0 ]; then
    echo "Build échoué avec le code: $BUILD_EXIT_CODE"
    echo "Tentative de build simplifié..."
    # Essayer un build sans optimisations
    NODE_OPTIONS="--max-old-space-size=1536 --no-warnings" npm run build:simple
fi

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
