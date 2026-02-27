<script lang="ts">
  import SvelteVirtualList from '@humanspeak/svelte-virtual-list';
  import { RefreshCw, LoaderCircle, SquarePen, X } from '@o7/icon/lucide';
  import { toast } from 'svelte-sonner';

  import CreateAirline from './CreateAirline.svelte';
  import EditAirline from './EditAirline.svelte';

  import AirlineIcon from '$lib/components/display/AirlineIcon.svelte';
  import { confirmation } from '$lib/components/helpers';
  import { Button } from '$lib/components/ui/button';
  import { Card } from '$lib/components/ui/card';
  import { Collapsible } from '$lib/components/ui/collapsible';
  import { Modal } from '$lib/components/ui/modal';
  import { Input } from '$lib/components/ui/input';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import type { Airline } from '$lib/db/types';
  import { api, trpc } from '$lib/trpc';

  const { airlines = [] }: { airlines: Airline[] } = $props();

  let editOpen = $state(false);
  let airlineToEdit = $state<Airline | null>(null);

  const openEdit = (airline: Airline) => {
    airlineToEdit = airline;
    editOpen = true;
  };

  const deleteAirline = async (airline: Airline) => {
    const confirmed = await confirmation.show({
      title: 'Eliminar aerolínea',
      description: `¿Estás seguro de que deseas eliminar ${airline.name}?`,
    });
    if (!confirmed) return;

    const success = await api.airline.delete.mutate(airline.id);
    if (success) {
      await trpc.airline.list.utils.invalidate();
      await trpc.flight.list.utils.invalidate();
      toast.success('Aerolínea eliminada');
    } else {
      toast.error('Error al eliminar aerolínea');
    }
  };

  const filteredAirlines = $derived(
    airlines.filter((airline) =>
      airline.name.toLowerCase().includes(search.toLowerCase()),
    ),
  );
  let search = $state('');
  const handleSearch = (e: Event) => {
    search = (e.target as HTMLInputElement).value;
  };

  let syncDialogOpen = $state(false);
  let syncing = $state(false);
  let syncingIcons = $state(false);
  let overwrite = $state(false);
  let includeDefunct = $state(false);

  const syncAirlines = async () => {
    syncing = true;
    try {
      const result = await api.airline.sync.mutate({
        overwrite,
        includeDefunct,
      });
      await trpc.airline.list.utils.invalidate();
      let message = `Añadidas ${result.added}, Actualizadas ${result.updated}`;
      if (result.errors.length > 0) {
        message += ` (${result.errors.length} errores)`;
        toast.warning(message);
      } else {
        toast.success(message);
      }
    } catch {
      toast.error('Error al sincronizar aerolíneas');
    } finally {
      syncing = false;
    }
  };

  const syncIcons = async () => {
    syncingIcons = true;
    try {
      const result = await api.airline.syncIcons.mutate({ overwrite });
      await trpc.airline.list.utils.invalidate();
      let message = `Sincronizados ${result.synced} iconos`;
      if (result.errors.length > 0) {
        message += ` (${result.errors.length} errores)`;
        toast.warning(message);
      } else if (result.synced === 0) {
        toast.info('No hay iconos para sincronizar');
      } else {
        toast.success(message);
      }
    } catch {
      toast.error('Error al sincronizar iconos');
    } finally {
      syncingIcons = false;
    }
  };
</script>

<Collapsible title="Aerolíneas" subtitle="Gestiona las aerolíneas en tu base de datos.">
  <div class="flex flex-col gap-4">
    <div class="flex gap-2 justify-between">
      <Input oninput={handleSearch} class="h-9" placeholder="Buscar aerolíneas" />
      <div class="flex gap-2">
        <Button
          variant="outline"
          class="h-9"
          disabled={syncing || syncingIcons}
          onclick={() => (syncDialogOpen = true)}
        >
          <RefreshCw size={16} class="shrink-0" />
          Sincronizar
        </Button>
        <CreateAirline withoutTrigger={false} />
      </div>
    </div>
    <div class="h-[40dvh]">
      <SvelteVirtualList
        items={filteredAirlines}
        itemsClass="flex flex-col gap-2"
      >
        {#snippet renderItem(airline)}
          <Card level="2" class="w-full flex items-center justify-between p-3">
            <div class="flex items-center gap-3">
              <AirlineIcon {airline} size={32} />
              <div class="flex flex-col">
                <span class="font-medium">{airline.name}</span>
                <div class="flex gap-4 text-sm text-muted-foreground">
                  {#if airline.iata}
                    <span>IATA: <b>{airline.iata}</b></span>
                  {/if}
                  {#if airline.icao}
                    <span>ICAO: <b>{airline.icao}</b></span>
                  {/if}
                </div>
              </div>
            </div>
            <div class="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onclick={() => openEdit(airline)}
              >
                <SquarePen size={16} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onclick={() => deleteAirline(airline)}
              >
                <X />
              </Button>
            </div>
          </Card>
        {/snippet}
      </SvelteVirtualList>
    </div>
  </div>
</Collapsible>

<EditAirline airline={airlineToEdit} bind:open={editOpen} />

<Modal bind:open={syncDialogOpen} class="max-w-md">
  <div class="flex flex-col gap-1.5">
    <h2 class="text-lg font-semibold">Sincronizar aerolíneas</h2>
    <p class="text-sm text-muted-foreground">
      Descargar datos e iconos de aerolíneas del repositorio de AirTrail.
    </p>
  </div>

  <div class="flex flex-col gap-3 py-2">
    <label class="flex items-center gap-2 text-sm">
      <Checkbox bind:checked={overwrite} />
      Sobrescribir entradas existentes
    </label>
    <label class="flex items-center gap-2 text-sm">
      <Checkbox bind:checked={includeDefunct} />
      Incluir aerolíneas extintas
    </label>
  </div>

  <div class="flex flex-col gap-2">
    <Button
      variant="outline"
      disabled={syncing || syncingIcons}
      onclick={syncAirlines}
    >
      {#if syncing}
        <LoaderCircle size={16} class="mr-2 animate-spin" />
      {/if}
      Sincronizar aerolíneas
    </Button>
    <Button
      variant="outline"
      disabled={syncing || syncingIcons}
      onclick={syncIcons}
    >
      {#if syncingIcons}
        <LoaderCircle size={16} class="mr-2 animate-spin" />
      {/if}
      Sincronizar iconos
    </Button>
  </div>
</Modal>
