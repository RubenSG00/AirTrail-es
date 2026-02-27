<script lang="ts">
  import autoAnimate from '@formkit/auto-animate';
  import { X } from '@o7/icon/lucide';
  import { formatRelative } from 'date-fns';
  import { es } from 'date-fns/locale';
  import { toast } from 'svelte-sonner';

  import { Confirm } from '$lib/components/helpers';
  import CreateKey from '$lib/components/modals/settings/pages/security-page/CreateKey.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Card } from '$lib/components/ui/card';
  import { Collapsible } from '$lib/components/ui/collapsible';
  import type { ApiKey } from '$lib/db/types';
  import { api } from '$lib/trpc';

  let loaded = $state(false);
  let keys: ApiKey[] = $state([]);

  const fetchKeys = async () => {
    keys = await api.user.listApiKeys.query();
    loaded = true;
  };

  $effect(() => {
    fetchKeys();
  });

  const deleteKey = async (key: ApiKey) => {
    await api.user.deleteApiKey.mutate(key.id);
    await fetchKeys();
    toast.success('Clave API eliminada');
  };
</script>

<Collapsible
  title="Claves API"
  subtitle="Gestiona tus claves API"
  disabled={!loaded}
  class={{ 'opacity-80': !loaded }}
>
  <div use:autoAnimate class="space-y-2">
    {#each keys as key}
      <Card class="p-2 flex justify-between">
        <div>
          <h4 class="font-medium text-lg">
            {key.name}
          </h4>
          <p class="text-muted-foreground text-sm">
            Creado {formatRelative(key.createdAt, new Date(), { locale: es })}
            {#if key.lastUsed}
              ∙ Último uso {formatRelative(key.lastUsed, new Date(), { locale: es })}
            {/if}
          </p>
        </div>
        <div class="flex items-center pr-1">
          <Confirm
            title="Eliminar clave API"
            description="¿Estás seguro de que deseas eliminar esta clave API? Esta acción no se puede deshacer."
            onConfirm={async () => deleteKey(key)}
          >
            {#snippet triggerContent({ props })}
              <Button variant="outline" size="icon" {...props}>
                <X />
              </Button>
            {/snippet}
          </Confirm>
        </div>
      </Card>
    {:else}
      <p class="pb-2 text-center text-muted-foreground">No se encontraron claves API</p>
    {/each}
  </div>
  <CreateKey bind:keys />
</Collapsible>
