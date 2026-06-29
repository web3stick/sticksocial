# Issue: Unified Feed - Show Posts, Reposts, and Comments on `/feed` Route

## Summary

The current `/feed` route only displays **posts** via `getActivityFeed()` (which queries `index` with `action: "post", key: "main"`). It does **not** show:

- **Reposts** (action: `"repost"`, key: `"main"`)
- **Comments** (action: `"comment"`, key: `"main"`)

The goal is to create a unified feed on `/feed` that merges posts, reposts, and comments into a single chronological feed sorted by `blockHeight` (newest first).

---

## Current Architecture

### `/feed` Route (`src/routes/feed/+page.svelte`)

```svelte
<WIDGET_INFINITE_POST_FEED />
```

### `infinite_post_feed.svelte` (`src/lib/widgets/infinite_post_feed.svelte`)

```svelte
<INFINITE_FEED fetch={get_activity_feed} limit={saved.limit} order={saved.order} />
```

### `get_activity_feed` wrapper (`src/lib/near-social-js/main/fun_get_activity_feed.ts`)

```typescript
export async function get_activity_feed(options?: NEAR_SOCIAL_JS_FEED_OPTIONS) {
	const result = await near_social_client(near_kit_client()).getActivityFeed(options);
	// getActivityFeed calls: index({ action: "post", key: "main", ... })
	return result;
}
```

### Profile Pages (Reference Implementation)

| Route                           | Wrapper                | Index Query                                 |
| ------------------------------- | ---------------------- | ------------------------------------------- |
| `/profile/[accountId]`          | `get_account_feed`     | `action: "post", key: "main", accountId`    |
| `/profile/[accountId]/reposts`  | `get_account_reposts`  | `action: "repost", key: "main", accountId`  |
| `/profile/[accountId]/comments` | `get_account_comments` | `action: "comment", key: "main", accountId` |

**Key Insight**: Profile pages already fetch reposts/comments separately using the same `index` method with different `action` values. The main feed needs to do the same but **without** an `accountId` filter (global feed).

---

## Technical Approach

### Option 1: New Wrapper - Fetch & Merge (Recommended)

Create a new wrapper `fun_get_unified_feed.ts` that:

1. Fetches from 3 indices in parallel:
   - `index({ action: "post", key: "main", ...options })`
   - `index({ action: "repost", key: "main", ...options })`
   - `index({ action: "comment", key: "main", ...options })`
2. Merges all `IndexEntry[]` results
3. Deduplicates by `accountId + blockHeight`
4. Sorts by `blockHeight` descending (newest first)
5. Applies `limit` and `from` pagination

```typescript
// src/lib/near-social-js/main/fun_get_unified_feed.ts
import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
import type { FeedOptions, IndexEntry } from "near-social-js";

interface NEAR_SOCIAL_JS_UNIFIED_FEED_OPTIONS {
	limit?: number;
	from?: number;
	order?: "asc" | "desc";
}

export async function get_unified_feed(
	options?: NEAR_SOCIAL_JS_UNIFIED_FEED_OPTIONS
): Promise<IndexEntry[]> {
	const client = near_social_client(near_kit_client());

	const [posts, reposts, comments] = await Promise.all([
		client.index({ action: "post", key: "main", ...options }),
		client.index({ action: "repost", key: "main", ...options }),
		client.index({ action: "comment", key: "main", ...options })
	]);

	const all = [...(posts ?? []), ...(reposts ?? []), ...(comments ?? [])];

	// Deduplicate by accountId + blockHeight
	const seen = new Set<string>();
	const unique = all.filter((entry) => {
		const key = `${entry.accountId}-${entry.blockHeight}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});

	// Sort by blockHeight (desc = newest first)
	unique.sort((a, b) =>
		options?.order === "asc" ? a.blockHeight - b.blockHeight : b.blockHeight - a.blockHeight
	);

	// Apply pagination
	if (options?.from !== undefined) {
		const fromIndex = unique.findIndex((e) => e.blockHeight <= options.from!);
		if (fromIndex >= 0) return unique.slice(fromIndex, fromIndex + (options.limit ?? 10));
	}

	return unique.slice(0, options?.limit ?? 10);
}
```

### Option 2: Extend Backend API (Future)

If the API server (`api-server-js`) supports a combined feed endpoint, we could use that instead. Currently it does not.

---

## Widget Changes

### Option A: New Widget `unified_feed.svelte`

Create a new widget that accepts a `fetch` function returning `IndexEntry[]` and renders appropriate sub-components based on `entry.value` type.

The existing `infinite_feed.svelte` already:

- Accepts a generic `fetch: FeedFetcher`
- Renders a `Renderer` component (default: `Post`)
- Passes `accountId`, `blockHeight`, and `value` (the raw `IndexEntry.value`)

**The `value` field contains the raw indexed data:**

- **Post**: `{ text: string, type?: string, image?: {...} }`
- **Repost**: `{ item: CommentItem }` - references the original post
- **Comment**: `{ item: CommentItem, text: string, image?: {...} }`

So the renderer needs to inspect `value` to determine render type.

### Option B: Extend `infinite_feed.svelte` (Recommended)

Make the renderer polymorphic - it receives `value` and decides what component to render.

```svelte
<!-- infinite_feed.svelte - add polymorphic renderer -->
<script>
	import POST_VIEW from "./post_view.svelte";
	import REPOST_VIEW from "./repost_view.svelte";
	import COMMENT_VIEW from "./comment_view.svelte";

	function getRenderer(entry: IndexEntry) {
		const v = entry.value as any;
		if (v?.item?.type === "repost" || v?.item?.path?.includes("/repost/")) return REPOST_VIEW;
		if (v?.item?.type === "comment" || v?.item?.path?.includes("/comment/")) return COMMENT_VIEW;
		return POST_VIEW;
	}
