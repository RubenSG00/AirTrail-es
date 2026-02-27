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
// GENERAL PAGE
// =========================================================
apply('src/lib/components/modals/settings/pages/general-page/GeneralPage.svelte', [
  ['title="General"', 'title="General"'],  // already done via first pass? check
  ['"Set up your account and manage your settings."', '"Configura tu cuenta y gestiona tus ajustes."'],
  ['>Log out</Button>', '>Cerrar sesión</Button>'],
]);

// =========================================================
// SECURITY PAGE
// =========================================================
apply('src/lib/components/modals/settings/pages/security-page/SecurityPage.svelte', [
  ['title="Security"', 'title="Seguridad"'],
  ['"Manage your account security settings."', '"Gestiona la seguridad de tu cuenta."'],
  ['toast.loading(\'Deleting all your flights...\')', 'toast.loading(\'Eliminando todos tus vuelos...\')'],
  ['toast.info(\'All your flights have been deleted.\'', 'toast.info(\'Todos tus vuelos han sido eliminados.\''],
  ['toast.error(\'Failed to delete your flights\'', 'toast.error(\'Error al eliminar tus vuelos\''],
  ['>Password</h4>', '>Contraseña</h4>'],
  ['>Danger zone</h4>', '>Zona de peligro</h4>'],
  ['title="Delete all flights"', 'title="Eliminar todos los vuelos"'],
  ['"Are you sure you want to delete all your flights? This does not include flights you share with other users. This action cannot be undone."', '"¿Estás seguro de que deseas eliminar todos tus vuelos? Esto no incluye vuelos que compartes con otros usuarios. Esta acción no se puede deshacer."'],
  ['>Delete all flights\n          </Button>', '>Eliminar todos los vuelos\n          </Button>'],
  ['Delete all flights\n          </Button>', 'Eliminar todos los vuelos\n          </Button>'],
]);

// =========================================================
// EDIT PASSWORD
// =========================================================
apply('src/lib/components/modals/settings/pages/security-page/EditPassword.svelte', [
  ['>Edit password</Button>', '>Editar contraseña</Button>'],
  ['section="Security"', 'section="Seguridad"'],
  ['title="Edit password"', 'title="Editar contraseña"'],
  ['>Current Password</Form.Label>', '>Contraseña actual</Form.Label>'],
  ['>New Password</Form.Label>', '>Nueva contraseña</Form.Label>'],
  ['>Confirm Password</Form.Label>', '>Confirmar contraseña</Form.Label>'],
]);

// =========================================================
// API KEYS
// =========================================================
apply('src/lib/components/modals/settings/pages/security-page/ApiKeys.svelte', [
  ['toast.success(\'API key deleted\')', 'toast.success(\'Clave API eliminada\')'],
  ['title="API Keys"', 'title="Claves API"'],
  ['subtitle="Manage your API keys"', 'subtitle="Gestiona tus claves API"'],
  ['title="Delete API Key"', 'title="Eliminar clave API"'],
  ['"Are you sure you want to delete this API key? This action cannot be undone."', '"¿Estás seguro de que deseas eliminar esta clave API? Esta acción no se puede deshacer."'],
  ['>No API keys found</p>', '>No se encontraron claves API</p>'],
]);

// =========================================================
// CREATE KEY
// =========================================================
apply('src/lib/components/modals/settings/pages/security-page/CreateKey.svelte', [
  ['toast.error(\'Failed to create API key\')', 'toast.error(\'Error al crear la clave API\')'],
  ['toast.success(\'API key created\')', 'toast.success(\'Clave API creada\')'],
  ['section="API Keys"', 'section="Claves API"'],
  ['title="Create key"', 'title="Crear clave"'],
  ['>Name</Label>', '>Nombre</Label>'],
  ['>Create\n        </Button>', '>Crear\n        </Button>'],
  ['>Your API Key</h1>', '>Tu clave API</h1>'],
  ['Your API key has been created. Please copy it and store it in a safe\n          place, as you won\'t be able to see it again.', 'Tu clave API ha sido creada. Por favor, cópiala y guárdala en un lugar seguro, ya que no podrás verla de nuevo.'],
  ['>Got it</Button', '>Entendido</Button'],
]);

// =========================================================
// OAUTH (security page)
// =========================================================
apply('src/lib/components/modals/settings/pages/security-page/OAuth.svelte', [
  ['toast.info(\'OAuth unlinked successfully.\')', 'toast.info(\'OAuth desvinculado correctamente.\')'],
  ['You can currently sign in via OAuth.', 'Actualmente puedes iniciar sesión mediante OAuth.'],
  ['Link your account to an OAuth provider.', 'Vincula tu cuenta a un proveedor de OAuth.'],
  ['title="Unlink OAuth"', 'title="Desvincular OAuth"'],
  ['"Are you sure you want to unlink your OAuth account? If you do not have a password set, you will not be able to sign in."', '"¿Estás seguro de que deseas desvincular tu cuenta OAuth? Si no tienes una contraseña configurada, no podrás iniciar sesión."'],
  ['confirmText="Unlink"', 'confirmText="Desvincular"'],
  ['>Unlink\n            </Button>', '>Desvincular\n            </Button>'],
  ['>\n              Unlink\n            </Button>', '>\n              Desvincular\n            </Button>'],
  ['>Link\n        </Button>', '>Vincular\n        </Button>'],
  ['>\n          Link\n        </Button>', '>\n          Vincular\n        </Button>'],
]);

