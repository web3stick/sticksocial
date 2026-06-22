<script lang="ts">
	import { auth } from "$lib/ts/auth.svelte";
	import { near_social_js_keys_fun } from "$lib/near-social-js/main/fun_keys";
	import { near_social_js_get_fun } from "$lib/near-social-js/main/fun_get";
	import { near_social_js_get_following_fun } from "$lib/near-social-js/main/fun_get_following";
	import FOLLOW_BUTTON from "./follow_button.svelte";
	// ============================================
	let { limit = 24 }: { limit?: number } = $props();
	// ============================================
	// raw fetched data. one fetch on mount: keys() powers the recent
	// avatars grid; get() powers search. viewerFollowing is batch-fetched
	// when signed in so each search row's follow button can render in
	// the right state without doing its own getFollowers roundtrip.
	let profileMap = $state<
		Record<string, { profile?: { name?: string; tags?: Record<string, string> } }>
	>({});
	let recentAccounts = $state<string[]>([]);
	let viewerFollowing = $state<Set<string>>(new Set());
	let totalAccounts = $state(0);
	let loading = $state(true);
	// ============================================
	// search input — bound to `term`. derived matches recompute on
	// every keystroke without re-fetching.
	let term = $state("");
	const MAX_ID_LENGTH = 20;
	// ============================================
	// port of mob.near/widget/ProfileSearch scoring. for each profile we
	// score accountId + name + first 10 tags against the typed terms,
	// average across terms per field, weight the three fields evenly
	// (out of MaxSingleScore * 3), and sort by total.
	const MaxSingleScore = 20;
	const MaxScore = MaxSingleScore * 3;
	function compute_score(s: string, terms: string[]): number {
		s = s.toLowerCase();
		return (
			terms
				.map((t) => {
					const pos = s.indexOf(t);
					return pos >= 0 ? Math.max(1, MaxSingleScore - pos) : 0;
				})
				.reduce((acc, v) => acc + v, 0) / terms.length
		);
	}
	interface SearchMatch {
		accountId: string;
		name: string;
		tags: string[];
		score: number;
	}
	const matches = $derived.by<SearchMatch[]>(() => {
		const raw = term.trim().toLowerCase();
		if (!raw) return [];
		const terms = raw.split(/[^\w._-]/).filter((s) => !!s.trim());
		if (terms.length === 0) return [];
		const out: SearchMatch[] = [];
		for (const [accountId, data] of Object.entries(profileMap)) {
			const profile = data?.profile ?? {};
			const name = profile.name || "";
			const tags = Object.keys(profile.tags || {}).slice(0, 10);
			const accountIdScore = compute_score(accountId, terms);
			const nameScore = compute_score(name, terms);
			const tagsScore = Math.min(
				MaxSingleScore,
				tags.map((tag) => compute_score(tag, terms)).reduce((s, v) => s + v, 0)
			);
			const score = (accountIdScore + nameScore + tagsScore) / MaxScore;
			if (score > 0) out.push({ accountId, name, tags, score });
		}
		out.sort((a, b) => b.score - a.score);
		return out.slice(0, 30);
	});
	// ============================================
	// initial fetch. depends on auth.accountId so the follow-state map
	// re-syncs on sign-in/sign-out. keys()/get() don't strictly depend
	// on auth but re-running them is fine — the SDK caches responses.
	$effect(() => {
		loading = true;
		const viewer = auth.accountId;
		let cancelled = false;
		(async () => {
			try {
				const [keysRes, getRes] = await Promise.all([
					near_social_js_keys_fun({ keys: ["*/profile"] }),
					near_social_js_get_fun({ keys: ["*/profile/name", "*/profile/tags/*"] })
				]);
				if (cancelled) return;
				const allAccounts = keysRes ? Object.keys(keysRes) : [];
				totalAccounts = allAccounts.length;
				recentAccounts = allAccounts.slice(-limit);
				profileMap = (getRes as Record<string, any>) || {};
				if (viewer) {
					const vf = await near_social_js_get_following_fun(viewer);
					if (cancelled) return;
					viewerFollowing = new Set(Object.keys(vf ?? {}));
				} else {
					viewerFollowing = new Set();
				}
			} catch (e) {
				console.error("discover_people fetch failed", e);
			} finally {
				if (!cancelled) loading = false;
			}
		})();
		return () => {
			cancelled = true;
		};
	});
	// ============================================
	function avatar_url(accountId: string): string {
		return `https://i.near.social/magic/large/https://near.social/magic/img/account/${accountId}`;
	}
	function display_id(accountId: string): string {
		return accountId.length > MAX_ID_LENGTH ? accountId.slice(0, MAX_ID_LENGTH) + "..." : accountId;
	}
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_discover_people -->
<!-- WIDGET_DISCOVER_PEOPLE -->
<div class="discover-people">
	<!-- ============== -->
	<h2>PEOPLE</h2>
	<input
		type="text"
		class="search"
		placeholder="SEARCH BY NAME, TAG, OR @ACCOUNT"
		bind:value={term}
	/>
	<!-- ============== -->
	{#if matches.length > 0}
		<ul class="results">
			{#each matches as match (match.accountId)}
				{@const did = display_id(match.accountId)}
				<li class="result-row">
					<a class="avatar" href="/profile/{match.accountId}" aria-label={match.accountId}>
						<img src={avatar_url(match.accountId)} alt="" />
					</a>
					<div class="info">
						<a class="name" href="/profile/{match.accountId}">{match.name || match.accountId}</a>
						<a class="handle" href="/profile/{match.accountId}" title={match.accountId}>@{did}</a>
					</div>
					{#if auth.accountId && auth.accountId !== match.accountId}
						<FOLLOW_BUTTON
							accountId={match.accountId}
							initialFollowing={viewerFollowing.has(match.accountId)}
						/>
					{/if}
				</li>
			{/each}
		</ul>
		<hr />
	{:else if !loading && term.trim()}
		<p class="empty">no matches.</p>
	{/if}
	<!-- ============== -->
	{#if loading}
		<p class="empty">Loading profiles...</p>
	{:else}
		<div class="recent">
			<h3>RECENT PROFILES</h3>
			<p class="recent-meta">
				{totalAccounts} TOTAL · SHOWING LAST {recentAccounts.length}
			</p>
			{#if recentAccounts.length === 0}
				<p class="empty">no profiles yet.</p>
			{:else}
				<div class="grid">
					{#each recentAccounts as accountId (accountId)}
						<a class="grid-cell" href="/profile/{accountId}" title={accountId}>
							<img src={avatar_url(accountId)} alt={accountId} />
						</a>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
	<!-- ============== -->
</div>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.discover-people {
		width: 500px;
		max-width: 90vw;
		margin: 0 auto;
	}
	h2 {
		margin: 0 0 12px;
		font-size: 18px;
	}
	h3 {
		margin: 0 0 4px;
		font-size: 13px;
		color: #888;
		font-weight: 600;
		letter-spacing: 0.04em;
	}
	.search {
		width: 100%;
		box-sizing: border-box;
		font-size: 14px;
		padding: 10px 12px;
		border-radius: 8px;
		border: 1px solid rgba(0, 0, 0, 0.15);
		background: inherit;
		color: inherit;
		font-family: inherit;
	}
	.search:focus {
		outline: none;
		border-color: var(--color-blue);
	}
	@media (prefers-color-scheme: dark) {
		.search {
			border-color: rgba(255, 255, 255, 0.15);
		}
		.search:focus {
			border-color: var(--color-purple);
		}
	}
	.empty {
		color: #888;
		font-style: italic;
		font-size: 12px;
		padding: 12px 4px;
		margin: 0;
	}
	.results {
		list-style: none;
		padding: 0;
		margin: 12px 0 0;
	}
	.result-row {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 4px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
	}
	@media (prefers-color-scheme: dark) {
		.result-row {
			border-bottom-color: rgba(255, 255, 255, 0.08);
		}
	}
	.avatar img {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: block;
	}
	.info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.name {
		font-size: 14px;
		font-weight: bold;
		color: inherit;
		text-decoration: none;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.name:hover {
		text-decoration: underline;
	}
	.handle {
		font-size: 12px;
		color: #888;
		text-decoration: none;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.handle:hover {
		text-decoration: underline;
	}
	.recent {
		margin-top: 8px;
	}
	.recent-meta {
		font-size: 11px;
		color: #888;
		margin: 0 0 12px;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
		gap: 8px;
	}
	.grid-cell {
		display: block;
		aspect-ratio: 1 / 1;
		border-radius: 50%;
		overflow: hidden;
	}
	.grid-cell img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
		transition: transform 0.15s ease;
	}
	.grid-cell:hover img {
		transform: scale(1.08);
	}
</style>
