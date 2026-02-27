<script lang="ts">
  import {
    ChartColumn,
    GitBranchPlus,
    Grip,
    LayoutList,
    Map,
    Settings,
  } from '@o7/icon/lucide';

  import { page } from '$app/state';
  import {
    Dock,
    DockDropdownItem,
    DockFloatingItem,
    DockTooltipItem,
  } from '$lib/components/dock';
  import { Separator } from '$lib/components/ui/separator';
  import { openModalsState } from '$lib/state.svelte';
  import { flyAndScale } from '$lib/utils';

  const addFlightItem = {
    label: 'Añadir vuelo',
    icon: GitBranchPlus,
    testId: 'add-flight-button',
    onClick: () => {
      openModalsState.addFlight = true;
    },
  };
  const listFlightsItem = {
    label: 'Lista de vuelos',
    icon: LayoutList,
    testId: 'list-flights-button',
    onClick: () => {
      openModalsState.listFlights = true;
    },
  };
  const flightsStatisticsItem = {
    label: 'Estadísticas',
    icon: ChartColumn,
    testId: 'statistics-button',
    onClick: () => {
      openModalsState.statistics = true;
    },
  };
  const settingsItem = {
    label: 'Configuración',
    icon: Settings,
    id: 'settings-button',
    onClick: () => {
      openModalsState.settingsTab = 'general';
      openModalsState.settings = true;
    },
  };

  const OTHER = [
    {
      label: 'Herramientas',
      href: '/tools',
    },
    {
      label: 'Países visitados',
      href: '/visited-countries',
    },
  ];
</script>

<div class="z-10 absolute bottom-6 left-1/2 translate-x-[-50%]">
  <div class="flex gap-4">
    {#if page.url.pathname !== '/'}
      <div transition:flyAndScale>
        <DockFloatingItem href="/" label="Inicio">
          <Map />
        </DockFloatingItem>
      </div>
    {/if}
    <Dock>
      <DockTooltipItem item={addFlightItem} />
      {#if page.url.pathname === '/'}
        <DockTooltipItem item={listFlightsItem} />
        <DockTooltipItem item={flightsStatisticsItem} />
      {/if}
      <DockDropdownItem items={OTHER} label="Más">
        <Grip />
      </DockDropdownItem>
      <Separator orientation="vertical" class="h-full w-px" />
      <DockTooltipItem item={settingsItem} />
    </Dock>
  </div>
</div>
