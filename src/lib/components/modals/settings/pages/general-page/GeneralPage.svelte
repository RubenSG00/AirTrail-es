<script lang="ts">
  import { PageHeader } from '../index';

  import EditUserForm from './EditUserForm.svelte';

  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/form';
  import { toTitleCase } from '$lib/utils';

  const user = $derived($page.data.user);
</script>

<PageHeader
  title="General"
  subtitle="Configura tu cuenta y gestiona tus ajustes."
>
  {#if user}
    <div class="flex justify-between">
      <div>
        <h4 class="font-medium leading-4">{user.displayName}</h4>
        <span class="text-sm text-muted-foreground"
          >{toTitleCase(user.role)}</span
        >
      </div>
      <form method="POST" action="/log-out">
        <Button variant="destructiveOutline">Cerrar sesión</Button>
      </form>
    </div>
    <EditUserForm />
  {/if}
</PageHeader>
