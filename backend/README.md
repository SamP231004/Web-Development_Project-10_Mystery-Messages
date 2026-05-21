# Mystery Messages Spring Boot Backend

This folder contains the Java + Spring Boot migration of the original Next.js API routes.
The frontend files are intentionally unchanged.

## Run

Set environment variables, then run:

```powershell
mvn spring-boot:run
```

Required for normal app behavior:

- `MONGODB_URI`
- `JWT_SECRET` or `NEXTAUTH_SECRET`
- `FRONTEND_ORIGIN`, set this to your deployed frontend origin. You may use a comma-separated list, for example `http://localhost:3000,https://your-app.vercel.app,https://*.vercel.app`.

Optional integrations:

- `MONGODB_DATABASE`, defaults to `test` to match the original Mongoose URI behavior when no database is present in the URI.
- `RESEND_API_KEY`
- `RESEND_FROM`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`, defaults to `gemini-1.5-flash`

## Implemented Routes

- `POST /api/sign-up`
- `GET /api/check-username-unique?username=...`
- `POST /api/verify-code`
- `POST /api/auth/sign-in`
- `POST /api/send-messages`
- `POST /api/suggest-messages`
- `GET /api/get-messages`
- `GET /api/accept-messages`
- `PUT /api/accept-messages`
- `DELETE /api/delete-messages/{messageId}`

Protected routes use a Bearer token returned from `POST /api/auth/sign-in`.

## Data Compatibility

The Mongo document shape is kept compatible with the original Mongoose model:

- collection: `users`
- user id serialized as `_id`
- embedded message id serialized as `_id`
- `isVerified`
- `isAcceptingMessages`
- embedded `messages`
