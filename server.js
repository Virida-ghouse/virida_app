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
    
    // Essayer le build en arrière-plan
    setTimeout(() => {
      console.log('Tentative de build en arrière-plan...');
      try {
        execSync('npm run build', { 
          stdio: 'pipe',
          timeout: 180000, // 3 minutes timeout
          env: { 
            ...process.env,
            NODE_OPTIONS: '--max-old-space-size=1024',
            NODE_ENV: 'production'
          }
        });
        console.log('✅ Build en arrière-plan réussi!');
      } catch (buildError) {
        console.error('❌ Build en arrière-plan échoué:', buildError.message);
      }
    }, 5000);
    
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
  
  if (fs.existsSync(indexPath) && hasBuiltAssets) {
    console.log('Envoi du fichier index.html (build React complet)');
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