// =========================================================
// IMPORT PAGE
// =========================================================
apply('src/lib/components/modals/settings/pages/import-page/ImportPage.svelte', [
  ['title="Import"', 'title="Importar"'],
  ['>Choose a source</h3>', '>Elegir una fuente</h3>'],
  ['Custom field values are included in the export for reference, but are\n          not restored during import.', 'Los valores de campos personalizados se incluyen en la exportación como referencia, pero no se restauran durante la importación.'],
  ['>Next</Button>', '>Siguiente</Button>'],
  ['toast.info(\'No new flights to import\')', 'toast.info(\'No hay nuevos vuelos para importar\')'],
  ['toast.success(`Imported ${inserted} ${pluralize(inserted, \'flight\')}`)', 'toast.success(`Se importaron ${inserted} ${pluralize(inserted, \'vuelo\')}`)', ],
  ['toast.error(\'No flights found in the file\')', 'toast.error(\'No se encontraron vuelos en el archivo\')'],
  ['toast.error(\'Failed to import file\')', 'toast.error(\'Error al importar el archivo\')'],
  ['toast.error(\'Failed to reprocess file\')', 'toast.error(\'Error al reprocesar el archivo\')'],
  ["'Source'", "'Fuente'"],
  ["'File'", "'Archivo'"],
  ["'Options'", "'Opciones'"],
  ["'Users'", "'Usuarios'"],
  ["'Status'", "'Estado'"],
]);

// =========================================================
// FILE STEP
// =========================================================
apply('src/lib/components/modals/settings/pages/import-page/FileStep.svelte', [
  ['>Upload file</h3>', '>Subir archivo</h3>'],
  ["'Upload file'", "'Subir archivo'"],
  ['Supported: CSV, TXT, JSON, ICS. Max 5MB.', 'Soportado: CSV, TXT, JSON, ICS. Máx. 5MB.'],
  ['>Back</Button>', '>Atrás</Button>'],
  ['File type not supported', 'Tipo de archivo no soportado'],
  ['File must be less than 5MB', 'El archivo debe ser menor de 5MB'],
]);

// =========================================================
// OPTIONS STEP
// =========================================================
apply('src/lib/components/modals/settings/pages/import-page/OptionsStep.svelte', [
  ['>Options</h3>', '>Opciones</h3>'],
  ['Match airline from flight number', 'Asociar aerolínea por número de vuelo'],
  ['>Only import your flights</Label', '>Solo importar tus vuelos</Label'],
  ['Deduplicate imported flights', 'Deduplicar vuelos importados'],
  ['>Import\n    </Button>', '>Importar\n    </Button>'],
  ['>\n      Import\n    </Button>', '>\n      Importar\n    </Button>'],
]);

// =========================================================
// STATUS STEP
// =========================================================
apply('src/lib/components/modals/settings/pages/import-page/StatusStep.svelte', [
  ['>Import Status</h3>', '>Estado de la importación</h3>'],
  ['>Import Complete</p>', '>Importación completada</p>'],
  ['Successfully imported', 'Se importaron correctamente'],
  ['Unknown\n            {pluralize(', 'Desconocidos\n            {pluralize('],
  ["'Code',", "'código',"],
  ['Match unknown airports and airlines, then re-import.', 'Asocia aeropuertos y aerolíneas desconocidos, luego reimporta.'],
  ['>Airports ({unknownAirportCodes.length})', '>Aeropuertos ({unknownAirportCodes.length})'],
  ['placeholder="Search for airport..."', 'placeholder="Buscar aeropuerto..."'],
  ['>Airlines ({unknownAirlineCodes.length})', '>Aerolíneas ({unknownAirlineCodes.length})'],
  ['placeholder="Search for airline..."', 'placeholder="Buscar aerolínea..."'],
  ["'airport')} mapped", "'aeropuerto')} mapeados"],
  ["'airline')} mapped", "'aerolínea')} mapeados"],
  ['>Apply Mapping & Re-import\n        </Button>', '>Aplicar mapeo y reimportar\n        </Button>'],
  ['Apply Mapping & Re-import', 'Aplicar mapeo y reimportar'],
  ['>Search OurAirports\n', '>Buscar en OurAirports\n'],
  ['Search OurAirports', 'Buscar en OurAirports'],
  ['>Close\n        </Button>', '>Cerrar\n        </Button>'],
]);

// =========================================================
// USER MAPPING STEP
// =========================================================
apply('src/lib/components/modals/settings/pages/import-page/UserMappingStep.svelte', [
  ['>Mapa exported users</h3>', '>Mapear usuarios exportados</h3>'],
  ['Review and adjust user mapping before import.', 'Revisa y ajusta el mapeo de usuarios antes de importar.'],
  ['Username matches are pre-selected when possible.', 'Las coincidencias de nombre de usuario se preseleccionan cuando es posible.'],
  ['Select local user...', 'Seleccionar usuario local...'],
  ['No mapping (import as guest)', 'Sin mapeo (importar como invitado)'],
  ['users mapped', 'usuarios mapeados'],
  ['>Continue Import</Button', '>Continuar importación</Button'],
]);

