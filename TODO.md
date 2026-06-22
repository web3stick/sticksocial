# TODO

---

### thread view

- [ ] **build a real thread view for /post/[accountId]/[blockHeight]** — today the post page renders the post + a flat list of comments; each comment_view recurses on its own sub-comments via `get_comments(item)`, but there's no navigation between siblings and no view that pivots off the on-chain `rootItem`. the plumbing for threaded replies is now in place (`fun_create_comment.ts` writes `rootItem` alongside `item` matching the old `mob.near/widget/MainPage.N.Comment.Compose` shape; `comment_compose_form.svelte` accepts `item` + `rootItem` + `replyToHandle` and shows a "replying to…" hint; the post page retargets the compose form on REPLY clicks). what we still need:
  - a way to navigate to `/post/<rootAuthor>/<rootBh>#comment-<commenter>-<commentBh>` so a comment permalink deep-links into the thread with the right reply highlighted
  - a thread sidebar / breadcrumb showing where the current comment lives in the tree (rootItem → item chain)
  - "show N more replies" truncation so deep threads don't blow up the page
  - decide whether `get_comments(item)` on a sub-comment should be replaced with a `notify` + `index.comment,key=item` merge so we can also surface replies from before the dual-index patch

### discover

- [ ] **discover page — actual content** — the page is a stub right now (reset in 53aa971). when we come back to it, design needs to be its own thing, not a duplicate of the global feed. candidates that were considered earlier and not used:
  - **trending hashtags** — near-social-js only exposes `getHashtagFeed(tag)` per-tag, no list-all-tags endpoint. would need either a server-side aggregation or a community-curated tag list.
  - **top accounts by follower count** — `getFollowers` is per-account only; not indexable. would need a follow graph cache.
  - **follow-graph based suggestions** — "people you follow follow X". possible with current APIs but expensive (N follows × N followers).
  
  decide on a direction before re-mounting anything on the page.

==============================================
<br/>
copyright 2026 by sleet.near
