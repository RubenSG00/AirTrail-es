<script lang="ts">
  import { toast } from 'svelte-sonner';
  import { defaults, type Infer, superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';

  import { PageHeader } from '.';

  import { invalidateAll } from '$app/navigation';
  import { Locked } from '$lib/components/helpers';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { Switch } from '$lib/components/ui/switch';
  import { appConfig } from '$lib/state.svelte';
  import { oauthConfigSchema } from '$lib/zod/config';

  const form = superForm(
    defaults<Infer<typeof oauthConfigSchema>>(
      appConfig?.config?.oauth,
      zod(oauthConfigSchema),
    ),
    {
      resetForm: false,
      validators: zod(oauthConfigSchema),
      onUpdated({ form }) {
        if (form.message) {
          if (form.message.type === 'success') {
            invalidateAll();

            // special case for client secret, as it isn't stored in the client app config
            $formData.clientSecret = '';

            toast.success(form.message.text);
            return;
          }
          toast.error(form.message.text);
        }
      },
    },
  );
  const { form: formData, enhance } = form;

  const changes = $derived.by(() => {
    return Object.entries($formData).some(([key, value]) => {
      // @ts-expect-error - safe via optional chaining
      const saved = appConfig?.config?.oauth?.[key];
      if (!saved && !value) return false;
      return value !== saved;
    });
  });
</script>

<PageHeader
  title="OAuth"
  subtitle="Configura OAuth para tu instancia de AirTrail."
>
  <form
    method="POST"
    action="/api/oauth/save"
    autocomplete="off"
    class="space-y-4"
    use:enhance
  >
    <Locked
      locked={appConfig.envConfigured?.oauth?.enabled ?? false}
      tooltip={lockedTooltip}
    >
      <Form.Field
        {form}
        name="enabled"
        class="flex flex-row items-center justify-between"
      >
        <Form.Control>
          {#snippet children({ props })}
            <div class="grid gap-1">
              <Form.Label>Habilitar OAuth</Form.Label>
              <Form.Description>
                Habilita OAuth para tu instancia de AirTrail.
              </Form.Description>
            </div>
            <Switch bind:checked={$formData.enabled} {...props} />
          {/snippet}
        </Form.Control>
      </Form.Field>
    </Locked>
    <Locked
      locked={appConfig.envConfigured?.oauth?.issuerUrl ?? false}
      tooltip={lockedTooltip}
    >
      <Form.Field {form} name="issuerUrl">
        <Form.Control>
          {#snippet children({ props })}
            <div class="grid gap-1">
              <Form.Label>URL del Emisor</Form.Label>
              <Form.Description>La URL del proveedor OAuth.</Form.Description
              >
            </div>
            <Input
              bind:value={$formData.issuerUrl}
              {...props}
              placeholder="https://example.com/.well-known/openid-configuration"
            />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </Locked>
    <Locked
      locked={appConfig.envConfigured?.oauth?.clientId ?? false}
      tooltip={lockedTooltip}
    >
      <Form.Field {form} name="clientId">
        <Form.Control>
          {#snippet children({ props })}
            <div class="grid gap-1">
              <Form.Label>ID de Cliente</Form.Label>
              <Form.Description>
                El ID de cliente proporcionado por el proveedor OAuth.
              </Form.Description>
            </div>
            <Input bind:value={$formData.clientId} {...props} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </Locked>
    <Locked
      locked={appConfig.envConfigured?.oauth?.clientSecret ?? false}
      tooltip={lockedTooltip}
    >
      <Form.Field {form} name="clientSecret">
        <Form.Control>
          {#snippet children({ props })}
            <div class="grid gap-1">
              <Form.Label>Secreto de Cliente</Form.Label>
              <Form.Description>
                El secreto de cliente proporcionado por el proveedor OAuth.
              </Form.Description>
            </div>
            <Input
              bind:value={$formData.clientSecret}
              {...props}
              placeholder="********"
            />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </Locked>
    <Locked
      locked={appConfig.envConfigured?.oauth?.scope ?? false}
      tooltip={lockedTooltip}
    >
      <Form.Field {form} name="scope">
        <Form.Control>
          {#snippet children({ props })}
            <div class="grid gap-1">
              <Form.Label>Alcance</Form.Label>
              <Form.Description>
                El alcance del proveedor OAuth (separado por espacios).
              </Form.Description>
            </div>
            <Input
              bind:value={$formData.scope}
              {...props}
              placeholder="openid profile"
            />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </Locked>
    <Locked
      locked={appConfig.envConfigured?.oauth?.buttonText ?? false}
      tooltip={lockedTooltip}
    >
      <Form.Field {form} name="buttonText">
        <Form.Control>
          {#snippet children({ props })}
            <div class="grid gap-1">
              <Form.Label>Texto del Botón</Form.Label>
              <Form.Description>
                El texto a mostrar en el botón de inicio de sesión OAuth.
              </Form.Description>
            </div>
            <Input bind:value={$formData.buttonText} {...props} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </Locked>
    <Locked
      locked={appConfig.envConfigured?.oauth?.autoRegister ?? false}
      tooltip={lockedTooltip}
    >
      <Form.Field
        {form}
        name="autoRegister"
        class="flex flex-row items-center justify-between"
      >
        <Form.Control>
          {#snippet children({ props })}
            <div class="grid gap-1">
              <Form.Label>Registro Automático</Form.Label>
              <Form.Description>
                Registrar automáticamente nuevos usuarios cuando inicien sesión con OAuth.
              </Form.Description>
            </div>
            <Switch bind:checked={$formData.autoRegister} {...props} />
          {/snippet}
        </Form.Control>
      </Form.Field>
    </Locked>
    <Locked
      locked={appConfig.envConfigured?.oauth?.autoLogin ?? false}
      tooltip={lockedTooltip}
    >
      <Form.Field
        {form}
        name="autoLogin"
        class="flex flex-row items-center justify-between"
      >
        <Form.Control>
          {#snippet children({ props })}
            <div class="grid gap-1">
              <Form.Label>Inicio de Sesión Automático</Form.Label>
              <Form.Description>
                Redirigir automáticamente a los usuarios al proveedor OAuth cuando
                visiten la página de inicio de sesión.
              </Form.Description>
            </div>
            <Switch bind:checked={$formData.autoLogin} {...props} />
          {/snippet}
        </Form.Control>
      </Form.Field>
    </Locked>
    <Locked
      locked={appConfig.envConfigured?.oauth?.hidePasswordForm ?? false}
      tooltip={lockedTooltip}
    >
      <Form.Field
        {form}
        name="hidePasswordForm"
        class="flex flex-row items-center justify-between"
      >
        <Form.Control>
          {#snippet children({ props })}
            <div class="grid gap-1">
              <Form.Label>Ocultar Formulario de Contraseña</Form.Label>
              <Form.Description>
                Ocultar formulario de contraseña cuando OAuth está habilitado.
              </Form.Description>
            </div>
            <Switch bind:checked={$formData.hidePasswordForm} {...props} />
          {/snippet}
        </Form.Control>
      </Form.Field>
    </Locked>
    <Form.Button disabled={!changes}>Guardar</Form.Button>
  </form>
</PageHeader>

{#snippet lockedTooltip()}
  <p>
    Esta configuración está bloqueada porque se configura mediante variables de entorno.
  </p>
  <p>
    To change this setting, update or delete the environment variable and
    restart the server.
  </p>
{/snippet}
