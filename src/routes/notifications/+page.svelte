<script lang="ts">
	import { auth } from "$lib/ts/auth.svelte";
	import WIDGET_NOTIFICATIONS_LIST from "$lib/widgets/notifications_list.svelte";
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<section>
	<h1>NOTIFICATIONS</h1>
	{#if auth.accountId}
		<WIDGET_NOTIFICATIONS_LIST accountId={auth.accountId} />
	{:else}
		<p>Please log in to view notifications</p>
	{/if}
</section>

<!-- ============================================ -->
<!-- ============================================ -->

<style></style>