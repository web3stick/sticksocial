<script lang="ts">
	import { page } from "$app/state";
	import PROFILE_RELATIONS from "$lib/widgets/profile_relations.svelte";
	// ============================================
	const accountId = $derived(page.params.accountId ?? "");
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<PROFILE_RELATIONS {accountId} mode="following" />

<!-- ============================================ -->
<!-- ============================================ -->

<style></style>
