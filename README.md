Task 1: Build API Endpoints
- Develop API endpoints to connect with MongoDB Atlas
- Create an endpoint to register new users and authenticate existing users. Upon successful authentication, generate an access token that expires after one minute. This access token should be used as an authentication header for subsequent requests
- Implement an endpoint to update user records, accessible by authorized users

Task 2: Implement Stripe Webhook
- Set up an endpoint to accept requests from the Stripe webhook.
- Verify successful payment events from Stripe.
- Upon receiving payment event, update user status to "paid" in the database.