// =========================================================
// IMPORT PAGE index.ts (platform descriptions)
// =========================================================
apply('src/lib/components/modals/settings/pages/import-page/index.ts', [
  ["description: 'CSV export from MyFlightRadar24 settings.'", "description: 'Exportación CSV desde la configuración de MyFlightRadar24.'"],
  ["description: 'Text export from App in the Air (via email).'", "description: 'Exportación de texto desde App in the Air (por correo).'"],
  ["description: 'CSV export from JetLog settings.'", "description: 'Exportación CSV desde la configuración de JetLog.'"],
  ["description: 'Trip export from TripIt as an ICS file.'", "description: 'Exportación de viaje desde TripIt como archivo ICS.'"],
  ["description: 'CSV export from Flighty flight tracker app.'", "description: 'Exportación CSV desde la app Flighty.'"],
  ["description: 'CSV export from byAir flight tracker.'", "description: 'Exportación CSV desde el rastreador de vuelos byAir.'"],
  ["description: 'JSON export from AirTrail (re-import your data).'", "description: 'Exportación JSON desde AirTrail (reimportar datos).'"],
  ["description:\n      'JSON export from AirTrail (exported from a pre-v3 version of AirTrail).'", "description:\n      'Exportación JSON desde AirTrail (exportada desde una versión anterior a v3).'"],
]);

// =========================================================
// DATA PAGE
// =========================================================
apply('src/lib/components/modals/settings/pages/data-page/DataPage.svelte', [
  ['title="Data"', 'title="Datos"'],
  ['"Manage custom airports, airlines and aircraft."', '"Gestiona aeropuertos, aerolíneas y aeronaves personalizados."'],
  ['title="Airports"', 'title="Aeropuertos"'],
  ['title="Custom Airports"', 'title="Aeropuertos personalizados"'],
  ['title="Aircraft"', 'title="Aeronaves"'],
  ['title="Airlines"', 'title="Aerolíneas"'],
]);

// =========================================================
// UPDATE FROM SOURCE
// =========================================================
apply('src/lib/components/modals/settings/pages/data-page/UpdateFromSource.svelte', [
  ['>Airport Source</CardTitle>', '>Fuente de aeropuertos</CardTitle>'],
  ['By default, AirTrail uses', 'Por defecto, AirTrail utiliza'],
  ['as the source for airport data. If OurAirports updates their data, you can\n      in turn update the internal data used by AirTrail here.', 'como fuente de datos de aeropuertos. Si OurAirports actualiza sus datos, puedes actualizar los datos internos utilizados por AirTrail aquí.'],
  ['>Check for updates\n      </Button>', '>Buscar actualizaciones\n      </Button>'],
  ['Check for updates', 'Buscar actualizaciones'],
  ["'Updating'", "'Actualizando'"],
  ["'Success'", "'Correcto'"],
  ['>Took</dt>', '>Tardó</dt>'],
  ['>Added</dt>', '>Añadidos</dt>'],
  ['>Updated</dt>', '>Actualizados</dt>'],
  ['>Deleted</dt>', '>Eliminados</dt>'],
  ['>Status</dt>', '>Estado</dt>'],
]);

// =========================================================
// AIRCRAFT
// =========================================================
apply('src/lib/components/modals/settings/pages/data-page/aircraft/Aircraft.svelte', [
  ['toast.success(\'Aircraft removed\')', 'toast.success(\'Aeronave eliminada\')'],
  ['toast.error(\'Failed to remove aircraft\')', 'toast.error(\'Error al eliminar aeronave\')'],
  ['title="Aircraft"\n  subtitle="Manage aircraft types in your database."', 'title="Aeronaves"\n  subtitle="Gestiona los tipos de aeronaves en tu base de datos."'],
  ['placeholder="Search aircraft"', 'placeholder="Buscar aeronaves"'],
  ['title="Remove Aircraft"', 'title="Eliminar aeronave"'],
  ['"Are you sure you want to remove this aircraft? This may affect existing flight records."', '"¿Estás seguro de que deseas eliminar esta aeronave? Esto puede afectar a los registros de vuelos existentes."'],
  ['>Sync Aircraft</h2>', '>Sincronizar aeronaves</h2>'],
  ['Download aircraft data from the AirTrail repository.', 'Descargar datos de aeronaves del repositorio de AirTrail.'],
  ['Overwrite existing entries', 'Sobrescribir entradas existentes'],
  ['>Sync Aircraft\n    </Button>', '>Sincronizar aeronaves\n    </Button>'],
  ['toast.error(\'Failed to sync aircraft\')', 'toast.error(\'Error al sincronizar aeronaves\')'],
]);

apply('src/lib/components/modals/settings/pages/data-page/aircraft/AircraftFormFields.svelte', [
  ['>Aircraft Name *</Form.Label>', '>Nombre de aeronave *</Form.Label>'],
  ['The ICAO aircraft type designation code. Used for search and when\n        importing flights.', 'Código de designación de tipo de aeronave ICAO. Se usa para búsquedas y al importar vuelos.'],
]);

