<script lang="ts">
  import { ChartPie } from '@o7/icon/lucide';
  import { AirplanemodeInactive } from '@o7/icon/material/solid';

  import { page } from '$app/state';
  import { Map } from '$lib/components/map';
  import { ListFlightsModal, StatisticsModal } from '$lib/components/modals';
  import { trpc } from '$lib/trpc';
  import { prepareFlightData } from '$lib/utils';

  const slug = $derived(page.params.slug);

  const shareQuery = trpc.share.public.query({ slug });

  const flights = $derived.by(() => {
    const data = $shareQuery.data;
    if (!data?.flights?.length) return [];

    return prepareFlightData(data.flights);
  });

  let showFlightList = $state(false);
  let showStatistics = $state(false);

  const shareSettings = $derived($shareQuery.data?.settings);
</script>

<svelte:head>
  <title>Mapa de Vuelos Compartido - AirTrail</title>
  <meta name="description" content="Ver datos de vuelos compartidos en AirTrail" />
</svelte:head>

{#if shareSettings && flights.length > 0}
  <!-- Navigation bar for accessible modals -->
  {#if shareSettings.showFlightList || shareSettings.showStats}
    <nav
      class="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b"
    >
      <div
        class="container mx-auto px-4 py-3 flex items-center justify-between"
      >
        <div class="flex items-center space-x-2">
          <div class="text-lg font-semibold">Vuelos Compartidos</div>
          <div class="text-sm text-muted-foreground">
            ({flights.length} vuelos)
          </div>
        </div>
        <div class="flex items-center space-x-2">
          {#if shareSettings.showFlightList}
            <button
              onclick={() => (showFlightList = true)}
              class="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
            >
              Lista de Vuelos
            </button>
          {/if}
          {#if shareSettings.showStats}
            <button
              onclick={() => (showStatistics = true)}
              class="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
            >
              Estadísticas
            </button>
          {/if}
        </div>
      </div>
    </nav>
  {/if}

  {#if shareSettings.showMap}
    <div
      class={shareSettings.showFlightList || shareSettings.showStats
        ? 'h-full pt-14'
        : 'h-full'}
    >
      <Map {flights} filteredFlights={flights} />
    </div>
  {:else}
    <div class="min-h-screen flex items-center justify-center">
      <div class="text-center flex flex-col items-center space-y-4 max-w-md">
        <ChartPie size={64} class="text-primary" />
        <h1 class="text-2xl font-bold">Datos de Vuelo Compartidos</h1>
        <p class="text-muted-foreground">
          Este enlace compartido incluye {flights.length} vuelos.
          {#if shareSettings.showFlightList || shareSettings.showStats}
            Usa los botones de arriba para explorar los datos.
          {:else}
            La vista de mapa no está disponible para este enlace compartido.
          {/if}
        </p>
      </div>
    </div>
  {/if}

  {#if shareSettings.showFlightList}
    <ListFlightsModal
      bind:open={showFlightList}
      {flights}
      filteredFlights={flights}
      readonly={true}
    />
  {/if}

  {#if shareSettings.showStats}
    <StatisticsModal
      bind:open={showStatistics}
      allFlights={flights}
      disableUserSeatFiltering={true}
    />
  {/if}
{:else if shareSettings}
  <div class="flex items-center justify-center min-h-screen">
    <div class="flex flex-col items-center text-center space-y-4 max-w-md">
      <AirplanemodeInactive size={64} class="text-primary" />
      <h1 class="text-2xl font-bold">No Hay Vuelos para Mostrar</h1>
      <p class="text-muted-foreground">
        Este compartido no contiene datos de vuelo, o los filtros aplicados
        no muestran ningún vuelo.
      </p>
    </div>
  </div>
{/if}
