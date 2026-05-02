<script lang="ts">
	let { loading = true, accountId = '', onReady = () => {} } = $props<{ loading?: boolean; accountId?: string; onReady?: () => void }>();

	let showSkeleton = $state(true);
	let minTimeElapsed = $state(false);

	function checkReady() {
		if (minTimeElapsed) {
			showSkeleton = false;
			onReady();
		}
	}

	$effect(() => {
		const timer = setTimeout(() => {
			minTimeElapsed = true;
			checkReady();
		}, 500);

		return () => clearTimeout(timer);
	});
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- skeleton_profile_banner -->
<!-- SKELETON_PROFILE_BANNER -->
<div class="skeleton-container" class:hidden={!showSkeleton}>
	<div class="banner"></div>
	<div class="profile-pic"></div>
	<div class="name-block"></div>
	<div class="desc-block"></div>
	<div class="linktree">
		<div class="link-pill"></div>
		<div class="link-pill"></div>
		<div class="link-pill"></div>
	</div>
</div>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.skeleton-container {
		position: relative;
		width: 500px;
		max-width: 90vw;
		margin: 0 auto;
		text-align: left;
		transition: opacity 0.3s ease;
	}

	.skeleton-container.hidden {
		display: none;
	}

	@keyframes shimmer {
		0% { opacity: 0.6; }
		50% { opacity: 1; }
		100% { opacity: 0.6; }
	}

	.skeleton-container .banner,
	.skeleton-container .profile-pic,
	.skeleton-container .name-block,
	.skeleton-container .desc-block,
	.skeleton-container .link-pill {
		background: var(--color-skeleton, #e0e0e0);
		animation: shimmer 1.5s ease-in-out infinite;
	}

	.skeleton-container .banner {
		width: 100%;
		height: 160px;
		object-fit: cover;
		border-radius: 16px;
	}

	.skeleton-container .profile-pic {
		width: 90px;
		height: 90px;
		border-radius: 50%;
		border: 4px solid white;
		position: absolute;
		top: 110px;
		left: 20px;
		box-shadow: 0 4px 12px rgba(0,0,0,0.25);
	}

	.skeleton-container .name-block {
		width: 30%;
		height: 20px;
		margin-top: 50px;
	}

	.skeleton-container .desc-block {
		width: 100%;
		height: 14px;
		margin-top: 0;
	}

	.skeleton-container .link-pill {
		width: 80px;
		height: 32px;
		display: inline-block;
		border-radius: 16px;
	}

	.skeleton-container .linktree {
		margin-top: 12px;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	@media (prefers-color-scheme: dark) {
		.skeleton-container .banner,
		.skeleton-container .profile-pic,
		.skeleton-container .name-block,
		.skeleton-container .desc-block,
		.skeleton-container .link-pill {
			background: var(--color-skeleton, #3a3a3a);
		}
	}
</style>