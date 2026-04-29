<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();
	import COMPONENT_NAV from '$lib/components/nav.svelte'
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- ============================================ -->
<!-- ============================================ -->
{@render children()}
<COMPONENT_NAV/>