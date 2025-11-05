// Utilitaire pour générer un PDF de progression et statistiques
// Pour l'instant, génère un mock - à remplacer par une vraie librairie PDF

export interface UserStats {
  name: string
  level: string
  totalDuels: number
  victories: number
  defeats: number
  draws: number
  winRate: number
  avgRapidite: number
  avgPrecision: number
  avgRigueur: number
  topSkills: string[]
  badges: Array<{ name: string; unlocked: boolean }>
  recentDuels: Array<{
    title: string
    result: string
    date: string
    score: number
  }>
}

/**
 * Génère un document PDF des statistiques utilisateur pour CV
 * @param stats - Statistiques de l'utilisateur
 * @returns URL du PDF généré (blob)
 */
export function generateProgressPDF(stats: UserStats): string {
  // Créer le contenu HTML qui sera converti en PDF
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Rapport de Progression - ${stats.name}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 40px;
      background: white;
      color: #1a1a1a;
    }
    h1 {
      color: #5573FF;
      border-bottom: 3px solid #5573FF;
      padding-bottom: 10px;
      margin-bottom: 30px;
    }
    h2 {
      color: #333;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin: 30px 0;
    }
    .stat-card {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      border-left: 4px solid #5573FF;
    }
    .stat-value {
      font-size: 32px;
      font-weight: bold;
      color: #5573FF;
      margin: 10px 0;
    }
    .stat-label {
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
    }
    .performance {
      background: #f0f7ff;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .skill-bar {
      margin: 15px 0;
    }
    .skill-name {
      font-weight: 600;
      margin-bottom: 5px;
    }
    .progress-bar {
      background: #e0e0e0;
      height: 20px;
      border-radius: 10px;
      overflow: hidden;
    }
    .progress-fill {
      background: linear-gradient(90deg, #5573FF, #78FFC8);
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 10px;
      color: white;
      font-size: 12px;
      font-weight: bold;
    }
    .badges {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 20px 0;
    }
    .badge {
      background: #5573FF;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
    }
    .recent-duels {
      margin-top: 30px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background: #5573FF;
      color: white;
      font-weight: 600;
    }
    .victory { color: #4CAF50; font-weight: bold; }
    .defeat { color: #F44336; font-weight: bold; }
    .footer {
      margin-top: 50px;
      text-align: center;
      color: #999;
      font-size: 12px;
      border-top: 1px solid #ddd;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📊 Rapport de Progression IT</h1>
    <p style="font-size: 18px; color: #666;">Plateforme de Défis IT 1v1</p>
    <p style="font-size: 20px; font-weight: bold; margin-top: 20px;">${stats.name}</p>
    <p style="color: #5573FF; font-weight: 600;">Niveau: ${stats.level}</p>
  </div>

  <h2>Statistiques Générales</h2>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-label">Total Duels</div>
      <div class="stat-value">${stats.totalDuels}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Victoires</div>
      <div class="stat-value">${stats.victories}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Taux de victoire</div>
      <div class="stat-value">${stats.winRate}%</div>
    </div>
  </div>

  <h2>Performance</h2>
  <div class="performance">
    <div class="skill-bar">
      <div class="skill-name">⚡ Rapidité</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${stats.avgRapidite}%">${stats.avgRapidite}%</div>
      </div>
    </div>
    <div class="skill-bar">
      <div class="skill-name">🎯 Précision</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${stats.avgPrecision}%">${stats.avgPrecision}%</div>
      </div>
    </div>
    <div class="skill-bar">
      <div class="skill-name">🏆 Rigueur</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${stats.avgRigueur}%">${stats.avgRigueur}%</div>
      </div>
    </div>
  </div>

  <h2>Compétences Principales</h2>
  <div class="badges">
    ${stats.topSkills.map(skill => `<div class="badge">${skill}</div>`).join('')}
  </div>

  <h2>Badges Débloqués</h2>
  <div class="badges">
    ${stats.badges.filter(b => b.unlocked).map(badge => `<div class="badge">🏅 ${badge.name}</div>`).join('')}
  </div>

  <div class="recent-duels">
    <h2>Derniers Duels</h2>
    <table>
      <thead>
        <tr>
          <th>Défi</th>
          <th>Date</th>
          <th>Résultat</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        ${stats.recentDuels.map(duel => `
          <tr>
            <td>${duel.title}</td>
            <td>${new Date(duel.date).toLocaleDateString('fr-FR')}</td>
            <td class="${duel.result === 'Victoire' ? 'victory' : 'defeat'}">${duel.result}</td>
            <td>${duel.score} pts</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p>Document généré le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
    <p>Plateforme de Défis IT 1v1 • https://defi-it.fr</p>
  </div>
</body>
</html>
  `

  // Créer un Blob avec le contenu HTML
  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  
  return url
}

/**
 * Télécharge le PDF généré
 */
export function downloadPDF(url: string, filename: string = 'progression-defi-it.html') {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Note: Pour un vrai PDF, utiliser une lib comme jsPDF ou html2pdf.js
  // Ceci génère un HTML pour l'instant qui peut être imprimé en PDF
}
