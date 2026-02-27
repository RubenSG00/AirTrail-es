<script lang="ts">
  import {
    Airlines,
    FlightTakeoff,
    LocationOn,
    Flight,
  } from '@o7/icon/material/solid';

  import { PageHeader } from '../';

  import Aircraft from './aircraft/Aircraft.svelte';
  import Airline from './airline/Airline.svelte';
  import CustomAirports from './airport/CustomAirports.svelte';
  import StatCard from './StatCard.svelte';
  import UpdateFromSource from './UpdateFromSource.svelte';

  import { Card } from '$lib/components/ui/card';
  import { CardContent } from '$lib/components/ui/card/index.js';
  import type { Airport } from '$lib/db/types';
  import { api, trpc } from '$lib/trpc';

  let numAirports: number | null = $state(null);
  let customAirports: Airport[] = $state([]);

  const aircraftResult = trpc.aircraft.list.query();
  let aircraft = $derived.by(() => $aircraftResult.data || []);

  const airlinesResult = trpc.airline.list.query();
  let airlines = $derived.by(() => $airlinesResult.data || []);

  const fetchAirports = async () => {
    const airportData = await api.airport.getData.query();
    numAirports = airportData.numAirports;
    customAirports = airportData.customAirports;
  };

  $effect(() => {
    fetchAirports();
  });
</script>

<PageHeader
  title="Datos"
  subtitle="Gestiona aeropuertos, aerolíneas y aeronaves personalizados."
>
  <div class="flex flex-col gap-4">
    <Card>
      <CardContent>
        <div class="flex flex-col">
          <StatCard title="Aeropuertos" value={numAirports}>
            {#snippet icon()}
              <FlightTakeoff class="text-primary" />
            {/snippet}
          </StatCard>
          <StatCard title="Aeropuertos personalizados" value={customAirports.length}>
            {#snippet icon()}
              <LocationOn class="text-primary" />
            {/snippet}
          </StatCard>
          <StatCard title="Aeronaves" value={aircraft.length}>
            {#snippet icon()}
              <Flight class="text-primary" />
            {/snippet}
          </StatCard>
          <StatCard title="Aerolíneas" value={airlines.length}>
            {#snippet icon()}
              <Airlines class="text-primary" />
            {/snippet}
          </StatCard>
        </div>
      </CardContent>
    </Card>

    <UpdateFromSource {fetchAirports} />
    <CustomAirports bind:airports={customAirports} {fetchAirports} />
    <Aircraft {aircraft} />
    <Airline {airlines} />
  </div>
</PageHeader>
