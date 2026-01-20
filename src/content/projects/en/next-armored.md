---
title: 'Next Armored'
description: 'NextJs middleware toolkit to secure your application with flexibility and ease. Default configurations are based on best practices and security standards.'
featured: true
techStack: ['TypeScript', 'Next.js', 'Node.js', "Security"]
links:
  demo: 'https://www.npmjs.com/package/next-armored'
  repo: 'https://github.com/marek-e/next-armored'
publishDate: 2025-01-24
image: '/projects/n-armor.svg'
imageAlt: 'Next Armored logo - armor with N letter'
status: 'in-progress'
---

Next Armored is a npm package to secure your Next.Js application with flexibility and ease. Default configurations are based on best practices and security standards. 

It's my first open-source project. The idea is to create a npm package that allows to secure a Next.Js application, without requiring excessive configuration and knowledge of cybersecurity.

The first release is to configure CORS for an API built with Next.Js.
It's a special case, where our API is consumed by a different web front-end than the one produced by the Next app itself, which is on the same domain and therefore applies the [SOP](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy) (Same-Origin Policy).

For more information, on how to use the package, what are CORS and in which situations to use them, you can read the following article: [How to configure CORS for NextJs](https://dev.to/theodo/how-to-configure-cors-for-nextjs-5ek2)

For the next releases, I plan to add middlewares to secure other aspects of a Next.Js application, like CSP, security headers, cookies, etc.
