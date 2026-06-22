<script lang="ts">
	import { page } from "$app/state";
	import PROFILE_BANNER from "$lib/widgets/profile_banner.svelte";
	import PROFILE_LINKTREE from "$lib/widgets/profile_linktree.svelte";
	import PROFILE_NAV from "$lib/components/profile_nav.svelte";
	import PROFILE_TAB_NAV from "$lib/components/profile_tab_nav.svelte";
	import FOLLOW_BUTTON from "$lib/widgets/follow_button.svelte";
	import type { Snippet } from "svelte";
	// ============================================
	const accountId = $derived(page.params.accountId ?? "");
	// ============================================
	let { children }: { children: Snippet } = $props();
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<section>
	<PROFILE_NAV />
	<PROFILE_BANNER {accountId} />
	<div class="follow-row">
		<FOLLOW_BUTTON {accountId} />
	</div>
	<PROFILE_LINKTREE {accountId} />
	<PROFILE_TAB_NAV {accountId} />
	{@render children()}
</section>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.follow-row {
		width: 500px;
		max-width: 90vw;
		margin: 8px auto 0;
		display: flex;
		justify-content: flex-start;
	}
</style>
