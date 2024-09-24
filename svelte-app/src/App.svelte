<!-- App.svelte -->
<script>
  import { Router, Route } from "svelte-routing";
  import Top from "./pages/Top.svelte";
  import Title from "./pages/Title.svelte";
</script>

<Router>
  <Route path="/svelte/" component={Top} />
  <Route path="/svelte/title" component={Title} />
</Router>
