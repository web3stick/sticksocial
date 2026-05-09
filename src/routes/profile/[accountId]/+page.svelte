<script lang="ts">
	import { page } from '$app/state';
	import PROFILE_BANNER from '$lib/widgets/profile_banner.svelte';
	import PROFILE_NAV from '$lib/components/profile_nav.svelte';
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<section>
	<PROFILE_NAV />
	<PROFILE_BANNER accountId={page.params.accountId} />
</section>
