<script lang="ts">
    export let label: string
    export let maxGuage: number
    export let guage: number
</script>

<div class="container">
    <div><p class="label">{label}</p></div>
    <ul class="guage">
        {#each { length: maxGuage } as _, i}
            {#if i < guage}
                <li class='enable'></li>
            {:else}
                <li class='disable'></li>
            {/if}
        {/each}
    </ul>
</div>

<style>
    div.container {
        margin: 0 auto;
        display: flex;
        width: 300px;
        height: 60px;
        align-items: center;
    }
    p.label {
        margin: 0 auto;
        font-size: 20px;
        color: #FFFFFF;
    }
    ul.guage{
        padding: 0;
        margin: 0 auto;
        list-style: none;
        height: 20px;
        display: flex; /*横並びにする*/
        vertical-align: middle;
    }
    ul.guage li{
        text-align: center;
        transform: skewX(-45deg);
    }
    li.enable {
        position: relative;
        padding: 5px 15px;
        background-color:#de5901;
    }
    li.disable {
        position: relative;
        padding: 5px 15px;
        background-color:#AAAAAA;
    }
</style>