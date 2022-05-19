Access token

- Short time

- Sent as JSON
- Client stores in memory
- Do NOT store in local storage or cookie

---

- issued at Authorization
- Client uses for API access until expires
- Verified with Middleware
- New token issued at Refresh request

Refresh token

- Sent as httpOnly cookie
- Not accessible via JavaScript
- Must have expiry at some point

---

- issued at Authorization
- Client uses to request new Access Token
- Veified with endpoint & database
- Must be allowed to expire or logout
