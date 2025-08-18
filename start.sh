#!/bin/bash

echo "=== DÉBUT DU SCRIPT DE DÉMARRAGE ==="
echo "Répertoire courant: $(pwd)"
echo "Contenu du répertoire: $(ls -la)"

echo "=== EXÉCUTION DU BUILD VITE AVEC CORRECTION THREE.JS ==="
# Build Vite avec correction du problème three-stdlib
NODE_OPTIONS='--max-old-space-size=1536 --no-warnings' timeout 600 npm run build --loglevel verbose

if [ $? -eq 0 ]; then
    echo "✅ Build Vite réussi!"
    if [ -d "dist" ]; then
        echo "✅ Dossier dist créé avec succès"
        ls -la dist/
    else
        echo "❌ Dossier dist non trouvé après le build"
    fi
else
    echo "❌ Build Vite échoué, création d'un fallback..."
    # Créer le dossier dist
    mkdir -p dist
    echo "✅ Dossier dist créé en fallback"
fi

echo "=== DÉMARRAGE DU SERVEUR ==="
echo "Lancement de node server.js..."
node server.js