</script>

{#each posts as item (item.accountId + "-" + item.blockHeight)}
	<svelte:component
		this={getRenderer(item)}
		accountId={item.accountId}
		blockHeight={item.blockHeight}
		value={item.value}
	/>
{/each}
```

---

## Types Reference (`near-social-js`)

```typescript
interface IndexEntry {
	accountId: string;
	blockHeight: number;
	value?: unknown; // Shape varies by action type
}

interface FeedOptions {
	limit?: number;
	from?: number;
	order?: "asc" | "desc";
}

interface CommentItem {
	type: string;
	path: string;
	blockHeight: number;
}
```

---

## Implementation Checklist

- [x] Create `src/lib/near-social-js/main/fun_get_unified_feed.ts` wrapper
- [x] Add inline options interface `NEAR_SOCIAL_JS_UNIFIED_FEED_OPTIONS`
- [x] Add section dividers and console.log per convention
- [ ] Test in `near-social-tool-box/bin-env/main/get_unified_feed.ts`
- [ ] Add example to `near-social-tool-box/bin-env/README.md`
- [x] Mirror wrapper to `sticksocial/src/lib/near-social-js/main/fun_get_unified_feed.ts`
- [x] Create/update widget (unified_feed.svelte + poly_feed_renderer.svelte)
- [x] Update `/feed/+page.svelte` to use new widget/wrapper
- [x] Add polymorphic renderers for Post / Repost / Comment
- [x] Run `bun run check && bun run tsc --noEmit && bun run format`
- [ ] Test on mainnet via tool-box bin

---

## Files to Modify/Create

| File                                                  | Action                                           |
| ----------------------------------------------------- | ------------------------------------------------ |
| `src/lib/near-social-js/main/fun_get_unified_feed.ts` | **Create** - new wrapper                         |
| `src/lib/widgets/infinite_feed.svelte`                | **Modify** - polymorphic renderer                |
| `src/routes/feed/+page.svelte`                        | **Modify** - use new wrapper                     |
| `src/lib/widgets/post_view.svelte`                    | **Create** - extract post rendering              |
| `src/lib/widgets/repost_view.svelte`                  | **Create** - render repost (shows original post) |
| `src/lib/widgets/comment_view.svelte`                 | **Create** - render comment                      |

---

## Related Files (Reference)

| File                                                      | Purpose                             |
| --------------------------------------------------------- | ----------------------------------- |
| `src/lib/near-social-js/main/fun_get_activity_feed.ts`    | Current feed wrapper (posts only)   |
| `src/lib/near-social-js/main/fun_get_profile_reposts.ts`  | Profile reposts wrapper             |
| `src/lib/near-social-js/main/fun_get_profile_comments.ts` | Profile comments wrapper            |
| `src/lib/widgets/infinite_feed.svelte`                    | Generic infinite scroll feed        |
| `src/lib/widgets/infinite_post_feed.svelte`               | Feed-specific infinite feed         |
| `src/lib/widgets/post.svelte`                             | Current post renderer               |
| `src/lib/widgets/repost_view.svelte`                      | Existing repost renderer (profile)  |
| `src/lib/widgets/comment_view.svelte`                     | Existing comment renderer (profile) |

---

## Notes

- The `IndexEntry.value` for **reposts** contains `{ item: CommentItem }` pointing to the original post
- The `IndexEntry.value` for **comments** contains `{ item: CommentItem, text: string, image?: ... }`
- The `CommentItem.path` format: `"post/accountId/blockHeight"` or `"comment/accountId/blockHeight"` etc.
- Renderers should handle missing `value` gracefully (fallback to loading post via `get_account_id_post`)
- Pagination with `from` (blockHeight cursor) needs careful handling when merging 3 sorted lists
