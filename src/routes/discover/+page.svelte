<script lang="ts">
	import WIDGET_DISCOVER_PEOPLE from "$lib/widgets/discover_people.svelte";
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<svelte:head>
	<title>DISCOVER · STICKSOCIAL</title>
</svelte:head>

<!-- ============================================ -->
<!-- ============================================ -->

<section>
	<h1>DISCOVER</h1>
	<hr />
	<WIDGET_DISCOVER_PEOPLE />
	<hr />
	<div class="contribute-card">
		<h2>HACK ON STICKSOCIAL</h2>
		<p>found a bug? have an idea? leave bug reports and help contribute on github.</p>
		<a
			class="cta-link"
			href="https://github.com/web3stick/sticksocial"
			target="_blank"
			rel="noopener noreferrer"
		>
			<button type="button">OPEN REPO</button>
		</a>
	</div>
</section>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.contribute-card {
		margin-top: 24px;
		padding: 16px 24px;
		width: 500px;
		max-width: 90vw;
		box-sizing: border-box;
		border-radius: 14px;
		background: rgba(140, 162, 245, 0.08);
		border: 1px solid rgba(140, 162, 245, 0.35);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		text-align: center;
	}
	@media (prefers-color-scheme: dark) {
		.contribute-card {
			background: rgba(201, 168, 244, 0.08);
			border-color: rgba(201, 168, 244, 0.3);
		}
	}
	.contribute-card h2 {
		margin: 0;
		font-size: 18px;
		letter-spacing: 0.04em;
	}
	.contribute-card p {
		margin: 0;
		font-size: 13px;
		color: #888;
		max-width: 380px;
		line-height: 1.5;
	}
	.cta-link {
		margin-top: 4px;
		text-decoration: none;
	}
	.cta-link button {
		font-size: 13px;
		padding: 7px 18px;
	}
</style>
