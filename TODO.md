# TODO

---

### profile page polish

- [ ] **repost rendering — research old NEAR social semantics + finish verification** — the immediate 'Repost unavailable' bug was infinite_feed dropping IndexEntry.value (fixed in bd45d66). with value forwarded, repost_view reads value.item.path, parses the target account/blockHeight, and fetches the original post. the next step is to verify this end-to-end against a real reposting account (mob.near has many) and, if needed, refine against the old near.social Post widget semantics — specifically:
  - confirm path.split('/')[0] is the right way to extract the target account id (what if the path has more than 2 segments?)
  - confirm get_account_id_post(item.blockHeight) returns the original post content; in some legacy cases the original may have been deleted and we should fall back to a 'post unavailable' state instead of throwing
  - consider whether the byline should also link to the original /post/<author>/<block> (currently only the original body links there)

### /bin debug route

- [ ] **expand /bin for other SDK probes** — currently /bin covers reposts / posts / comments. extend with more probes as we hit them:
  - `notifications` for a given account (per-type rendering + value shapes)
  - `getPost` (single post + comments) to verify the post + comments shape
  - `getFollowers` / `getFollowing` for a given account, including the cross-walk between Record<string,unknown> (following) vs [{accountId}] (followers) shapes — both are confusing and worth seeing in one place
  - `notify` index entries (mentions / likes / reposts notifications) to verify item/ value/ type

==============================================
<br/>
copyright 2026 by sleet.near
