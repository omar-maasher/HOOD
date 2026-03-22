# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-22)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* add instagram_manage_comments scope to allow bot replies on comments ([c95d8ea](https://github.com/omar-maasher/HOOD/commit/c95d8ea8a7ef8f179568d7903201d0cab3792eb4))
* **admin:** address lint errors and accessibility issues ([e981b8c](https://github.com/omar-maasher/HOOD/commit/e981b8c0700c66b0ad4936b24eb3332fabcf2e33))
* **admin:** resolve client-side exception and hydration mismatch ([ff76df2](https://github.com/omar-maasher/HOOD/commit/ff76df265e32dc8f0cc7e48fb635805874cc5f34))
* **admin:** resolve linting errors and typescript type mismatches ([09f9acf](https://github.com/omar-maasher/HOOD/commit/09f9acffe31712b8523680c518b1d60dbcc5b955))
* **admin:** robust error handling and strict data serialization ([b07d137](https://github.com/omar-maasher/HOOD/commit/b07d137f328757676ab0d64c87c86babed6f82c8))
* **bookings:** show ai-extracted service details in the dashboard ([85446e7](https://github.com/omar-maasher/HOOD/commit/85446e75327babe4702486b14117d70a0bf0b045))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* **chat:** add detailed error messages for n8n troubleshooting ([27248ae](https://github.com/omar-maasher/HOOD/commit/27248ae763b4aea994dd528327451ddc997645fd))
* **chat:** allow n8n to work without db settings ([1a3cc3a](https://github.com/omar-maasher/HOOD/commit/1a3cc3aa5133d9fff45bfd679bc53089fbaf251d))
* **chat:** remove unused variables and fix syntax error ([ea11f3e](https://github.com/omar-maasher/HOOD/commit/ea11f3e537eab1c356516ac67f4120594df2f16e))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* **hooks:** fix lint errors and pass message content to n8n ([6a1b238](https://github.com/omar-maasher/HOOD/commit/6a1b238ff8ee9e05aac5ee94bad9addbcd950ac2))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* **middleware:** protect admin routes and fix Clerk auth error ([9ce4940](https://github.com/omar-maasher/HOOD/commit/9ce49408cdbd08d9d1c280db60e4619c76e64d89))
* prevent instagram bot from replying to its own comments (echo prevention) ([f8d1578](https://github.com/omar-maasher/HOOD/commit/f8d15780d72c3e2b51ecdaec28670cdbd532e8d7))
* resolve admin dashboard 500 error by ensuring serializable data ([6cba386](https://github.com/omar-maasher/HOOD/commit/6cba386caf98e3ac1f059190407d6ec9178df689))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* **ui:** improve mobile responsiveness for tables and landing sections ([653c504](https://github.com/omar-maasher/HOOD/commit/653c504c0e992a62c03aad6e4f3a4955ce9146dc))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add API endpoint for n8n to send bot replies (DMs and Comments) ([0bfbb9c](https://github.com/omar-maasher/HOOD/commit/0bfbb9cadf632a7365846bad8184e21e9d7f43eb))
* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* **admin:** add global settings dashboard and chat auto-scroll ([98a6c48](https://github.com/omar-maasher/HOOD/commit/98a6c48ee8357fa75f148173177bb4f1417315b9))
* **admin:** add global system prompt field ([e9abaaa](https://github.com/omar-maasher/HOOD/commit/e9abaaaabda606d8cfccc6ec17dea9cae7c5ec77))
* **ai:** enable agentic tools for products, business info, and bookings ([6c5a492](https://github.com/omar-maasher/HOOD/commit/6c5a492084e7e6914c329511e23ed7b660a3644b))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* **billing:** finalize hybrid stripe support and fix linting errors ([8338e53](https://github.com/omar-maasher/HOOD/commit/8338e53f410e19b5284b3106a1035b8740907f15))
* **branding:** make free plan footer more subtle and bilingual ([d5185cd](https://github.com/omar-maasher/HOOD/commit/d5185cd2e944811ba49999d77ffeb8fa6e46995e))
* **chat:** fix lint error and update env config ([ba501d4](https://github.com/omar-maasher/HOOD/commit/ba501d4a8d74551068524dcb8e356bece6e97bcf))
* **chat:** implement AI chat widget with n8n integration ([3320808](https://github.com/omar-maasher/HOOD/commit/3320808fe79a9b09e39cc1aac6ab70f10ce23661))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* implement super admin dashboard for platform management ([6c4cfd5](https://github.com/omar-maasher/HOOD/commit/6c4cfd56c605ed6d28e093016d4f56fb02489bc0))
* instagram comments with deduplication ([6cf1047](https://github.com/omar-maasher/HOOD/commit/6cf1047a48ef0326597a43cd8efcb04a797c362d))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))
* **webhooks:** add explicit message type and fix platform detection for audio ([0dab008](https://github.com/omar-maasher/HOOD/commit/0dab008182028a3a553ddef1117b93ff58355879))
* **webhooks:** pass merchant metaAccessToken to n8n for authorized media access ([9dfe7d1](https://github.com/omar-maasher/HOOD/commit/9dfe7d1252d502e9ca6646e4d821b406e0243a5c))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-22)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* add instagram_manage_comments scope to allow bot replies on comments ([c95d8ea](https://github.com/omar-maasher/HOOD/commit/c95d8ea8a7ef8f179568d7903201d0cab3792eb4))
* **admin:** address lint errors and accessibility issues ([e981b8c](https://github.com/omar-maasher/HOOD/commit/e981b8c0700c66b0ad4936b24eb3332fabcf2e33))
* **admin:** resolve client-side exception and hydration mismatch ([ff76df2](https://github.com/omar-maasher/HOOD/commit/ff76df265e32dc8f0cc7e48fb635805874cc5f34))
* **admin:** resolve linting errors and typescript type mismatches ([09f9acf](https://github.com/omar-maasher/HOOD/commit/09f9acffe31712b8523680c518b1d60dbcc5b955))
* **admin:** robust error handling and strict data serialization ([b07d137](https://github.com/omar-maasher/HOOD/commit/b07d137f328757676ab0d64c87c86babed6f82c8))
* **bookings:** show ai-extracted service details in the dashboard ([85446e7](https://github.com/omar-maasher/HOOD/commit/85446e75327babe4702486b14117d70a0bf0b045))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* **chat:** add detailed error messages for n8n troubleshooting ([27248ae](https://github.com/omar-maasher/HOOD/commit/27248ae763b4aea994dd528327451ddc997645fd))
* **chat:** allow n8n to work without db settings ([1a3cc3a](https://github.com/omar-maasher/HOOD/commit/1a3cc3aa5133d9fff45bfd679bc53089fbaf251d))
* **chat:** remove unused variables and fix syntax error ([ea11f3e](https://github.com/omar-maasher/HOOD/commit/ea11f3e537eab1c356516ac67f4120594df2f16e))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* **hooks:** fix lint errors and pass message content to n8n ([6a1b238](https://github.com/omar-maasher/HOOD/commit/6a1b238ff8ee9e05aac5ee94bad9addbcd950ac2))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* **middleware:** protect admin routes and fix Clerk auth error ([9ce4940](https://github.com/omar-maasher/HOOD/commit/9ce49408cdbd08d9d1c280db60e4619c76e64d89))
* prevent instagram bot from replying to its own comments (echo prevention) ([f8d1578](https://github.com/omar-maasher/HOOD/commit/f8d15780d72c3e2b51ecdaec28670cdbd532e8d7))
* resolve admin dashboard 500 error by ensuring serializable data ([6cba386](https://github.com/omar-maasher/HOOD/commit/6cba386caf98e3ac1f059190407d6ec9178df689))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add API endpoint for n8n to send bot replies (DMs and Comments) ([0bfbb9c](https://github.com/omar-maasher/HOOD/commit/0bfbb9cadf632a7365846bad8184e21e9d7f43eb))
* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* **admin:** add global settings dashboard and chat auto-scroll ([98a6c48](https://github.com/omar-maasher/HOOD/commit/98a6c48ee8357fa75f148173177bb4f1417315b9))
* **admin:** add global system prompt field ([e9abaaa](https://github.com/omar-maasher/HOOD/commit/e9abaaaabda606d8cfccc6ec17dea9cae7c5ec77))
* **ai:** enable agentic tools for products, business info, and bookings ([6c5a492](https://github.com/omar-maasher/HOOD/commit/6c5a492084e7e6914c329511e23ed7b660a3644b))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* **billing:** finalize hybrid stripe support and fix linting errors ([8338e53](https://github.com/omar-maasher/HOOD/commit/8338e53f410e19b5284b3106a1035b8740907f15))
* **branding:** make free plan footer more subtle and bilingual ([d5185cd](https://github.com/omar-maasher/HOOD/commit/d5185cd2e944811ba49999d77ffeb8fa6e46995e))
* **chat:** fix lint error and update env config ([ba501d4](https://github.com/omar-maasher/HOOD/commit/ba501d4a8d74551068524dcb8e356bece6e97bcf))
* **chat:** implement AI chat widget with n8n integration ([3320808](https://github.com/omar-maasher/HOOD/commit/3320808fe79a9b09e39cc1aac6ab70f10ce23661))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* implement super admin dashboard for platform management ([6c4cfd5](https://github.com/omar-maasher/HOOD/commit/6c4cfd56c605ed6d28e093016d4f56fb02489bc0))
* instagram comments with deduplication ([6cf1047](https://github.com/omar-maasher/HOOD/commit/6cf1047a48ef0326597a43cd8efcb04a797c362d))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))
* **webhooks:** add explicit message type and fix platform detection for audio ([0dab008](https://github.com/omar-maasher/HOOD/commit/0dab008182028a3a553ddef1117b93ff58355879))
* **webhooks:** pass merchant metaAccessToken to n8n for authorized media access ([9dfe7d1](https://github.com/omar-maasher/HOOD/commit/9dfe7d1252d502e9ca6646e4d821b406e0243a5c))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-22)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* add instagram_manage_comments scope to allow bot replies on comments ([c95d8ea](https://github.com/omar-maasher/HOOD/commit/c95d8ea8a7ef8f179568d7903201d0cab3792eb4))
* **admin:** address lint errors and accessibility issues ([e981b8c](https://github.com/omar-maasher/HOOD/commit/e981b8c0700c66b0ad4936b24eb3332fabcf2e33))
* **admin:** resolve client-side exception and hydration mismatch ([ff76df2](https://github.com/omar-maasher/HOOD/commit/ff76df265e32dc8f0cc7e48fb635805874cc5f34))
* **admin:** resolve linting errors and typescript type mismatches ([09f9acf](https://github.com/omar-maasher/HOOD/commit/09f9acffe31712b8523680c518b1d60dbcc5b955))
* **admin:** robust error handling and strict data serialization ([b07d137](https://github.com/omar-maasher/HOOD/commit/b07d137f328757676ab0d64c87c86babed6f82c8))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* **chat:** add detailed error messages for n8n troubleshooting ([27248ae](https://github.com/omar-maasher/HOOD/commit/27248ae763b4aea994dd528327451ddc997645fd))
* **chat:** allow n8n to work without db settings ([1a3cc3a](https://github.com/omar-maasher/HOOD/commit/1a3cc3aa5133d9fff45bfd679bc53089fbaf251d))
* **chat:** remove unused variables and fix syntax error ([ea11f3e](https://github.com/omar-maasher/HOOD/commit/ea11f3e537eab1c356516ac67f4120594df2f16e))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* **hooks:** fix lint errors and pass message content to n8n ([6a1b238](https://github.com/omar-maasher/HOOD/commit/6a1b238ff8ee9e05aac5ee94bad9addbcd950ac2))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* **middleware:** protect admin routes and fix Clerk auth error ([9ce4940](https://github.com/omar-maasher/HOOD/commit/9ce49408cdbd08d9d1c280db60e4619c76e64d89))
* prevent instagram bot from replying to its own comments (echo prevention) ([f8d1578](https://github.com/omar-maasher/HOOD/commit/f8d15780d72c3e2b51ecdaec28670cdbd532e8d7))
* resolve admin dashboard 500 error by ensuring serializable data ([6cba386](https://github.com/omar-maasher/HOOD/commit/6cba386caf98e3ac1f059190407d6ec9178df689))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add API endpoint for n8n to send bot replies (DMs and Comments) ([0bfbb9c](https://github.com/omar-maasher/HOOD/commit/0bfbb9cadf632a7365846bad8184e21e9d7f43eb))
* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* **admin:** add global settings dashboard and chat auto-scroll ([98a6c48](https://github.com/omar-maasher/HOOD/commit/98a6c48ee8357fa75f148173177bb4f1417315b9))
* **admin:** add global system prompt field ([e9abaaa](https://github.com/omar-maasher/HOOD/commit/e9abaaaabda606d8cfccc6ec17dea9cae7c5ec77))
* **ai:** enable agentic tools for products, business info, and bookings ([6c5a492](https://github.com/omar-maasher/HOOD/commit/6c5a492084e7e6914c329511e23ed7b660a3644b))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* **billing:** finalize hybrid stripe support and fix linting errors ([8338e53](https://github.com/omar-maasher/HOOD/commit/8338e53f410e19b5284b3106a1035b8740907f15))
* **branding:** make free plan footer more subtle and bilingual ([d5185cd](https://github.com/omar-maasher/HOOD/commit/d5185cd2e944811ba49999d77ffeb8fa6e46995e))
* **chat:** fix lint error and update env config ([ba501d4](https://github.com/omar-maasher/HOOD/commit/ba501d4a8d74551068524dcb8e356bece6e97bcf))
* **chat:** implement AI chat widget with n8n integration ([3320808](https://github.com/omar-maasher/HOOD/commit/3320808fe79a9b09e39cc1aac6ab70f10ce23661))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* implement super admin dashboard for platform management ([6c4cfd5](https://github.com/omar-maasher/HOOD/commit/6c4cfd56c605ed6d28e093016d4f56fb02489bc0))
* instagram comments with deduplication ([6cf1047](https://github.com/omar-maasher/HOOD/commit/6cf1047a48ef0326597a43cd8efcb04a797c362d))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))
* **webhooks:** add explicit message type and fix platform detection for audio ([0dab008](https://github.com/omar-maasher/HOOD/commit/0dab008182028a3a553ddef1117b93ff58355879))
* **webhooks:** pass merchant metaAccessToken to n8n for authorized media access ([9dfe7d1](https://github.com/omar-maasher/HOOD/commit/9dfe7d1252d502e9ca6646e4d821b406e0243a5c))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-18)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* add instagram_manage_comments scope to allow bot replies on comments ([c95d8ea](https://github.com/omar-maasher/HOOD/commit/c95d8ea8a7ef8f179568d7903201d0cab3792eb4))
* **admin:** address lint errors and accessibility issues ([e981b8c](https://github.com/omar-maasher/HOOD/commit/e981b8c0700c66b0ad4936b24eb3332fabcf2e33))
* **admin:** resolve client-side exception and hydration mismatch ([ff76df2](https://github.com/omar-maasher/HOOD/commit/ff76df265e32dc8f0cc7e48fb635805874cc5f34))
* **admin:** resolve linting errors and typescript type mismatches ([09f9acf](https://github.com/omar-maasher/HOOD/commit/09f9acffe31712b8523680c518b1d60dbcc5b955))
* **admin:** robust error handling and strict data serialization ([b07d137](https://github.com/omar-maasher/HOOD/commit/b07d137f328757676ab0d64c87c86babed6f82c8))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* **chat:** add detailed error messages for n8n troubleshooting ([27248ae](https://github.com/omar-maasher/HOOD/commit/27248ae763b4aea994dd528327451ddc997645fd))
* **chat:** allow n8n to work without db settings ([1a3cc3a](https://github.com/omar-maasher/HOOD/commit/1a3cc3aa5133d9fff45bfd679bc53089fbaf251d))
* **chat:** remove unused variables and fix syntax error ([ea11f3e](https://github.com/omar-maasher/HOOD/commit/ea11f3e537eab1c356516ac67f4120594df2f16e))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* **hooks:** fix lint errors and pass message content to n8n ([6a1b238](https://github.com/omar-maasher/HOOD/commit/6a1b238ff8ee9e05aac5ee94bad9addbcd950ac2))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* **middleware:** protect admin routes and fix Clerk auth error ([9ce4940](https://github.com/omar-maasher/HOOD/commit/9ce49408cdbd08d9d1c280db60e4619c76e64d89))
* prevent instagram bot from replying to its own comments (echo prevention) ([f8d1578](https://github.com/omar-maasher/HOOD/commit/f8d15780d72c3e2b51ecdaec28670cdbd532e8d7))
* resolve admin dashboard 500 error by ensuring serializable data ([6cba386](https://github.com/omar-maasher/HOOD/commit/6cba386caf98e3ac1f059190407d6ec9178df689))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add API endpoint for n8n to send bot replies (DMs and Comments) ([0bfbb9c](https://github.com/omar-maasher/HOOD/commit/0bfbb9cadf632a7365846bad8184e21e9d7f43eb))
* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* **admin:** add global settings dashboard and chat auto-scroll ([98a6c48](https://github.com/omar-maasher/HOOD/commit/98a6c48ee8357fa75f148173177bb4f1417315b9))
* **admin:** add global system prompt field ([e9abaaa](https://github.com/omar-maasher/HOOD/commit/e9abaaaabda606d8cfccc6ec17dea9cae7c5ec77))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* **billing:** finalize hybrid stripe support and fix linting errors ([8338e53](https://github.com/omar-maasher/HOOD/commit/8338e53f410e19b5284b3106a1035b8740907f15))
* **branding:** make free plan footer more subtle and bilingual ([d5185cd](https://github.com/omar-maasher/HOOD/commit/d5185cd2e944811ba49999d77ffeb8fa6e46995e))
* **chat:** fix lint error and update env config ([ba501d4](https://github.com/omar-maasher/HOOD/commit/ba501d4a8d74551068524dcb8e356bece6e97bcf))
* **chat:** implement AI chat widget with n8n integration ([3320808](https://github.com/omar-maasher/HOOD/commit/3320808fe79a9b09e39cc1aac6ab70f10ce23661))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* implement super admin dashboard for platform management ([6c4cfd5](https://github.com/omar-maasher/HOOD/commit/6c4cfd56c605ed6d28e093016d4f56fb02489bc0))
* instagram comments with deduplication ([6cf1047](https://github.com/omar-maasher/HOOD/commit/6cf1047a48ef0326597a43cd8efcb04a797c362d))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))
* **webhooks:** add explicit message type and fix platform detection for audio ([0dab008](https://github.com/omar-maasher/HOOD/commit/0dab008182028a3a553ddef1117b93ff58355879))
* **webhooks:** pass merchant metaAccessToken to n8n for authorized media access ([9dfe7d1](https://github.com/omar-maasher/HOOD/commit/9dfe7d1252d502e9ca6646e4d821b406e0243a5c))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-18)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* add instagram_manage_comments scope to allow bot replies on comments ([c95d8ea](https://github.com/omar-maasher/HOOD/commit/c95d8ea8a7ef8f179568d7903201d0cab3792eb4))
* **admin:** address lint errors and accessibility issues ([e981b8c](https://github.com/omar-maasher/HOOD/commit/e981b8c0700c66b0ad4936b24eb3332fabcf2e33))
* **admin:** resolve client-side exception and hydration mismatch ([ff76df2](https://github.com/omar-maasher/HOOD/commit/ff76df265e32dc8f0cc7e48fb635805874cc5f34))
* **admin:** resolve linting errors and typescript type mismatches ([09f9acf](https://github.com/omar-maasher/HOOD/commit/09f9acffe31712b8523680c518b1d60dbcc5b955))
* **admin:** robust error handling and strict data serialization ([b07d137](https://github.com/omar-maasher/HOOD/commit/b07d137f328757676ab0d64c87c86babed6f82c8))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* **chat:** add detailed error messages for n8n troubleshooting ([27248ae](https://github.com/omar-maasher/HOOD/commit/27248ae763b4aea994dd528327451ddc997645fd))
* **chat:** allow n8n to work without db settings ([1a3cc3a](https://github.com/omar-maasher/HOOD/commit/1a3cc3aa5133d9fff45bfd679bc53089fbaf251d))
* **chat:** remove unused variables and fix syntax error ([ea11f3e](https://github.com/omar-maasher/HOOD/commit/ea11f3e537eab1c356516ac67f4120594df2f16e))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* **hooks:** fix lint errors and pass message content to n8n ([6a1b238](https://github.com/omar-maasher/HOOD/commit/6a1b238ff8ee9e05aac5ee94bad9addbcd950ac2))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* **middleware:** protect admin routes and fix Clerk auth error ([9ce4940](https://github.com/omar-maasher/HOOD/commit/9ce49408cdbd08d9d1c280db60e4619c76e64d89))
* prevent instagram bot from replying to its own comments (echo prevention) ([f8d1578](https://github.com/omar-maasher/HOOD/commit/f8d15780d72c3e2b51ecdaec28670cdbd532e8d7))
* resolve admin dashboard 500 error by ensuring serializable data ([6cba386](https://github.com/omar-maasher/HOOD/commit/6cba386caf98e3ac1f059190407d6ec9178df689))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add API endpoint for n8n to send bot replies (DMs and Comments) ([0bfbb9c](https://github.com/omar-maasher/HOOD/commit/0bfbb9cadf632a7365846bad8184e21e9d7f43eb))
* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* **admin:** add global settings dashboard and chat auto-scroll ([98a6c48](https://github.com/omar-maasher/HOOD/commit/98a6c48ee8357fa75f148173177bb4f1417315b9))
* **admin:** add global system prompt field ([e9abaaa](https://github.com/omar-maasher/HOOD/commit/e9abaaaabda606d8cfccc6ec17dea9cae7c5ec77))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* **billing:** finalize hybrid stripe support and fix linting errors ([8338e53](https://github.com/omar-maasher/HOOD/commit/8338e53f410e19b5284b3106a1035b8740907f15))
* **branding:** make free plan footer more subtle and bilingual ([d5185cd](https://github.com/omar-maasher/HOOD/commit/d5185cd2e944811ba49999d77ffeb8fa6e46995e))
* **chat:** fix lint error and update env config ([ba501d4](https://github.com/omar-maasher/HOOD/commit/ba501d4a8d74551068524dcb8e356bece6e97bcf))
* **chat:** implement AI chat widget with n8n integration ([3320808](https://github.com/omar-maasher/HOOD/commit/3320808fe79a9b09e39cc1aac6ab70f10ce23661))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* implement super admin dashboard for platform management ([6c4cfd5](https://github.com/omar-maasher/HOOD/commit/6c4cfd56c605ed6d28e093016d4f56fb02489bc0))
* instagram comments with deduplication ([6cf1047](https://github.com/omar-maasher/HOOD/commit/6cf1047a48ef0326597a43cd8efcb04a797c362d))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))
* **webhooks:** pass merchant metaAccessToken to n8n for authorized media access ([9dfe7d1](https://github.com/omar-maasher/HOOD/commit/9dfe7d1252d502e9ca6646e4d821b406e0243a5c))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-18)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* add instagram_manage_comments scope to allow bot replies on comments ([c95d8ea](https://github.com/omar-maasher/HOOD/commit/c95d8ea8a7ef8f179568d7903201d0cab3792eb4))
* **admin:** address lint errors and accessibility issues ([e981b8c](https://github.com/omar-maasher/HOOD/commit/e981b8c0700c66b0ad4936b24eb3332fabcf2e33))
* **admin:** resolve client-side exception and hydration mismatch ([ff76df2](https://github.com/omar-maasher/HOOD/commit/ff76df265e32dc8f0cc7e48fb635805874cc5f34))
* **admin:** resolve linting errors and typescript type mismatches ([09f9acf](https://github.com/omar-maasher/HOOD/commit/09f9acffe31712b8523680c518b1d60dbcc5b955))
* **admin:** robust error handling and strict data serialization ([b07d137](https://github.com/omar-maasher/HOOD/commit/b07d137f328757676ab0d64c87c86babed6f82c8))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* **chat:** add detailed error messages for n8n troubleshooting ([27248ae](https://github.com/omar-maasher/HOOD/commit/27248ae763b4aea994dd528327451ddc997645fd))
* **chat:** allow n8n to work without db settings ([1a3cc3a](https://github.com/omar-maasher/HOOD/commit/1a3cc3aa5133d9fff45bfd679bc53089fbaf251d))
* **chat:** remove unused variables and fix syntax error ([ea11f3e](https://github.com/omar-maasher/HOOD/commit/ea11f3e537eab1c356516ac67f4120594df2f16e))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* **middleware:** protect admin routes and fix Clerk auth error ([9ce4940](https://github.com/omar-maasher/HOOD/commit/9ce49408cdbd08d9d1c280db60e4619c76e64d89))
* prevent instagram bot from replying to its own comments (echo prevention) ([f8d1578](https://github.com/omar-maasher/HOOD/commit/f8d15780d72c3e2b51ecdaec28670cdbd532e8d7))
* resolve admin dashboard 500 error by ensuring serializable data ([6cba386](https://github.com/omar-maasher/HOOD/commit/6cba386caf98e3ac1f059190407d6ec9178df689))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add API endpoint for n8n to send bot replies (DMs and Comments) ([0bfbb9c](https://github.com/omar-maasher/HOOD/commit/0bfbb9cadf632a7365846bad8184e21e9d7f43eb))
* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* **admin:** add global settings dashboard and chat auto-scroll ([98a6c48](https://github.com/omar-maasher/HOOD/commit/98a6c48ee8357fa75f148173177bb4f1417315b9))
* **admin:** add global system prompt field ([e9abaaa](https://github.com/omar-maasher/HOOD/commit/e9abaaaabda606d8cfccc6ec17dea9cae7c5ec77))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* **billing:** finalize hybrid stripe support and fix linting errors ([8338e53](https://github.com/omar-maasher/HOOD/commit/8338e53f410e19b5284b3106a1035b8740907f15))
* **branding:** make free plan footer more subtle and bilingual ([d5185cd](https://github.com/omar-maasher/HOOD/commit/d5185cd2e944811ba49999d77ffeb8fa6e46995e))
* **chat:** fix lint error and update env config ([ba501d4](https://github.com/omar-maasher/HOOD/commit/ba501d4a8d74551068524dcb8e356bece6e97bcf))
* **chat:** implement AI chat widget with n8n integration ([3320808](https://github.com/omar-maasher/HOOD/commit/3320808fe79a9b09e39cc1aac6ab70f10ce23661))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* implement super admin dashboard for platform management ([6c4cfd5](https://github.com/omar-maasher/HOOD/commit/6c4cfd56c605ed6d28e093016d4f56fb02489bc0))
* instagram comments with deduplication ([6cf1047](https://github.com/omar-maasher/HOOD/commit/6cf1047a48ef0326597a43cd8efcb04a797c362d))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))
* **webhooks:** pass merchant metaAccessToken to n8n for authorized media access ([9dfe7d1](https://github.com/omar-maasher/HOOD/commit/9dfe7d1252d502e9ca6646e4d821b406e0243a5c))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-17)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* add instagram_manage_comments scope to allow bot replies on comments ([c95d8ea](https://github.com/omar-maasher/HOOD/commit/c95d8ea8a7ef8f179568d7903201d0cab3792eb4))
* **admin:** address lint errors and accessibility issues ([e981b8c](https://github.com/omar-maasher/HOOD/commit/e981b8c0700c66b0ad4936b24eb3332fabcf2e33))
* **admin:** resolve client-side exception and hydration mismatch ([ff76df2](https://github.com/omar-maasher/HOOD/commit/ff76df265e32dc8f0cc7e48fb635805874cc5f34))
* **admin:** resolve linting errors and typescript type mismatches ([09f9acf](https://github.com/omar-maasher/HOOD/commit/09f9acffe31712b8523680c518b1d60dbcc5b955))
* **admin:** robust error handling and strict data serialization ([b07d137](https://github.com/omar-maasher/HOOD/commit/b07d137f328757676ab0d64c87c86babed6f82c8))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* **chat:** add detailed error messages for n8n troubleshooting ([27248ae](https://github.com/omar-maasher/HOOD/commit/27248ae763b4aea994dd528327451ddc997645fd))
* **chat:** allow n8n to work without db settings ([1a3cc3a](https://github.com/omar-maasher/HOOD/commit/1a3cc3aa5133d9fff45bfd679bc53089fbaf251d))
* **chat:** remove unused variables and fix syntax error ([ea11f3e](https://github.com/omar-maasher/HOOD/commit/ea11f3e537eab1c356516ac67f4120594df2f16e))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* **middleware:** protect admin routes and fix Clerk auth error ([9ce4940](https://github.com/omar-maasher/HOOD/commit/9ce49408cdbd08d9d1c280db60e4619c76e64d89))
* prevent instagram bot from replying to its own comments (echo prevention) ([f8d1578](https://github.com/omar-maasher/HOOD/commit/f8d15780d72c3e2b51ecdaec28670cdbd532e8d7))
* resolve admin dashboard 500 error by ensuring serializable data ([6cba386](https://github.com/omar-maasher/HOOD/commit/6cba386caf98e3ac1f059190407d6ec9178df689))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add API endpoint for n8n to send bot replies (DMs and Comments) ([0bfbb9c](https://github.com/omar-maasher/HOOD/commit/0bfbb9cadf632a7365846bad8184e21e9d7f43eb))
* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* **admin:** add global settings dashboard and chat auto-scroll ([98a6c48](https://github.com/omar-maasher/HOOD/commit/98a6c48ee8357fa75f148173177bb4f1417315b9))
* **admin:** add global system prompt field ([e9abaaa](https://github.com/omar-maasher/HOOD/commit/e9abaaaabda606d8cfccc6ec17dea9cae7c5ec77))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* **billing:** finalize hybrid stripe support and fix linting errors ([8338e53](https://github.com/omar-maasher/HOOD/commit/8338e53f410e19b5284b3106a1035b8740907f15))
* **branding:** make free plan footer more subtle and bilingual ([d5185cd](https://github.com/omar-maasher/HOOD/commit/d5185cd2e944811ba49999d77ffeb8fa6e46995e))
* **chat:** fix lint error and update env config ([ba501d4](https://github.com/omar-maasher/HOOD/commit/ba501d4a8d74551068524dcb8e356bece6e97bcf))
* **chat:** implement AI chat widget with n8n integration ([3320808](https://github.com/omar-maasher/HOOD/commit/3320808fe79a9b09e39cc1aac6ab70f10ce23661))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* implement super admin dashboard for platform management ([6c4cfd5](https://github.com/omar-maasher/HOOD/commit/6c4cfd56c605ed6d28e093016d4f56fb02489bc0))
* instagram comments with deduplication ([6cf1047](https://github.com/omar-maasher/HOOD/commit/6cf1047a48ef0326597a43cd8efcb04a797c362d))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-17)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* add instagram_manage_comments scope to allow bot replies on comments ([c95d8ea](https://github.com/omar-maasher/HOOD/commit/c95d8ea8a7ef8f179568d7903201d0cab3792eb4))
* **admin:** address lint errors and accessibility issues ([e981b8c](https://github.com/omar-maasher/HOOD/commit/e981b8c0700c66b0ad4936b24eb3332fabcf2e33))
* **admin:** resolve client-side exception and hydration mismatch ([ff76df2](https://github.com/omar-maasher/HOOD/commit/ff76df265e32dc8f0cc7e48fb635805874cc5f34))
* **admin:** resolve linting errors and typescript type mismatches ([09f9acf](https://github.com/omar-maasher/HOOD/commit/09f9acffe31712b8523680c518b1d60dbcc5b955))
* **admin:** robust error handling and strict data serialization ([b07d137](https://github.com/omar-maasher/HOOD/commit/b07d137f328757676ab0d64c87c86babed6f82c8))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* **chat:** add detailed error messages for n8n troubleshooting ([27248ae](https://github.com/omar-maasher/HOOD/commit/27248ae763b4aea994dd528327451ddc997645fd))
* **chat:** allow n8n to work without db settings ([1a3cc3a](https://github.com/omar-maasher/HOOD/commit/1a3cc3aa5133d9fff45bfd679bc53089fbaf251d))
* **chat:** remove unused variables and fix syntax error ([ea11f3e](https://github.com/omar-maasher/HOOD/commit/ea11f3e537eab1c356516ac67f4120594df2f16e))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* **middleware:** protect admin routes and fix Clerk auth error ([9ce4940](https://github.com/omar-maasher/HOOD/commit/9ce49408cdbd08d9d1c280db60e4619c76e64d89))
* prevent instagram bot from replying to its own comments (echo prevention) ([f8d1578](https://github.com/omar-maasher/HOOD/commit/f8d15780d72c3e2b51ecdaec28670cdbd532e8d7))
* resolve admin dashboard 500 error by ensuring serializable data ([6cba386](https://github.com/omar-maasher/HOOD/commit/6cba386caf98e3ac1f059190407d6ec9178df689))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add API endpoint for n8n to send bot replies (DMs and Comments) ([0bfbb9c](https://github.com/omar-maasher/HOOD/commit/0bfbb9cadf632a7365846bad8184e21e9d7f43eb))
* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* **admin:** add global settings dashboard and chat auto-scroll ([98a6c48](https://github.com/omar-maasher/HOOD/commit/98a6c48ee8357fa75f148173177bb4f1417315b9))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* **billing:** finalize hybrid stripe support and fix linting errors ([8338e53](https://github.com/omar-maasher/HOOD/commit/8338e53f410e19b5284b3106a1035b8740907f15))
* **branding:** make free plan footer more subtle and bilingual ([d5185cd](https://github.com/omar-maasher/HOOD/commit/d5185cd2e944811ba49999d77ffeb8fa6e46995e))
* **chat:** fix lint error and update env config ([ba501d4](https://github.com/omar-maasher/HOOD/commit/ba501d4a8d74551068524dcb8e356bece6e97bcf))
* **chat:** implement AI chat widget with n8n integration ([3320808](https://github.com/omar-maasher/HOOD/commit/3320808fe79a9b09e39cc1aac6ab70f10ce23661))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* implement super admin dashboard for platform management ([6c4cfd5](https://github.com/omar-maasher/HOOD/commit/6c4cfd56c605ed6d28e093016d4f56fb02489bc0))
* instagram comments with deduplication ([6cf1047](https://github.com/omar-maasher/HOOD/commit/6cf1047a48ef0326597a43cd8efcb04a797c362d))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-17)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* add instagram_manage_comments scope to allow bot replies on comments ([c95d8ea](https://github.com/omar-maasher/HOOD/commit/c95d8ea8a7ef8f179568d7903201d0cab3792eb4))
* **admin:** address lint errors and accessibility issues ([e981b8c](https://github.com/omar-maasher/HOOD/commit/e981b8c0700c66b0ad4936b24eb3332fabcf2e33))
* **admin:** resolve client-side exception and hydration mismatch ([ff76df2](https://github.com/omar-maasher/HOOD/commit/ff76df265e32dc8f0cc7e48fb635805874cc5f34))
* **admin:** resolve linting errors and typescript type mismatches ([09f9acf](https://github.com/omar-maasher/HOOD/commit/09f9acffe31712b8523680c518b1d60dbcc5b955))
* **admin:** robust error handling and strict data serialization ([b07d137](https://github.com/omar-maasher/HOOD/commit/b07d137f328757676ab0d64c87c86babed6f82c8))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* **chat:** add detailed error messages for n8n troubleshooting ([27248ae](https://github.com/omar-maasher/HOOD/commit/27248ae763b4aea994dd528327451ddc997645fd))
* **chat:** allow n8n to work without db settings ([1a3cc3a](https://github.com/omar-maasher/HOOD/commit/1a3cc3aa5133d9fff45bfd679bc53089fbaf251d))
* **chat:** remove unused variables and fix syntax error ([ea11f3e](https://github.com/omar-maasher/HOOD/commit/ea11f3e537eab1c356516ac67f4120594df2f16e))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* **middleware:** protect admin routes and fix Clerk auth error ([9ce4940](https://github.com/omar-maasher/HOOD/commit/9ce49408cdbd08d9d1c280db60e4619c76e64d89))
* prevent instagram bot from replying to its own comments (echo prevention) ([f8d1578](https://github.com/omar-maasher/HOOD/commit/f8d15780d72c3e2b51ecdaec28670cdbd532e8d7))
* resolve admin dashboard 500 error by ensuring serializable data ([6cba386](https://github.com/omar-maasher/HOOD/commit/6cba386caf98e3ac1f059190407d6ec9178df689))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add API endpoint for n8n to send bot replies (DMs and Comments) ([0bfbb9c](https://github.com/omar-maasher/HOOD/commit/0bfbb9cadf632a7365846bad8184e21e9d7f43eb))
* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* **billing:** finalize hybrid stripe support and fix linting errors ([8338e53](https://github.com/omar-maasher/HOOD/commit/8338e53f410e19b5284b3106a1035b8740907f15))
* **branding:** make free plan footer more subtle and bilingual ([d5185cd](https://github.com/omar-maasher/HOOD/commit/d5185cd2e944811ba49999d77ffeb8fa6e46995e))
* **chat:** fix lint error and update env config ([ba501d4](https://github.com/omar-maasher/HOOD/commit/ba501d4a8d74551068524dcb8e356bece6e97bcf))
* **chat:** implement AI chat widget with n8n integration ([3320808](https://github.com/omar-maasher/HOOD/commit/3320808fe79a9b09e39cc1aac6ab70f10ce23661))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* implement super admin dashboard for platform management ([6c4cfd5](https://github.com/omar-maasher/HOOD/commit/6c4cfd56c605ed6d28e093016d4f56fb02489bc0))
* instagram comments with deduplication ([6cf1047](https://github.com/omar-maasher/HOOD/commit/6cf1047a48ef0326597a43cd8efcb04a797c362d))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-17)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* add instagram_manage_comments scope to allow bot replies on comments ([c95d8ea](https://github.com/omar-maasher/HOOD/commit/c95d8ea8a7ef8f179568d7903201d0cab3792eb4))
* **admin:** address lint errors and accessibility issues ([e981b8c](https://github.com/omar-maasher/HOOD/commit/e981b8c0700c66b0ad4936b24eb3332fabcf2e33))
* **admin:** resolve client-side exception and hydration mismatch ([ff76df2](https://github.com/omar-maasher/HOOD/commit/ff76df265e32dc8f0cc7e48fb635805874cc5f34))
* **admin:** resolve linting errors and typescript type mismatches ([09f9acf](https://github.com/omar-maasher/HOOD/commit/09f9acffe31712b8523680c518b1d60dbcc5b955))
* **admin:** robust error handling and strict data serialization ([b07d137](https://github.com/omar-maasher/HOOD/commit/b07d137f328757676ab0d64c87c86babed6f82c8))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* **chat:** allow n8n to work without db settings ([1a3cc3a](https://github.com/omar-maasher/HOOD/commit/1a3cc3aa5133d9fff45bfd679bc53089fbaf251d))
* **chat:** remove unused variables and fix syntax error ([ea11f3e](https://github.com/omar-maasher/HOOD/commit/ea11f3e537eab1c356516ac67f4120594df2f16e))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* **middleware:** protect admin routes and fix Clerk auth error ([9ce4940](https://github.com/omar-maasher/HOOD/commit/9ce49408cdbd08d9d1c280db60e4619c76e64d89))
* prevent instagram bot from replying to its own comments (echo prevention) ([f8d1578](https://github.com/omar-maasher/HOOD/commit/f8d15780d72c3e2b51ecdaec28670cdbd532e8d7))
* resolve admin dashboard 500 error by ensuring serializable data ([6cba386](https://github.com/omar-maasher/HOOD/commit/6cba386caf98e3ac1f059190407d6ec9178df689))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add API endpoint for n8n to send bot replies (DMs and Comments) ([0bfbb9c](https://github.com/omar-maasher/HOOD/commit/0bfbb9cadf632a7365846bad8184e21e9d7f43eb))
* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* **billing:** finalize hybrid stripe support and fix linting errors ([8338e53](https://github.com/omar-maasher/HOOD/commit/8338e53f410e19b5284b3106a1035b8740907f15))
* **branding:** make free plan footer more subtle and bilingual ([d5185cd](https://github.com/omar-maasher/HOOD/commit/d5185cd2e944811ba49999d77ffeb8fa6e46995e))
* **chat:** fix lint error and update env config ([ba501d4](https://github.com/omar-maasher/HOOD/commit/ba501d4a8d74551068524dcb8e356bece6e97bcf))
* **chat:** implement AI chat widget with n8n integration ([3320808](https://github.com/omar-maasher/HOOD/commit/3320808fe79a9b09e39cc1aac6ab70f10ce23661))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* implement super admin dashboard for platform management ([6c4cfd5](https://github.com/omar-maasher/HOOD/commit/6c4cfd56c605ed6d28e093016d4f56fb02489bc0))
* instagram comments with deduplication ([6cf1047](https://github.com/omar-maasher/HOOD/commit/6cf1047a48ef0326597a43cd8efcb04a797c362d))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-17)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* add instagram_manage_comments scope to allow bot replies on comments ([c95d8ea](https://github.com/omar-maasher/HOOD/commit/c95d8ea8a7ef8f179568d7903201d0cab3792eb4))
* **admin:** address lint errors and accessibility issues ([e981b8c](https://github.com/omar-maasher/HOOD/commit/e981b8c0700c66b0ad4936b24eb3332fabcf2e33))
* **admin:** resolve client-side exception and hydration mismatch ([ff76df2](https://github.com/omar-maasher/HOOD/commit/ff76df265e32dc8f0cc7e48fb635805874cc5f34))
* **admin:** resolve linting errors and typescript type mismatches ([09f9acf](https://github.com/omar-maasher/HOOD/commit/09f9acffe31712b8523680c518b1d60dbcc5b955))
* **admin:** robust error handling and strict data serialization ([b07d137](https://github.com/omar-maasher/HOOD/commit/b07d137f328757676ab0d64c87c86babed6f82c8))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* **chat:** remove unused variables and fix syntax error ([ea11f3e](https://github.com/omar-maasher/HOOD/commit/ea11f3e537eab1c356516ac67f4120594df2f16e))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* **middleware:** protect admin routes and fix Clerk auth error ([9ce4940](https://github.com/omar-maasher/HOOD/commit/9ce49408cdbd08d9d1c280db60e4619c76e64d89))
* prevent instagram bot from replying to its own comments (echo prevention) ([f8d1578](https://github.com/omar-maasher/HOOD/commit/f8d15780d72c3e2b51ecdaec28670cdbd532e8d7))
* resolve admin dashboard 500 error by ensuring serializable data ([6cba386](https://github.com/omar-maasher/HOOD/commit/6cba386caf98e3ac1f059190407d6ec9178df689))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add API endpoint for n8n to send bot replies (DMs and Comments) ([0bfbb9c](https://github.com/omar-maasher/HOOD/commit/0bfbb9cadf632a7365846bad8184e21e9d7f43eb))
* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* **billing:** finalize hybrid stripe support and fix linting errors ([8338e53](https://github.com/omar-maasher/HOOD/commit/8338e53f410e19b5284b3106a1035b8740907f15))
* **branding:** make free plan footer more subtle and bilingual ([d5185cd](https://github.com/omar-maasher/HOOD/commit/d5185cd2e944811ba49999d77ffeb8fa6e46995e))
* **chat:** fix lint error and update env config ([ba501d4](https://github.com/omar-maasher/HOOD/commit/ba501d4a8d74551068524dcb8e356bece6e97bcf))
* **chat:** implement AI chat widget with n8n integration ([3320808](https://github.com/omar-maasher/HOOD/commit/3320808fe79a9b09e39cc1aac6ab70f10ce23661))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* implement super admin dashboard for platform management ([6c4cfd5](https://github.com/omar-maasher/HOOD/commit/6c4cfd56c605ed6d28e093016d4f56fb02489bc0))
* instagram comments with deduplication ([6cf1047](https://github.com/omar-maasher/HOOD/commit/6cf1047a48ef0326597a43cd8efcb04a797c362d))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-17)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* add instagram_manage_comments scope to allow bot replies on comments ([c95d8ea](https://github.com/omar-maasher/HOOD/commit/c95d8ea8a7ef8f179568d7903201d0cab3792eb4))
* **admin:** address lint errors and accessibility issues ([e981b8c](https://github.com/omar-maasher/HOOD/commit/e981b8c0700c66b0ad4936b24eb3332fabcf2e33))
* **admin:** resolve client-side exception and hydration mismatch ([ff76df2](https://github.com/omar-maasher/HOOD/commit/ff76df265e32dc8f0cc7e48fb635805874cc5f34))
* **admin:** resolve linting errors and typescript type mismatches ([09f9acf](https://github.com/omar-maasher/HOOD/commit/09f9acffe31712b8523680c518b1d60dbcc5b955))
* **admin:** robust error handling and strict data serialization ([b07d137](https://github.com/omar-maasher/HOOD/commit/b07d137f328757676ab0d64c87c86babed6f82c8))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* **chat:** remove unused variables and fix syntax error ([ea11f3e](https://github.com/omar-maasher/HOOD/commit/ea11f3e537eab1c356516ac67f4120594df2f16e))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* **middleware:** protect admin routes and fix Clerk auth error ([9ce4940](https://github.com/omar-maasher/HOOD/commit/9ce49408cdbd08d9d1c280db60e4619c76e64d89))
* prevent instagram bot from replying to its own comments (echo prevention) ([f8d1578](https://github.com/omar-maasher/HOOD/commit/f8d15780d72c3e2b51ecdaec28670cdbd532e8d7))
* resolve admin dashboard 500 error by ensuring serializable data ([6cba386](https://github.com/omar-maasher/HOOD/commit/6cba386caf98e3ac1f059190407d6ec9178df689))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add API endpoint for n8n to send bot replies (DMs and Comments) ([0bfbb9c](https://github.com/omar-maasher/HOOD/commit/0bfbb9cadf632a7365846bad8184e21e9d7f43eb))
* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* **billing:** finalize hybrid stripe support and fix linting errors ([8338e53](https://github.com/omar-maasher/HOOD/commit/8338e53f410e19b5284b3106a1035b8740907f15))
* **branding:** make free plan footer more subtle and bilingual ([d5185cd](https://github.com/omar-maasher/HOOD/commit/d5185cd2e944811ba49999d77ffeb8fa6e46995e))
* **chat:** implement AI chat widget with n8n integration ([3320808](https://github.com/omar-maasher/HOOD/commit/3320808fe79a9b09e39cc1aac6ab70f10ce23661))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* implement super admin dashboard for platform management ([6c4cfd5](https://github.com/omar-maasher/HOOD/commit/6c4cfd56c605ed6d28e093016d4f56fb02489bc0))
* instagram comments with deduplication ([6cf1047](https://github.com/omar-maasher/HOOD/commit/6cf1047a48ef0326597a43cd8efcb04a797c362d))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-17)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* add instagram_manage_comments scope to allow bot replies on comments ([c95d8ea](https://github.com/omar-maasher/HOOD/commit/c95d8ea8a7ef8f179568d7903201d0cab3792eb4))
* **admin:** address lint errors and accessibility issues ([e981b8c](https://github.com/omar-maasher/HOOD/commit/e981b8c0700c66b0ad4936b24eb3332fabcf2e33))
* **admin:** resolve client-side exception and hydration mismatch ([ff76df2](https://github.com/omar-maasher/HOOD/commit/ff76df265e32dc8f0cc7e48fb635805874cc5f34))
* **admin:** resolve linting errors and typescript type mismatches ([09f9acf](https://github.com/omar-maasher/HOOD/commit/09f9acffe31712b8523680c518b1d60dbcc5b955))
* **admin:** robust error handling and strict data serialization ([b07d137](https://github.com/omar-maasher/HOOD/commit/b07d137f328757676ab0d64c87c86babed6f82c8))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* **middleware:** protect admin routes and fix Clerk auth error ([9ce4940](https://github.com/omar-maasher/HOOD/commit/9ce49408cdbd08d9d1c280db60e4619c76e64d89))
* prevent instagram bot from replying to its own comments (echo prevention) ([f8d1578](https://github.com/omar-maasher/HOOD/commit/f8d15780d72c3e2b51ecdaec28670cdbd532e8d7))
* resolve admin dashboard 500 error by ensuring serializable data ([6cba386](https://github.com/omar-maasher/HOOD/commit/6cba386caf98e3ac1f059190407d6ec9178df689))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add API endpoint for n8n to send bot replies (DMs and Comments) ([0bfbb9c](https://github.com/omar-maasher/HOOD/commit/0bfbb9cadf632a7365846bad8184e21e9d7f43eb))
* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* **billing:** finalize hybrid stripe support and fix linting errors ([8338e53](https://github.com/omar-maasher/HOOD/commit/8338e53f410e19b5284b3106a1035b8740907f15))
* **branding:** make free plan footer more subtle and bilingual ([d5185cd](https://github.com/omar-maasher/HOOD/commit/d5185cd2e944811ba49999d77ffeb8fa6e46995e))
* **chat:** implement AI chat widget with n8n integration ([3320808](https://github.com/omar-maasher/HOOD/commit/3320808fe79a9b09e39cc1aac6ab70f10ce23661))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* implement super admin dashboard for platform management ([6c4cfd5](https://github.com/omar-maasher/HOOD/commit/6c4cfd56c605ed6d28e093016d4f56fb02489bc0))
* instagram comments with deduplication ([6cf1047](https://github.com/omar-maasher/HOOD/commit/6cf1047a48ef0326597a43cd8efcb04a797c362d))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-16)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* add instagram_manage_comments scope to allow bot replies on comments ([c95d8ea](https://github.com/omar-maasher/HOOD/commit/c95d8ea8a7ef8f179568d7903201d0cab3792eb4))
* **admin:** address lint errors and accessibility issues ([e981b8c](https://github.com/omar-maasher/HOOD/commit/e981b8c0700c66b0ad4936b24eb3332fabcf2e33))
* **admin:** resolve client-side exception and hydration mismatch ([ff76df2](https://github.com/omar-maasher/HOOD/commit/ff76df265e32dc8f0cc7e48fb635805874cc5f34))
* **admin:** resolve linting errors and typescript type mismatches ([09f9acf](https://github.com/omar-maasher/HOOD/commit/09f9acffe31712b8523680c518b1d60dbcc5b955))
* **admin:** robust error handling and strict data serialization ([b07d137](https://github.com/omar-maasher/HOOD/commit/b07d137f328757676ab0d64c87c86babed6f82c8))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* **middleware:** protect admin routes and fix Clerk auth error ([9ce4940](https://github.com/omar-maasher/HOOD/commit/9ce49408cdbd08d9d1c280db60e4619c76e64d89))
* prevent instagram bot from replying to its own comments (echo prevention) ([f8d1578](https://github.com/omar-maasher/HOOD/commit/f8d15780d72c3e2b51ecdaec28670cdbd532e8d7))
* resolve admin dashboard 500 error by ensuring serializable data ([6cba386](https://github.com/omar-maasher/HOOD/commit/6cba386caf98e3ac1f059190407d6ec9178df689))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add API endpoint for n8n to send bot replies (DMs and Comments) ([0bfbb9c](https://github.com/omar-maasher/HOOD/commit/0bfbb9cadf632a7365846bad8184e21e9d7f43eb))
* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* **billing:** finalize hybrid stripe support and fix linting errors ([8338e53](https://github.com/omar-maasher/HOOD/commit/8338e53f410e19b5284b3106a1035b8740907f15))
* **branding:** make free plan footer more subtle and bilingual ([d5185cd](https://github.com/omar-maasher/HOOD/commit/d5185cd2e944811ba49999d77ffeb8fa6e46995e))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* implement super admin dashboard for platform management ([6c4cfd5](https://github.com/omar-maasher/HOOD/commit/6c4cfd56c605ed6d28e093016d4f56fb02489bc0))
* instagram comments with deduplication ([6cf1047](https://github.com/omar-maasher/HOOD/commit/6cf1047a48ef0326597a43cd8efcb04a797c362d))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-16)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* add instagram_manage_comments scope to allow bot replies on comments ([c95d8ea](https://github.com/omar-maasher/HOOD/commit/c95d8ea8a7ef8f179568d7903201d0cab3792eb4))
* **admin:** address lint errors and accessibility issues ([e981b8c](https://github.com/omar-maasher/HOOD/commit/e981b8c0700c66b0ad4936b24eb3332fabcf2e33))
* **admin:** resolve client-side exception and hydration mismatch ([ff76df2](https://github.com/omar-maasher/HOOD/commit/ff76df265e32dc8f0cc7e48fb635805874cc5f34))
* **admin:** resolve linting errors and typescript type mismatches ([09f9acf](https://github.com/omar-maasher/HOOD/commit/09f9acffe31712b8523680c518b1d60dbcc5b955))
* **admin:** robust error handling and strict data serialization ([b07d137](https://github.com/omar-maasher/HOOD/commit/b07d137f328757676ab0d64c87c86babed6f82c8))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* **middleware:** protect admin routes and fix Clerk auth error ([9ce4940](https://github.com/omar-maasher/HOOD/commit/9ce49408cdbd08d9d1c280db60e4619c76e64d89))
* prevent instagram bot from replying to its own comments (echo prevention) ([f8d1578](https://github.com/omar-maasher/HOOD/commit/f8d15780d72c3e2b51ecdaec28670cdbd532e8d7))
* resolve admin dashboard 500 error by ensuring serializable data ([6cba386](https://github.com/omar-maasher/HOOD/commit/6cba386caf98e3ac1f059190407d6ec9178df689))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add API endpoint for n8n to send bot replies (DMs and Comments) ([0bfbb9c](https://github.com/omar-maasher/HOOD/commit/0bfbb9cadf632a7365846bad8184e21e9d7f43eb))
* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* **branding:** make free plan footer more subtle and bilingual ([d5185cd](https://github.com/omar-maasher/HOOD/commit/d5185cd2e944811ba49999d77ffeb8fa6e46995e))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* implement super admin dashboard for platform management ([6c4cfd5](https://github.com/omar-maasher/HOOD/commit/6c4cfd56c605ed6d28e093016d4f56fb02489bc0))
* instagram comments with deduplication ([6cf1047](https://github.com/omar-maasher/HOOD/commit/6cf1047a48ef0326597a43cd8efcb04a797c362d))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-16)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* add instagram_manage_comments scope to allow bot replies on comments ([c95d8ea](https://github.com/omar-maasher/HOOD/commit/c95d8ea8a7ef8f179568d7903201d0cab3792eb4))
* **admin:** address lint errors and accessibility issues ([e981b8c](https://github.com/omar-maasher/HOOD/commit/e981b8c0700c66b0ad4936b24eb3332fabcf2e33))
* **admin:** resolve client-side exception and hydration mismatch ([ff76df2](https://github.com/omar-maasher/HOOD/commit/ff76df265e32dc8f0cc7e48fb635805874cc5f34))
* **admin:** resolve linting errors and typescript type mismatches ([09f9acf](https://github.com/omar-maasher/HOOD/commit/09f9acffe31712b8523680c518b1d60dbcc5b955))
* **admin:** robust error handling and strict data serialization ([b07d137](https://github.com/omar-maasher/HOOD/commit/b07d137f328757676ab0d64c87c86babed6f82c8))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* **middleware:** protect admin routes and fix Clerk auth error ([9ce4940](https://github.com/omar-maasher/HOOD/commit/9ce49408cdbd08d9d1c280db60e4619c76e64d89))
* prevent instagram bot from replying to its own comments (echo prevention) ([f8d1578](https://github.com/omar-maasher/HOOD/commit/f8d15780d72c3e2b51ecdaec28670cdbd532e8d7))
* resolve admin dashboard 500 error by ensuring serializable data ([6cba386](https://github.com/omar-maasher/HOOD/commit/6cba386caf98e3ac1f059190407d6ec9178df689))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add API endpoint for n8n to send bot replies (DMs and Comments) ([0bfbb9c](https://github.com/omar-maasher/HOOD/commit/0bfbb9cadf632a7365846bad8184e21e9d7f43eb))
* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* implement super admin dashboard for platform management ([6c4cfd5](https://github.com/omar-maasher/HOOD/commit/6c4cfd56c605ed6d28e093016d4f56fb02489bc0))
* instagram comments with deduplication ([6cf1047](https://github.com/omar-maasher/HOOD/commit/6cf1047a48ef0326597a43cd8efcb04a797c362d))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-16)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* add instagram_manage_comments scope to allow bot replies on comments ([c95d8ea](https://github.com/omar-maasher/HOOD/commit/c95d8ea8a7ef8f179568d7903201d0cab3792eb4))
* **admin:** address lint errors and accessibility issues ([e981b8c](https://github.com/omar-maasher/HOOD/commit/e981b8c0700c66b0ad4936b24eb3332fabcf2e33))
* **admin:** resolve client-side exception and hydration mismatch ([ff76df2](https://github.com/omar-maasher/HOOD/commit/ff76df265e32dc8f0cc7e48fb635805874cc5f34))
* **admin:** robust error handling and strict data serialization ([b07d137](https://github.com/omar-maasher/HOOD/commit/b07d137f328757676ab0d64c87c86babed6f82c8))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* **middleware:** protect admin routes and fix Clerk auth error ([9ce4940](https://github.com/omar-maasher/HOOD/commit/9ce49408cdbd08d9d1c280db60e4619c76e64d89))
* prevent instagram bot from replying to its own comments (echo prevention) ([f8d1578](https://github.com/omar-maasher/HOOD/commit/f8d15780d72c3e2b51ecdaec28670cdbd532e8d7))
* resolve admin dashboard 500 error by ensuring serializable data ([6cba386](https://github.com/omar-maasher/HOOD/commit/6cba386caf98e3ac1f059190407d6ec9178df689))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add API endpoint for n8n to send bot replies (DMs and Comments) ([0bfbb9c](https://github.com/omar-maasher/HOOD/commit/0bfbb9cadf632a7365846bad8184e21e9d7f43eb))
* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* implement super admin dashboard for platform management ([6c4cfd5](https://github.com/omar-maasher/HOOD/commit/6c4cfd56c605ed6d28e093016d4f56fb02489bc0))
* instagram comments with deduplication ([6cf1047](https://github.com/omar-maasher/HOOD/commit/6cf1047a48ef0326597a43cd8efcb04a797c362d))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-16)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* add instagram_manage_comments scope to allow bot replies on comments ([c95d8ea](https://github.com/omar-maasher/HOOD/commit/c95d8ea8a7ef8f179568d7903201d0cab3792eb4))
* **admin:** resolve client-side exception and hydration mismatch ([ff76df2](https://github.com/omar-maasher/HOOD/commit/ff76df265e32dc8f0cc7e48fb635805874cc5f34))
* **admin:** robust error handling and strict data serialization ([b07d137](https://github.com/omar-maasher/HOOD/commit/b07d137f328757676ab0d64c87c86babed6f82c8))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* **middleware:** protect admin routes and fix Clerk auth error ([9ce4940](https://github.com/omar-maasher/HOOD/commit/9ce49408cdbd08d9d1c280db60e4619c76e64d89))
* prevent instagram bot from replying to its own comments (echo prevention) ([f8d1578](https://github.com/omar-maasher/HOOD/commit/f8d15780d72c3e2b51ecdaec28670cdbd532e8d7))
* resolve admin dashboard 500 error by ensuring serializable data ([6cba386](https://github.com/omar-maasher/HOOD/commit/6cba386caf98e3ac1f059190407d6ec9178df689))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add API endpoint for n8n to send bot replies (DMs and Comments) ([0bfbb9c](https://github.com/omar-maasher/HOOD/commit/0bfbb9cadf632a7365846bad8184e21e9d7f43eb))
* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* implement super admin dashboard for platform management ([6c4cfd5](https://github.com/omar-maasher/HOOD/commit/6c4cfd56c605ed6d28e093016d4f56fb02489bc0))
* instagram comments with deduplication ([6cf1047](https://github.com/omar-maasher/HOOD/commit/6cf1047a48ef0326597a43cd8efcb04a797c362d))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-16)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* add instagram_manage_comments scope to allow bot replies on comments ([c95d8ea](https://github.com/omar-maasher/HOOD/commit/c95d8ea8a7ef8f179568d7903201d0cab3792eb4))
* **admin:** resolve client-side exception and hydration mismatch ([ff76df2](https://github.com/omar-maasher/HOOD/commit/ff76df265e32dc8f0cc7e48fb635805874cc5f34))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* prevent instagram bot from replying to its own comments (echo prevention) ([f8d1578](https://github.com/omar-maasher/HOOD/commit/f8d15780d72c3e2b51ecdaec28670cdbd532e8d7))
* resolve admin dashboard 500 error by ensuring serializable data ([6cba386](https://github.com/omar-maasher/HOOD/commit/6cba386caf98e3ac1f059190407d6ec9178df689))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add API endpoint for n8n to send bot replies (DMs and Comments) ([0bfbb9c](https://github.com/omar-maasher/HOOD/commit/0bfbb9cadf632a7365846bad8184e21e9d7f43eb))
* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* implement super admin dashboard for platform management ([6c4cfd5](https://github.com/omar-maasher/HOOD/commit/6c4cfd56c605ed6d28e093016d4f56fb02489bc0))
* instagram comments with deduplication ([6cf1047](https://github.com/omar-maasher/HOOD/commit/6cf1047a48ef0326597a43cd8efcb04a797c362d))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-16)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* add instagram_manage_comments scope to allow bot replies on comments ([c95d8ea](https://github.com/omar-maasher/HOOD/commit/c95d8ea8a7ef8f179568d7903201d0cab3792eb4))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* prevent instagram bot from replying to its own comments (echo prevention) ([f8d1578](https://github.com/omar-maasher/HOOD/commit/f8d15780d72c3e2b51ecdaec28670cdbd532e8d7))
* resolve admin dashboard 500 error by ensuring serializable data ([6cba386](https://github.com/omar-maasher/HOOD/commit/6cba386caf98e3ac1f059190407d6ec9178df689))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add API endpoint for n8n to send bot replies (DMs and Comments) ([0bfbb9c](https://github.com/omar-maasher/HOOD/commit/0bfbb9cadf632a7365846bad8184e21e9d7f43eb))
* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* implement super admin dashboard for platform management ([6c4cfd5](https://github.com/omar-maasher/HOOD/commit/6c4cfd56c605ed6d28e093016d4f56fb02489bc0))
* instagram comments with deduplication ([6cf1047](https://github.com/omar-maasher/HOOD/commit/6cf1047a48ef0326597a43cd8efcb04a797c362d))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-16)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* add instagram_manage_comments scope to allow bot replies on comments ([c95d8ea](https://github.com/omar-maasher/HOOD/commit/c95d8ea8a7ef8f179568d7903201d0cab3792eb4))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* prevent instagram bot from replying to its own comments (echo prevention) ([f8d1578](https://github.com/omar-maasher/HOOD/commit/f8d15780d72c3e2b51ecdaec28670cdbd532e8d7))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add API endpoint for n8n to send bot replies (DMs and Comments) ([0bfbb9c](https://github.com/omar-maasher/HOOD/commit/0bfbb9cadf632a7365846bad8184e21e9d7f43eb))
* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* implement super admin dashboard for platform management ([6c4cfd5](https://github.com/omar-maasher/HOOD/commit/6c4cfd56c605ed6d28e093016d4f56fb02489bc0))
* instagram comments with deduplication ([6cf1047](https://github.com/omar-maasher/HOOD/commit/6cf1047a48ef0326597a43cd8efcb04a797c362d))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-15)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* add instagram_manage_comments scope to allow bot replies on comments ([c95d8ea](https://github.com/omar-maasher/HOOD/commit/c95d8ea8a7ef8f179568d7903201d0cab3792eb4))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* prevent instagram bot from replying to its own comments (echo prevention) ([f8d1578](https://github.com/omar-maasher/HOOD/commit/f8d15780d72c3e2b51ecdaec28670cdbd532e8d7))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add API endpoint for n8n to send bot replies (DMs and Comments) ([0bfbb9c](https://github.com/omar-maasher/HOOD/commit/0bfbb9cadf632a7365846bad8184e21e9d7f43eb))
* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* instagram comments with deduplication ([6cf1047](https://github.com/omar-maasher/HOOD/commit/6cf1047a48ef0326597a43cd8efcb04a797c362d))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-15)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* add instagram_manage_comments scope to allow bot replies on comments ([c95d8ea](https://github.com/omar-maasher/HOOD/commit/c95d8ea8a7ef8f179568d7903201d0cab3792eb4))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add API endpoint for n8n to send bot replies (DMs and Comments) ([0bfbb9c](https://github.com/omar-maasher/HOOD/commit/0bfbb9cadf632a7365846bad8184e21e9d7f43eb))
* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* instagram comments with deduplication ([6cf1047](https://github.com/omar-maasher/HOOD/commit/6cf1047a48ef0326597a43cd8efcb04a797c362d))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-15)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add API endpoint for n8n to send bot replies (DMs and Comments) ([0bfbb9c](https://github.com/omar-maasher/HOOD/commit/0bfbb9cadf632a7365846bad8184e21e9d7f43eb))
* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* instagram comments with deduplication ([6cf1047](https://github.com/omar-maasher/HOOD/commit/6cf1047a48ef0326597a43cd8efcb04a797c362d))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-15)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* instagram comments with deduplication ([6cf1047](https://github.com/omar-maasher/HOOD/commit/6cf1047a48ef0326597a43cd8efcb04a797c362d))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-15)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* handle instagram comments and mentions in webhook ([d22b81d](https://github.com/omar-maasher/HOOD/commit/d22b81d546b3e8851649803cff4ff1c7f72492ae))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-15)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* multi n8n webhooks, localization, and enhanced meta lead profiles ([a53c910](https://github.com/omar-maasher/HOOD/commit/a53c91068a107f1aad4352647c84335fdeeb3efe))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-15)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* correctly identify IG vs Messenger and fetch sender profiles ([3d0a9d9](https://github.com/omar-maasher/HOOD/commit/3d0a9d903ac4936a45579c90cc0c25e7dcd37d37))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-15)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* messenger webhook now correctly routes to n8n ([accd46c](https://github.com/omar-maasher/HOOD/commit/accd46cd1c5a5afec629ff44711e71d38a3cc833))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-15)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize SendMessageModal, AiSettings, Business pages ([26b26b2](https://github.com/omar-maasher/HOOD/commit/26b26b26065c83b092eabec3defd8245f0147d27))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-15)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* localize leads page + auto-add leads from webhook ([27dfec9](https://github.com/omar-maasher/HOOD/commit/27dfec93e18a4f9752e1027b41e64cc588002a93))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-15)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* auto-add leads from incoming WhatsApp/Instagram/Messenger messages ([9bb5a45](https://github.com/omar-maasher/HOOD/commit/9bb5a45137568335f6db16408413be35424cfc93))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-15)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* add send message functionality with templates to leads page ([e8f5246](https://github.com/omar-maasher/HOOD/commit/e8f52469cbdac253f9170574300ae19451b2c146))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-15)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* localize WhatsApp template builder and fix rejection reason display ([fbe778d](https://github.com/omar-maasher/HOOD/commit/fbe778d24c2709ca2dacd296bb09f2dd1a682e7a))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-15)


### Bug Fixes

* add auto-samples for WA variables to prevent immediate rejection ([f4965aa](https://github.com/omar-maasher/HOOD/commit/f4965aab2ac987bde71133ca39de0242dedaa9fc))
* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-15)


### Bug Fixes

* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* improve Meta error logging to include error_data for debugging ([53a9ab5](https://github.com/omar-maasher/HOOD/commit/53a9ab575a4ac5f8b1fc081fc99ed15b2fd7282c))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-15)


### Bug Fixes

* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* complete WhatsApp Template Builder and Meta API integrations ([862468b](https://github.com/omar-maasher/HOOD/commit/862468b070c1775a760fbec535e0c114593631ed))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-15)


### Bug Fixes

* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))
* use native button element to match Instagram/Messenger button size exactly ([a655e81](https://github.com/omar-maasher/HOOD/commit/a655e8107f94ddecb5461493b020a47e4f5625dd))


### Features

* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-15)


### Bug Fixes

* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* hide WhatsApp connect button after linking, match button style to other platforms ([a8aa6e0](https://github.com/omar-maasher/HOOD/commit/a8aa6e0af8affc2454a26c2e45b2a0295314e112))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))


### Features

* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-15)


### Bug Fixes

* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))


### Features

* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-15)


### Bug Fixes

* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use App Access Token for WABA subscribed_apps call with fallback chain ([bdff101](https://github.com/omar-maasher/HOOD/commit/bdff10148092a242eb32b5905ccc4ff640c64041))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))


### Features

* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-15)


### Bug Fixes

* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* show webhook fix button even when WhatsApp is already connected ([ac63f79](https://github.com/omar-maasher/HOOD/commit/ac63f79d6bd4afb407f3aff0cc84c3eeae5abd57))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))


### Features

* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-15)


### Bug Fixes

* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))


### Features

* add fix webhook subscription button to WhatsAppConnect for existing integrations ([2c5f35d](https://github.com/omar-maasher/HOOD/commit/2c5f35db1316df02bf6841474ce2903639c25c58))
* add resubscribe endpoint to fix WABA webhook subscriptions for existing integrations ([2960070](https://github.com/omar-maasher/HOOD/commit/29600705878cc00757e665b7cff7ebf66b49bbe4))
* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-15)


### Bug Fixes

* add detailed webhook diagnostic logging to trace N8N forwarding failure ([0a7bb14](https://github.com/omar-maasher/HOOD/commit/0a7bb148c1e833fb4bc4e68e77742300852cf911))
* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))


### Features

* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-15)


### Bug Fixes

* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))


### Features

* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* smart handling of Meta API error codes and exact WABA targeting ([e80c9a0](https://github.com/omar-maasher/HOOD/commit/e80c9a0eced1a120be511b2c609654eb230572d4))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-15)


### Bug Fixes

* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))


### Features

* force WABA subscribed_apps registration during Embedded Signup to solve missing webhooks ([afc4a80](https://github.com/omar-maasher/HOOD/commit/afc4a80e6bab8d871c430db2861765165a1ecbc0))
* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-14)


### Bug Fixes

* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))


### Features

* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* log raw webhooks from Meta to logger for debugging N8N forwarding ([2221cf4](https://github.com/omar-maasher/HOOD/commit/2221cf46155b34631ce676859f3eb3497ad54d41))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-14)


### Bug Fixes

* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))
* use granular scoped client access token instead of system token override for WABA ID fetching ([875c14c](https://github.com/omar-maasher/HOOD/commit/875c14cbcf47dc34937b8c351032f0c66d3b2ec5))


### Features

* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-14)


### Bug Fixes

* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))


### Features

* implement forced phone number registration request directly into the Meta onboarding pipeline ([598fe65](https://github.com/omar-maasher/HOOD/commit/598fe65f820f60fb6634e498c69e36aea8952240))
* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-14)


### Bug Fixes

* change generic WABA error message ([eddebfe](https://github.com/omar-maasher/HOOD/commit/eddebfe01852d68c72e2e49d9a2db7c4eb8066f6))
* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))


### Features

* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-14)


### Bug Fixes

* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))


### Features

* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))
* use debug_token as fallback to extract WABA target IDs from granular scopes ([76cf0d9](https://github.com/omar-maasher/HOOD/commit/76cf0d90e268ba4fb7bbd9070afb39a855774106))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-14)


### Bug Fixes

* trigger vercel deployment ([0643125](https://github.com/omar-maasher/HOOD/commit/0643125f73e17c712e43bea60b0fd03c89a0e99d))


### Features

* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))

# [1.16.0](https://github.com/omar-maasher/HOOD/compare/v1.15.9...v1.16.0) (2026-03-14)


### Features

* print detailed meta API responses to browser console for debugging ([63ce13c](https://github.com/omar-maasher/HOOD/commit/63ce13c67e4e32d23713ebe740fa838402304a25))

## [1.15.9](https://github.com/omar-maasher/HOOD/compare/v1.15.8...v1.15.9) (2026-03-14)


### Bug Fixes

* disable sys user token upgrade and embed WABA debug info ([1961fa3](https://github.com/omar-maasher/HOOD/commit/1961fa369c3fc3d62c6b49c26ad6fb26d20f3904))

## [1.15.8](https://github.com/omar-maasher/HOOD/compare/v1.15.7...v1.15.8) (2026-03-14)


### Bug Fixes

* re-introduce WhatsApp business manager discovery and fix embedded flow args ([92cba37](https://github.com/omar-maasher/HOOD/commit/92cba37a0b2738b0a4a3f92d1b63cd4a59f05195))

## [1.15.7](https://github.com/omar-maasher/HOOD/compare/v1.15.6...v1.15.7) (2026-03-14)


### Bug Fixes

* resolve messenger scopes and prevent whatsapp embed crash ([62302f5](https://github.com/omar-maasher/HOOD/commit/62302f5cf6384e75be6e5b244d841a3813e11b7f))

## [1.15.6](https://github.com/omar-maasher/HOOD/compare/v1.15.5...v1.15.6) (2026-03-10)


### Bug Fixes

* resolve lint errors and update WABA onboarding parameters ([46731df](https://github.com/omar-maasher/HOOD/commit/46731df60eff994f51120ec5549a6f36ad859c86))

## [1.15.5](https://github.com/omar-maasher/HOOD/compare/v1.15.4...v1.15.5) (2026-03-10)


### Bug Fixes

* implement fallback WABA discovery via Business Managers ([4afd69a](https://github.com/omar-maasher/HOOD/commit/4afd69a2762bef067609cab3acefbfc3a8538047))

## [1.15.4](https://github.com/omar-maasher/HOOD/compare/v1.15.3...v1.15.4) (2026-03-10)


### Bug Fixes

* update WABA fetch logic with fallback to handle nonexisting field error ([a6c06ae](https://github.com/omar-maasher/HOOD/commit/a6c06ae4abb17af2feffd7be4c9bf4ea80aa87ba))

## [1.15.3](https://github.com/omar-maasher/HOOD/compare/v1.15.2...v1.15.3) (2026-03-10)


### Bug Fixes

* improve WhatsApp fetch error details and add explicit scopes ([f90f7db](https://github.com/omar-maasher/HOOD/commit/f90f7db30cc9f3468d737d00e6d9d9fa86a4431b))

## [1.15.2](https://github.com/omar-maasher/HOOD/compare/v1.15.1...v1.15.2) (2026-03-10)


### Bug Fixes

* improve error reporting in WhatsAppConnect ([19c4e3b](https://github.com/omar-maasher/HOOD/commit/19c4e3b34a10fc00e92f5f7d4f12f0f87280086f))

## [1.15.1](https://github.com/omar-maasher/HOOD/compare/v1.15.0...v1.15.1) (2026-03-10)


### Bug Fixes

* resolve redirect_uri mismatch for WhatsApp JS SDK token exchange ([5b2ddb8](https://github.com/omar-maasher/HOOD/commit/5b2ddb8f5e8fed3390365b904726e03aa6aa5dda))

# [1.15.0](https://github.com/omar-maasher/HOOD/compare/v1.14.14...v1.15.0) (2026-03-10)


### Features

* update Meta SDK and Graph API to v25.0 and fix window interface lint ([3fea871](https://github.com/omar-maasher/HOOD/commit/3fea871ea391af335715654da4033cb137a908d5))

## [1.14.14](https://github.com/omar-maasher/HOOD/compare/v1.14.13...v1.14.14) (2026-03-10)


### Bug Fixes

* resolve lint error for global Window interface augmentation ([2e7a7be](https://github.com/omar-maasher/HOOD/commit/2e7a7be2e496959594577896cc70e303e9255aae))

## [1.14.13](https://github.com/omar-maasher/HOOD/compare/v1.14.12...v1.14.13) (2026-03-07)


### Bug Fixes

* update debug payload to expose environment variable status (masked) ([6fcba91](https://github.com/omar-maasher/HOOD/commit/6fcba91766f8657b7c10ba85ac00020d8e87dc23))

## [1.14.12](https://github.com/omar-maasher/HOOD/compare/v1.14.11...v1.14.12) (2026-03-07)


### Bug Fixes

* re-enable test fallback and ensure n8n delivery before responding ([de630c9](https://github.com/omar-maasher/HOOD/commit/de630c90aae9044436d0aca52e5ba7b3a9d9117e))

## [1.14.11](https://github.com/omar-maasher/HOOD/compare/v1.14.10...v1.14.11) (2026-03-07)


### Bug Fixes

* stabilize webhook with serverless execution safety and duplicate prevention ([4e6e78d](https://github.com/omar-maasher/HOOD/commit/4e6e78d3fbfbf92d171d58ed3922774fb93f3957))

## [1.14.10](https://github.com/omar-maasher/HOOD/compare/v1.14.9...v1.14.10) (2026-03-07)


### Bug Fixes

* resolve lint error for unused variable in webhook ([a7678a8](https://github.com/omar-maasher/HOOD/commit/a7678a81438b92ed4ae9b05158d41a19f76ea3ac))

## [1.14.9](https://github.com/omar-maasher/HOOD/compare/v1.14.8...v1.14.9) (2026-03-07)


### Bug Fixes

* add self-test capability to debug endpoint ([88df0d7](https://github.com/omar-maasher/HOOD/commit/88df0d731f6e5b8d7c5f77233fcbba26572ba938))

## [1.14.8](https://github.com/omar-maasher/HOOD/compare/v1.14.7...v1.14.8) (2026-03-07)


### Bug Fixes

* force immediate db logging for incoming webhooks and disable cache on debug page ([40e98ce](https://github.com/omar-maasher/HOOD/commit/40e98ceac6c8a620f5031233e2d3f97bbb1f3dad))

## [1.14.7](https://github.com/omar-maasher/HOOD/compare/v1.14.6...v1.14.7) (2026-03-07)


### Bug Fixes

* update debug payload to read real events from database ([d4e2581](https://github.com/omar-maasher/HOOD/commit/d4e258181926181a4da3d47ad9ef3a1e7071ebf5))

## [1.14.6](https://github.com/omar-maasher/HOOD/compare/v1.14.5...v1.14.6) (2026-03-07)


### Bug Fixes

* remove unused imports in meta webhook route ([eeaf232](https://github.com/omar-maasher/HOOD/commit/eeaf2326e1d39a10da07f46fa526a9e09e2d61cd))

## [1.14.5](https://github.com/omar-maasher/HOOD/compare/v1.14.4...v1.14.5) (2026-03-07)


### Bug Fixes

* add live webhook payload debugger for testing ([7a882f3](https://github.com/omar-maasher/HOOD/commit/7a882f366a412fc2b5b4c775596bad53b6321cd9))

## [1.14.4](https://github.com/omar-maasher/HOOD/compare/v1.14.3...v1.14.4) (2026-03-07)


### Bug Fixes

* add detailed logging for meta webhooks and fix whatsapp structure ([5c0246f](https://github.com/omar-maasher/HOOD/commit/5c0246f2f90c488f96bd7555ee95a3ddddf36365))

## [1.14.3](https://github.com/omar-maasher/HOOD/compare/v1.14.2...v1.14.3) (2026-03-07)


### Bug Fixes

* ensure whatsapp changes structure is correctly processed and sent to n8n ([698c91d](https://github.com/omar-maasher/HOOD/commit/698c91df38ff88bf9017c2b501c530f27fb30c2d))

## [1.14.2](https://github.com/omar-maasher/HOOD/compare/v1.14.1...v1.14.2) (2026-03-07)


### Bug Fixes

* add webhook fallback for testing mode ([d5a7041](https://github.com/omar-maasher/HOOD/commit/d5a70410b940767c0ae76476ef2c4911c0832260))

## [1.14.1](https://github.com/omar-maasher/HOOD/compare/v1.14.0...v1.14.1) (2026-03-07)


### Bug Fixes

* complete whatsapp integration with oauth connection and sending logic ([44c2d28](https://github.com/omar-maasher/HOOD/commit/44c2d280736551b43cec649b13238735da1d5267))

# [1.14.0](https://github.com/omar-maasher/HOOD/compare/v1.13.2...v1.14.0) (2026-03-07)


### Features

* enable whatsapp support for webhooks and messaging API ([dfff07e](https://github.com/omar-maasher/HOOD/commit/dfff07e028b240f529f5b488f4816093d89a927e))

## [1.13.2](https://github.com/omar-maasher/HOOD/compare/v1.13.1...v1.13.2) (2026-03-06)


### Bug Fixes

* final meta webhook stabilization ([5ae537b](https://github.com/omar-maasher/HOOD/commit/5ae537b641957cbdc0b6271bd47bda35aa6ec866))
* **webhook:** ensure all code paths return a value to fix build error ([15064d6](https://github.com/omar-maasher/HOOD/commit/15064d651b2726ba45e9c5439b7688fd00db181b))

## [1.13.1](https://github.com/omar-maasher/HOOD/compare/v1.13.0...v1.13.1) (2026-03-06)


### Bug Fixes

* resolve duplicate message replies and fix lint errors ([351011f](https://github.com/omar-maasher/HOOD/commit/351011fc54f410c29e309fb0bb1f27942accf26f))

# [1.13.0](https://github.com/omar-maasher/HOOD/compare/v1.12.1...v1.13.0) (2026-03-02)


### Features

* complete Meta integration fixes, compliance updates, and UI cleanup ([93c443e](https://github.com/omar-maasher/HOOD/commit/93c443ea7056bdbef40df17a1d5b9135e8236691))

## [1.12.1](https://github.com/omar-maasher/HOOD/compare/v1.12.0...v1.12.1) (2026-03-02)


### Bug Fixes

* maintain locale after Meta OAuth callback and support multi-language success messages ([ac0100e](https://github.com/omar-maasher/HOOD/commit/ac0100ec7f17fe3b939258df914805902d986e80))

# [1.12.0](https://github.com/omar-maasher/HOOD/compare/v1.11.0...v1.12.0) (2026-03-02)


### Features

* implement platform-specific Meta scopes with discovery essentials ([650b5f0](https://github.com/omar-maasher/HOOD/commit/650b5f0753b6b9ea6017cb0082c7bc05f1479a78))


### Reverts

* return Meta integration files to stable version 1.8.5 with compatibility fix ([fcf8499](https://github.com/omar-maasher/HOOD/commit/fcf8499670db34fffc8c54d4068b09a5119689e7))

# [1.11.0](https://github.com/omar-maasher/HOOD/compare/v1.10.1...v1.11.0) (2026-03-02)


### Features

* improve Instagram account discovery and restore essential Meta scopes ([fc38651](https://github.com/omar-maasher/HOOD/commit/fc38651c529aaca6b0e90bd495b487398caf2140))

## [1.10.1](https://github.com/omar-maasher/HOOD/compare/v1.10.0...v1.10.1) (2026-03-02)


### Bug Fixes

* restore essential scopes for Meta account discovery ([20d545c](https://github.com/omar-maasher/HOOD/commit/20d545c12c632803275206b56585bf0ed7a9d365))

# [1.10.0](https://github.com/omar-maasher/HOOD/compare/v1.9.0...v1.10.0) (2026-03-01)


### Features

* implement platform-specific permissions and auto-connection for Meta platforms ([c2161c4](https://github.com/omar-maasher/HOOD/commit/c2161c441aa16ad80efca2cf2b747024714eefd6))

# [1.9.0](https://github.com/omar-maasher/HOOD/compare/v1.8.5...v1.9.0) (2026-03-01)


### Features

* implement platform-specific OAuth scopes for Meta integrations ([245bd54](https://github.com/omar-maasher/HOOD/commit/245bd5490d58593e2e11223b044d504e0aa34508))

## [1.8.5](https://github.com/omar-maasher/HOOD/compare/v1.8.4...v1.8.5) (2026-03-01)


### Bug Fixes

* resolve ts errors in webhook and prevent duplication ([ab4a5d7](https://github.com/omar-maasher/HOOD/commit/ab4a5d7664a22220846f5e393439588d5dff249f))

## [1.8.4](https://github.com/omar-maasher/HOOD/compare/v1.8.3...v1.8.4) (2026-03-01)


### Bug Fixes

* optimize webhook response time with parallel processing ([d23c2f5](https://github.com/omar-maasher/HOOD/commit/d23c2f56a889ddb4c0d6f63e99e2b71303b3ca13))

## [1.8.3](https://github.com/omar-maasher/HOOD/compare/v1.8.2...v1.8.3) (2026-03-01)


### Bug Fixes

* improve meta webhook to prevent duplicate responses and clean up logic ([f1709fc](https://github.com/omar-maasher/HOOD/commit/f1709fc52ecb69a3b9418419057883476ccc26a0))

## [1.8.2](https://github.com/omar-maasher/HOOD/compare/v1.8.1...v1.8.2) (2026-03-01)


### Bug Fixes

* resolve lint errors and update messenger webhook ([59ff879](https://github.com/omar-maasher/HOOD/commit/59ff879624af3effa0ec307d3636e4f54c5a91b8))

## [1.8.1](https://github.com/omar-maasher/HOOD/compare/v1.8.0...v1.8.1) (2026-03-01)


### Bug Fixes

* resolve lint errors and add missing english translations ([7b544d8](https://github.com/omar-maasher/HOOD/commit/7b544d8261f9d30ad9e5446958629946563bee39))

# [1.8.0](https://github.com/omar-maasher/HOOD/compare/v1.7.0...v1.8.0) (2026-03-01)


### Features

* complete meta integrations UI separation and dashboard updates ([96bf1c9](https://github.com/omar-maasher/HOOD/commit/96bf1c9812aabb758ee9b64e2420d4b084076684))

# [1.7.0](https://github.com/omar-maasher/HOOD/compare/v1.6.0...v1.7.0) (2026-03-01)


### Bug Fixes

* await webhook dispatch to prevent vercel freeze ([029db73](https://github.com/omar-maasher/HOOD/commit/029db73b1d66e4538b504205c038e2918011be78))
* fallback lookup for instagram webhook provider id mismatch ([ebd8b48](https://github.com/omar-maasher/HOOD/commit/ebd8b483568408b4459e68a8d600c02b523a5f74))
* ignore bot echo messages and status receipts in webhooks to prevent duplicate responses ([4327e3e](https://github.com/omar-maasher/HOOD/commit/4327e3e40324df3ee06d20e2c6dde1916e8d527c))
* use Facebook Page ID (not Instagram account ID) for Messenger API ([995de62](https://github.com/omar-maasher/HOOD/commit/995de622d30e62505356cac68c2c750ad6210617))


### Features

* sync dashboard integrations status and add seamless i18n support ([98c8ca8](https://github.com/omar-maasher/HOOD/commit/98c8ca8b02a461905d807601a947cddba3803a61))

## [1.6.1](https://github.com/omar-maasher/HOOD/compare/v1.6.0...v1.6.1) (2026-02-28)


### Bug Fixes

* await webhook dispatch to prevent vercel freeze ([029db73](https://github.com/omar-maasher/HOOD/commit/029db73b1d66e4538b504205c038e2918011be78))
* fallback lookup for instagram webhook provider id mismatch ([ebd8b48](https://github.com/omar-maasher/HOOD/commit/ebd8b483568408b4459e68a8d600c02b523a5f74))
* ignore bot echo messages and status receipts in webhooks to prevent duplicate responses ([4327e3e](https://github.com/omar-maasher/HOOD/commit/4327e3e40324df3ee06d20e2c6dde1916e8d527c))
* use Facebook Page ID (not Instagram account ID) for Messenger API ([995de62](https://github.com/omar-maasher/HOOD/commit/995de622d30e62505356cac68c2c750ad6210617))

## [1.6.1](https://github.com/omar-maasher/HOOD/compare/v1.6.0...v1.6.1) (2026-02-28)


### Bug Fixes

* await webhook dispatch to prevent vercel freeze ([029db73](https://github.com/omar-maasher/HOOD/commit/029db73b1d66e4538b504205c038e2918011be78))
* fallback lookup for instagram webhook provider id mismatch ([ebd8b48](https://github.com/omar-maasher/HOOD/commit/ebd8b483568408b4459e68a8d600c02b523a5f74))
* use Facebook Page ID (not Instagram account ID) for Messenger API ([995de62](https://github.com/omar-maasher/HOOD/commit/995de622d30e62505356cac68c2c750ad6210617))

## [1.6.1](https://github.com/omar-maasher/HOOD/compare/v1.6.0...v1.6.1) (2026-02-28)


### Bug Fixes

* await webhook dispatch to prevent vercel freeze ([029db73](https://github.com/omar-maasher/HOOD/commit/029db73b1d66e4538b504205c038e2918011be78))
* fallback lookup for instagram webhook provider id mismatch ([ebd8b48](https://github.com/omar-maasher/HOOD/commit/ebd8b483568408b4459e68a8d600c02b523a5f74))
* use Facebook Page ID (not Instagram account ID) for Messenger API ([995de62](https://github.com/omar-maasher/HOOD/commit/995de622d30e62505356cac68c2c750ad6210617))

## [1.6.1](https://github.com/omar-maasher/HOOD/compare/v1.6.0...v1.6.1) (2026-02-28)


### Bug Fixes

* await webhook dispatch to prevent vercel freeze ([029db73](https://github.com/omar-maasher/HOOD/commit/029db73b1d66e4538b504205c038e2918011be78))
* use Facebook Page ID (not Instagram account ID) for Messenger API ([995de62](https://github.com/omar-maasher/HOOD/commit/995de622d30e62505356cac68c2c750ad6210617))

## [1.6.1](https://github.com/omar-maasher/HOOD/compare/v1.6.0...v1.6.1) (2026-02-28)


### Bug Fixes

* await webhook dispatch to prevent vercel freeze ([029db73](https://github.com/omar-maasher/HOOD/commit/029db73b1d66e4538b504205c038e2918011be78))
* use Facebook Page ID (not Instagram account ID) for Messenger API ([995de62](https://github.com/omar-maasher/HOOD/commit/995de622d30e62505356cac68c2c750ad6210617))

## [1.6.1](https://github.com/omar-maasher/HOOD/compare/v1.6.0...v1.6.1) (2026-02-28)


### Bug Fixes

* await webhook dispatch to prevent vercel freeze ([029db73](https://github.com/omar-maasher/HOOD/commit/029db73b1d66e4538b504205c038e2918011be78))

# [1.6.0](https://github.com/omar-maasher/HOOD/compare/v1.5.0...v1.6.0) (2026-02-27)


### Features

* **integrations:** add working disconnect button and api endpoint ([1eb4e56](https://github.com/omar-maasher/HOOD/commit/1eb4e567811585de2555a6e5e24de44b27e32bcd))

# [1.5.0](https://github.com/omar-maasher/HOOD/compare/v1.4.0...v1.5.0) (2026-02-27)


### Bug Fixes

* **integrations:** correct syntax error in db query to prevent server_error ([8607a84](https://github.com/omar-maasher/HOOD/commit/8607a8478ad1e6e558f534f72fb81a073bf29d54))
* **integrations:** use standard anchor tag for meta oauth redirect to prevent cors issues ([7c3606d](https://github.com/omar-maasher/HOOD/commit/7c3606d1ee402e42c0f9ee18c82136664867df69))
* **integrations:** use standard anchor tag for meta oauth redirect to prevent cors issues ([1533a92](https://github.com/omar-maasher/HOOD/commit/1533a92b5ece041d5fbdf8972cb901e865b089b8))
* **integrations:** wrap db query in try-catch to prevent page crash ([0ed641d](https://github.com/omar-maasher/HOOD/commit/0ed641d4de2a53bf1cb037d05bb6f663b4cf0986))
* remove unused Link import to resolve build error ([62b0ded](https://github.com/omar-maasher/HOOD/commit/62b0dedcb7aa6f66f8f96d520876062117445f40))
* resolve CORS and RSC fetch errors in Meta integration ([c167dc3](https://github.com/omar-maasher/HOOD/commit/c167dc3ae31293b40770d7a00f77bc3a9ca21a1f))
* resolve merge conflict in integrations page ([19c80d3](https://github.com/omar-maasher/HOOD/commit/19c80d3b91bc15c034e7015f0cd87aab51d89c58))
* resolve merge conflict in package.json ([8c52e94](https://github.com/omar-maasher/HOOD/commit/8c52e942dc40b8ee86a4929d0195e1c6f4d73361))


### Features

* **integrations:** auto-fetch and save page access token for instagram messages ([d0713e4](https://github.com/omar-maasher/HOOD/commit/d0713e4ea7387ea15c8c63ae5c28f08b9bf59589))

## [1.4.1](https://github.com/omar-maasher/HOOD/compare/v1.4.0...v1.4.1) (2026-02-27)


### Bug Fixes

* **integrations:** correct syntax error in db query to prevent server_error ([8607a84](https://github.com/omar-maasher/HOOD/commit/8607a8478ad1e6e558f534f72fb81a073bf29d54))
* **integrations:** use standard anchor tag for meta oauth redirect to prevent cors issues ([7c3606d](https://github.com/omar-maasher/HOOD/commit/7c3606d1ee402e42c0f9ee18c82136664867df69))
* **integrations:** use standard anchor tag for meta oauth redirect to prevent cors issues ([1533a92](https://github.com/omar-maasher/HOOD/commit/1533a92b5ece041d5fbdf8972cb901e865b089b8))
* **integrations:** wrap db query in try-catch to prevent page crash ([0ed641d](https://github.com/omar-maasher/HOOD/commit/0ed641d4de2a53bf1cb037d05bb6f663b4cf0986))
* remove unused Link import to resolve build error ([62b0ded](https://github.com/omar-maasher/HOOD/commit/62b0dedcb7aa6f66f8f96d520876062117445f40))
* resolve CORS and RSC fetch errors in Meta integration ([c167dc3](https://github.com/omar-maasher/HOOD/commit/c167dc3ae31293b40770d7a00f77bc3a9ca21a1f))
* resolve merge conflict in integrations page ([19c80d3](https://github.com/omar-maasher/HOOD/commit/19c80d3b91bc15c034e7015f0cd87aab51d89c58))
* resolve merge conflict in package.json ([8c52e94](https://github.com/omar-maasher/HOOD/commit/8c52e942dc40b8ee86a4929d0195e1c6f4d73361))

## [1.4.1](https://github.com/omar-maasher/HOOD/compare/v1.4.0...v1.4.1) (2026-02-27)


### Bug Fixes

* **integrations:** use standard anchor tag for meta oauth redirect to prevent cors issues ([7c3606d](https://github.com/omar-maasher/HOOD/commit/7c3606d1ee402e42c0f9ee18c82136664867df69))
* **integrations:** use standard anchor tag for meta oauth redirect to prevent cors issues ([1533a92](https://github.com/omar-maasher/HOOD/commit/1533a92b5ece041d5fbdf8972cb901e865b089b8))
* **integrations:** wrap db query in try-catch to prevent page crash ([0ed641d](https://github.com/omar-maasher/HOOD/commit/0ed641d4de2a53bf1cb037d05bb6f663b4cf0986))
* remove unused Link import to resolve build error ([62b0ded](https://github.com/omar-maasher/HOOD/commit/62b0dedcb7aa6f66f8f96d520876062117445f40))
* resolve CORS and RSC fetch errors in Meta integration ([c167dc3](https://github.com/omar-maasher/HOOD/commit/c167dc3ae31293b40770d7a00f77bc3a9ca21a1f))
* resolve merge conflict in integrations page ([19c80d3](https://github.com/omar-maasher/HOOD/commit/19c80d3b91bc15c034e7015f0cd87aab51d89c58))
* resolve merge conflict in package.json ([8c52e94](https://github.com/omar-maasher/HOOD/commit/8c52e942dc40b8ee86a4929d0195e1c6f4d73361))

## [1.4.1](https://github.com/omar-maasher/HOOD/compare/v1.4.0...v1.4.1) (2026-02-27)


### Bug Fixes

* **integrations:** use standard anchor tag for meta oauth redirect to prevent cors issues ([7c3606d](https://github.com/omar-maasher/HOOD/commit/7c3606d1ee402e42c0f9ee18c82136664867df69))
* **integrations:** use standard anchor tag for meta oauth redirect to prevent cors issues ([1533a92](https://github.com/omar-maasher/HOOD/commit/1533a92b5ece041d5fbdf8972cb901e865b089b8))
* **integrations:** wrap db query in try-catch to prevent page crash ([0ed641d](https://github.com/omar-maasher/HOOD/commit/0ed641d4de2a53bf1cb037d05bb6f663b4cf0986))
* remove unused Link import to resolve build error ([62b0ded](https://github.com/omar-maasher/HOOD/commit/62b0dedcb7aa6f66f8f96d520876062117445f40))
* resolve CORS and RSC fetch errors in Meta integration ([c167dc3](https://github.com/omar-maasher/HOOD/commit/c167dc3ae31293b40770d7a00f77bc3a9ca21a1f))
* resolve merge conflict in package.json ([8c52e94](https://github.com/omar-maasher/HOOD/commit/8c52e942dc40b8ee86a4929d0195e1c6f4d73361))

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
