<!-- App.svelte -->
<script lang="ts">
  import SelectingCars from "./pages/SelectingCars.svelte";
  import Title from  "./pages/Title.svelte";

  let selectedCarID: number | null = null;

  const _cars = [
    { id: 1, name: "Car 1" },
    { id: 2, name: "Car 2" },
    { id: 3, name: "Car 3" },
  ];

  const _handleSelectCar = (id: number) => {
    selectedCarID = id;
    localStorage.setItem("selectedCarID", id.toString());
  };
</script>
