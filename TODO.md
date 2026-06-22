# TODO

---

### profile & content

- [ ] **bio markdown rendering** — `profile_banner.svelte` shows `profile.description` as plain text. run it through `render_post_text` so bios get the same `<blockquote>` / `<h1>` / `<pre>` / etc. styling as posts (provided by `src/lib/css/markdown.css`). wraps the same `.text` class so the existing selectors apply.
- [ ] **profile posts / comments / reposts tabs** — `/profile/[accountId]` currently only shows the user's own posts via `profile_post_feed`. add a tabs UI at the top of the profile column that swaps the feed source:
  - **Posts** — `getAccountFeed(accountId)` (current behavior)
  - **Comments** — entries at `${accountId}/post/comment`; either `getAccountFeed` with `includeReplies: true` or fetch directly
  - **Reposts** — `index({ action: 'repost', key: accountId })` returns IndexEntries pointing to reposted posts
  tabs can be a simple `<button>` row + reactive state + reuse `infinite_feed` with three fetch closures.

### post page layout

- [ ] **move comment input to the bottom on /post** — `comment_compose_form` currently sits between the parent post and `comments_list`, so the user has to scroll past the form to see any replies. move it below the list so the thread reads top-to-bottom: parent → replies → compose box.
- [ ] **new-post compose component on /post page** — the parent POST widget's actions row currently has like / comment / repost / open-thread. extract the compose affordance (the existing `comment_compose_form`) into its own labeled section below the post — something like a "REPLY" header + the form — so the action row stays focused on engagement actions. could also drop the redundant open-thread link since the page header already has home_nav.
- [ ] **comment button on comments → @mention prefill in compose** — `comment_view`'s mounted `COMMENT_BUTTON` currently just navigates to that comment's own /post page. the old near.social pattern was different: clicking reply on a comment auto-prefilled `@<commenterAccountId> ` (with trailing space) in the compose textarea. add an `onReply: (handle: string) => void` callback on `comment_view` → `comments_list` → `/post` page → `comment_compose_form` so the textarea gets the prefill and focuses for the user to keep typing.

### css conflicts with global button styles

- [ ] **compose form button CSS conflicts with `src/lib/css/button.css`** — `.actions button` in `compose_post_form.svelte` re-declares padding (`8px 16px`), border-radius, border (`1px solid #95d58d`), background (`#fff8a3`), and cursor — all of which are already set globally. drop the local declarations and let the global rule drive; only keep the `:disabled` state if the global doesn't cover it. same pattern fix applies to `comment_compose_form.svelte` (its `.actions button` overrides the global with the blue reply button style) and `settings_edit_profile.svelte` (yellow SAVE button override).
- [ ] **follow button CSS conflicts with `src/lib/css/button.css`** — `.follow-button` in `follow_button.svelte` re-declares border-radius (`999px`), border, background (`#fff8a3`), padding, font-weight — all global conflicts. drop the duplicate declarations; keep only the `.following` variant (filled yellow → transparent grey) since that's the actual state difference, not a duplicate of the global.

==============================================
<br/>
copyright 2026 by sleet.near