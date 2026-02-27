<script lang="ts">
  import { Copy, ExternalLink, Trash2 } from '@o7/icon/lucide';
  import { toast } from 'svelte-sonner';

  import CreateShare from './CreateShare.svelte';
  import EditShare from './EditShare.svelte';
  import PageHeader from './PageHeader.svelte';

  import { Confirm } from '$lib/components/helpers';
  import { Button } from '$lib/components/ui/button';
  import { Card } from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { TextTooltip } from '$lib/components/ui/tooltip/index.js';
  import { api, trpc } from '$lib/trpc';

  const sharesQuery = trpc.share.list.query();

  const deleteShare = async (id: number) => {
    try {
      const success = await api.share.delete.mutate(id.toString());
      if (success) {
        await trpc.share.list.utils.invalidate();
        toast.success('Enlace compartido eliminado');
      } else {
        toast.error('Error al eliminar enlace compartido');
      }
    } catch (error) {
      console.error('Error deleting share:', error);
      toast.error('Error al eliminar enlace compartido');
    }
  };

  async function copyShareUrl(slug: string) {
    const url = `${window.location.origin}/share/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('URL del enlace compartido copiada al portapapeles');
    } catch {
      toast.error('Error al copiar URL');
    }
  }

  let search = $state('');
  const handleSearch = (e: Event) => {
    search = (e.target as HTMLInputElement).value;
  };

  const filteredShares = $derived(
    $sharesQuery.data?.filter((share) =>
      share.slug.toLowerCase().includes(search.toLowerCase()),
    ) || [],
  );
</script>

<PageHeader
  title="Compartir"
  subtitle="Crea y gestiona enlaces públicos de tus datos de vuelo."
>
  <div class="space-y-4">
    <div class="flex gap-2 justify-between">
      <Input oninput={handleSearch} class="h-9" placeholder="Buscar compartidos" />
      <CreateShare />
    </div>

    {#if $sharesQuery.isLoading}
      <p class="text-center text-muted-foreground py-8">Cargando compartidos...</p>
    {:else if $sharesQuery.error}
      <p class="text-center text-destructive py-8">
        Error al cargar compartidos: {$sharesQuery.error.message}
      </p>
    {:else if !$sharesQuery.data || $sharesQuery.data.length === 0}
      <p class="text-center text-muted-foreground">Aún no se han creado compartidos.</p>
    {:else if filteredShares.length === 0}
      <p class="text-center text-muted-foreground">
        No se encontraron compartidos que coincidan con tu búsqueda.
      </p>
    {:else}
      <div class="space-y-4">
        {#each filteredShares as share (share.id)}
          <Card level="2" class="p-4">
            <div class="flex items-center justify-between gap-4">
              <div class="flex-1 space-y-3">
                <div>
                  <h4 class="font-semibold text-lg">{share.slug}</h4>
                  <p class="text-sm text-muted-foreground mt-1">
                    Creado el {new Date(share.createdAt).toLocaleDateString()}
                    {#if share.expiresAt}
                      • Expira el {new Date(share.expiresAt).toLocaleDateString()}
                    {:else}
                      • No expira nunca
                    {/if}
                  </p>
                </div>

                <div class="flex flex-wrap gap-2">
                  {#if share.showMap}
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                    >
                      Mapa
                    </span>
                  {/if}
                  {#if share.showStats}
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/50 text-secondary-foreground"
                    >
                      Estadísticas
                    </span>
                  {/if}
                  {#if share.showFlightList}
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/50 text-accent-foreground"
                    >
                      Lista de vuelos
                    </span>
                  {/if}
                  {#if share.dateFrom || share.dateTo}
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                    >
                      Filtrado por Fecha
                    </span>
                  {/if}
                </div>
              </div>

              <div class="flex items-center gap-2">
                <TextTooltip content="Copiar URL del compartido">
                  <Button
                    variant="outline"
                    size="icon"
                    onclick={() => copyShareUrl(share.slug)}
                  >
                    <Copy size={16} />
                  </Button>
                </TextTooltip>
                <TextTooltip content="Vista previa en nueva pestaña">
                  <Button
                    variant="outline"
                    size="icon"
                    onclick={() =>
                      window.open(`/share/${share.slug}`, '_blank')}
                  >
                    <ExternalLink size={16} />
                  </Button>
                </TextTooltip>
                {#key share}
                  <EditShare {share} />
                {/key}
                <TextTooltip content="Eliminar compartido">
                  <Confirm
                    title="Eliminar Compartido"
                    description="¿Estás seguro de que quieres eliminar este compartido? Esta acción no se puede deshacer."
                    onConfirm={() => deleteShare(share.id)}
                  >
                    {#snippet triggerContent({ props })}
                      <Button variant="outline" size="icon" {...props}>
                        <Trash2 size={16} />
                      </Button>
                    {/snippet}
                  </Confirm>
                </TextTooltip>
              </div>
            </div>
          </Card>
        {/each}
      </div>
    {/if}
  </div>
</PageHeader>
