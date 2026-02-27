<script lang="ts">
  import { SlidersHorizontal } from '@o7/icon/lucide';
  import { toast } from 'svelte-sonner';

  import { CustomFieldInput } from '$lib/components/modals/flight-form';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Switch } from '$lib/components/ui/switch';
  import {
    Modal,
    ModalBody,
    ModalBreadcrumbHeader,
  } from '$lib/components/ui/modal';
  import * as Select from '$lib/components/ui/select';
  import { HelpTooltip } from '$lib/components/ui/tooltip';
  import { api, trpc } from '$lib/trpc';

  import {
    FIELD_TYPE_LABELS,
    type DefinitionItem,
    type EditingState,
    type FieldType,
  } from './types';
  import {
    buildPayload,
    createBlankEditing,
    getPreviewValue,
    isTextLike,
    itemToEditing,
    setPreviewValue,
    toKey,
    validatePayload,
  } from './helpers';

  let {
    open = $bindable(false),
    definitionCount = 0,
  }: {
    open?: boolean;
    definitionCount?: number;
  } = $props();

  let editing = $state<EditingState | null>(null);
  let autoKey = $state(false);

  export function openCreate() {
    editing = createBlankEditing(definitionCount);
    autoKey = true;
    open = true;
  }

  export function openEdit(item: DefinitionItem) {
    editing = itemToEditing(item);
    autoKey = false;
    open = true;
  }

  const close = () => {
    open = false;
    editing = null;
    autoKey = false;
  };

  const onLabelInput = (value: string) => {
    if (!editing) return;

    const previousAutoKey = toKey(editing.label);
    if (editing.key !== previousAutoKey) {
      autoKey = false;
    }

    editing.label = value;

    if (autoKey) {
      editing.key = toKey(value);
    }
  };

  const onKeyInput = (value: string) => {
    if (!editing) return;
    editing.key = value;
    autoKey = false;
  };

  const invalidate = () => {
    trpc.customField.listDefinitions.utils.invalidate({
      entityType: 'flight',
      includeInactive: true,
    });
  };

  const save = async () => {
    if (!editing) return;

    let payload: ReturnType<typeof buildPayload>;
    try {
      payload = buildPayload(editing);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Valor predeterminado no válido');
      return;
    }

    const error = validatePayload(editing, payload);
    if (error) {
      toast.error(error.message);
      return;
    }

    try {
      if (editing.id) {
        await api.customField.updateDefinition.mutate({
          id: editing.id,
          ...payload,
        });
        toast.success('Campo personalizado actualizado');
      } else {
        await api.customField.createDefinition.mutate(payload);
        toast.success('Campo personalizado creado');
      }
      invalidate();
      close();
    } catch (e) {
      toast.error('Error al guardar campo personalizado');
      console.error(e);
    }
  };

  $effect(() => {
    if (!open && editing) {
      editing = null;
    }
  });
</script>

