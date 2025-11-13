# DualTech.1V1 – Communauté IT en Flat-File CI/CD
https://dualtech1v1.vercel.app/
## 🎯 Objectif
Créer un **site communautaire statique** destiné aux **professionnels et étudiants de l’informatique** (cybersécurité, développement, infrastructure, data, IA…).  
Le but est de **partager des articles techniques, tutoriels et retours d’expérience**, publiés **asynchronement via Git**.  
Chaque contribution est ajoutée sous forme de fichier Markdown, puis validée et publiée automatiquement par un pipeline **CI/CD**, à la manière du projet *Brown Bag Lunch*.

## 👥 Public visé
- Étudiants en informatique souhaitant documenter leurs apprentissages  
- Professionnels voulant partager leurs bonnes pratiques  
- Formateurs ou tuteurs voulant centraliser des ressources techniques fiables

## 🧱 Concept technique
Le site est **statique**, généré automatiquement à partir des fichiers Markdown du dépôt.  
Chaque contribution déclenche une intégration continue (CI) pour valider et construire le site.  
L’objectif est d’obtenir un écosystème collaboratif simple, transparent et traçable grâce à Git.

## 📦 Stack utilisée
- **MkDocs + Material** pour la génération du site statique  
- **GitHub Actions** pour le CI/CD (lint + build + déploiement)  
- **Markdown (.md)** pour les articles  
- **GitHub Pages** pour l’hébergement
![Maquette du site](design/maquette.png)

## 🧩 Structure prévue
.
├── content/ # articles markdown
│ ├── 2025-11-12-exemple.md
│ └── 2025-11-12-cybersec.md
├── docs/ # pages du site
│ ├── index.md
│ └── guide-contributeur.md
├── mkdocs.yml
└── .github/workflows/ci.yml

yaml
Copier le code

## 🪄 Processus de contribution
1. **Fork** le dépôt  
2. Crée une branche `feat/<ton-article>`  
3. Ajoute ton fichier `.md` dans `/content/`  
4. Commit : `feat(content): ajout de l’article sur Docker`  
5. **Push** ta branche  
6. Ouvre une **Pull Request** vers `main`  
7. Le pipeline CI/CD vérifie ton fichier et reconstruit le site

## 🧑‍💻 Exemple d’article
```yaml
---
title: "Installer un serveur Apache"
author: "Arda S."
tags: ["linux", "serveur", "web"]
date: "2025-11-12"
---
Contenu :
Explique comment installer et configurer Apache sur Ubuntu, gérer les services et tester localement.

🧑‍🤝‍🧑 Crédits
Arda S.
(ajouter les prénoms et initiales de tes coéquipiers si besoin)

🖼️ Maquette
Figma / Stitch : https://stitch.withgoogle.com/
(ou image à ajouter dans un dossier /design)

⚙️ Licence
Code MIT – Contenus CC BY 4.0

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
