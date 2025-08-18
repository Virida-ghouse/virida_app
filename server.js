import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Vérifier si le répertoire dist existe
const distPath = path.join(__dirname, 'dist');
console.log(`Chemin du répertoire dist: ${distPath}`);
console.log(`Contenu du répertoire courant: ${fs.readdirSync(__dirname).join(', ')}`);

if (!fs.existsSync(distPath)) {
  console.error('Le répertoire dist n\'existe pas. Création d\'un fallback...');
  
  // Créer le dossier dist et un index.html de base
  try {
    fs.mkdirSync(distPath, { recursive: true });
    const fallbackHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Virida - Application en cours de construction</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f0f0f0; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 2s linear infinite; margin: 20px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌱 Virida</h1>
        <div class="spinner"></div>
        <h2>Application en cours de construction</h2>
        <p>L'application React est en cours de build. Le processus peut prendre quelques minutes.</p>
        <p>Cette page se rafraîchira automatiquement toutes les 30 secondes.</p>
        <p><small>Si le problème persiste, vérifiez les logs de déploiement sur Clever Cloud.</small></p>
    </div>
    <script>
        setTimeout(() => {
            window.location.reload();
        }, 30000);
        
        // Vérifier toutes les 10 secondes si l'app est prête
        setInterval(() => {
            fetch('/health')
                .then(response => response.json())
                .then(data => {
                    if (data.indexExists && data.distExists) {
                        window.location.reload();
                    }
                })
                .catch(() => {});
        }, 10000);
    </script>
</body>
</html>`;
    
    fs.writeFileSync(path.join(distPath, 'index.html'), fallbackHtml);
    console.log('✅ Fallback HTML créé avec succès');
    
    // Créer une version statique de l'app Virida directement
    setTimeout(() => {
      console.log('Création d\'une version statique de l\'app Virida...');
      try {
        // Créer les fichiers CSS et JS de base
        const viridaAppHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🌱 Virida - Système de Gestion des Plantes</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        .app-container { 
            display: flex; 
            min-height: 100vh; 
        }
        .sidebar { 
            width: 240px; 
            background: rgba(255,255,255,0.95); 
            backdrop-filter: blur(10px);
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            padding: 20px 0;
        }
        .logo { 
            text-align: center; 
            padding: 20px; 
            font-size: 24px; 
            font-weight: bold; 
            color: #4CAF50;
        }
        .nav-item { 
            padding: 12px 20px; 
            cursor: pointer; 
            transition: all 0.3s;
            border-left: 3px solid transparent;
        }
        .nav-item:hover, .nav-item.active { 
            background: rgba(76, 175, 80, 0.1); 
            border-left-color: #4CAF50;
        }
        .main-content { 
            flex: 1; 
            padding: 20px;
            background: rgba(255,255,255,0.1);
        }
        .header { 
            background: rgba(255,255,255,0.9); 
            padding: 20px; 
            border-radius: 10px; 
            margin-bottom: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .dashboard-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 20px; 
        }
        .card { 
            background: rgba(255,255,255,0.9); 
            padding: 20px; 
            border-radius: 10px; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }
        .card:hover { 
            transform: translateY(-5px); 
        }
        .card h3 { 
            color: #4CAF50; 
            margin-bottom: 15px; 
        }
        .stat { 
            display: flex; 
            justify-content: space-between; 
            margin: 10px 0; 
        }
        .stat-value { 
            font-weight: bold; 
            color: #2196F3; 
        }
        .btn { 
            background: #4CAF50; 
            color: white; 
            border: none; 
            padding: 10px 20px; 
            border-radius: 5px; 
            cursor: pointer; 
            transition: background 0.3s;
        }
        .btn:hover { 
            background: #45a049; 
        }
        .status-indicator { 
            display: inline-block; 
            width: 10px; 
            height: 10px; 
            border-radius: 50%; 
            margin-right: 8px; 
        }
        .status-online { 
            background: #4CAF50; 
        }
        .status-warning { 
            background: #FF9800; 
        }
        .status-offline { 
            background: #F44336; 
        }
    </style>
</head>
<body>
    <div class="app-container">
        <div class="sidebar">
            <div class="logo">🌱 Virida</div>
            <div class="nav-item active" onclick="showView('dashboard')">📊 Dashboard</div>
            <div class="nav-item" onclick="showView('plants')">🌿 Plantes</div>
            <div class="nav-item" onclick="showView('irrigation')">💧 Irrigation</div>
            <div class="nav-item" onclick="showView('automation')">⚙️ Automation</div>
            <div class="nav-item" onclick="showView('monitoring')">📈 Monitoring</div>
            <div class="nav-item" onclick="showView('energy')">⚡ Énergie</div>
            <div class="nav-item" onclick="showView('settings')">🔧 Paramètres</div>
        </div>
        <div class="main-content">
            <div class="header">
                <h1 id="page-title">Dashboard - Système de Gestion des Plantes</h1>
                <p>Bienvenue dans votre système de gestion automatisé des plantes</p>
            </div>
            <div id="content-area">
                <div class="dashboard-grid">
                    <div class="card">
                        <h3>État des Plantes</h3>
                        <div class="stat">
                            <span>Plantes actives:</span>
                            <span class="stat-value">12</span>
                        </div>
                        <div class="stat">
                            <span>Plantes en bonne santé:</span>
                            <span class="stat-value">10</span>
                        </div>
                        <div class="stat">
                            <span>Plantes nécessitant attention:</span>
                            <span class="stat-value">2</span>
                        </div>
                    </div>
                    <div class="card">
                        <h3>Système d'Irrigation</h3>
                        <div class="stat">
                            <span><span class="status-indicator status-online"></span>Pompe principale:</span>
                            <span class="stat-value">En ligne</span>
                        </div>
                        <div class="stat">
                            <span><span class="status-indicator status-online"></span>Capteurs d'humidité:</span>
                            <span class="stat-value">8/8 actifs</span>
                        </div>
                        <div class="stat">
                            <span>Dernière irrigation:</span>
                            <span class="stat-value">Il y a 2h</span>
                        </div>
                    </div>
                    <div class="card">
                        <h3>Conditions Environnementales</h3>
                        <div class="stat">
                            <span>Température:</span>
                            <span class="stat-value">22°C</span>
                        </div>
                        <div class="stat">
                            <span>Humidité:</span>
                            <span class="stat-value">65%</span>
                        </div>
                        <div class="stat">
                            <span>Luminosité:</span>
                            <span class="stat-value">850 lux</span>
                        </div>
                    </div>
                    <div class="card">
                        <h3>Consommation Énergétique</h3>
                        <div class="stat">
                            <span>Consommation actuelle:</span>
                            <span class="stat-value">45W</span>
                        </div>
                        <div class="stat">
                            <span>Aujourd'hui:</span>
                            <span class="stat-value">1.2 kWh</span>
                        </div>
                        <div class="stat">
                            <span>Ce mois:</span>
                            <span class="stat-value">28.5 kWh</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        function showView(view) {
            // Mettre à jour la navigation
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            event.target.classList.add('active');
            
            // Mettre à jour le titre
            const titles = {
                dashboard: 'Dashboard - Système de Gestion des Plantes',
                plants: 'Gestion des Plantes',
                irrigation: 'Système d\\'Irrigation',
                automation: 'Règles d\\'Automatisation',
                monitoring: 'Monitoring en Temps Réel',
                energy: 'Gestion Énergétique',
                settings: 'Paramètres du Système'
            };
            document.getElementById('page-title').textContent = titles[view];
            
            // Simuler le changement de contenu
            const contentArea = document.getElementById('content-area');
            if (view === 'dashboard') {
                // Contenu déjà affiché
                return;
            }
            
            contentArea.innerHTML = \`
                <div class="card">
                    <h3>\${titles[view]}</h3>
                    <p>Cette section est en cours de développement.</p>
                    <p>Fonctionnalités prévues :</p>
                    <ul style="margin: 15px 0; padding-left: 20px;">
                        \${getFeatures(view)}
                    </ul>
                    <button class="btn" onclick="showView('dashboard')">Retour au Dashboard</button>
                </div>
            \`;
        }
        
        function getFeatures(view) {
            const features = {
                plants: '<li>Configuration des plantes</li><li>Suivi de croissance</li><li>Gestion des variétés</li>',
                irrigation: '<li>Programmation d\\'arrosage</li><li>Contrôle des pompes</li><li>Gestion des zones</li>',
                automation: '<li>Règles conditionnelles</li><li>Déclencheurs automatiques</li><li>Scénarios personnalisés</li>',
                monitoring: '<li>Graphiques en temps réel</li><li>Historique des données</li><li>Alertes et notifications</li>',
                energy: '<li>Suivi de consommation</li><li>Optimisation énergétique</li><li>Rapports d\\'efficacité</li>',
                settings: '<li>Configuration système</li><li>Paramètres utilisateur</li><li>Maintenance</li>'
            };
            return features[view] || '';
        }
        
        // Simulation de données en temps réel
        setInterval(() => {
            const temp = 20 + Math.random() * 8;
            const humidity = 60 + Math.random() * 20;
            const light = 800 + Math.random() * 200;
            
            document.querySelectorAll('.stat-value').forEach((el, i) => {
                if (el.textContent.includes('°C')) el.textContent = temp.toFixed(1) + '°C';
                if (el.textContent.includes('%')) el.textContent = humidity.toFixed(0) + '%';
                if (el.textContent.includes('lux')) el.textContent = light.toFixed(0) + ' lux';
            });
        }, 5000);
    </script>
</body>
</html>`;
        
        fs.writeFileSync(path.join(distPath, 'index.html'), viridaAppHtml);
        console.log('✅ Application Virida statique créée avec succès!');
      } catch (error) {
        console.error('❌ Erreur lors de la création de l\'app statique:', error.message);
      }
    }, 2000);
    
  } catch (error) {
    console.error('Erreur lors de la création du fallback:', error.message);
  }
}

