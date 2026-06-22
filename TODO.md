# TODO

---

### profile / settings

- [ ] **profile edit — only save changed fields** — `settings_edit_profile.svelte` currently always builds and sends the full payload (`name`, `image`, `backgroundImage`, `description`, `linktree.*`) on every save, even when the user only touched one field. that overwrites every field with whatever's in the form, including stale/empty values, and bumps the on-chain profile unnecessarily. fix by diffing the current form values against the freshly-fetched profile (or tracking an initial snapshot in an `$state` after `refresh_profile()`) and only including fields in the payload that actually changed. needs care for `linktree` since partial merges of nested objects are non-trivial — either diff key-by-key or treat linktree as a single blob that only ships when any of its keys change.

### discover

- [ ] **discover page — actual content** — the page is a stub right now (reset in 53aa971). when we come back to it, design needs to be its own thing, not a duplicate of the global feed. candidates that were considered earlier and not used:
  - **trending hashtags** — near-social-js only exposes `getHashtagFeed(tag)` per-tag, no list-all-tags endpoint. would need either a server-side aggregation or a community-curated tag list.
  - **top accounts by follower count** — `getFollowers` is per-account only; not indexable. would need a follow graph cache.
  - **follow-graph based suggestions** — "people you follow follow X". possible with current APIs but expensive (N follows × N followers).
  
  decide on a direction before re-mounting anything on the page.

### /bin debug route

- [ ] **expand /bin for other SDK probes** — currently /bin covers reposts / posts / comments. extend with more probes as we hit them:
  - `notifications` for a given account (per-type rendering + value shapes)
  - `getPost` (single post + comments) to verify the post + comments shape
  - `getFollowers` / `getFollowing` for a given account, including the cross-walk between Record<string,unknown> (following) vs [{accountId}] (followers) shapes — both are confusing and worth seeing in one place
  - `notify` index entries (mentions / likes / reposts notifications) to verify item/ value/ type

==============================================
<br/>
copyright 2026 by sleet.near
