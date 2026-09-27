# Payment setup

ATI has a subscription page at `pages/subscribe.html`, but checkout is intentionally disabled until a payment provider is configured. The supplied Vivant app contains placeholder PayPal IDs and activates subscriptions directly in browser code; that is not safe to use for paid access.

To enable subscriptions, configure a provider account and public checkout credentials, then add a trusted server endpoint that verifies provider webhooks and writes the verified subscription state to the signed-in user's Firestore profile. Restrict profile writes with Firestore Security Rules so browsers cannot set their own subscription status. Only then should the subscription page expose checkout and the app enforce paid access.

The app owner must provide the provider account, plan and price, and deploy access to the Firebase project before live billing can be completed. No payment credentials or secrets belong in this static website.
