---
title: 'Next Armored'
description: 'Toolkit de middleware NextJs pour sécuriser votre application avec flexibilité et simplicité. Les configurations par défaut sont basées sur les meilleures pratiques de sécurité.'
featured: true
techStack: ['TypeScript', 'Next.js', 'Node.js', "Security"]
links:
  repo: 'https://github.com/marek-e/next-armored'
  demo: 'https://www.npmjs.com/package/next-armored'
publishDate: 2025-01-24
image: '/projects/n-armor.svg'
imageAlt: 'Next Armored logo - armor with N letter'
status: 'in-progress'
---

Il s'agit de mon premier projet open-source. L'idée est de créer un package npm qui permet de sécuriser son application Next.Js, sans demander de configuration excessive et de connaissances excessives en cybersécurité.

L'objectif de la 1ère release est de permettre de configurer les CORS pour une API construite avec Next.Js.
Il s'agit d'un cas particulier, où notre API est consommée par un front web différent de celui produit par l'app Next qui se trouve sur le même domaine et donc applique la [SOP](https://developer.mozilla.org/fr/docs/Web/Security/Same-origin_policy) (Same-Origin Policy).

Pour plus d'informations, sur comment utiliser le package, qu'est ce que les CORS et dans quelles situations l'utiliser, vous pouvez lire l'article suivant: [Comment configurer CORS pour NextJs](https://dev.to/theodo/how-to-configure-cors-for-nextjs-5ek2)

Pour les prochaines releases, j'ai prévu d'ajouter des middlewares pour sécuriser d'autres aspects d'une application Next.Js, comme les CSP, les headers de sécurité, les cookies, etc.