apply('src/lib/components/modals/settings/pages/data-page/aircraft/CreateAircraft.svelte', [
  ['section="Aircraft" title="Add aircraft"', 'section="Aeronaves" title="Añadir aeronave"'],
]);

apply('src/lib/components/modals/settings/pages/data-page/aircraft/EditAircraft.svelte', [
  ['section="Aircraft"', 'section="Aeronaves"'],
  ['title="Edit aircraft"', 'title="Editar aeronave"'],
]);

// =========================================================
// AIRLINE
// =========================================================
apply('src/lib/components/modals/settings/pages/data-page/airline/Airline.svelte', [
  ["title: 'Remove Airline'", "title: 'Eliminar aerolínea'"],
  ['`Are you sure you want to remove ${airline.name}?`', '`¿Estás seguro de que deseas eliminar ${airline.name}?`'],
  ['toast.success(\'Airline removed\')', 'toast.success(\'Aerolínea eliminada\')'],
  ['toast.error(\'Failed to remove airline\')', 'toast.error(\'Error al eliminar aerolínea\')'],
  ['title="Airlines" subtitle="Manage airlines in your database."', 'title="Aerolíneas" subtitle="Gestiona las aerolíneas en tu base de datos."'],
  ['placeholder="Search airlines"', 'placeholder="Buscar aerolíneas"'],
  ['>Sync Airlines</h2>', '>Sincronizar aerolíneas</h2>'],
  ['Download airline data and icons from the AirTrail repository.', 'Descargar datos e iconos de aerolíneas del repositorio de AirTrail.'],
  ['Include defunct airlines', 'Incluir aerolíneas extintas'],
  ['>Sync Airlines\n    </Button>', '>Sincronizar aerolíneas\n    </Button>'],
  ['Sync Airlines\n    </Button>', 'Sincronizar aerolíneas\n    </Button>'],
  ['>Sync Icons\n    </Button>', '>Sincronizar iconos\n    </Button>'],
  ['Sync Icons\n    </Button>', 'Sincronizar iconos\n    </Button>'],
  ['toast.error(\'Failed to sync airlines\')', 'toast.error(\'Error al sincronizar aerolíneas\')'],
  ['toast.info(\'No icons to sync\')', 'toast.info(\'No hay iconos para sincronizar\')'],
  ['toast.error(\'Failed to sync icons\')', 'toast.error(\'Error al sincronizar iconos\')'],
]);

apply('src/lib/components/modals/settings/pages/data-page/airline/AirlineFormFields.svelte', [
  ['>Airline Name *</Form.Label>', '>Nombre de aerolínea *</Form.Label>'],
  ['The ICAO airline designation code (3 letters). Used for search and when\n        importing flights.', 'Código de designación de aerolínea ICAO (3 letras). Se usa para búsquedas y al importar vuelos.'],
  ['The IATA airline designation code (2 letters). Used for display and when\n        importing flights. Append <code>*</code> for controlled duplicates.', 'Código de designación de aerolínea IATA (2 letras). Se usa para visualización y al importar vuelos. Añade <code>*</code> para duplicados controlados.'],
  ['This IATA code is marked as a controlled duplicate. Airlines with a\n        <code>*</code> suffix are excluded from automatic airline matching when importing\n        flights by flight number.', 'Este código IATA está marcado como duplicado controlado. Las aerolíneas con sufijo <code>*</code> se excluyen de la asociación automática de aerolíneas al importar vuelos por número de vuelo.'],
]);

apply('src/lib/components/modals/settings/pages/data-page/airline/CreateAirline.svelte', [
  ['section="Airlines" title="Add airline"', 'section="Aerolíneas" title="Añadir aerolínea"'],
]);

apply('src/lib/components/modals/settings/pages/data-page/airline/EditAirline.svelte', [
  ['section="Airlines"', 'section="Aerolíneas"'],
  ['title="Edit airline"', 'title="Editar aerolínea"'],
]);

// =========================================================
// AIRPORT
// =========================================================
apply('src/lib/components/modals/settings/pages/data-page/airport/AirportFormFields.svelte', [
  ['>Name *</Form.Label>', '>Nombre *</Form.Label>'],
  ['>Municipality</Form.Label>', '>Municipio</Form.Label>'],
  ['>Type *</Form.Label>', '>Tipo *</Form.Label>'],
  ["'Select a type'", "'Seleccionar un tipo'"],
  ['>Purely for sorting purposes.', '>Solo para fines de ordenación.'],
  ['The ICAO code of the airport.', 'El código ICAO del aeropuerto.'],
  ['The IATA code of the airport.', 'El código IATA del aeropuerto.'],
  ['Will only be used for display purposes\n          and airport autocomplete.', 'Solo se usará para fines de visualización y autocompletado de aeropuertos.'],
]);

apply('src/lib/components/modals/settings/pages/data-page/airport/CreateAirport.svelte', [
  ['section="Airports" title="Add airport"', 'section="Aeropuertos" title="Añadir aeropuerto"'],
]);