<Modal bind:open class="max-w-lg" closeOnOutsideClick={false}>
  {#if editing}
    <ModalBreadcrumbHeader
      section="Campos personalizados"
      title={editing.id ? 'Editar campo' : 'Añadir campo'}
      icon={SlidersHorizontal}
    />
    <ModalBody>
      <div class="grid gap-4">
        <div class="grid gap-1">
          <label class="text-sm font-medium" for="custom-field-label"
            >Etiqueta</label
          >
          <Input
            id="custom-field-label"
            value={editing.label}
            oninput={(e) => onLabelInput(e.currentTarget.value)}
            placeholder="e.g. Booking reference"
          />
        </div>

        <div class="grid gap-1">
          <label class="text-sm font-medium" for="custom-field-key">Clave</label>
          <Input
            id="custom-field-key"
            value={editing.key}
            oninput={(e) => onKeyInput(e.currentTarget.value)}
            placeholder="e.g. booking_reference"
          />
        </div>

        <div class="grid gap-1">
          <label class="text-sm font-medium" for="custom-field-type-trigger"
            >Tipo</label
          >
          <Select.Root
            type="single"
            value={editing.fieldType}
            onValueChange={(v) => {
              if (!editing) return;

              const nextType = (v as FieldType) ?? 'text';
              editing.fieldType = nextType;

              if (nextType !== 'select') {
                editing.defaultValue = null;
              }
            }}
          >
            <Select.Trigger id="custom-field-type-trigger"
              >{FIELD_TYPE_LABELS[editing.fieldType]}</Select.Trigger
            >
            <Select.Content>
              <Select.Item value="text" label="Texto corto" />
              <Select.Item value="textarea" label="Texto largo" />
              <Select.Item value="number" label="Número" />
              <Select.Item value="boolean" label="Booleano" />
              <Select.Item value="date" label="Fecha" />
              <Select.Item value="select" label="Selección" />
              <Select.Item value="airport" label="Aeropuerto" />
              <Select.Item value="airline" label="Aerolínea" />
              <Select.Item value="aircraft" label="Aeronave" />
            </Select.Content>
          </Select.Root>
        </div>

        {#if isTextLike(editing.fieldType)}
          <div class="grid gap-1">
            <label
              class="text-sm font-medium flex items-center gap-1"
              for="custom-field-validation-regex"
            >
              Regex
              <HelpTooltip
                text="Patrón regex opcional de estilo JavaScript utilizado para validar valores de texto."
              />
            </label>
            <Input
              id="custom-field-validation-regex"
              bind:value={editing.validationRegex}
              placeholder={'e.g. ^[A-Z0-9]{6}$'}
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="grid gap-1">
              <label class="text-sm font-medium" for="custom-field-min-length"
                >Longitud mín.</label
              >
              <Input
                id="custom-field-min-length"
                type="number"
                bind:value={editing.validationMinLength}
              />
            </div>
            <div class="grid gap-1">
              <label class="text-sm font-medium" for="custom-field-max-length"
                >Longitud máx.</label
              >
              <Input
                id="custom-field-max-length"
                type="number"
                bind:value={editing.validationMaxLength}
              />
            </div>
          </div>
        {:else if editing.fieldType === 'number'}
          <div class="grid grid-cols-2 gap-3">
            <div class="grid gap-1">
              <label class="text-sm font-medium" for="custom-field-min-value"
                >Valor mín.</label
              >
              <Input
                id="custom-field-min-value"
                type="number"
                bind:value={editing.validationMin}
              />
            </div>
            <div class="grid gap-1">
              <label class="text-sm font-medium" for="custom-field-max-value"
                >Valor máx.</label
              >
              <Input
                id="custom-field-max-value"
                type="number"
                bind:value={editing.validationMax}
              />
            </div>
          </div>
        {/if}

        {#if editing.fieldType === 'select'}
          <div class="grid gap-1">
            <label class="text-sm font-medium" for="custom-field-options"
              >Opciones (una por línea)</label
            >
            <textarea
              id="custom-field-options"
              class="min-h-24 w-full rounded-md border bg-background p-2 text-sm"
              bind:value={editing.optionsText}
              placeholder={'Economy\nBusiness\nFirst'}
            ></textarea>
          </div>
        {/if}

        <div class="grid grid-cols-2 gap-3">
          <div class="flex items-center gap-2">
            <Switch
              id="custom-field-required"
              bind:checked={editing.required}
            />
            <label class="text-sm font-normal" for="custom-field-required"
              >Obligatorio</label
            >
          </div>
          <div class="flex items-center gap-2">
            <Switch id="custom-field-active" bind:checked={editing.active} />
            <label class="text-sm font-normal" for="custom-field-active"
              >Activo</label
            >
          </div>
        </div>

        <div class="grid gap-1">
          <label class="text-sm font-medium" for="custom-field-description"
            >Descripción</label
          >
          <Input
            id="custom-field-description"
            bind:value={editing.description}
            placeholder="Texto de ayuda opcional"
          />
        </div>

        <!-- Preview / default value -->
        <div class="grid gap-2">
          <p class="text-sm font-medium">Vista previa</p>
          <p class="text-muted-foreground text-xs">
            This is how the field will appear. The value you enter here becomes
            the default.
          </p>
          <div class="rounded-md border border-dashed bg-muted/30 p-4">
            <CustomFieldInput
              id="custom-field-preview"
              label={editing.label || 'Campo sin título'}
              fieldType={editing.fieldType}
              required={editing.required}
              options={editing.fieldType === 'select'
                ? editing.optionsText
                    .split('\n')
                    .map((x) => x.trim())
                    .filter(Boolean)
                : []}
              description={editing.description}
              value={getPreviewValue(editing)}
              onchange={(val) => setPreviewValue(editing, val)}
            />
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <Button variant="outline" onclick={close}>Cancelar</Button>
          <Button onclick={save}>Guardar</Button>
        </div>
      </div>
    </ModalBody>
  {/if}
</Modal>
