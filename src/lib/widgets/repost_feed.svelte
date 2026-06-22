<script lang="ts">
	import INFINITE_FEED from "./infinite_feed.svelte";
	import REPOST_VIEW from "./repost_view.svelte";
	import { near_social_js_get_account_reposts_fun } from "$lib/near-social-js/main/fun_get_account_reposts";
	import { load_feed_options } from "$lib/ts/feed_options_storage";
	import { DEFAULT_FEED_OPTIONS } from "$lib/types/feed_options";
	// ============================================
	let { accountId }: { accountId: string } = $props();
	// ============================================
	const saved = load_feed_options();
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_repost_feed -->
<!-- WIDGET_REPOST_FEED -->
<INFINITE_FEED
	fetch={(opts) => near_social_js_get_account_reposts_fun(accountId, opts)}
	limit={saved.limit}
	order={saved.order}
	component={REPOST_VIEW}
/>

<!-- ============================================ -->
<!-- ============================================ -->

<style></style>