apply('src/lib/components/modals/settings/pages/data-page/airport/CustomAirports.svelte', [
  ['toast.success(\'Airport removed\')', 'toast.success(\'Aeropuerto eliminado\')'],
  ['toast.error(\'Failed to remove airport\')', 'toast.error(\'Error al eliminar aeropuerto\')'],
  ['title="Custom Airports"\n  subtitle="Add airports not found in the official list."', 'title="Aeropuertos personalizados"\n  subtitle="Añade aeropuertos que no se encuentran en la lista oficial."'],
  ['placeholder="Search airports"', 'placeholder="Buscar aeropuertos"'],
  ['title="Remove Airport"', 'title="Eliminar aeropuerto"'],
  ['"Are you sure you want to remove this airport?"', '"¿Estás seguro de que deseas eliminar este aeropuerto?"'],
  ['No airports found.', 'No se encontraron aeropuertos.'],
  ['No custom airports added.', 'No se han añadido aeropuertos personalizados.'],
]);

apply('src/lib/components/modals/settings/pages/data-page/airport/EditAirport.svelte', [
  ['section="Airports"', 'section="Aeropuertos"'],
  ['title="Edit airport"', 'title="Editar aeropuerto"'],
]);

apply('src/lib/components/modals/settings/pages/data-page/airport/LocationField.svelte', [
  ['>Location *</span', '>Ubicación *</span'],
  ['Click on the map to set the location of the airport. Drag the marker to adjust\n  the location.', 'Haz clic en el mapa para establecer la ubicación del aeropuerto. Arrastra el marcador para ajustar la ubicación.'],
  ['Please select a location on the map.', 'Por favor, selecciona una ubicación en el mapa.'],
  ['>Country *</Form.Label>', '>País *</Form.Label>'],
  ["'Select a country'", "'Seleccionar un país'"],
  ['>Continent *</Form.Label>', '>Continente *</Form.Label>'],
  ["'Select a continent'", "'Seleccionar un continente'"],
]);

apply('src/lib/components/modals/settings/pages/data-page/airport/TimezoneField.svelte', [
  ['>Timezone *</Form.Label>', '>Zona horaria *</Form.Label>'],
  ['The timezone of the airport.', 'La zona horaria del aeropuerto.'],
  ['"Needed for accurate time normalization. The backend converts all times to UTC for storage, so it needs to know the timezone for conversion."', '"Necesario para una normalización precisa del tiempo. El backend convierte todas las horas a UTC para almacenamiento, por lo que necesita conocer la zona horaria para la conversión."'],
  ["placeholder=\"Select a timezone\"", "placeholder=\"Seleccionar zona horaria\""],
  ['No timezones found.', 'No se encontraron zonas horarias.'],
]);

// =========================================================
// USERS PAGE
// =========================================================
apply('src/lib/components/modals/settings/pages/users-page/UsersPage.svelte', [
  ['title="Users" subtitle="Manage who can access AirTrail."', 'title="Usuarios" subtitle="Gestiona quién puede acceder a AirTrail."'],
  ['toast.error(\'Failed to delete user.\')', 'toast.error(\'Error al eliminar usuario.\')'],
  ['toast.success(\'User deleted.\')', 'toast.success(\'Usuario eliminado.\')'],
  ['>Add User\n    </Button>', '>Añadir usuario\n    </Button>'],
  ['Add User\n    </Button>', 'Añadir usuario\n    </Button>'],
  ['>No users found.</p>', '>No se encontraron usuarios.</p>'],
  ['title="Remove User"', 'title="Eliminar usuario"'],
  ['"Are you sure you want to remove this user?"', '"¿Estás seguro de que deseas eliminar este usuario?"'],
]);

apply('src/lib/components/modals/settings/pages/users-page/UserModal.svelte', [
  ["title={isEdit ? 'Edit user' : 'Add user'}", "title={isEdit ? 'Editar usuario' : 'Añadir usuario'}"],
  ['>Name</Form.Label>', '>Nombre</Form.Label>'],
  ['text="Admins can do everything except delete other admins or the owner."', 'text="Los administradores pueden hacer todo excepto eliminar otros administradores o al propietario."'],
  ['>Role\n', '>Rol\n'],
  ['{isEdit ? \'Save\' : \'Add\'}', '{isEdit ? \'Guardar\' : \'Añadir\'}'],
]);

// =========================================================
// CUSTOM FIELDS PAGE
// =========================================================
apply('src/lib/components/modals/settings/pages/custom-fields-page/CustomFieldsPage.svelte', [
  ['title="Custom Fields"\n  subtitle="Define optional structured fields for flight records."', 'title="Campos personalizados"\n  subtitle="Define campos estructurados opcionales para registros de vuelos."'],
  ["title: 'Remove custom field'", "title: 'Eliminar campo personalizado'"],
  ["'Are you sure you want to remove this custom field? Any existing values will be deleted.'", "'¿Estás seguro de que deseas eliminar este campo personalizado? Todos los valores existentes serán eliminados.'"],
  ['toast.success(\'Custom fields reordered\')', 'toast.success(\'Campos personalizados reordenados\')'],
  ['toast.error(\'Failed to reorder custom fields\')', 'toast.error(\'Error al reordenar campos personalizados\')'],
  ['toast.success(\'Custom field removed\')', 'toast.success(\'Campo personalizado eliminado\')'],
  ['toast.error(\'Failed to delete custom field\')', 'toast.error(\'Error al eliminar campo personalizado\')'],
  ['>No custom fields configured yet.', '>Aún no se han configurado campos personalizados.'],
]);

