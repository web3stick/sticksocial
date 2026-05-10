<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	import "$lib/ts/hello";
	import "$lib/css/main.css";
	import "bootstrap-icons/font/bootstrap-icons.css";
	let { children } = $props();
	import COMPONENT_NAV from "$lib/components/nav.svelte";
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- ============================================ -->
<!-- ============================================ -->
{@render children()}
<COMPONENT_NAV />
