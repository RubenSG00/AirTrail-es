<script lang="ts">
  import { LoaderCircle } from '@o7/icon/lucide';
  import { toast } from 'svelte-sonner';

  import { invalidateAll } from '$app/navigation';
  import { Confirm } from '$lib/components/helpers';
  import { Button } from '$lib/components/ui/button';
  import type { User } from '$lib/db/types';
  import { appConfig } from '$lib/state.svelte';
  import { api } from '$lib/trpc';

  let { user }: { user: User | null } = $props();

  let loading = $state(false);
  const link = async () => {
    loading = true;
    const redirect = window.location.origin + '/login';
    if (!redirect) return;

    try {
      const resp = await api.oauth.authorize.query(redirect);
      window.location.href = resp.url;
    } catch (err) {
      toast.error(err.message);
    } finally {
      loading = false;
    }
  };

  const unlink = async () => {
    loading = true;
    try {
      await api.oauth.unlink.mutate();
      await invalidateAll();
      toast.info('OAuth desvinculado correctamente.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      loading = false;
    }
  };
</script>

{#if user && appConfig?.config?.oauth?.enabled}
  <div class="flex items-center justify-between p-4 rounded-lg border">
    <div class="space-y-0.5">
      <h4 class="font-medium leading-4">OAuth</h4>
      <p class="text-sm text-muted-foreground">
        {#if user.oauthId}
          Actualmente puedes iniciar sesión mediante OAuth.
        {:else}
          Vincula tu cuenta a un proveedor de OAuth.
        {/if}
      </p>
    </div>
    <div>
      {#if user.oauthId}
        <Confirm
          onConfirm={unlink}
          title="Desvincular OAuth"
          description="¿Estás seguro de que deseas desvincular tu cuenta OAuth? Si no tienes una contraseña configurada, no podrás iniciar sesión."
          confirmText="Desvincular"
        >
          {#snippet triggerContent({ props })}
            <Button variant="outline" {...props} disabled={loading}>
              {#if loading}
                <LoaderCircle class="animate-spin mr-1" size={16} />
              {/if}
              Unlink
            </Button>
          {/snippet}
        </Confirm>
      {:else}
        <Button onclick={link} disabled={loading} variant="outline">
          {#if loading}
            <LoaderCircle class="animate-spin mr-1" size={16} />
          {/if}
          Link
        </Button>
      {/if}
    </div>
  </div>
{/if}
