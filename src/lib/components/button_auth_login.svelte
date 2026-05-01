<!-- =========================================== -->
<!-- =========================================== -->
<script lang="ts">
  import { near_connect_client } from "@near-kit-tool-box/web";
  // ==================================
  async function handleLogin() {
    try {
      await near_connect_client().connect();
    } catch (error) {
      console.error("Login failed:", error);
    }
  }
</script>

<!-- =========================================== -->
<!-- =========================================== -->

<!-- AUTH_BUTTON_LOGIN -->
<button onclick={handleLogin}> LOGIN </button>

<!-- =========================================== -->
<!-- =========================================== -->

<style>
  button {
    width: 500px;
  }
</style>
