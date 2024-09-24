<script lang="ts">
  let count: number = 0
  const increment = () => {
    count += 1
  }
  console.log("Counter.svelte")
</script>

<button on:click={increment}>
  count is {count}
</button>