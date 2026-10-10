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
