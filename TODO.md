# TODO

---

### profile page tabs

- [ ] **tab CSS — alignment + readable active state** — `profile_feed.svelte` tabs currently use `inline-flex` with `gap: 4px` and a `.active` selector that paints the active tab `background: #fff8a3` (yellow). combined with the global `button { color: #ffffff }` rule from `src/lib/css/button.css`, the active tab ends up white-on-yellow and is unreadable. fix the layout so the row is centered or full-width with even spacing, and replace the yellow background with something readable — e.g. an underline + bold weight, or a muted tint that keeps dark text on light background.
- [ ] **proper comments renderer for profile Comments tab** — `profile_feed` currently passes `COMMENT_VIEW` to `infinite_feed` for the comments tab, but `comment_view.svelte` calls `get_account_id_post` which reads `${accountId}/post/main`. comments live at `${accountId}/post/comment`. fix `comment_view` to use `get_account_id_comment` so comments on `/profile/...` (and under `/post/...`) actually render their text.
- [ ] **repost_view component for profile Reposts tab** — reposts are index entries (`value.item` = `{ type: 'social', path: '<originalAuthor>/post/main', blockHeight }`), not posts. rendering them via `<Post>` would try to read `${reposterId}/post/main` at the repost block, which is empty. build a `repost_view.svelte` that pulls `value.item` from the IndexEntry, fetches the original post via `get_account_id_post`, and renders it with a small "REPOSTED BY @<reposter>" header above the original post body. swap into `profile_feed` for the reposts tab.
- [ ] **add Followers / Following tabs to profile_feed** — currently the tabs are POSTS / COMMENTS / REPOSTS. extend the row to five tabs (POSTS / COMMENTS / REPOSTS / FOLLOWERS / FOLLOWING):
  - **FOLLOWERS** — `getFollowers(accountId)` returns `{ accountId: string }[]`
  - **FOLLOWING** — `getFollowing(accountId)` returns a `Record<string, unknown>` keyed by accountId

  build a `profile_relations.svelte` widget (or fold into `profile_feed`) that renders each row with avatar + @handle + name + a follow/unfollow button so users can manage follows directly from the list. needs to fetch each profile individually via `get_profile(accountId)` since the relationship APIs return just account IDs.
- [ ] **follow button shows "already following" state on first paint** — `follow_button.svelte` already toggles label/icon by `class:following` and re-derives `following` from the followers list. verify the first render after navigation actually shows UNFOLLOW when the viewer is already following (currently the effect fires on mount which should be fine; double-check there's no flash of FOLLOW state before the followers fetch resolves).

==============================================
<br/>
copyright 2026 by sleet.near
