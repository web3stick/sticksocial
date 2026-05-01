<script lang="ts">
	import { page } from '$app/state';

	let { accountId } = $props();
</script>

<section>
	<h1>PROFILE</h1>
	<p>Account: {accountId}</p>
</section>

<style>
	section {
		padding: 20px;
	}
</style>