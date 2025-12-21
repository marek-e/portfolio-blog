---
title: 'TaskFlow'
description: 'A minimalist task management app with real-time sync, keyboard shortcuts, and a focus on getting things done without distractions.'
featured: true
techStack: ['Next.js', 'PostgreSQL', 'Prisma', 'tRPC', 'TypeScript']
role: 'Lead Developer'
links:
  demo: 'https://taskflow.example.com'
  repo: 'https://github.com/melmayan/taskflow'
publishDate: 2024-08-15
---

I built TaskFlow because every todo app I tried was either too complex or too slow. This one loads in under 100ms and supports full keyboard navigation.

The app uses optimistic updates for instant feedback, with background sync to PostgreSQL via tRPC. Real-time collaboration is powered by WebSockets, allowing multiple users to work on shared task lists simultaneously.
