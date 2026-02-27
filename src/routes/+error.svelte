<script lang="ts">
  import { page } from '$app/state';
  import { Button } from '$lib/components/ui/button';
</script>

<div class="flex flex-col h-full items-center justify-center">
  {#if page.status === 404}
    <p class="text-lg">Página no encontrada</p>
    <h1 class="text-3xl font-bold">404</h1>
    <Button href="/" variant="outline">Volver</Button>
  {:else}
    <h1 class="text-4xl font-bold">Ha ocurrido un error desconocido</h1>
    <p class="text-lg">{page.error?.message}</p>
    <p class="italic text-sm">
      Si eres el propietario del sitio, por favor revisa los registros para más información.
    </p>
  {/if}
</div>
