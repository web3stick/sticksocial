# TODO

---

### profile / settings

- [ ] **profile Comments tab is empty — figure out the right query and extract a reusable comment-feed widget** — the Comments tab on `/profile/[accountId]` calls `near_social_js_index_fun({action: 'comment', key: 'main', accountId})` (see `profile_feed.svelte::fetch_comments`) and gets nothing back. verified by curl against `https://api.near.social/index` with `action: "comment"` + several different keys (`main`, `comment`, the user's own accountId, an empty string) — all return `[]` even for accounts that definitely have comments stored at `<userId>/post/comment` (e.g. `root.near`). root cause is that comment INDEX entries are written with `key = <parent post item>` (the `CommentItem` referencing the original post), not `key = "main"`, so the index API has no way to match them via a fixed key. the SDK's own `getAccountFeed({includeReplies: true})` has the same bug.

  before implementing, think big picture — not "patch the one closure":
  - **reusable comment feed widget**: build `comment_feed.svelte` that takes `(accountId, limit?, order?)` and internally wires `infinite_feed` + `comment_view` + the fetch closure. any future surface that wants "comments by X" (`/profile/...`, `/discover` "people commenting on X", notification drilldowns, etc.) just imports it. same pattern as `infinite_post_feed` for posts.
  - **clean fetch logic**: move the `index({action, key, ...})` wrappers out of `profile_feed.svelte`'s inline script and into named helpers in `src/lib/near-social-js/main/` (e.g. `fun_get_account_comments.ts`) so the SDK quirks are isolated and testable from the `/bin` route.
  - **figure out what query actually returns comments by user** before committing to an approach:
    - **option A**: query `/index` with no `key` filter and filter the result client-side by `value.accountId === <userId>` or `value.item.path.startsWith(<userId>)`. cheap if the API supports it; expensive if it returns the whole global comment index.
    - **option B**: scan `${userId}/post/comment` over a range of block heights (the contract exposes `keys` via `get` only at a single blockHeight, so this won't work directly).
    - **option C**: ask the api server to support a wildcard / partial-key match for `action: "comment"`.
    - **option D**: drop the "comments by user" feature entirely and surface something else (e.g. notifications drilldown or "recent replies on this user's posts" via the `notify` index).
  - until we know which option works, don't wire the tab up — just leave the Comments tab disabled with a placeholder note.

- [ ] **profile edit — only save changed fields** — `settings_edit_profile.svelte` currently always builds and sends the full payload (`name`, `image`, `backgroundImage`, `description`, `linktree.*`) on every save, even when the user only touched one field. that overwrites every field with whatever's in the form, including stale/empty values, and bumps the on-chain profile unnecessarily. fix by diffing the current form values against the freshly-fetched profile (or tracking an initial snapshot in an `$state` after `refresh_profile()`) and only including fields in the payload that actually changed. needs care for `linktree` since partial merges of nested objects are non-trivial — either diff key-by-key or treat linktree as a single blob that only ships when any of its keys change.

- [ ] **unfollow button text color — keep it white** — `follow_button.svelte`'s `.follow-button.following` rule sets `color: #666` (and `#aaa` in dark mode). against the blue global button background that comes through from `src/lib/css/button.css`, the gray text is hard to read. drop both color overrides (light + dark) so the button falls back to the global `color: #ffffff` and the label stays legible. the state difference between follow / unfollow is already carried by the label text (FOLLOW vs UNFOLLOW), the icon (UserPlus vs UserMinus), and the border-color; we don't need a third dim-text signal on top.

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