apply('src/lib/components/modals/settings/pages/custom-fields-page/CustomFieldEditModal.svelte', [
  ['toast.success(\'Custom field updated\')', 'toast.success(\'Campo personalizado actualizado\')'],
  ['toast.success(\'Custom field created\')', 'toast.success(\'Campo personalizado creado\')'],
  ['toast.error(\'Failed to save custom field\')', 'toast.error(\'Error al guardar campo personalizado\')'],
  ["section=\"Custom fields\"", "section=\"Campos personalizados\""],
  ["title={editing.id ? 'Edit field' : 'Add field'}", "title={editing.id ? 'Editar campo' : 'Añadir campo'}"],
  ['>Label</label', '>Etiqueta</label'],
  ['>Key</label', '>Clave</label'],
  ['>Type</label', '>Tipo</label'],
  ['label="Short text"', 'label="Texto corto"'],
  ['label="Long text"', 'label="Texto largo"'],
  ['label="Number"', 'label="Número"'],
  ['label="Boolean"', 'label="Booleano"'],
  ['label="Date"', 'label="Fecha"'],
  ['label="Select"', 'label="Selección"'],
  ['label="Airport"', 'label="Aeropuerto"'],
  ['label="Airline"', 'label="Aerolínea"'],
  ['label="Aircraft"', 'label="Aeronave"'],
  ['>Regex\n', '>Regex\n'],
  ['"Optional JavaScript-style regex pattern used to validate text values."', '"Patrón regex opcional de estilo JavaScript utilizado para validar valores de texto."'],
  ['>Min length</label', '>Longitud mín.</label'],
  ['>Max length</label', '>Longitud máx.</label'],
  ['>Min value</label', '>Valor mín.</label'],
  ['>Max value</label', '>Valor máx.</label'],
  ['>Options (one per line)</label', '>Opciones (una por línea)</label'],
  ['>Required</label', '>Obligatorio</label'],
  ['>Active</label', '>Activo</label'],
  ['>Description</label', '>Descripción</label'],
  ['placeholder="Optional helper text"', 'placeholder="Texto de ayuda opcional"'],
  ['>Preview</p>', '>Vista previa</p>'],
  ['This is how the field will appear. The value you enter here becomes\n            the default.', 'Así es como se verá el campo. El valor que ingreses aquí se convierte en el predeterminado.'],
  ["label={editing.label || 'Untitled field'}", "label={editing.label || 'Campo sin título'}"],
  ['>Cancelar</Button>', '>Cancelar</Button>'],  // already Spanish if first pass worked
  ['>Save</Button>', '>Guardar</Button>'],
]);

apply('src/lib/components/modals/settings/pages/custom-fields-page/CustomFieldRow.svelte', [
  ["'(inactive)'", "'(inactivo)'"],
  ["' • Required'", "' • Obligatorio'"],
]);

// =========================================================
// FORM FIELDS - AIRCRAFT FIELD
// =========================================================
apply('src/lib/components/form-fields/AircraftField.svelte', [
  ["'Unknown Aircraft'", "'Aeronave desconocida'"],
  ['placeholder="Select aircraft"', 'placeholder="Seleccionar aeronave"'],
  ["'No ICAO'", "'Sin ICAO'"],
  ['Loading aircraft...', 'Cargando aeronaves...'],
  ['>No results found</span>\n              <span class="text-sm opacity-75">Create a new aircraft?</span>', '>No se encontraron resultados</span>\n              <span class="text-sm opacity-75">¿Crear una nueva aeronave?</span>'],
]);

apply('src/lib/components/form-fields/AircraftPicker.svelte', [
  ["'Searching...' : 'Searching aircraft...'", "'Buscando...' : 'Buscando aeronaves...'"],
  ["'Type to search'", "'Escribe para buscar'"],
  ["No {compact ? 'results' : 'aircraft found'}", "No se encontraron {compact ? 'resultados' : 'aeronaves'}"],
]);

apply('src/lib/components/form-fields/AirlinePicker.svelte', [
  ["'Searching...' : 'Searching airlines...'", "'Buscando...' : 'Buscando aerolíneas...'"],
  ["'Type to search'", "'Escribe para buscar'"],
  [">No results found</span>\n              <span class=\"text-xs opacity-75\">Create a new airline?</span>", ">No se encontraron resultados</span>\n              <span class=\"text-xs opacity-75\">¿Crear una nueva aerolínea?</span>"],
  ["No {compact ? 'results' : 'airlines found'}", "No se encontraron {compact ? 'resultados' : 'aerolíneas'}"],
]);

apply('src/lib/components/form-fields/AirportField.svelte', [
  ["placeholder=\"Choose an airport\"", "placeholder=\"Elegir un aeropuerto\""],
]);

apply('src/lib/components/form-fields/AirportPicker.svelte', [
  ["'Searching...' : 'Searching airports...'", "'Buscando...' : 'Buscando aeropuertos...'"],
  ["'Type to search'", "'Escribe para buscar'"],
  [">No results found</span>\n              <span class=\"text-xs opacity-75\">Create a new airport?</span>", ">No se encontraron resultados</span>\n              <span class=\"text-xs opacity-75\">¿Crear un nuevo aeropuerto?</span>"],
  ["No {compact ? 'results' : 'airports found'}", "No se encontraron {compact ? 'resultados' : 'aeropuertos'}"],
]);

