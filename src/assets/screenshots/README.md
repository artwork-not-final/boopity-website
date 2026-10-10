# Product screenshots

Captured from a local, isolated Boopity 1.0.1 build on 2026-10-06 (application revision `39e719daa04c25c17445727ecd5fbf18e8586708`).

The example business is **Maple & Paws**. All clients, pets, bookings, and `example.test` addresses are fictional. Email delivery is intercepted locally and outbound provider calls are disabled. No production account or live demo is used.

- `bookings.png`: sitter weekly calendar.
- `services.png`: services and rates offered to clients.
- `clients.png`: sitter client list.

Additional tour captures from the same application revision on 2026-10-07:

- `pet-care.png`: Scout’s health, daily care, and private-note fields.
- `client-booking.png`: an invited client preparing a booking; the form was not submitted.
- `booking-rules.png`: opening hours, approval settings, and notice periods.
- `payments.png`: three seeded manual payment records; no money was collected or moved.
- `branding.png`: business name, colors, regional settings, and logo controls.

The added captures use the same fictional business in a fresh loopback-only fixture. Email codes were intercepted locally, and no Stripe credentials or external provider connections were configured. Full-page captures retain the actual application UI; no controls or values were edited into the images.

These are real application captures, not mockups. Refresh them when the interface changes. Use Astro image components so the built site receives optimized sizes and formats. Capture only the product UI; exclude browser chrome, credentials, private links, and unrelated desktop content.

## Railway walkthrough

Captured on 2026-10-10 from a disposable Railway installation of the published Boopity 1.0.2 image (`ghcr.io/artwork-not-final/boopity@sha256:70407d584f7d8fc9b3df673996e4fcdf82a194ecd3bff07a44c2f118ecec763a`, application revision `2d7a4d2b32175caa4125c02163869db5b20e2473`).

- `railway/deploy.jpg`: template deployment form, requiring no configuration values.
- `railway/service.jpg`: successful deployment and the View logs button. The pictured public hostname belongs to the deleted test installation, not a visitor destination.
- `railway/account.jpg`: fictional Alex Morgan and `owner@example.test` account details.
- `railway/email.jpg`: Resend selected with blank credential fields; nothing was sent or connected.

These are cropped, unaltered UI captures. No startup logs, private setup link, or credentials are included. Railway UI remains the property of Railway; screenshots illustrate its deployment steps, not an endorsement or managed-hosting offer.

Validation covered deployment from the template, HTTPS health, the protected setup handoff, account details saved through a container restart, and temporary-project deletion. The disposable installation did not create an owner or send verification emails, configure Google, or process payments. The maintainer had completed the full wizard on their separate Railway installation before this release. The temporary service was taken offline and its project entered Railway’s 48-hour deletion grace period immediately after capture.
