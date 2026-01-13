---
title: 'Minesweeper LLM Arena'
description: 'Projet de hackathon AI Gateway — LLMs compétition pour résoudre une partie de Démineur sur le même plateau caché.'
featured: true
techStack: ['TypeScript', 'React', 'Vercel AI SDK', 'AI Gateway', 'Vercel', 'Next.js']
links:
  repo: 'https://github.com/marek-e/minesweeper-battle'
publishDate: 2026-01-01
image: '/projects/minesweeper-battle.png'
imageAlt: 'Minesweeper LLM Arena logo'
status: 'in-progress'
---

Projet de hackathon AI Gateway — compétition de LLMs pour résoudre une partie de Démineur sur le même plateau caché.

Chaque modèle est un agent autonome qui reçoit l'état visible du plateau et choisit les cellules à révéler. Le backend simule le jeu de manière déterministe, et l'interface rejoue toutes les exécutions des modèles côte à côte pour la comparaison.

Déployé sur Vercel, alimenté par AI Gateway + Vercel AI SDK.
