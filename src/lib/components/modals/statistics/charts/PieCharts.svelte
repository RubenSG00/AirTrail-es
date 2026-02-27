<script lang="ts">
  import PieChart from './PieChart.svelte';

  import { page } from '$app/state';
  import { FLIGHT_CHARTS, type FlightChartKey } from '$lib/stats/aggregations';
  import { type FlightData } from '$lib/utils';

  let {
    flights,
    onOpenChart,
    disableUserSeatFiltering = false,
  }: {
    flights: FlightData[];
    onOpenChart?: (key: FlightChartKey) => void;
    // Seat user override
    disableUserSeatFiltering?: boolean;
  } = $props();

  const user = $derived(page.data.user);

  const ctx = $derived.by(() => ({
    userId: disableUserSeatFiltering ? undefined : user?.id,
  }));

  const seatDistribution = $derived.by(() =>
    FLIGHT_CHARTS['seat'].aggregate(flights, ctx),
  );
  const seatClassDistribution = $derived.by(() =>
    FLIGHT_CHARTS['seat-class'].aggregate(flights, ctx),
  );
  const reasonDistribution = $derived.by(() =>
    FLIGHT_CHARTS['reason'].aggregate(flights, ctx),
  );
  const continentDistribution = $derived.by(() =>
    FLIGHT_CHARTS['continents'].aggregate(flights, ctx),
  );

  const topAirlineDistribution = $derived.by(() =>
    FLIGHT_CHARTS['airlines'].aggregate(flights, ctx, { limit: 5 }),
  );
  const topAircraftDistribution = $derived.by(() =>
    FLIGHT_CHARTS['aircraft-models'].aggregate(flights, ctx, { limit: 5 }),
  );
  const topAircraftRegDistribution = $derived.by(() =>
    FLIGHT_CHARTS['aircraft-regs'].aggregate(flights, ctx, { limit: 5 }),
  );
  const topAirportDistribution = $derived.by(() =>
    FLIGHT_CHARTS['airports'].aggregate(flights, ctx, { limit: 5 }),
  );
  const topRouteDistribution = $derived.by(() =>
    FLIGHT_CHARTS['routes'].aggregate(flights, ctx, { limit: 5 }),
  );
</script>

<div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
  <div class="cursor-pointer" onclick={() => onOpenChart?.('seat-class')}>
    <PieChart data={seatClassDistribution} title="Clase de asiento" />
  </div>
  <div class="cursor-pointer" onclick={() => onOpenChart?.('seat')}>
    <PieChart data={seatDistribution} title="Preferencia de asiento" />
  </div>
  <div class="cursor-pointer" onclick={() => onOpenChart?.('reason')}>
    <PieChart data={reasonDistribution} title="Motivos de vuelo" />
  </div>
  <div class="cursor-pointer" onclick={() => onOpenChart?.('continents')}>
    <PieChart data={continentDistribution} title="Continentes" />
  </div>
  <div class="cursor-pointer" onclick={() => onOpenChart?.('airlines')}>
    <PieChart data={topAirlineDistribution} title="Top aerolíneas" />
  </div>
  <div class="cursor-pointer" onclick={() => onOpenChart?.('aircraft-models')}>
    <PieChart data={topAircraftDistribution} title="Top modelos de aeronaves" />
  </div>
  <div class="cursor-pointer" onclick={() => onOpenChart?.('aircraft-regs')}>
    <PieChart data={topAircraftRegDistribution} title="Top aeronaves específicas" />
  </div>
  <div class="cursor-pointer" onclick={() => onOpenChart?.('airports')}>
    <PieChart data={topAirportDistribution} title="Top aeropuertos visitados" />
  </div>
  <div class="cursor-pointer" onclick={() => onOpenChart?.('routes')}>
    <PieChart data={topRouteDistribution} title="Top rutas" />
  </div>
</div>
