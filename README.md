# ATI Invoice App

The ATI app is kept in its own project folder, with application files separated into `css/`, `js/`, and `pages/`.

## Included

- Sales tax invoices, purchase invoices, pro forma invoices, and credit notes.
- Editable VAT percentage, with totals recalculated in the invoice preview.
- Per-account cloud invoice storage using the app's existing Firebase Authentication and Firestore setup. Open the dedicated **Saved Invoices** page to search, filter, reopen, or download saved records as JSON.
- A separate subscription page. Live payment checkout is not enabled until a payment provider and secure subscription verification endpoint are configured; see `PAYMENTS.md`.

## Run

Serve this folder from a web server and open `index.html`. Firebase must be configured for the deployed domain, and Firestore Security Rules should limit each user's invoice subcollection to that signed-in user. Do not publish billing secrets in the browser.