apply('src/lib/components/form-fields/DateTimeField.svelte', [
  ['text="Local airport time."', 'text="Hora local del aeropuerto."'],
]);

apply('src/lib/components/form-fields/IconUploadField.svelte', [
  ["'Invalid file type. Use PNG, JPG, SVG, or WebP.'", "'Tipo de archivo inválido. Usa PNG, JPG, SVG o WebP.'"],
  ["'File too large (max 5MB).'", "'Archivo demasiado grande (máx. 5MB).'"],
  ["toast.success('Icon uploaded')", "toast.success('Icono subido')"],
  ["toast.error(result.error || 'Failed to upload icon')", "toast.error(result.error || 'Error al subir el icono')"],
  ["toast.error('Failed to upload icon')", "toast.error('Error al subir el icono')"],
  ["toast.success('Icon removed')", "toast.success('Icono eliminado')"],
  ["toast.error(result.error || 'Failed to remove icon')", "toast.error(result.error || 'Error al eliminar el icono')"],
  ["toast.error('Failed to remove icon')", "toast.error('Error al eliminar el icono')"],
  ['Uploading...', 'Subiendo...'],
  ["{iconUrl ? 'Change' : 'Upload'}", "{iconUrl ? 'Cambiar' : 'Subir'}"],
  ['PNG, JPG, SVG, or WebP. Max 5MB.<br />\n      You can also paste from clipboard.', 'PNG, JPG, SVG o WebP. Máx. 5MB.<br />\n      También puedes pegar desde el portapapeles.'],
]);

// =========================================================
// MAP POPUPS
// =========================================================
apply('src/lib/components/map/AirportPopup.svelte', [
  ['>Airport</h3>', '>Aeropuerto</h3>'],
  [">{pluralize(data.departures, 'departure')}</span", ">{pluralize(data.departures, 'salida')}</span"],
  [">{pluralize(data.arrivals, 'arrival')}</span", ">{pluralize(data.arrivals, 'llegada')}</span"],
  [">{pluralize(data.airlines.length, 'airline')}</span", ">{pluralize(data.airlines.length, 'aerolínea')}</span"],
  ['>Route</h3>\n', '>Ruta</h3>\n'],
  ['>Date</h3>\n', '>Fecha</h3>\n'],
  ['>Airline</h3>\n', '>Aerolínea</h3>\n'],
  ['>Click to view all</p>', '>Clic para ver todos</p>'],
]);

apply('src/lib/components/map/ArcPopup.svelte', [
  ['>Route</h3>', '>Ruta</h3>'],
  [">{pluralize(data.flights.length, 'trip')}</span", ">{pluralize(data.flights.length, 'viaje')}</span"],
  [">{pluralize(data.airlines.length, 'airline')}</span", ">{pluralize(data.airlines.length, 'aerolínea')}</span"],
  ['>Route</h3>\n    <h3 class="font-semibold">Date</h3>\n    <h3 class="font-semibold">Airline</h3>', '>Ruta</h3>\n    <h3 class="font-semibold">Fecha</h3>\n    <h3 class="font-semibold">Aerolínea</h3>'],
  ['>Click to view all</p>', '>Clic para ver todos</p>'],
]);

// =========================================================
// HELPERS - CONFIRM
// =========================================================
apply('src/lib/components/helpers/Confirm.svelte', [
  ["confirmText = 'Confirm'", "confirmText = 'Confirmar'"],
  ["cancelText = 'Cancel'", "cancelText = 'Cancelar'"],
]);

apply('src/lib/components/helpers/confirm/ConfirmDialog.svelte', [
  ["confirmText = 'Confirm'", "confirmText = 'Confirmar'"],
  ["cancelText = 'Cancel'", "cancelText = 'Cancelar'"],
]);

// =========================================================
// NEW VERSION ANNOUNCEMENT
// =========================================================
apply('src/lib/components/modals/new-version-announcement/NewVersionAnnouncement.svelte', [
  ['New version available!', '¡Nueva versión disponible!'],
  ['{versionState.newReleases.length} new versions available!', '¡{versionState.newReleases.length} nuevas versiones disponibles!'],
  ['>Got it</Dialog.Action>', '>Entendido</Dialog.Action>'],
]);

// =========================================================
// FLIGHT FILTERS
// =========================================================
apply('src/lib/components/flight-filters/Filters.svelte', [
  ['title="Departure Airport"', 'title="Aeropuerto de salida"'],
  ['placeholder="Search departure airports"', 'placeholder="Buscar aeropuertos de salida"'],
  ['title="Arrival Airport"', 'title="Aeropuerto de llegada"'],
  ['placeholder="Search arrival airports"', 'placeholder="Buscar aeropuertos de llegada"'],
  ['title="From"', 'title="Desde"'],
  ['title="To"', 'title="Hasta"'],
  ['title="Airline"', 'title="Aerolínea"'],
  ['placeholder="Search airlines"', 'placeholder="Buscar aerolíneas"'],
  ['title="Aircraft"', 'title="Aeronave"'],
  ['placeholder="Search aircraft"', 'placeholder="Buscar aeronaves"'],
  ['title="Tail Number"', 'title="Matrícula"'],
  ['placeholder="Search tail numbers"', 'placeholder="Buscar matrículas"'],
  ['>Clear Filters\n  </Button>', '>Limpiar filtros\n  </Button>'],
  ['Clear Filters\n  </Button>', 'Limpiar filtros\n  </Button>'],
]);

