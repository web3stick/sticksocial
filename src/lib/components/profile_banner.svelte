<script lang="ts">
	import type { Profile } from 'near-social-js';
	import { resolveImageUrl } from '$lib/ts/profile_fun';
	let { profile } = $props<{ profile: Profile | null }>();
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- profile_banner -->
<!-- PROFILE_BANNER -->
<div>
	<img src={resolveImageUrl(profile?.backgroundImage)} alt="BANNER" class="banner" />
	<h1>{profile?.name}</h1>
	<p>{profile?.description}</p>
</div>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	div {
		text-align: left;
		width: 500px;
		max-width: 90vw;
	}
	.banner {
		width: 500px;
		max-width: 90vw;
	}
</style>
