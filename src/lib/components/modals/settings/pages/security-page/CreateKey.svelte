<script lang="ts">
  import { KeyRound, LoaderCircle } from '@o7/icon/lucide';
  import { toast } from 'svelte-sonner';

  import { Button } from '$lib/components/ui/button';
  import { CopyInput, Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import {
    Modal,
    ModalBody,
    ModalBreadcrumbHeader,
  } from '$lib/components/ui/modal';
  import type { ApiKey } from '$lib/db/types';
  import { api } from '$lib/trpc';

  let { keys = $bindable() }: { keys: ApiKey[] } = $props();

  let open = $state(false);
  let name = $state('');
  let loading = $state(false);
  let key = $state('');

  const create = async () => {
    if (!name) return;

    loading = true;
    const result = await api.user.createApiKey.mutate(name);
    if (!result) {
      loading = false;
      toast.error('Error al crear la clave API');
      return;
    }

    key = result;
    keys.push({ name, createdAt: new Date(), lastUsed: null, id: 1111 });
    loading = false;

    toast.success('Clave API creada');
  };

  $effect(() => {
    if (!open) {
      name = '';
      key = '';
    }
  });
</script>

<Button variant="outline" onclick={() => (open = true)}>Crear</Button>

<Modal bind:open>
  <ModalBreadcrumbHeader
    section="Claves API"
    title="Crear clave"
    icon={KeyRound}
  />
  <ModalBody>
    {#if !key}
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <Label for="name">Nombre</Label>
          <Input bind:value={name} id="name" />
        </div>
        <Button onclick={create} disabled={loading} class="gap-2">
          {#if loading}
            <LoaderCircle size={16} />
          {/if}
          Create
        </Button>
      </div>
    {:else}
      <div>
        <h1 class="text-lg font-medium">Tu clave API</h1>
        <p class="text-sm text-muted-foreground">
          Your API key has been created. Please copy it and store it in a safe
          place, as you won't be able to see it again.
        </p>
      </div>
      <CopyInput value={key} />
      <Button
        onclick={() => {
          open = false;
        }}
        class="mt-1">Entendido</Button
      >
    {/if}
  </ModalBody>
</Modal>
