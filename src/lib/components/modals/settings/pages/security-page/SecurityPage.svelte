<script lang="ts">
  import { toast } from 'svelte-sonner';

  import { PageHeader } from '../index';

  import ApiKeys from './ApiKeys.svelte';
  import EditPassword from './EditPassword.svelte';
  import OAuth from './OAuth.svelte';

  import { page } from '$app/state';
  import { Confirm } from '$lib/components/helpers';
  import { Button } from '$lib/components/ui/button';
  import { api, trpc } from '$lib/trpc';

  const user = $derived(page.data.user);

  const deleteFlights = async () => {
    const toastId = toast.loading('Eliminando todos tus vuelos...');
    try {
      await api.flight.deleteAll.mutate();
      await trpc.flight.list.utils.invalidate();
      toast.info('Todos tus vuelos han sido eliminados.', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Error al eliminar tus vuelos', { id: toastId });
    }
  };
</script>

<PageHeader title="Seguridad" subtitle="Gestiona la seguridad de tu cuenta.">
  <div class="flex items-center justify-between p-4 rounded-lg border">
    <h4 class="font-medium leading-4">Contraseña</h4>
    <div>
      <EditPassword />
    </div>
  </div>
  <OAuth {user} />
  <ApiKeys />
  <div class="flex items-center justify-between p-4 rounded-lg border">
    <h4 class="font-medium leading-4">Zona de peligro</h4>
    <div>
      <Confirm
        onConfirm={deleteFlights}
        title="Eliminar todos los vuelos"
        description="¿Estás seguro de que deseas eliminar todos tus vuelos? Esto no incluye vuelos que compartes con otros usuarios. Esta acción no se puede deshacer."
        confirmText="Eliminar"
      >
        {#snippet triggerContent({ props })}
          <Button variant="destructiveOutline" {...props}>
            Eliminar todos los vuelos
          </Button>
        {/snippet}
      </Confirm>
    </div>
  </div>
</PageHeader>
