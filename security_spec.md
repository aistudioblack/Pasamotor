# Firestore Rules Security Spec

## Data Invariants
1. A post can only be created by an Admin, and must have a valid title and slug.
2. Messages can be created by anyone, but must include valid email, name, phone, subject, and message under size constraints to prevent resource exhaustion attacks.
3. Users collection stores the authorization roles. It cannot be modified by users themselves. It can only be modified by admins.
4. Product and Site Content data are public read-only, but strict admin-only write.

## Dirty Dozen Payloads
1. **Shadow Field Attack**: Adding `isAdmin: true` to a message payload.
2. **Resource Exhaustion**: Sending a 5MB string in the message text.
3. **Role Escalation**: Normal user trying to update their role to `admin` in `users` collection.
4. **Invalid ID Injection**: Injecting a long string `../users/fake` into a document ID.
5. **Type Mismatch**: Sending `price` as a string instead of a number for a product.
6. **Unauthenticated Write**: Creating a product without being signed in.
7. **Bypass Query Filter**: Fetching `posts` collection without filtering for `is_published == true`.
8. **Malformed Slug**: Sending a post with a space or special character in the slug.
9. **Deletion Escalation**: Non-admins attempting to delete an FAQ.
10. **Ghost User Write**: Creating a `users` document without being an admin.
11. **Excessive Tags/Arrays**: Sending an array with 10,000 items in a product's images list.
12. **Missing Required Fields**: Sending a message without an email.

## Test Runner
See `firestore.rules.test.ts`.
