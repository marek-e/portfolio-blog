---
title: 'TaskFlow'
description: "Une application de gestion de tâches minimaliste avec synchronisation temps réel, raccourcis clavier et focus sur l'efficacité sans distractions."
featured: true
techStack: ['Next.js', 'PostgreSQL', 'Prisma', 'tRPC', 'TypeScript']
role: 'Lead Developer'
links:
  demo: 'https://taskflow.example.com'
  repo: 'https://github.com/melmayan/taskflow'
publishDate: 2024-08-15
---

J'ai créé TaskFlow parce que chaque application de todo que j'ai essayée était soit trop complexe, soit trop lente. Celle-ci charge en moins de 100ms et supporte une navigation complète au clavier.

L'application utilise des mises à jour optimistes pour un feedback instantané, avec synchronisation en arrière-plan vers PostgreSQL via tRPC. La collaboration temps réel est alimentée par WebSockets, permettant à plusieurs utilisateurs de travailler simultanément sur des listes de tâches partagées.
