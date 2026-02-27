<script lang="ts">
  import { REGEXP_ONLY_CHARS } from 'bits-ui';
  import type { Infer, SuperForm } from 'sveltekit-superforms';

  import LocationField from './LocationField.svelte';
  import TimezoneField from './TimezoneField.svelte';

  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import * as InputOTP from '$lib/components/ui/input-otp';
  import * as Select from '$lib/components/ui/select';
  import { HelpTooltip } from '$lib/components/ui/tooltip';
  import { AirportTypes } from '$lib/db/types';
  import { snakeToTitleCase } from '$lib/utils/string.js';
  import type { airportSchema } from '$lib/zod/airport';

  const { form }: { form: SuperForm<Infer<typeof airportSchema>> } = $props();

  const { form: formData } = form;
</script>

<Form.Field {form} name="name" class="flex flex-col">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Nombre *</Form.Label>
      <Input bind:value={$formData.name} {...props} />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="municipality" class="flex flex-col">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Municipio</Form.Label>
      <Input
        bind:value={$formData.municipality}
        {...props}
        placeholder="e.g. Los Angeles"
      />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="type">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Tipo *</Form.Label>
      <Select.Root bind:value={$formData.type} name={props.name} type="single">
        <Select.Trigger {...props}>
          {$formData.type ? snakeToTitleCase($formData.type) : 'Seleccionar un tipo'}
        </Select.Trigger>
        <Select.Content>
          {#each AirportTypes as type}
            <Select.Item value={type} label={snakeToTitleCase(type)} />
          {/each}
        </Select.Content>
      </Select.Root>
      <Form.Description
        >Solo para fines de ordenación. <HelpTooltip
          text="For reference, Dubai International Airport is a &quot;large airport&quot;, while Nuuk Airport is a &quot;medium airport&quot;."
        /></Form.Description
      >
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>

<section class="grid grid-cols-1 gap-2 sm:grid-cols-2">
  <Form.Field {form} name="icao" class="flex flex-col">
    <Form.Control>
      {#snippet children()}
        <Form.Label>ICAO *</Form.Label>
        <InputOTP.Root
          value={$formData.icao}
          onValueChange={(v) => {
            $formData.icao = v.toUpperCase();
          }}
          pattern={REGEXP_ONLY_CHARS}
          maxlength={4}
        >
          {#snippet children({ cells })}
            <InputOTP.Group>
              {#each cells as cell}
                <InputOTP.Slot {cell} class="font-bold text-base" />
              {/each}
            </InputOTP.Group>
          {/snippet}
        </InputOTP.Root>
        <Form.Description>
          El código ICAO del aeropuerto.
          <HelpTooltip
            text="Technically speaking, the only requirement is that it is a unique four-letter code."
          />
        </Form.Description>
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="iata" class="flex flex-col">
    <Form.Control>
      {#snippet children()}
        <Form.Label>IATA</Form.Label>
        <InputOTP.Root
          value={$formData.iata}
          onValueChange={(v) => {
            $formData.iata = v.toUpperCase();
          }}
          pattern={REGEXP_ONLY_CHARS}
          maxlength={3}
        >
          {#snippet children({ cells })}
            <InputOTP.Group>
              {#each cells as cell}
                <InputOTP.Slot {cell} class="font-bold text-base" />
              {/each}
            </InputOTP.Group>
          {/snippet}
        </InputOTP.Root>
        <Form.Description>
          El código IATA del aeropuerto. <HelpTooltip
            text="Will only be used for display purposes
          and airport autocomplete."
          />
        </Form.Description>
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
</section>

<LocationField {form} />
<TimezoneField {form} />
