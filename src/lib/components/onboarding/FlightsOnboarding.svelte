<script lang="ts">
  import { PlaneTakeoff, Upload } from '@o7/icon/lucide';

  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import { Button } from '$lib/components/ui/button';
  import { Card } from '$lib/components/ui/card';
  import { Modal } from '$lib/components/ui/modal';
  import { platforms } from '$lib/components/modals/settings/pages/import-page';
  import { openModalsState } from '$lib/state.svelte';

  let { flightsCount = 0 }: { flightsCount?: number } = $props();

  const isAutomation = navigator.webdriver;

  const importSources = $derived(
    platforms
      .map((platform) => platform.name)
      .filter((name) => !name.startsWith('AirTrail'))
      .map((name) => name.replace(' (ICS)', ''))
      .join(', '),
  );

  let dismissed = $state(false);
  let open = $state(false);

  $effect(() => {
    // By default, onboarding is disabled when E2E tests are running as to not disturb unrelated tests.
    // Tests can explicitly enable it by adding ?onboarding to the URL.
    const allowAutomation = page.url.searchParams.has('onboarding');
    open =
      !dismissed && flightsCount === 0 && (!isAutomation || allowAutomation);
  });

  const startImport = () => {
    dismissed = true;
    open = false;
    openModalsState.settingsTab = 'import';
    openModalsState.settings = true;
  };

  const addFirstFlight = () => {
    dismissed = true;
    open = false;
    openModalsState.addFlight = true;
  };

  const skip = () => {
    dismissed = true;
    open = false;
  };
</script>

<Modal
  bind:open
  class="max-w-2xl"
  closeButton={false}
  closeOnOutsideClick={false}
  handleBackButton={false}
  dialogNoPadding
>
  <div class="p-6 md:p-8 space-y-6">
    <div class="space-y-2">
      <p
        class="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase"
      >
        Primer vuelo
      </p>
      <h2 class="text-2xl font-bold tracking-tight">
        Importa tus vuelos a AirTrail
      </h2>
      <p class="text-muted-foreground text-sm">
        Importa tu historial o añade un vuelo para comenzar tu mapa personal.
      </p>
    </div>
    <div class="grid gap-4 md:grid-cols-2">
      <Card class="p-4 flex flex-col gap-4">
        <div class="flex items-start gap-3">
          <div
            class="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0"
          >
            <Upload size={18} />
          </div>
          <div>
            <p class="font-semibold">Importar vuelos</p>
            <p class="text-xs text-muted-foreground">
              {importSources}.
            </p>
          </div>
        </div>
        <Button onclick={startImport} class="w-full mt-auto"
          >Iniciar importación</Button
        >
      </Card>
      <Card class="p-4 flex flex-col gap-4">
        <div class="flex items-start gap-3">
          <div
            class="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0"
          >
            <PlaneTakeoff size={18} />
          </div>
          <div>
            <p class="font-semibold">Añade tu primer vuelo</p>
            <p class="text-xs text-muted-foreground">
              Entrada manual rápida para un vuelo.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onclick={addFirstFlight}
          class="w-full mt-auto"
        >
          Add flight
        </Button>
      </Card>
    </div>
    <div
      class="flex items-center justify-between text-xs text-muted-foreground"
    >
      <span>Consejo: siempre puedes importar más tarde en Configuración > Importar.</span>
      <Button variant="ghost" size="sm" onclick={skip}>Ahora no</Button>
    </div>
  </div>
</Modal>
