# TODO

---

### follow-ups from this session

- [ ] **comment refresh across widgets** — posting a reply inside post.svelte's inline comment_button refreshes its own count but not the sibling comments_list on /post/[accountId]/[blockHeight]. they need to share a state source (lifted state, callback prop, or a shared rune store) so the comment thread updates immediately after a post.
- [ ] **mention + hashtag extraction in createComment** — the SDK's built-in `createComment` extracted `@mentions` and `#hashtags` and wrote notify/hashtag index entries for each. the write-permission fix dropped that. add it back into the wrapper so comments notify mentions and tag the post for hashtag feeds.
- [ ] **settings save flow** — `settings_edit_profile.svelte` loads the existing profile into form fields but has no save handler. wire up `set()` with the profile shape (name / image / backgroundImage / description / linktree) and a SAVE button. verify write permissions work the same way as like/comment (likely fine since it writes only to the signer's own keys).
- [ ] **image upload in compose** — `compose_post_form.svelte` accepts an image URL only. real compose needs to upload an image (paste/drop file → IPFS) and insert the resulting `ipfs_cid`. needs an IPFS uploader; @near-kit-tool-box/env/web doesn't ship one, so this means wiring up something like the social-db IPFS endpoint or a separate uploader.
- [ ] **hashtag routes** — `widgets/fun/post_text.ts` links hashtags to `/hashtag/<tag>` but the route doesn't exist. add a `/hashtag/[tag]/+page.svelte` that mounts `infinite_post_feed` filtered by the tag (or a hashtag-specific widget using `getHashtagFeed`).
- [ ] **notifications widget polish** — `notifications_list.svelte` still dumps raw JSON. build a proper renderer with one row per notification, icons per type (like / comment / follow / mention / repost), links to the source post, and unread-state styling.
- [ ] **discover page** — `/discover/+page.svelte` is a stub. candidates: trending hashtags (top entries from `index({ action: 'hashtag' })`), top accounts by follower count (`getFollowers` is per-account so this needs a different strategy — maybe a hand-curated list to start), or recent posts (`getActivityFeed`).
- [ ] **/post page sticky parent** — on `/post/[accountId]/[blockHeight]` the parent post + comment thread scroll together. consider a sticky/minimized parent so users can keep typing replies while reading the thread.
- [ ] **profile id display** — `profile_banner.svelte` now wraps long accountIds (the recent line-break fix), but on really long ids it still expands the banner vertically. consider truncating with ellipsis after N chars and a tooltip showing the full id (matches how `post.svelte` caps at 20).
- [ ] **post image sizing** — `post.svelte` and `comment_view.svelte` both have `max-width: 100%` on `.post-image`, but huggies.near/140599606 renders really large. look at the actual rendered image: confirm the container is constraining it, check if it's an SVG / no-intrinsic-dimensions case, and add a hard cap (`max-width: 600px; height: auto; object-fit: contain`) if `100%` isn't enough. also verify `.post` parent isn't allowing overflow (e.g. `display: inline-block` can let content spill — consider switching to `block`).
- [ ] **comment_view action buttons** — `comment_view.svelte` (used inside `comments_list`) currently only renders text + author + time. mount `like_button`, `comment_button`, `repost_button` so users can interact with comments too. right now you can read comments but not like/reply/repost them from the thread page.
- [ ] **recursive comments on /post page** — `comments_list` only fetches top-level comments via `getComments(parentItem)`. sub-comments live under each comment's own `${commenterAccountId}/post/comment` and need `getComments(commentItem)` to be discovered. show the full thread recursively (or at least one more level deep) so nested replies aren't hidden. data structure should still be `getComments(item)` per node — recursive component or flat list with depth metadata both work.
- [ ] **comment_button reply form layout** — when the inline reply textarea opens inside `comment_button.svelte`, it breaks the `.actions` flex row in `post.svelte`. the comment-block (button + form) is one of four flex children in `.actions` (`display: flex; gap: 8px; align-items: center;`) but `.reply-form` (`display: flex; flex-direction: column`) renders inside that flex item, so the textarea inherits the constrained width from the action row. fix: either render the comment-button + reply-form as a column outside `.actions` (move COMMENT_BUTTON out of the actions row, or have it render its own row when open), or make `.reply-form textarea` ignore the parent width (`width: 100vw; max-width: 500px;` and break out via a wrapping container). cleanest is probably putting the whole comment-block in its own row below the action bar.

---

### other (from older prompts, not yet started)

- [ ] wire up follow / unfollow UI somewhere on the profile page (button + count next to banner, or in a dedicated tab)
- [ ] upload-to-IPFS for profile avatar + backdrop in settings (same uploader as the compose one above)

==============================================
<br/>
copyright 2026 by sleet.near