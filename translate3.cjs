const fs = require('fs');
const path = require('path');

const BASE = __dirname;

function replaceInFile(filePath, replacements) {
  const absPath = path.join(BASE, filePath);
  if (!fs.existsSync(absPath)) {
    console.log(`SKIP (not found): ${filePath}`);
    return 0;
  }
  let content = fs.readFileSync(absPath, 'utf8');
  let count = 0;
  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.split(from).join(to);
      count++;
    }
  }
  if (count > 0) {
    fs.writeFileSync(absPath, content, 'utf8');
    console.log(`OK (${count} replacements): ${filePath}`);
  }
  return count;
}

let totalFiles = 0;
let totalReplacements = 0;

function apply(filePath, replacements) {
  const c = replaceInFile(filePath, replacements);
  if (c > 0) {
    totalFiles++;
    totalReplacements += c;
  }
}

// =========================================================
// VISITED COUNTRIES - Setup
// =========================================================
apply('src/lib/components/modals/visited-countries/SetupVisitedCountries.svelte', [
  ["toast.error('Failed to import flights (possibly due to no past flights)');", "toast.error('Error al importar vuelos (posiblemente debido a que no hay vuelos pasados)');"],
  ['>Welcome to your globe</h1>', '>Bienvenido a tu globo</h1>'],
  ['>Fill from your flights\n  </Button>', '>Rellenar desde tus vuelos\n  </Button>'],
  ['>Start from scratch\n  </Button>', '>Empezar desde cero\n  </Button>'],
]);

// =========================================================
// VISITED COUNTRIES - Edit
// =========================================================
apply('src/lib/components/modals/visited-countries/EditVisitedCountry.svelte', [
  ["toast.error('Failed to save');", "toast.error('Error al guardar');"],
  ["statusRadioItem('visited', 'Visited')", "statusRadioItem('visited', 'Visitado')"],
  ["statusRadioItem('lived', 'Lived')", "statusRadioItem('lived', 'Vivido')"],
  ["statusRadioItem('wishlist', 'Wishlist')", "statusRadioItem('wishlist', 'Deseo')"],
  ["statusRadioItem('layover', 'Layover')", "statusRadioItem('layover', 'Escala')"],
  ['placeholder="Note"', 'placeholder="Nota"'],
  ['>\n    Save\n  </Button>', '>\n    Guardar\n  </Button>'],
]);

// =========================================================
// SHARE PAGE - remaining English
// =========================================================
apply('src/lib/components/modals/settings/pages/SharePage.svelte', [  
  ["Created {new Date(share.createdAt).toLocaleDateString()}", "Creado el {new Date(share.createdAt).toLocaleDateString()}"],
  ["• Expires {new Date(share.expiresAt).toLocaleDateString()}", "• Expira el {new Date(share.expiresAt).toLocaleDateString()}"],
  ['>\n                      Map\n                    </span>', '>\n                      Mapa\n                    </span>'],
  ['>\n                      Statistics\n                    </span>', '>\n                      Estadísticas\n                    </span>'],
  ['>\n                      Flight List\n                    </span>', '>\n                      Lista de vuelos\n                    </span>'],
]);

// =========================================================
// CREATE SHARE - remaining
// =========================================================
apply('src/lib/components/modals/settings/pages/CreateShare.svelte', [
  ['<Form.Button>Create</Form.Button>', '<Form.Button>Crear</Form.Button>'],
]);

// =========================================================
// DEDUPLICATE PAGE
// =========================================================
apply('src/routes/tools/deduplicate/+page.svelte', [
  ["'aria-label': 'Select all'", "'aria-label': 'Seleccionar todo'"],
  ["'aria-label': 'Select row'", "'aria-label': 'Seleccionar fila'"],
  ['All of these already exist in the database, with the same origin,\n    destination, and date.', 'Todos estos ya existen en la base de datos, con el mismo origen,\n    destino y fecha.'],
  ['No duplicates found.', 'No se encontraron duplicados.'],
  ['>Delete Flights\n  </Button>', '>Eliminar vuelos\n  </Button>'],
]);

