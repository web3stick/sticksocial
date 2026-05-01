<!-- =========================================== -->
<!-- =========================================== -->
<script lang="ts">
  import { onMount } from "svelte";
  import { near_connect_client } from "@near-kit-tool-box/web";
  // ==================================
  let isSignedIn = $state(false);
  let accountId = $state<string | null>(null);
  // ==================================
  async function updateAuthStatus() {
    const wallet = await near_connect_client().wallet();
    const accounts = await wallet.getAccounts();
    if (accounts && accounts.length > 0) {
      console.log("Connected account:", accounts[0].accountId);
      accountId = accounts[0].accountId;
      isSignedIn = true;
    } else {
      console.log("Not connected");
      isSignedIn = false;
    }
  }
  // ==================================
  async function handleLogin() {
    try {
      // const wallet = await near_connect.wallet();
      // wallet.signIn();
      await near_connect_client().connect();

      await updateAuthStatus();
    } catch (error) {
      console.error("Login failed:", error);
    }
  }
  // ==================================
  async function handleLogout() {
    try {
      const wallet = await near_connect_client().wallet();
      // near_connect.disconnect();
      wallet.signOut();
      await updateAuthStatus();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
  // ==================================
  onMount(async () => {
    await updateAuthStatus();
  });
</script>

<!-- =========================================== -->
<!-- =========================================== -->

<!-- AUTH_BUTTON_LOGIN -->
{#if isSignedIn}
  <button onclick={handleLogout}>
    LOGOUT {accountId}
  </button>
{:else}
  <button onclick={handleLogin}> LOGIN </button>
{/if}

<!-- =========================================== -->
<!-- =========================================== -->

<style>
  button {
    width: 500px;
  }
</style>