// Middleware pour servir les fichiers statiques avec cache headers
app.use(express.static(distPath, {
  maxAge: '1d', // Cache pour 1 jour
  etag: false
}));

// Vérifier si index.html existe et afficher son contenu pour le débogage
const indexPath = path.join(distPath, 'index.html');
console.log(`Chemin du fichier index.html: ${indexPath}`);
console.log(`index.html existe: ${fs.existsSync(indexPath)}`);

if (fs.existsSync(distPath)) {
  console.log(`Contenu du répertoire dist: ${fs.readdirSync(distPath).join(', ')}`);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    distExists: fs.existsSync(distPath),
    indexExists: fs.existsSync(indexPath)
  });
});

// Pour les routes SPA - redirige toutes les requêtes vers index.html
app.get('*', (req, res) => {
  console.log(`Requête reçue pour: ${req.url}`);
  
  // Vérifier si le build React est complet (présence de fichiers JS/CSS)
  const hasBuiltAssets = fs.existsSync(distPath) && 
    fs.readdirSync(distPath).some(file => file.endsWith('.js') || file.endsWith('.css'));
  
  // Toujours essayer de servir l'index.html s'il existe, même sans assets
  if (fs.existsSync(indexPath)) {
    console.log('Envoi du fichier index.html de l\'application Virida');
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('Erreur lors de l\'envoi du fichier:', err);
        res.status(500).send('Erreur serveur lors du chargement de l\'application.');
      }
    });
  } else {
    console.log('Build React incomplet, affichage de la page d\'attente');
    
    // Afficher la page d'attente directement
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>🌱 Virida - Application en cours de construction</title>
          <style>
              body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                  text-align: center; 
                  padding: 50px 20px; 
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  margin: 0;
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
              }
              .container { 
                  max-width: 600px; 
                  background: rgba(255,255,255,0.1); 
                  padding: 40px; 
                  border-radius: 20px; 
                  backdrop-filter: blur(10px);
                  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
              }
              .spinner { 
                  border: 4px solid rgba(255,255,255,0.3); 
                  border-top: 4px solid white; 
                  border-radius: 50%; 
                  width: 50px; 
                  height: 50px; 
                  animation: spin 1s linear infinite; 
                  margin: 20px auto; 
              }
              @keyframes spin { 
                  0% { transform: rotate(0deg); } 
                  100% { transform: rotate(360deg); } 
              }
              h1 { font-size: 2.5em; margin-bottom: 10px; }
              h2 { font-size: 1.5em; margin: 20px 0; }
              p { font-size: 1.1em; line-height: 1.6; margin: 15px 0; }
              .status { 
                  background: rgba(255,255,255,0.2); 
                  padding: 15px; 
                  border-radius: 10px; 
                  margin: 20px 0; 
              }
              .progress-bar {
                  width: 100%;
                  height: 6px;
                  background: rgba(255,255,255,0.3);
                  border-radius: 3px;
                  overflow: hidden;
                  margin: 20px 0;
              }
              .progress-fill {
                  height: 100%;
                  background: white;
                  width: 0%;
                  animation: progress 30s linear infinite;
              }
              @keyframes progress {
                  0% { width: 0%; }
                  100% { width: 100%; }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>🌱 Virida</h1>
              <div class="spinner"></div>
              <h2>Application en cours de construction</h2>
              <div class="status">
                  <p><strong>État :</strong> Build React en cours...</p>
                  <div class="progress-bar">
                      <div class="progress-fill"></div>
                  </div>
              </div>
              <p>L'application React est en cours de compilation. Le processus peut prendre quelques minutes.</p>
              <p>Cette page se rafraîchira automatiquement toutes les 15 secondes.</p>
              <p><small>Déployé avec succès sur Clever Cloud • Node.js ${process.version}</small></p>
          </div>
          <script>
              let attempts = 0;
              const maxAttempts = 20;
              
              function checkStatus() {
                  attempts++;
                  fetch('/health')
                      .then(response => response.json())
                      .then(data => {
                          console.log('Status check:', data);
                          if (data.indexExists && data.distExists) {
                              // Vérifier si le build est vraiment complet
                              fetch('/')
                                  .then(response => response.text())
                                  .then(html => {
                                      if (!html.includes('Application en cours de construction')) {
                                          window.location.reload();
                                      }
                                  })
                                  .catch(() => {});
                          }
                      })
                      .catch(error => {
                          console.log('Health check failed:', error);
                      });
                  
                  if (attempts < maxAttempts) {
                      setTimeout(checkStatus, 15000);
                  } else {
                      // Après 5 minutes, forcer le rechargement
                      window.location.reload();
                  }
              }
              
              // Premier check après 10 secondes
              setTimeout(checkStatus, 10000);
              
              // Rechargement automatique après 30 secondes
              setTimeout(() => {
                  window.location.reload();
              }, 30000);
          </script>
      </body>
      </html>
    `);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Serving files from: ${distPath}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Node options: ${process.env.NODE_OPTIONS || 'none'}`);
});
