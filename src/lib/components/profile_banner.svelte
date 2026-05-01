<script lang="ts">
  import type { Profile } from 'near-social-js';
  let { profile } = $props<{ profile: Profile | null }>();
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- profile_banner -->
<!-- PROFILE_BANNER -->
<div>
   	<img src={profile?.backgroundImage} alt="BANNER"/>
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
</style>