// =========================================================
// SHARE [slug] page
// =========================================================
apply('src/routes/share/[slug]/+page.svelte', [
  ["This share doesn't contain any flight data, or the filters applied\n        result in no visible flights.", "Este compartido no contiene datos de vuelo, o los filtros aplicados\n        no muestran ningún vuelo."],
]);

// =========================================================
// SWIPEABLE FLIGHT ROW
// =========================================================
apply('src/lib/components/modals/list-flights/SwipeableFlightRow.svelte', [
  ['<span class="text-xs font-medium">Edit</span>', '<span class="text-xs font-medium">Editar</span>'],
  ['<span class="text-xs font-medium">Delete</span>', '<span class="text-xs font-medium">Eliminar</span>'],
]);

// =========================================================
// FLIGHT CUSTOM FIELDS MODAL - Save/Cancel
// =========================================================
apply('src/lib/components/modals/flight-form/FlightCustomFieldsModal.svelte', [
  ['>\n        Cancel\n      </Button>', '>\n        Cancelar\n      </Button>'],
  ['>Save</Button>', '>Guardar</Button>'],
]);

// =========================================================
// MAP CONTROLS
// =========================================================
apply('src/lib/components/map/Map.svelte', [
  ['title="Show all flights"', 'title="Mostrar todos los vuelos"'],
  ['title="Filter flights"', 'title="Filtrar vuelos"'],
  ['title="Clear filters"', 'title="Limpiar filtros"'],
]);

// =========================================================
// ARC POPUP - "+X more"
// =========================================================
apply('src/lib/components/map/ArcPopup.svelte', [
  ['+{data.flights.length - 5} more', '+{data.flights.length - 5} más'],
]);

apply('src/lib/components/map/AirportPopup.svelte', [
  ['+{data.flights.length - 5} more', '+{data.flights.length - 5} más'],
]);

// =========================================================
// SECURITY - CreateKey "Create" button
// =========================================================
apply('src/lib/components/modals/settings/pages/security-page/CreateKey.svelte', [
  ['>Create</Button>', '>Crear</Button>'],
  ['onclick={() => (open = true)}>Create</Button>', 'onclick={() => (open = true)}>Crear</Button>'],
]);

// =========================================================
// SECURITY - API Keys "Created" / "Last used" 
// =========================================================
apply('src/lib/components/modals/settings/pages/security-page/ApiKeys.svelte', [
  ['Created {formatRelative(key.createdAt, new Date())}', 'Creado {formatRelative(key.createdAt, new Date())}'],
  ['Last used {formatRelative(key.lastUsed, new Date())}', 'Último uso {formatRelative(key.lastUsed, new Date())}'],
]);

// =========================================================
// DATA - AIRLINE CreateAirline remaining
// =========================================================
apply('src/lib/components/modals/settings/pages/data-page/airline/CreateAirline.svelte', [
  ["toast.error('Failed to upload icon');", "toast.error('Error al subir el icono');"],
  ['<Form.Button>Create</Form.Button>', '<Form.Button>Crear</Form.Button>'],
  ['<Label>Icon</Label>', '<Label>Icono</Label>'],
]);

apply('src/lib/components/modals/settings/pages/data-page/airline/EditAirline.svelte', [
  ['<Label>Icon</Label>', '<Label>Icono</Label>'],
]);

// =========================================================
// DATA - AIRCRAFT CreateAircraft
// =========================================================
apply('src/lib/components/modals/settings/pages/data-page/aircraft/CreateAircraft.svelte', [
  ['<Form.Button>Create</Form.Button>', '<Form.Button>Crear</Form.Button>'],
]);

// =========================================================
// DATA - AIRPORT CreateAirport
// =========================================================
apply('src/lib/components/modals/settings/pages/data-page/airport/CreateAirport.svelte', [
  ['<Form.Button>Create</Form.Button>', '<Form.Button>Crear</Form.Button>'],
]);

// =========================================================
// IMPORT - FileStep remaining 
// =========================================================
apply('src/lib/components/modals/settings/pages/import-page/FileStep.svelte', [
  ['>Next</Button>', '>Siguiente</Button>'],
]);

