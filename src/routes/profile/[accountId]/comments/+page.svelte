<script lang="ts">
	import { page } from "$app/state";
	import COMMENT_FEED from "$lib/widgets/comment_feed.svelte";
	// ============================================
	const accountId = $derived(page.params.accountId ?? "");
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!--
	the NEAR Social comment index is keyed by parent post item, not by
	author. the API has no "all comments by user" endpoint today, so
	this tab renders an empty feed plus a note explaining why. when the
	API gains an author-keyed index, comment_feed.svelte will just
	start returning data — no other changes needed.
-->
<p class="note">
	comments-by-user is not supported by the NEAR Social API. comment INDEX entries are keyed by the
	parent post, so the server has no way to enumerate every comment a user has made across all posts.
</p>
<COMMENT_FEED {accountId} />

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.note {
		width: 500px;
		max-width: 90vw;
		margin: 12px auto;
		padding: 12px;
		font-size: 12px;
		font-style: italic;
		color: #888;
		background: rgba(149, 213, 141, 0.08);
		border: 1px solid var(--color-green, #95d58d);
		border-radius: 6px;
		text-align: left;
	}
</style>
