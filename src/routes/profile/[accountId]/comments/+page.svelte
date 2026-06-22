<script lang="ts">
	import { page } from "$app/state";
	import COMMENT_FEED from "$lib/widgets/comment_feed.svelte";
	// ============================================
	const accountId = $derived(page.params.accountId ?? "");
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<COMMENT_FEED {accountId} />

<!-- ============================================ -->
<!-- ============================================ -->

<style></style>
