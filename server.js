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

// Vérifier si le build React est complet
function isBuildComplete() {
  console.log('🔍 Vérification du build complet...');
  
  if (!fs.existsSync(distPath)) {
    console.log('❌ Dossier dist n\'existe pas');
    return false;
  }
  
  const indexPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.log('❌ Fichier index.html n\'existe pas');
    return false;
  }
  
  // Vérifier si les assets JS/CSS existent
  const assetsPath = path.join(distPath, 'assets');
  if (!fs.existsSync(assetsPath)) {
    console.log('❌ Dossier assets n\'existe pas');
    return false;
  }
  
  const assets = fs.readdirSync(assetsPath);
  console.log(`📁 Assets trouvés: ${assets.join(', ')}`);
  
  const hasJS = assets.some(file => file.endsWith('.js'));
  const hasCSS = assets.some(file => file.endsWith('.css'));
  
  console.log(`📝 JS trouvé: ${hasJS}, CSS trouvé: ${hasCSS}`);
  
  const isComplete = hasJS && hasCSS;
  console.log(`✅ Build complet: ${isComplete}`);
  
  return isComplete;
}

if (!isBuildComplete()) {
  console.log('Build React incomplet, attente du build Vite...');
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
  console.log(`🌐 Requête reçue pour: ${req.url}`);
  
  // Si c'est une requête pour un fichier statique qui n'existe pas, retourner 404
  if (req.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|gltf)$/)) {
    console.log(`📁 Fichier statique demandé: ${req.url}`);
    const filePath = path.join(distPath, req.url);
    if (fs.existsSync(filePath)) {
      console.log(`✅ Fichier trouvé, envoi: ${filePath}`);
      return res.sendFile(filePath);
    } else {
      console.log(`❌ Fichier statique non trouvé: ${req.url}`);
      return res.status(404).send('File not found');
    }
  }
  
  // Vérifier si le build est complet avant de servir l'application
  if (!isBuildComplete()) {
    console.log('⏳ Build incomplet, affichage de la page d\'attente');
    return res.status(200).send(getWaitingPage());
  }
  
  // Pour les routes de l'application, servir index.html
  if (fs.existsSync(indexPath)) {
    console.log('📄 Envoi du fichier index.html de l\'application Virida');
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('❌ Erreur lors de l\'envoi du fichier:', err);
        res.status(500).send('Erreur serveur lors du chargement de l\'application.');
      }
    });
  } else {
    console.log('⏳ Build React incomplet, affichage de la page d\'attente');
    return res.status(200).send(getWaitingPage());
  }
});

function getWaitingPage() {
  return `
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
    `;
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Serving files from: ${distPath}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Node options: ${process.env.NODE_OPTIONS || 'none'}`);
});
