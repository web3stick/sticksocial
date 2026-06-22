# TODO

---

### profile navigation

- [x] **profile child widgets don't re-fetch when `accountId` changes** — `profile_banner.svelte` (bio + name + banner image) and `profile_linktree.svelte` (linktree buttons) both loaded their profile via `onMount(async () => { profile = await get_profile(accountId) })`. when you navigated from `/profile/alice` → `/profile/bob` (e.g. by clicking an `@bob` mention inside `profile_banner`'s bio, which is rendered as `<a href="/profile/$1">` by `fun/post_text.ts`), SvelteKit reused the layout, so `onMount` did NOT re-fire and the banner/linktree stayed on alice's data. `profile_relations.svelte` was already using `$effect` but had no cancellation guard, so an in-flight fetch for the previous accountId could overwrite the new one when the param changed mid-flight. fix: replaced `onMount` with `$effect` keyed on `accountId` in both banner/linktree (with a `cancelled` cleanup flag so late resolves don't clobber fresh state), and added the same cancellation guard + synchronous close over `accountId`+`mode` to `profile_relations.svelte`.

### auth bootstrapping

- [x] **auth state isn't hydrated on initial page load** — `auth.svelte.ts` exports `auth = $state({ isSignedIn: false, accountId: null })` as the default, and `updateAuthStatus()` was only called from a handful of pages (`profile/router/+page.svelte`, `compose/+page.svelte`, `notifications/+page.svelte`, `settings_edit_profile.svelte`, `button_auth.svelte`'s mount). the root `+layout.svelte` never checked, so on a cold load or hard reload the navbar's `auth.isSignedIn` reflected the stale `false` default until the user manually navigated to `/profile/router` (or any page that called `updateAuthStatus`). fix: side-effect script `src/lib/ts/auth_boot.ts` that just calls `updateAuthStatus()` at module load, imported from `+layout.svelte` in the same slot as `hello.ts` — mirrors the `setNetwork_mainnet()` pattern. fire-and-forget; `auth.isSignedIn` / `auth.accountId` get updated once `wallet.getAccounts()` resolves and any widget reading `auth.*` reactively re-renders.

### discover

- [ ] **discover page — actual content** — the page is a stub right now (reset in 53aa971). when we come back to it, design needs to be its own thing, not a duplicate of the global feed. candidates that were considered earlier and not used:
  - **trending hashtags** — near-social-js only exposes `getHashtagFeed(tag)` per-tag, no list-all-tags endpoint. would need either a server-side aggregation or a community-curated tag list.
  - **top accounts by follower count** — `getFollowers` is per-account only; not indexable. would need a follow graph cache.
  - **follow-graph based suggestions** — "people you follow follow X". possible with current APIs but expensive (N follows × N followers).
  
  decide on a direction before re-mounting anything on the page.

==============================================
<br/>
copyright 2026 by sleet.near
