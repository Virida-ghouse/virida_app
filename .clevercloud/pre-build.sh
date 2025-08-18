#!/bin/bash

echo "=== PRE-BUILD SCRIPT ==="
echo "Optimisation pour build rapide..."

# Nettoyer le cache npm pour éviter les conflits
npm cache clean --force

# Installer seulement les dépendances de production
npm ci --only=production --no-audit --no-fund

echo "=== PRE-BUILD TERMINÉ ==="
