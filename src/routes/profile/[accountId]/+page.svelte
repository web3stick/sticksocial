<script lang="ts">
	import { page } from '$app/state';
</script>

<section>
	<h1>PROFILE</h1>
	<p>Account: {page.params.accountId}</p>
</section>

<style>
	section {
		padding: 20px;
	}
</style>