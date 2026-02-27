<script lang="ts">
  import { Users } from '@o7/icon/lucide';

  import { Button } from '$lib/components/ui/button';
  import { Card } from '$lib/components/ui/card';
  import * as Select from '$lib/components/ui/select';
  import { api } from '$lib/trpc';

  let {
    exportedUsers = [],
    userMapping = {},
    busy = false,
    onback,
    onnext,
  }: {
    exportedUsers?: {
      id: string;
      username: string;
      displayName: string;
      mappedUserId: string | null;
    }[];
    userMapping?: Record<string, string>;
    busy?: boolean;
    onback?: () => void;
    onnext?: (userMapping: Record<string, string>) => void;
  } = $props();

  const usersPromise = api.user.list.query();

  let localMapping = $state<Record<string, string>>({ ...userMapping });

  const mappedCount = $derived(Object.keys(localMapping).length);

  const setUserMapping = (exportedUserId: string, mappedUserId: string) => {
    if (mappedUserId) {
      localMapping[exportedUserId] = mappedUserId;
    } else {
      delete localMapping[exportedUserId];
    }
  };
</script>

<div class="space-y-4">
  <h3 class="text-sm font-medium">Mapear usuarios exportados</h3>

  <Card class="p-4 space-y-4">
    <div class="flex items-start gap-3">
      <Users class="text-muted-foreground mt-0.5 shrink-0" size={20} />
      <div>
        <p class="text-sm">Revisa y ajusta el mapeo de usuarios antes de importar.</p>
        <p class="text-xs text-muted-foreground mt-1">
          Las coincidencias de nombre de usuario se preseleccionan cuando es posible.
        </p>
      </div>
    </div>

    {#await usersPromise then users}
      <div class="space-y-2">
        {#each exportedUsers as exportedUser (exportedUser.id)}
          <div class="flex items-center gap-3">
            <div class="w-48 shrink-0">
              <div class="text-sm font-medium">{exportedUser.displayName}</div>
              <div class="text-xs text-muted-foreground">
                @{exportedUser.username}
              </div>
            </div>
            <div class="flex-1">
              <Select.Root
                type="single"
                value={localMapping[exportedUser.id] ?? ''}
                onValueChange={(value) =>
                  setUserMapping(exportedUser.id, value ?? '')}
              >
                <Select.Trigger disabled={busy}>
                  {#if localMapping[exportedUser.id]}
                    {@const selectedUser = users.find(
                      (user) => user.id === localMapping[exportedUser.id],
                    )}
                    {#if selectedUser}
                      {selectedUser.displayName} (@{selectedUser.username})
                    {:else}
                      Seleccionar usuario local...
                    {/if}
                  {:else}
                    Sin mapeo (importar como invitado)
                  {/if}
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="" label="Sin mapeo (importar como invitado)" />
                  {#each users as user (user.id)}
                    <Select.Item
                      value={user.id}
                      label={`${user.displayName} (@${user.username})`}
                    />
                  {/each}
                </Select.Content>
              </Select.Root>
            </div>
          </div>
        {/each}
      </div>

      <div class="mt-4 p-3 bg-muted/30 rounded-md border border-muted">
        <p class="text-xs text-muted-foreground">
          {mappedCount} of {exportedUsers.length} usuarios mapeados
        </p>
      </div>
    {/await}

    <div class="mt-4 flex justify-between">
      <Button variant="outline" onclick={() => onback?.()} disabled={busy}
        >Atrás</Button
      >
      <Button onclick={() => onnext?.(localMapping)} disabled={busy}
        >Continuar importación</Button
      >
    </div>
  </Card>
</div>
