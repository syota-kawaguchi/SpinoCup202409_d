<!-- App.svelte -->
<script>
  import { Router, Route } from "svelte-routing";
  import SelectingCars from "./pages/SelectingCars.svelte";
  import Title from  "./pages/Title.svelte";
</script>

<Router>
  <Route path="/svelte/selecting-cars" component={SelectingCars} />
  <Route path="/svelte/title" component={Title} />
</Router>
