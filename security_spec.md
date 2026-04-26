# Security Specification - KONY 83

## 1. Data Invariants

1.  **Lead Ownership**: A lead must always be associated with the `userId` of the creator and cannot be reassigned.
2.  **Search Integrity**: Search history and presets are strictly private to the user who created them.
3.  **Score Validity**: Intent scores and composite scores must be numeric and between 0 and 100.
4.  **Platform Enforcement**: The `platform` field must be one of the supported social signals.
5.  **Immutability**: `userId`, `savedAt`, and `createdAt` fields must be immutable after document creation.
6.  **Admin Oversight**: The designated admin (`abdokony@gmail.com`) is the only user who could potentially bypass standard ownership checks (though currently restricted to their own data in the rules for maximum privacy).

## 2. The "Dirty Dozen" Payloads (Anti-Patterns)

1.  **Identity Spoofing**: Attempt to create a lead with another user's `userId`.
2.  **Privilege Escalation**: Attempt to update a lead's `userId` to take ownership.
3.  **Shadow Field Injection**: Attempt to create a lead with an extra hidden field like `isAdmin: true`.
4.  **Resource Poisoning**: Create an ID or content field with a massive string (1MB+) to cause denial of wallet.
5.  **State Hijacking**: Update a lead's `compositeScore` without going through the AI intelligence engine.
6.  **Timestamp Fraud**: Provide a client-side timestamp instead of `serverTimestamp()`.
7.  **Relational Orphan**: Create a lead without a required `userId`.
8.  **Type Confusion**: Send a string for `compositeScore` instead of a number.
9.  **Boundary Violation**: Send a `compositeScore` of 101 or -1.
10. **Query Scraping**: Attempt to list leads without a `where` clause on `userId`.
11. **ID Poisoning**: Use a document ID that contains malicious scripts or non-standard characters.
12. **PII Leakage**: Attempt to read another user's lead by guessing their ID.

## 3. Test Runner Strategy

All the above payloads must return `PERMISSION_DENIED` when targeting the Firestore instance.
