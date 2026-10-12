# Writing and checking sitter guides

The website is the user manual. A reader should be able to finish an ordinary task without opening a Markdown file in the application repository.

## Editorial rules

- Lead with the task and its result. Skip generic introductions about efficiency, flexibility, or security.
- Give the location, actual control label, action, and expected result. Include what to do when the common failure occurs.
- Use short paragraphs, ordered lists for procedures, and tables only when they clarify a comparison or field mapping. Don't number section headings as decorative steps.
- Put a useful example beside a surprising rule. Extra-pet pricing, invitation delivery, and refunds need examples more than reassurance.
- Link to another website guide for a separate task, not as a substitute for the instructions promised by the page title.
- External links may point to provider dashboards/docs, downloads, release notes, and support. Don't hand off routine tasks to `boopity/blob/.../*.md`.
- Keep server commands in Hosting help except short, directly relevant installation/update procedures.
- Don't imply that a status check, provider credential save, or return from checkout proves an end-to-end outcome.
- Never remove material warnings to make copy sound friendlier. Say what could happen in plain language.

## Evidence for this revision

The sitter guides were checked against the application's `main` source after the 1.0.2 release. Existing screenshots retain the versions and validation boundaries recorded in `src/assets/screenshots/README.md`; this revision does not claim fresh provider transactions or restore rehearsals.

| Topic                    | Application source to recheck when behavior changes                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Setup and email          | `src/client/features/setup/`, `src/client/features/settings/`, `src/client/features/auth/`, `docs/guides/email-setup.md` |
| Google and account email | `src/client/features/settings/AccountSettings.tsx`, Google settings UI, auth routes                                      |
| Services                 | `src/client/features/services/ServiceForm.tsx`, `ServiceAvailability.tsx`                                                |
| Client access and pets   | `src/client/features/clients/ClientPortalAccess.tsx`, pet forms, portal response serializers                             |
| Bookings and rules       | `src/client/features/bookings/NewBooking.tsx`, booking detail actions, rules form, availability/policy validation        |
| Payments                 | `src/client/features/payments/`, Stripe provider adapter and webhook event handlers                                      |
| Installation/recovery    | `compose.image.yaml`, `Dockerfile`, `.env.self-hosted.example`, `scripts/start-docker.sh`, management commands           |
| Backups and updates      | `docs/guides/operations.md`, migration/upgrade tests, release notes                                                      |

Provider instructions were checked against Resend's domain/key docs, Google's web OAuth docs, Stripe's keys/event destinations/testing docs, Railway's volume-backup docs, and Docker's volume-backup docs. Links live beside the corresponding instructions. Recheck live provider dashboards when publishing changes to their steps.

The expanded Resend and Google walkthroughs were checked on October 12, 2026 against official provider documentation and Boopity 1.0.2 source. They do not claim a fresh account-creation or delivery test. Keep these details when updating them:

- Resend can generate CNAME records or TXT/MX sending records. Tell readers to use their own generated values; don't hard-code a fixed set or replace existing inbox MX records. The reused email screenshot contains blank credential fields.
- Google’s basic `openid`, email, and profile permissions are exempt from the normal test-user and seven-day authorization restrictions. Boopity's Better Auth Google provider requests only those defaults. Don't imply that all sitters must add every client as a Google test user.
- Google's external-production branding requirements are separate from a working sign-in test. Link real business policy pages, distinguish publishing from verification, and don't promise that Boopity supplies those pages.
- Resend keys and new Google client secrets are only fully shown when created. Test replacements before retiring an existing working credential. No account settings or credentials were changed for this documentation work.

The Stripe permission table is intentionally described as operations the app uses, not a fully certified dashboard preset. Don't upgrade that claim without a controlled restricted-key checkout/refund test. Likewise, don't copy obsolete preview/no-release disclaimers from older application runbooks into current user guides.

## Verification

Run `npm run verify`. In a production preview, check desktop and mobile navigation, long tables/code blocks, in-page links, and search results for everyday words such as “refund” and “email.” Confirm new guides are reachable from the docs home and sidebar. Keep the Railway referral link and disclosure together when editing its walkthrough.
