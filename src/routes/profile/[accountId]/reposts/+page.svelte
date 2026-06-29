<script lang="ts">
	import { page } from "$app/state";
	import REPOST_FEED from "$lib/widgets/profile_repost_feed.svelte";
	// ============================================
	const accountId = $derived(page.params.accountId ?? "");
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<REPOST_FEED {accountId} />

<!-- ============================================ -->
<!-- ============================================ -->

<style></style>
