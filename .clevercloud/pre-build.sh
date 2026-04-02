#!/bin/bash

echo "=== PRE-BUILD SCRIPT ==="
echo "Optimisation pour build rapide..."

# Nettoyer le cache npm pour éviter les conflits
npm cache clean --force

# Installer toutes les dépendances (y compris devDeps pour le build Vite)
npm ci --no-audit --no-fund

echo "=== PRE-BUILD TERMINÉ ==="
