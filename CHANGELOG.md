## [1.4.1](https://github.com/omar-maasher/HOOD/compare/v1.4.0...v1.4.1) (2026-02-27)


### Bug Fixes

* **integrations:** wrap db query in try-catch to prevent page crash ([0ed641d](https://github.com/omar-maasher/HOOD/commit/0ed641d4de2a53bf1cb037d05bb6f663b4cf0986))

# [1.4.0](https://github.com/omar-maasher/HOOD/compare/v1.3.4...v1.4.0) (2026-02-27)


### Features

* make integrations page dynamic and show real db status ([b134e4f](https://github.com/omar-maasher/HOOD/commit/b134e4f446d4efdc0e230e561bef75c232f7688c))

## [1.3.4](https://github.com/omar-maasher/HOOD/compare/v1.3.3...v1.3.4) (2026-02-26)


### Bug Fixes

* re-apply api bypass in middleware ([35010b6](https://github.com/omar-maasher/HOOD/commit/35010b6db8b4b0c8839e812d8d06061f1db71e87))

## [1.3.3](https://github.com/omar-maasher/HOOD/compare/v1.3.2...v1.3.3) (2026-02-26)


### Bug Fixes

* re-apply api bypass in middleware ([ca6d33f](https://github.com/omar-maasher/HOOD/commit/ca6d33f44553f6e8197c68a65be604dbc211e56d))

## [1.3.2](https://github.com/omar-maasher/HOOD/compare/v1.3.1...v1.3.2) (2026-02-26)


### Bug Fixes

* **meta:** correct fb long token integration insert logic ([035a5c9](https://github.com/omar-maasher/HOOD/commit/035a5c9d4504d0fdbcf7378e9f12f4ed8042dd20))

## [1.3.1](https://github.com/omar-maasher/HOOD/compare/v1.3.0...v1.3.1) (2026-02-26)


### Bug Fixes

* bypass intl middleware for API routes to fix 404 on webhooks ([0da7848](https://github.com/omar-maasher/HOOD/commit/0da7848341b8ebd91c383287b265110fc6bd38eb))

# [1.3.0](https://github.com/omar-maasher/HOOD/compare/v1.2.0...v1.3.0) (2026-02-26)


### Features

* enrich webhook payload with organization AI settings ([dd53a73](https://github.com/omar-maasher/HOOD/commit/dd53a73ec2ffc4e781c89fbe6ff6058da3c2ba46))

# [1.2.0](https://github.com/omar-maasher/HOOD/compare/v1.1.1...v1.2.0) (2026-02-26)


### Features

* setup n8n webhook forwarding and meta send API ([a786dd5](https://github.com/omar-maasher/HOOD/commit/a786dd5d03d18c64efdd795033b811a69a5867a8))

## [1.1.1](https://github.com/omar-maasher/HOOD/compare/v1.1.0...v1.1.1) (2026-02-26)


### Bug Fixes

* unused icon imports breaking vercel build ([cc75ccb](https://github.com/omar-maasher/HOOD/commit/cc75ccb7d421af187609cfe7f005f52f6b671cd8))

# [1.1.0](https://github.com/omar-maasher/HOOD/compare/v1.0.8...v1.1.0) (2026-02-26)


### Features

* complete UI redesign, setup dark mode with Cairo font, fix database timeout and add dashboard bento layout ([062d4ab](https://github.com/omar-maasher/HOOD/commit/062d4ab8619c20d75a4225ef9200b37f100793f3))

## [1.0.8](https://github.com/omar-maasher/HOOD/compare/v1.0.7...v1.0.8) (2026-02-26)


### Bug Fixes

* resolve pg import, empty my-account page, add error boundary ([2725cdb](https://github.com/omar-maasher/HOOD/commit/2725cdb9775901cc61b5b851924cddf14ac3e115))

## [1.0.7](https://github.com/omar-maasher/HOOD/compare/v1.0.6...v1.0.7) (2026-02-26)


### Bug Fixes

* add UserProfile to empty my-account page ([238cbdc](https://github.com/omar-maasher/HOOD/commit/238cbdc4c5cf7b15cd3bdf4bbbfe8fde6d251057))
* rewrite subscription page with error handling for Vercel ([038e731](https://github.com/omar-maasher/HOOD/commit/038e731383b66d94e7a513b1f968bad8b88c38d8))
* use correct pg Pool import path ([98e6db9](https://github.com/omar-maasher/HOOD/commit/98e6db94faf6b196f534e26b026b07b3a489fa4f))

## [1.0.6](https://github.com/omar-maasher/HOOD/compare/v1.0.5...v1.0.6) (2026-02-26)


### Bug Fixes

* prevent Server Components crash on subscription and my-account pages ([17afd8c](https://github.com/omar-maasher/HOOD/commit/17afd8c8602161324193b8059733ff812b873166))

## [1.0.5](https://github.com/omar-maasher/HOOD/compare/v1.0.4...v1.0.5) (2026-02-25)


### Bug Fixes

* make Stripe env vars optional ([61cca6d](https://github.com/omar-maasher/HOOD/commit/61cca6d15a3568b70ee5e53d8d43029d2b62653e))

## [1.0.4](https://github.com/omar-maasher/HOOD/compare/v1.0.3...v1.0.4) (2026-02-25)


### Bug Fixes

* add error handling to all dashboard pages ([da350de](https://github.com/omar-maasher/HOOD/commit/da350de3d562c4c13caa1d93535a4b40a809862c))

## [1.0.3](https://github.com/omar-maasher/HOOD/compare/v1.0.2...v1.0.3) (2026-02-25)


### Bug Fixes

* put Arabic first in locales array ([047d7f6](https://github.com/omar-maasher/HOOD/commit/047d7f62616534240126b078032a7425f56c1230))

## [1.0.2](https://github.com/omar-maasher/HOOD/compare/v1.0.1...v1.0.2) (2026-02-25)


### Bug Fixes

* force Arabic as default, disable browser locale detection ([f279521](https://github.com/omar-maasher/HOOD/commit/f279521c16d2772713fa27cc8542ebfdcbe9974e))

## [1.0.1](https://github.com/omar-maasher/HOOD/compare/v1.0.0...v1.0.1) (2026-02-25)


### Bug Fixes

* global-error locale crash and TS errors ([2aac775](https://github.com/omar-maasher/HOOD/commit/2aac775d92d3c90d51685e9dd28263abac4c3b1a))

# 1.0.0 (2026-02-25)


### Bug Fixes

* add demo banner at the top of the landing page ([09bf8c8](https://github.com/omar-maasher/HOOD/commit/09bf8c8aba06eba1405fb0c20aeec23dfb732bb7))
* chnage dashboard index message button in french translation ([2f1dca8](https://github.com/omar-maasher/HOOD/commit/2f1dca84cb05af52a959dd9630769ed661d8c69b))
* clerk integration ([a9981cd](https://github.com/omar-maasher/HOOD/commit/a9981cddcb4a0e2365066938533cd13225ce10a9))
* hide text in logo used in dashboard and add spacing for sign in button used in navbar ([a0eeda1](https://github.com/omar-maasher/HOOD/commit/a0eeda12251551fd6a8e50222f46f3d47f0daad7))
* in dashboard, make the logo smaller, display without text ([f780727](https://github.com/omar-maasher/HOOD/commit/f780727659fa58bbe6e4250dd63b2819369b7308))
* issue to build Next.js with Node.js 22.7, use 22.6 instead ([4acaef9](https://github.com/omar-maasher/HOOD/commit/4acaef95edec3cd72a35405969ece9d55a2bb641))
* redirect user to the landing page after signing out ([6e9f383](https://github.com/omar-maasher/HOOD/commit/6e9f3839daaab56dd3cf3e57287ea0f3862b8588))
* remove custom framework configuration for i18n-ally vscode ([63f87fe](https://github.com/omar-maasher/HOOD/commit/63f87feb3c0cb186c500ef9bed9cb50d7309224d))
* remove hydration error and unify with pro version 1.6.1 ([ea2d02b](https://github.com/omar-maasher/HOOD/commit/ea2d02bd52de34c6cd2390d160ffe7f14319d5c3))
* remove update deps github workflow, add separator in dashboard header ([fcf0fb4](https://github.com/omar-maasher/HOOD/commit/fcf0fb48304ce45f6ceefa7d7eae11692655c749))
* resolve all TypeScript errors ([c00074a](https://github.com/omar-maasher/HOOD/commit/c00074ab2f455a02a5a3510555c2afdbb3b69bc9))
* update checkly.config.ts ([61424bf](https://github.com/omar-maasher/HOOD/commit/61424bfa71764c08d349b7555c5f8696b070ffb5))
* update clerk to the latest version and update middlware to use await with auth ([2287192](https://github.com/omar-maasher/HOOD/commit/2287192ddcf5b27a1f43ac2b7a992e065b990627))
* update logicalId in checkly configuration ([6e7a479](https://github.com/omar-maasher/HOOD/commit/6e7a4795bff0b92d3681fadc36256aa957eb2613))
* use new vitest vscode setting for preventing automatic opening of the test results ([2a2b945](https://github.com/omar-maasher/HOOD/commit/2a2b945050f8d19883d6f2a8a6ec5ccf8b1f4173))


### Features

* add custom framework for i18n-ally and replace deprecated Jest VSCode configuration ([a9889dc](https://github.com/omar-maasher/HOOD/commit/a9889dc129aeeba8801f4f47e54d46e9515e6a29))
* add link to the GitHub repository ([ed42176](https://github.com/omar-maasher/HOOD/commit/ed42176bdc2776cacc2c939bac45914a1ede8e51))
* create dashboard header component ([f3dc1da](https://github.com/omar-maasher/HOOD/commit/f3dc1da451ab8dce90d111fe4bbc8d4bc99e4b01))
* dashboard redesign, subscription page, pricing updates, all modules ([fded9ec](https://github.com/omar-maasher/HOOD/commit/fded9ecc3f597106c2b1d36f0a90e53d6bc4a144))
* don't redirect to organization-selection if the user is already on this page ([87da997](https://github.com/omar-maasher/HOOD/commit/87da997b853fd9dcb7992107d2cb206817258910))
* initial commit ([d58e1d9](https://github.com/omar-maasher/HOOD/commit/d58e1d97e11baa0a756bd038332eb84daf5a8327))
* launching SaaS boilerplate for helping developers to build SaaS quickly ([7f24661](https://github.com/omar-maasher/HOOD/commit/7f246618791e3a731347dffc694a52fa90b1152a))
* make the landing page responsive and works on mobile ([27e908a](https://github.com/omar-maasher/HOOD/commit/27e908a735ea13845a6cc42acc12e6cae3232b9b))
* make user dashboard responsive ([f88c9dd](https://github.com/omar-maasher/HOOD/commit/f88c9dd5ac51339d37d1d010e5b16c7776c73b8d))
* migreate Env.mjs file to Env.ts ([2e6ff12](https://github.com/omar-maasher/HOOD/commit/2e6ff124dcc10a3c12cac672cbb82ec4000dc60c))
* remove next-sitemap and use the native Next.js sitemap/robots.txt ([75c9751](https://github.com/omar-maasher/HOOD/commit/75c9751d607b8a6a269d08667f7d9900797ff38a))
* update de Next.js Boilerplate v3.58.1 ([16aea65](https://github.com/omar-maasher/HOOD/commit/16aea651ef93ed627e3bf310412cfd3651aeb3e4))
* update to Drizzle Kit 0.22, Storybook 8, migrate to vitest ([c2f19cd](https://github.com/omar-maasher/HOOD/commit/c2f19cd8e9dc983e0ad799da2474610b57b88f50))
* update to Next.js Boilerpalte v3.54 ([ae80843](https://github.com/omar-maasher/HOOD/commit/ae808433e50d6889559fff382d4b9c595d34e04f))
* upgrade to Clerk v5 and use Clerk's Core 2 ([a92cef0](https://github.com/omar-maasher/HOOD/commit/a92cef026b5c85a703f707aabf42d28a16f07054))
* use Node.js version 20 and 22 in GitHub Actions ([226b5e9](https://github.com/omar-maasher/HOOD/commit/226b5e970f46bfcd384ca60cd63ebb15516eca21))
* vscode jest open test result view on test fails and add unauthenticatedUrl in clerk middleware ([3cfcb6b](https://github.com/omar-maasher/HOOD/commit/3cfcb6b00d91dabcb00cbf8eb2d8be6533ff672e))

## [1.7.7](https://github.com/ixartz/SaaS-Boilerplate/compare/v1.7.6...v1.7.7) (2025-12-12)


### Bug Fixes

* update checkly.config.ts ([61424bf](https://github.com/ixartz/SaaS-Boilerplate/commit/61424bfa71764c08d349b7555c5f8696b070ffb5))

## [1.7.6](https://github.com/ixartz/SaaS-Boilerplate/compare/v1.7.5...v1.7.6) (2025-05-01)


### Bug Fixes

* update clerk to the latest version and update middlware to use await with auth ([2287192](https://github.com/ixartz/SaaS-Boilerplate/commit/2287192ddcf5b27a1f43ac2b7a992e065b990627))

## [1.7.5](https://github.com/ixartz/SaaS-Boilerplate/compare/v1.7.4...v1.7.5) (2025-05-01)


### Bug Fixes

* clerk integration ([a9981cd](https://github.com/ixartz/SaaS-Boilerplate/commit/a9981cddcb4a0e2365066938533cd13225ce10a9))

## [1.7.4](https://github.com/ixartz/SaaS-Boilerplate/compare/v1.7.3...v1.7.4) (2024-12-20)


### Bug Fixes

* remove custom framework configuration for i18n-ally vscode ([63f87fe](https://github.com/ixartz/SaaS-Boilerplate/commit/63f87feb3c0cb186c500ef9bed9cb50d7309224d))
* use new vitest vscode setting for preventing automatic opening of the test results ([2a2b945](https://github.com/ixartz/SaaS-Boilerplate/commit/2a2b945050f8d19883d6f2a8a6ec5ccf8b1f4173))

## [1.7.3](https://github.com/ixartz/SaaS-Boilerplate/compare/v1.7.2...v1.7.3) (2024-11-07)


### Bug Fixes

* chnage dashboard index message button in french translation ([2f1dca8](https://github.com/ixartz/SaaS-Boilerplate/commit/2f1dca84cb05af52a959dd9630769ed661d8c69b))
* remove update deps github workflow, add separator in dashboard header ([fcf0fb4](https://github.com/ixartz/SaaS-Boilerplate/commit/fcf0fb48304ce45f6ceefa7d7eae11692655c749))

## [1.7.2](https://github.com/ixartz/SaaS-Boilerplate/compare/v1.7.1...v1.7.2) (2024-10-17)


### Bug Fixes

* hide text in logo used in dashboard and add spacing for sign in button used in navbar ([a0eeda1](https://github.com/ixartz/SaaS-Boilerplate/commit/a0eeda12251551fd6a8e50222f46f3d47f0daad7))
* in dashboard, make the logo smaller, display without text ([f780727](https://github.com/ixartz/SaaS-Boilerplate/commit/f780727659fa58bbe6e4250dd63b2819369b7308))
* remove hydration error and unify with pro version 1.6.1 ([ea2d02b](https://github.com/ixartz/SaaS-Boilerplate/commit/ea2d02bd52de34c6cd2390d160ffe7f14319d5c3))

## [1.7.1](https://github.com/ixartz/SaaS-Boilerplate/compare/v1.7.0...v1.7.1) (2024-10-04)


### Bug Fixes

* update logicalId in checkly configuration ([6e7a479](https://github.com/ixartz/SaaS-Boilerplate/commit/6e7a4795bff0b92d3681fadc36256aa957eb2613))

# [1.7.0](https://github.com/ixartz/SaaS-Boilerplate/compare/v1.6.1...v1.7.0) (2024-10-04)


### Features

* update de Next.js Boilerplate v3.58.1 ([16aea65](https://github.com/ixartz/SaaS-Boilerplate/commit/16aea651ef93ed627e3bf310412cfd3651aeb3e4))

## [1.6.1](https://github.com/ixartz/SaaS-Boilerplate/compare/v1.6.0...v1.6.1) (2024-08-31)


### Bug Fixes

* add demo banner at the top of the landing page ([09bf8c8](https://github.com/ixartz/SaaS-Boilerplate/commit/09bf8c8aba06eba1405fb0c20aeec23dfb732bb7))
* issue to build Next.js with Node.js 22.7, use 22.6 instead ([4acaef9](https://github.com/ixartz/SaaS-Boilerplate/commit/4acaef95edec3cd72a35405969ece9d55a2bb641))

# [1.6.0](https://github.com/ixartz/SaaS-Boilerplate/compare/v1.5.0...v1.6.0) (2024-07-26)


### Features

* update to Next.js Boilerpalte v3.54 ([ae80843](https://github.com/ixartz/SaaS-Boilerplate/commit/ae808433e50d6889559fff382d4b9c595d34e04f))

# [1.5.0](https://github.com/ixartz/SaaS-Boilerplate/compare/v1.4.0...v1.5.0) (2024-06-05)


### Features

* update to Drizzle Kit 0.22, Storybook 8, migrate to vitest ([c2f19cd](https://github.com/ixartz/SaaS-Boilerplate/commit/c2f19cd8e9dc983e0ad799da2474610b57b88f50))

# [1.4.0](https://github.com/ixartz/SaaS-Boilerplate/compare/v1.3.0...v1.4.0) (2024-05-17)


### Features

* vscode jest open test result view on test fails and add unauthenticatedUrl in clerk middleware ([3cfcb6b](https://github.com/ixartz/SaaS-Boilerplate/commit/3cfcb6b00d91dabcb00cbf8eb2d8be6533ff672e))

# [1.3.0](https://github.com/ixartz/SaaS-Boilerplate/compare/v1.2.1...v1.3.0) (2024-05-16)


### Features

* add custom framework for i18n-ally and replace deprecated Jest VSCode configuration ([a9889dc](https://github.com/ixartz/SaaS-Boilerplate/commit/a9889dc129aeeba8801f4f47e54d46e9515e6a29))
* create dashboard header component ([f3dc1da](https://github.com/ixartz/SaaS-Boilerplate/commit/f3dc1da451ab8dce90d111fe4bbc8d4bc99e4b01))
* don't redirect to organization-selection if the user is already on this page ([87da997](https://github.com/ixartz/SaaS-Boilerplate/commit/87da997b853fd9dcb7992107d2cb206817258910))
* make the landing page responsive and works on mobile ([27e908a](https://github.com/ixartz/SaaS-Boilerplate/commit/27e908a735ea13845a6cc42acc12e6cae3232b9b))
* make user dashboard responsive ([f88c9dd](https://github.com/ixartz/SaaS-Boilerplate/commit/f88c9dd5ac51339d37d1d010e5b16c7776c73b8d))
* migreate Env.mjs file to Env.ts ([2e6ff12](https://github.com/ixartz/SaaS-Boilerplate/commit/2e6ff124dcc10a3c12cac672cbb82ec4000dc60c))
* remove next-sitemap and use the native Next.js sitemap/robots.txt ([75c9751](https://github.com/ixartz/SaaS-Boilerplate/commit/75c9751d607b8a6a269d08667f7d9900797ff38a))
* upgrade to Clerk v5 and use Clerk's Core 2 ([a92cef0](https://github.com/ixartz/SaaS-Boilerplate/commit/a92cef026b5c85a703f707aabf42d28a16f07054))
* use Node.js version 20 and 22 in GitHub Actions ([226b5e9](https://github.com/ixartz/SaaS-Boilerplate/commit/226b5e970f46bfcd384ca60cd63ebb15516eca21))

## [1.2.1](https://github.com/ixartz/SaaS-Boilerplate/compare/v1.2.0...v1.2.1) (2024-03-30)


### Bug Fixes

* redirect user to the landing page after signing out ([6e9f383](https://github.com/ixartz/SaaS-Boilerplate/commit/6e9f3839daaab56dd3cf3e57287ea0f3862b8588))

# [1.2.0](https://github.com/ixartz/SaaS-Boilerplate/compare/v1.1.0...v1.2.0) (2024-03-29)


### Features

* add link to the GitHub repository ([ed42176](https://github.com/ixartz/SaaS-Boilerplate/commit/ed42176bdc2776cacc2c939bac45914a1ede8e51))

# [1.1.0](https://github.com/ixartz/SaaS-Boilerplate/compare/v1.0.0...v1.1.0) (2024-03-29)


### Features

* launching SaaS boilerplate for helping developers to build SaaS quickly ([7f24661](https://github.com/ixartz/SaaS-Boilerplate/commit/7f246618791e3a731347dffc694a52fa90b1152a))

# 1.0.0 (2024-03-29)


### Features

* initial commit ([d58e1d9](https://github.com/ixartz/SaaS-Boilerplate/commit/d58e1d97e11baa0a756bd038332eb84daf5a8327))