apply('src/lib/components/flight-filters/SelectFilter.svelte', [
  ['{filterValues.length} Selected', '{filterValues.length} Seleccionados'],
  ['>No results found.</Command.Empty>', '>No se encontraron resultados.</Command.Empty>'],
  ['No results found.', 'No se encontraron resultados.'],
  ['>Clear filters\n', '>Limpiar filtros\n'],
  ['Clear filters\n', 'Limpiar filtros\n'],
]);

// =========================================================
// STATISTICS - CHART TITLES (aggregations.ts)
// =========================================================
apply('src/lib/stats/aggregations.ts', [
  ["title: 'Seat Class'", "title: 'Clase de asiento'"],
  ["title: 'Seat Preference'", "title: 'Preferencia de asiento'"],
  ["title: 'Flight Reasons'", "title: 'Motivos de vuelo'"],
  ["title: 'Continents'", "title: 'Continentes'"],
  ["title: 'Airlines'", "title: 'Aerolíneas'"],
  ["title: 'Aircraft Models'", "title: 'Modelos de aeronaves'"],
  ["title: 'Specific Aircrafts'", "title: 'Aeronaves específicas'"],
  ["title: 'Visited Airports'", "title: 'Aeropuertos visitados'"],
  ["title: 'Routes'", "title: 'Rutas'"],
  ["title: 'Visited Country Status'", "title: 'Estado de países visitados'"],
  ["title: 'Countries by Continent'", "title: 'Países por continente'"],
]);

// =========================================================
// STATISTICS - PIE CHARTS TITLES
// =========================================================
apply('src/lib/components/modals/statistics/charts/PieCharts.svelte', [
  ['title="Seat Class"', 'title="Clase de asiento"'],
  ['title="Seat Preference"', 'title="Preferencia de asiento"'],
  ['title="Flight Reasons"', 'title="Motivos de vuelo"'],
  ['title="Continents"', 'title="Continentes"'],
  ['title="Top Airlines"', 'title="Top aerolíneas"'],
  ['title="Top Aircraft Models"', 'title="Top modelos de aeronaves"'],
  ['title="Top Specific Aircraft"', 'title="Top aeronaves específicas"'],
  ['title="Top Visited Airports"', 'title="Top aeropuertos visitados"'],
  ['title="Top Routes"', 'title="Top rutas"'],
]);

// =========================================================
// STATISTICS - CHART DRILLDOWN
// =========================================================
apply('src/lib/components/modals/statistics/charts/ChartDrillDown.svelte', [
  ['← Back to Overview', '← Volver al resumen'],
  ['total entries across', 'entradas totales en'],
  ['flights\n', 'vuelos\n'],
  ['>Distribution Overview\n', '>Resumen de distribución\n'],
  ['Distribution Overview', 'Resumen de distribución'],
  ['>Unique Categories\n', '>Categorías únicas\n'],
  ['Unique Categories', 'Categorías únicas'],
  ['>Total Count\n', '>Total\n'],
  ['Total Count', 'Total'],
  ['>Detailed Breakdown\n', '>Desglose detallado\n'],
  ['Detailed Breakdown', 'Desglose detallado'],
  ['categories ranked by frequency', 'categorías ordenadas por frecuencia'],
  ['>No data available</p>', '>Sin datos disponibles</p>'],
  ['This chart will populate as you add more flights', 'Este gráfico se completará a medida que añadas más vuelos'],
]);

apply('src/lib/components/modals/statistics/charts/BarChartDrillDown.svelte', [
  ['← Back to Overview', '← Volver al resumen'],
  ['countries visited', 'países visitados'],
]);

// =========================================================
// STATISTICS - TOOLTIP LABELS
// =========================================================
apply('src/lib/components/modals/statistics/charts/FlightsPerMonth.svelte', [
  ['label="Flights"', 'label="Vuelos"'],
]);

apply('src/lib/components/modals/statistics/charts/FlightsPerWeekday.svelte', [
  ['label="Flights"', 'label="Vuelos"'],
]);

// =========================================================
// CUSTOM FIELDS TYPES
// =========================================================
apply('src/lib/utils/custom-fields.ts', [
  // Need to check if this file has FIELD_TYPE_LABELS
]);

// =========================================================
// WEEKDAY NAMES
// =========================================================
apply('src/lib/components/modals/statistics/charts/FlightsPerWeekday.svelte', [
  ["const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];", "const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];"],
]);

// =========================================================
// 'No data' / 'No Data' labels in charts
// =========================================================
apply('src/lib/components/modals/statistics/charts/BarChart.svelte', [
  ['>No data</p>', '>Sin datos</p>'],
]);

apply('src/lib/components/modals/statistics/charts/PieChart.svelte', [
  ["'No data': 1", "'Sin datos': 1"],
]);

console.log(`\nTotal: ${totalReplacements} replacements in ${totalFiles} files`);
