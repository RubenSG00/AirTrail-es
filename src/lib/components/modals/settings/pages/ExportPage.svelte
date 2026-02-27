<script lang="ts">
  import { FileSpreadsheet, FileBraces } from '@o7/icon/lucide';
  import { toast } from 'svelte-sonner';

  import { PageHeader } from '.';

  import { Card } from '$lib/components/ui/card';
  import { api } from '$lib/trpc';
  import { cn } from '$lib/utils';

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    toast.info('Tu descarga debería comenzar en breve');
    URL.revokeObjectURL(url);
  };

  const downloadCsv = async () => {
    const csv = await api.flight.exportCsv.query();
    const blob = new Blob([csv], { type: 'text/csv' });
    downloadBlob(blob, 'airtrail.csv');
  };

  const downloadJson = async () => {
    const json = await api.flight.exportJson.query();
    const blob = new Blob([json], { type: 'application/json' });
    downloadBlob(blob, 'airtrail.json');
  };
</script>

<PageHeader title="Exportar">
  {#snippet subtitleHtml()}
    <p class="text-muted-foreground text-sm">
      Exporta tus datos. Aprende más sobre los formatos de datos <a
        href="https://airtrail.johan.ohly.dk/docs/features/export#export-formats"
        target="_blank"
        class="text-blue-500 underline">en la documentación</a
      >.
    </p>
  {/snippet}
  <div class="flex">
    <button onclick={downloadCsv} class="w-full">
      <Card
        class={cn(
          'cursor-pointer py-12 border-2 border-dashed border-r-0 rounded-r-none flex flex-col items-center hover:bg-card-hover dark:hover:bg-dark-2',
        )}
      >
        <FileSpreadsheet size={64} />
        <span class="text-muted-foreground">.csv</span>
      </Card>
    </button>
    <button onclick={downloadJson} class="w-full">
      <Card
        class={cn(
          'cursor-pointer py-12 border-2 border-dashed rounded-l-none flex flex-col items-center hover:bg-card-hover dark:hover:bg-dark-2',
        )}
      >
        <FileBraces size={64} />
        <span class="text-muted-foreground">.json</span>
      </Card>
    </button>
  </div>
</PageHeader>
