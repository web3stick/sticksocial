<script lang="ts">
	import { page } from "$app/state";
	import LATEST_COMMENT_VIEW from "$lib/widgets/latest_comment_view.svelte";
	// ============================================
	const accountId = $derived(page.params.accountId ?? "");
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!--
	the social DB only retains the LATEST comment per account — every new
	comment overwrites <userId>/post/comment. so we show that one comment
	when it exists, with a deep-link to the parent post. when the contract
	gains per-commenter history (or the API gains an actor-keyed comment
	index), this page can switch to a feed widget.
-->
<LATEST_COMMENT_VIEW {accountId} />

<!-- ============================================ -->
<!-- ============================================ -->

<style></style>