// =========================================================
// IMPORT - OptionsStep remaining
// =========================================================
apply('src/lib/components/modals/settings/pages/import-page/OptionsStep.svelte', [
  ['>Back</Button>', '>Atrás</Button>'],
]);

// =========================================================
// IMPORT - UserMappingStep remaining
// =========================================================
apply('src/lib/components/modals/settings/pages/import-page/UserMappingStep.svelte', [
  ['>Back</Button', '>Atrás</Button'],
  ['>Map exported users</h3>', '>Mapear usuarios exportados</h3>'],
]);

// =========================================================
// USERS - UserModal remaining role labels
// =========================================================
apply('src/lib/components/modals/settings/pages/users-page/UserModal.svelte', [
  ['<span class="text-2xl font-bold">User</span>', '<span class="text-2xl font-bold">Usuario</span>'],
  ['<span class="text-2xl font-bold">Admin</span>', '<span class="text-2xl font-bold">Administrador</span>'],
]);

// =========================================================
// OAUTH PAGE - remaining autoLogin description
// =========================================================
apply('src/lib/components/modals/settings/pages/OAuthPage.svelte', [
  ['Automatically redirect users to the OAuth provider when they\n                visit the login page.', 'Redirigir automáticamente a los usuarios al proveedor OAuth cuando\n                visiten la página de inicio de sesión.'],
]);

// =========================================================
// AIRLINE FIELD - "Select airline" placeholder
// =========================================================
apply('src/lib/components/form-fields/AirlineField.svelte', [
  ['placeholder="Select airline"', 'placeholder="Seleccionar aerolínea"'],
]);

// =========================================================
// SR-ONLY Close buttons
// =========================================================
apply('src/lib/components/ui/modal/ModalHeader.svelte', [
  ['<span class="sr-only">Close</span>', '<span class="sr-only">Cerrar</span>'],
]);

apply('src/lib/components/ui/dialog/dialog-content.svelte', [
  ['<span class="sr-only">Close</span>', '<span class="sr-only">Cerrar</span>'],
]);

// =========================================================
// UI TOOLTIP / INPUT helpers
// =========================================================
apply('src/lib/components/ui/tooltip/help-tooltip.svelte', [
  ['title="Click to view tooltip"', 'title="Clic para ver información"'],
]);

apply('src/lib/components/ui/input/password-input.svelte', [
  ['title="Toggle password visibility"', 'title="Alternar visibilidad de contraseña"'],
]);

apply('src/lib/components/ui/input/copy-input.svelte', [
  ['title="Copy to clipboard"', 'title="Copiar al portapapeles"'],
]);

// =========================================================
// AIRCRAFT FORM FIELDS - ICAO Code label
// =========================================================
apply('src/lib/components/modals/settings/pages/data-page/aircraft/AircraftFormFields.svelte', [
  ['>ICAO Code</Form.Label>', '>Código ICAO</Form.Label>'],
]);

// =========================================================
// AIRLINE FORM FIELDS - ICAO/IATA Code labels
// =========================================================
apply('src/lib/components/modals/settings/pages/data-page/airline/AirlineFormFields.svelte', [
  ['>ICAO Code</Form.Label>', '>Código ICAO</Form.Label>'],
  ['>IATA Code</Form.Label>', '>Código IATA</Form.Label>'],
]);

// =========================================================
// AIRPORT FORM FIELDS - ICAO/IATA labels
// =========================================================
apply('src/lib/components/modals/settings/pages/data-page/airport/AirportFormFields.svelte', [
  ['>ICAO *</Form.Label>', '>ICAO *</Form.Label>'],    // keep ICAO
  ['>IATA</Form.Label>', '>IATA</Form.Label>'],        // keep IATA
]);

// =========================================================
// STATISTICS MODAL - any remaining 
// =========================================================
apply('src/lib/components/modals/statistics/StatisticsModal.svelte', [
  // Check tab labels in modal if any
]);

console.log(`\nTotal: ${totalReplacements} replacements in ${totalFiles} files`);
