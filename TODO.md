# TODO

---

### profile navigation

- [x] **profile child widgets don't re-fetch when `accountId` changes** — `profile_banner.svelte` (bio + name + banner image) and `profile_linktree.svelte` (linktree buttons) both loaded their profile via `onMount(async () => { profile = await get_profile(accountId) })`. when you navigated from `/profile/alice` → `/profile/bob` (e.g. by clicking an `@bob` mention inside `profile_banner`'s bio, which is rendered as `<a href="/profile/$1">` by `fun/post_text.ts`), SvelteKit reused the layout, so `onMount` did NOT re-fire and the banner/linktree stayed on alice's data. `profile_relations.svelte` was already using `$effect` but had no cancellation guard, so an in-flight fetch for the previous accountId could overwrite the new one when the param changed mid-flight. fix: replaced `onMount` with `$effect` keyed on `accountId` in both banner/linktree (with a `cancelled` cleanup flag so late resolves don't clobber fresh state), and added the same cancellation guard + synchronous close over `accountId`+`mode` to `profile_relations.svelte`.

### profile edit (settings)

- [x] **add file-upload + live preview to `settings_edit_profile.svelte`** — the form previously only accepted URL strings for `image` / `backgroundImage`. fix: extracted the IPFS upload into a shared `upload_image_fun(file): Promise<string>` helper at `src/lib/widgets/fun/upload_image.ts` (handles both bare-cid and `{cid}` response shapes, throws on non-2xx). `compose_post_form.svelte` now calls the helper instead of inlining the fetch. `settings_edit_profile.svelte` got per-control upload buttons, `$derived` preview srcs, and `.banner-preview` / `.pic-preview` styling that matches `profile_banner.svelte`'s dimensions. uploads set `imageUrl` / `backdropUrl` to `ipfs://<cid>`, which `parse_image_input` already converts into `{ ipfs_cid }` for `build_diffed_payload` — no diff-logic change needed.

### auth bootstrapping

- [x] **auth state isn't hydrated on initial page load** — `auth.svelte.ts` exports `auth = $state({ isSignedIn: false, accountId: null })` as the default, and `updateAuthStatus()` was only called from a handful of pages (`profile/router/+page.svelte`, `compose/+page.svelte`, `notifications/+page.svelte`, `settings_edit_profile.svelte`, `button_auth.svelte`'s mount). the root `+layout.svelte` never checked, so on a cold load or hard reload the navbar's `auth.isSignedIn` reflected the stale `false` default until the user manually navigated to `/profile/router` (or any page that called `updateAuthStatus`). fix: side-effect script `src/lib/ts/auth_boot.ts` that just calls `updateAuthStatus()` at module load, imported from `+layout.svelte` in the same slot as `hello.ts` — mirrors the `setNetwork_mainnet()` pattern. fire-and-forget; `auth.isSignedIn` / `auth.accountId` get updated once `wallet.getAccounts()` resolves and any widget reading `auth.*` reactively re-renders.

### discover

- [x] **discover page — people widget** — replaced the stub `src/routes/discover/+page.svelte` with two sections. (1) `src/lib/widgets/discover_people.svelte` ports the old `mob.near/widget/People` + `ProfileSearch` + `LastProfilesImages` triplet: a `keys(["*/profile"])` + `get(["*/profile/name", "*/profile/tags/*"])` fetch powers both the search (the original accountId/name/tags scoring with `MaxSingleScore=20` / `MaxScore=60`, sliced to 30) and the recent-profile grid (last `limit` accountIds as a circular-avatar grid, default 24). search recomputes from cached data on every keystroke via `$derived.by`. each search result gets the existing `<FOLLOW_BUTTON initialFollowing={...}/>` pre-supplied with a batch-fetched viewer-following set so the button doesn't do its own `getFollowers` roundtrip. (2) a contribution card linking to `https://github.com/web3stick/sticksocial` for bug reports + contributions, styled as a blue/purple bordered CTA matching the app's accent colors. follow-graph / hashtag / top-accounts candidates from the old TODO remain unimplemented and aren't on the roadmap right now.

==============================================
<br/>
copyright 2026 by sleet.near
