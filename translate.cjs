const fs = require('fs');
const path = require('path');

// Comprehensive translation map English -> Spanish
const translations = [
  // ===================== app.html =====================
  ['lang="en"', 'lang="es"'],
  ['content="A modern, open-source personal flight tracking system"', 'content="Un sistema moderno y de código abierto para el seguimiento personal de vuelos"'],

  // ===================== +error.svelte =====================
  ['Page not found', 'Página no encontrada'],
  ['An unknown error occured', 'Ha ocurrido un error desconocido'],
  ['Go back', 'Volver'],
  ['If you are the site owner, please check the logs for more information.', 'Si eres el propietario del sitio, por favor revisa los registros para más información.'],

  // ===================== +page.svelte (main) =====================
  ["toast.loading('Deleting flight...')", "toast.loading('Eliminando vuelo...')"],
  ["toast.success('Flight deleted'", "toast.success('Vuelo eliminado'"],
  ["toast.error('Failed to delete flight'", "toast.error('Error al eliminar vuelo'"],

  // ===================== Login page =====================
  ['>Login</h1>', '>Iniciar Sesión</h1>'],
  ['Welcome back! Enter your username and password to login', 'Bienvenido de nuevo. Introduce tu nombre de usuario y contraseña para iniciar sesión'],
  ['Welcome back! Login below', 'Bienvenido de nuevo. Inicia sesión a continuación'],
  ['>Username</Form.Label>', '>Nombre de usuario</Form.Label>'],
  ['>Password</Form.Label>', '>Contraseña</Form.Label>'],
  ['>Log in', '>Iniciar sesión'],

  // ===================== Setup page =====================
  ['>Welcome</h1>', '>Bienvenido</h1>'],
  ["toast.info('AirTrail is already setup')", "toast.info('AirTrail ya está configurado')"],
  ['Welcome to AirTrail! Please set up your owner account to get started.', 'Bienvenido a AirTrail. Por favor, configura tu cuenta de propietario para comenzar.'],
  ['>Display Name</Form.Label>', '>Nombre para mostrar</Form.Label>'],
  ['>Unit of measurement</Form.Label>', '>Unidad de medida</Form.Label>'],
  ["'Select a unit'", "'Seleccionar unidad'"],
  ['value="metric" label="Metric"', 'value="metric" label="Métrico"'],
  ['value="imperial" label="Imperial"', 'value="imperial" label="Imperial"'],
  ['>Create\n', '>Crear\n'],
  ['Create\n        </Form.Button>', 'Crear\n        </Form.Button>'],

  // ===================== Tools page =====================
  ['>Tools</h1>', '>Herramientas</h1>'],
  ['>SQL Console</p>', '>Consola SQL</p>'],
  ['Write and execute SQL queries.', 'Escribe y ejecuta consultas SQL.'],
  ['>Remove Duplicates</p>', '>Eliminar Duplicados</p>'],
  ['Find and remove duplicate flights.', 'Busca y elimina vuelos duplicados.'],

  // ===================== Tools/SQL page =====================
  ['>SQL Console</h1>', '>Consola SQL</h1>'],
  ['>Execute</Button>', '>Ejecutar</Button>'],
  ['placeholder="Your SQL query"', 'placeholder="Tu consulta SQL"'],
  ['>No data</Table.Cell>', '>Sin datos</Table.Cell>'],

  // ===================== Tools/Deduplicate page =====================
  ['>Remove Duplicates</h1>', '>Eliminar Duplicados</h1>'],
  ['All of these already exist in the database, with the same origin,\n    destination, and date.', 'Todos estos ya existen en la base de datos, con el mismo origen,\n    destino y fecha.'],
  ["toast.success('Flights deleted.')", "toast.success('Vuelos eliminados.')"],
  ["header: 'Origin'", "header: 'Origen'"],
  ["header: 'Destination'", "header: 'Destino'"],
  ["header: 'Departure'", "header: 'Salida'"],
  ["header: 'Arrival'", "header: 'Llegada'"],
  ["render: () => `<div class=\"hidden md:block\">Airline</div>`", "render: () => `<div class=\"hidden md:block\">Aerolínea</div>`"],
  ['>No duplicates found.</Table.Cell>', '>No se encontraron duplicados.</Table.Cell>'],
  ['>Delete Flights\n', '>Eliminar Vuelos\n'],

  // ===================== Share page =====================
  ['<title>Shared Flight Map - AirTrail</title>', '<title>Mapa de Vuelos Compartido - AirTrail</title>'],
  ['content="View shared flight data on AirTrail"', 'content="Ver datos de vuelos compartidos en AirTrail"'],
  ['>Shared Flights</div>', '>Vuelos Compartidos</div>'],
  ['({flights.length} flights)', '({flights.length} vuelos)'],
  ['Flight List\n', 'Lista de Vuelos\n'],
  ['>Statistics\n', '>Estadísticas\n'],
  ['>Shared Flight Data</h1>', '>Datos de Vuelo Compartidos</h1>'],
  ['This share includes {flights.length} flights.', 'Este enlace compartido incluye {flights.length} vuelos.'],
  ['Use the buttons above to explore the data.', 'Usa los botones de arriba para explorar los datos.'],
  ['The map view is not available for this share.', 'La vista de mapa no está disponible para este enlace compartido.'],
  ['>No Flights to Display</h1>', '>No Hay Vuelos para Mostrar</h1>'],
  ["This share doesn't contain any flight data, or the filters applied\n        result in no visible flights.", 'Este enlace compartido no contiene datos de vuelos, o los filtros aplicados\n        no muestran ningún vuelo.'],

  // ===================== Visited Countries page =====================
  ["`Marked ${result} ${pluralize(result, 'country', 'countries')} as visited`", "`Se marcaron ${result} ${pluralize(result, 'país', 'países')} como visitados`"],
  ["toast.error('No changes found.')", "toast.error('No se encontraron cambios.')"],
  ['title="Sync from flights (will never overwrite)"', 'title="Sincronizar desde vuelos (nunca sobrescribe)"'],

  // ===================== NavigationDock =====================
  ["label: 'Add flight'", "label: 'Añadir vuelo'"],
  ["label: 'List flights'", "label: 'Lista de vuelos'"],
  ["label: 'Statistics'", "label: 'Estadísticas'"],
  ["label: 'Settings'", "label: 'Configuración'"],
  ["label: 'Tools'", "label: 'Herramientas'"],
  ["label: 'Visited countries'", "label: 'Países visitados'"],
  ['label="Home"', 'label="Inicio"'],
  ["label: 'More'", "label: 'Más'"],

  // ===================== FlightsOnboarding =====================
  ['First flight', 'Primer vuelo'],
  ['Bring your flights into AirTrail', 'Importa tus vuelos a AirTrail'],
  ['Import your history or add a single flight to begin your personal map.', 'Importa tu historial o añade un vuelo para comenzar tu mapa personal.'],
  ['>Import flights</p>', '>Importar vuelos</p>'],
  ['>Start import</Button', '>Iniciar importación</Button'],
  [">Add your first flight</p>", ">Añade tu primer vuelo</p>"],
  ['Quick manual entry for one flight.', 'Entrada manual rápida para un vuelo.'],
  ['>Add flight\n', '>Añadir vuelo\n'],
  ["Tip: you can always import later in Settings > Import.", "Consejo: siempre puedes importar más tarde en Configuración > Importar."],
  ['>Not now</Button>', '>Ahora no</Button>'],

  // ===================== AddFlightModal =====================
  ['section="Flights" title="New flight"', 'section="Vuelos" title="Nuevo vuelo"'],
  ['>Add Flight</Form.Button>', '>Añadir Vuelo</Form.Button>'],

  // ===================== EditFlightModal =====================
  ['section="Flights"\n    title="Edit flight"', 'section="Vuelos"\n    title="Editar vuelo"'],
  ['>Save</Form.Button>', '>Guardar</Form.Button>'],

  // ===================== FlightForm =====================
  ['Use simple departure/arrival inputs', 'Usar entradas simples de salida/llegada'],
  ['Add detailed timetable (taxi, takeoff, landing times...)', 'Añadir horario detallado (taxi, despegue, aterrizaje...)'],
  ["'Flight duration exceeds 24 hours'", "'La duración del vuelo excede las 24 horas'"],

  // ===================== FlightInformation =====================
  ['>Registration</Form.Label>', '>Matrícula</Form.Label>'],
  ['>Flight Reason</Form.Label>', '>Motivo del Vuelo</Form.Label>'],
  ["'Select flight reason'", "'Seleccionar motivo del vuelo'"],
  ['value="leisure" label="Leisure"', 'value="leisure" label="Ocio"'],
  ['value="business" label="Business"', 'value="business" label="Negocios"'],
  ['value="crew" label="Crew"', 'value="crew" label="Tripulación"'],
  ['value="other" label="Other"', 'value="other" label="Otro"'],
  ['>Notes</Form.Label>', '>Notas</Form.Label>'],

  // ===================== FlightNumber =====================
  ['Flight Number\n', 'Número de Vuelo\n'],
  ['"If you set the departure date before searching, it will be considered when searching for flights."', '"Si estableces la fecha de salida antes de buscar, se tendrá en cuenta al buscar vuelos."'],
  ['For more detailed results, configure the', 'Para resultados más detallados, configura la'],
  ['AeroDataBox integration.', 'integración de AeroDataBox.'],
  ["'Searching...' : 'Search'", "'Buscando...' : 'Buscar'"],
  ["'Are you sure you want to overwrite the current flight information?'", "'¿Estás seguro de que quieres sobrescribir la información del vuelo actual?'"],
  ["toast.success('Flight found')", "toast.success('Vuelo encontrado')"],
  ["'Error looking up flight'", "'Error al buscar vuelo'"],
  ["toast.error('Flight not found')", "toast.error('Vuelo no encontrado')"],
  ["toast.info('Multiple flights found. Please choose one.')", "toast.info('Se encontraron varios vuelos. Por favor, elige uno.')"],
  ['>Select your flight</span>', '>Selecciona tu vuelo</span>'],
  ['>Clear</Button>', '>Limpiar</Button>'],
  ["'Unknown'", "'Desconocido'"],
  ['>Today\n', '>Hoy\n'],

  // ===================== SeatInformation =====================
  [">Seat Information</h3>", ">Información de Asiento</h3>"],
  ["window: 'Window'", "window: 'Ventanilla'"],
  ["middle: 'Middle'", "middle: 'Centro'"],
  ["aisle: 'Aisle'", "aisle: 'Pasillo'"],
  ["pilot: 'Pilot'", "pilot: 'Piloto'"],
  ["copilot: 'Co-pilot'", "copilot: 'Copiloto'"],
  ["jumpseat: 'Jumpseat'", "jumpseat: 'Asiento plegable'"],
  ["other: 'Other'", "other: 'Otro'"],
  ["content=\"Remove seat\"", "content=\"Eliminar asiento\""],
  [">Class</Form.Label>", ">Clase</Form.Label>"],
  ["'Select class'", "'Seleccionar clase'"],
  ['value="economy" label="Economy"', 'value="economy" label="Turista"'],
  ['value="economy+" label="Economy+"', 'value="economy+" label="Turista+"'],
  ['value="business" label="Business"', 'value="business" label="Business"'],
  ['value="first" label="First"', 'value="first" label="Primera"'],
  ['value="private" label="Private"', 'value="private" label="Privado"'],
  [">Seat #</Form.Label>", ">Asiento #</Form.Label>"],
  ['class="sr-only">Seat Type</Form.Label>', 'class="sr-only">Tipo de Asiento</Form.Label>'],
  ['>Add Seat\n', '>Añadir Asiento\n'],

  // ===================== PassengerPicker =====================
  ['placeholder="Passenger Name"', 'placeholder="Nombre del Pasajero"'],
  ['Start typing to search...', 'Escribe para buscar...'],
  ['>" as guest\n', '>" como invitado\n'],
  ['Create new user "', 'Crear nuevo usuario "'],

  // ===================== FlightTimetable =====================
  ['>Scheduled</div>', '>Programado</div>'],
  ['>Actual</div>', '>Real</div>'],
  ['<Label>Gate departure</Label>', '<Label>Salida de puerta</Label>'],
  ['<Label class="text-muted-foreground">Taxi out</Label>', '<Label class="text-muted-foreground">Taxi de salida</Label>'],
  ['<Label>Takeoff</Label>', '<Label>Despegue</Label>'],
  ['<Label>Landing</Label>', '<Label>Aterrizaje</Label>'],
  ['<Label class="text-muted-foreground">Taxi in</Label>', '<Label class="text-muted-foreground">Taxi de llegada</Label>'],
  ['<Label>Gate arrival</Label>', '<Label>Llegada a puerta</Label>'],
  ['<Label class="text-muted-foreground">Air time</Label>', '<Label class="text-muted-foreground">Tiempo en el aire</Label>'],
  ['<Label class="text-muted-foreground">Total time</Label>', '<Label class="text-muted-foreground">Tiempo total</Label>'],
  ['<Tabs.Trigger value="scheduled">Scheduled</Tabs.Trigger>', '<Tabs.Trigger value="scheduled">Programado</Tabs.Trigger>'],
  ['<Tabs.Trigger value="actual">Actual</Tabs.Trigger>', '<Tabs.Trigger value="actual">Real</Tabs.Trigger>'],
  ['label="Gate departure"', 'label="Salida de puerta"'],
  ['label="Takeoff"', 'label="Despegue"'],
  ['label="Landing"', 'label="Aterrizaje"'],
  ['label="Gate arrival"', 'label="Llegada a puerta"'],

  // ===================== FlightTerminalGateModal =====================
  ['Terminal & Gate', 'Terminal y Puerta'],
  ["label: 'Departure'", "label: 'Salida'"],
  ["label: 'Arrival'", "label: 'Llegada'"],
  ['>Terminal</Form.Label>', '>Terminal</Form.Label>'],
  ['>Gate</Form.Label>', '>Puerta</Form.Label>'],
  ['>Done</Button>', '>Hecho</Button>'],

  // ===================== FlightCustomFieldsModal =====================
  ['Custom Fields\n', 'Campos Personalizados\n'],
  [">Custom Fields</h2>", ">Campos Personalizados</h2>"],
  ["Some fields below are showing default values that haven't been saved\n            on this flight yet. Saving the flight will apply these defaults.", "Algunos campos a continuación muestran valores predeterminados que aún no se han guardado\n            en este vuelo. Guardar el vuelo aplicará estos valores predeterminados."],
  [">No custom fields yet</p>", ">Aún no hay campos personalizados</p>"],
  ['Track extra details on your flights like ticket price, booking\n                reference, or frequent flyer points.', 'Registra detalles adicionales de tus vuelos como precio del billete, referencia\n                de reserva o puntos de viajero frecuente.'],
  ['An administrator can configure custom fields in settings.', 'Un administrador puede configurar campos personalizados en la configuración.'],
  ['>Configure in Settings\n', '>Configurar en Ajustes\n'],
  ['>Cancel\n', '>Cancelar\n'],

  // ===================== CustomFieldInput =====================
  ["placeholder=\"Enter value...\"", "placeholder=\"Introducir valor...\""],
  ["'Select option'", "'Seleccionar opción'"],

  // ===================== TimetableDateTimeCell =====================
  ["placeholder = 'Add time'", "placeholder = 'Añadir hora'"],
  ['{label} date', '{label} fecha'],
  ['{label} time', '{label} hora'],

  // ===================== DeleteFlightModal =====================
  ['>Delete flight</h2>', '>Eliminar vuelo</h2>'],
  ['Are you sure you want to delete this flight?', '¿Estás seguro de que quieres eliminar este vuelo?'],
  ['This action cannot be undone. All associated data will be permanently\n        removed.', 'Esta acción no se puede deshacer. Todos los datos asociados se eliminarán\n        permanentemente.'],
  ['To verify, type <span class="font-semibold">{confirmationCode}</span> below', 'Para verificar, escribe <span class="font-semibold">{confirmationCode}</span> abajo'],
  [">Cancel</Button>", ">Cancelar</Button>"],
  ["'Deleting...' : 'Delete flight'", "'Eliminando...' : 'Eliminar vuelo'"],

  // ===================== ListFlightsModal =====================
  ['>All Flights</h2>', '>Todos los Vuelos</h2>'],
  ["text={airport?.name || 'Deleted Airport'}", "text={airport?.name || 'Aeropuerto eliminado'}"],

  // ===================== FlightCard =====================
  ["return 'Unknown'", "return 'Desconocido'"],
  ["{getCityName(flight.from)} to {getCityName(flight.to)}", "{getCityName(flight.from)} a {getCityName(flight.to)}"],

  // ===================== Toolbar =====================
  ['>Show All Flights\n', '>Mostrar Todos los Vuelos\n'],
  ["toast.loading('Deleting flights')", "toast.loading('Eliminando vuelos')"],
  ["toast.success('Flights deleted'", "toast.success('Vuelos eliminados'"],
  ["toast.error('Failed to delete flights'", "toast.error('Error al eliminar vuelos'"],
  ['<span class="max-sm:hidden">Filters</span>', '<span class="max-sm:hidden">Filtros</span>'],
  ["title=\"Delete selected flights\"", "title=\"Eliminar vuelos seleccionados\""],
  ["description=\"Are you sure you want to delete the selected flights? This will permanently delete the flights as well as their seats.\"", "description=\"¿Estás seguro de que quieres eliminar los vuelos seleccionados? Esto eliminará permanentemente los vuelos así como sus asientos.\""],
  ['confirmText="Delete"', 'confirmText="Eliminar"'],
  ['<span class="max-sm:hidden">Delete</span>', '<span class="max-sm:hidden">Eliminar</span>'],
  ['<span class="max-sm:hidden">\n        {#if selecting}\n          Cancel\n        {:else}\n          Select\n        {/if}', '<span class="max-sm:hidden">\n        {#if selecting}\n          Cancelar\n        {:else}\n          Seleccionar\n        {/if}'],

  // ===================== StatisticsModal =====================
  ['>Statistics</h2>', '>Estadísticas</h2>'],
  ["selectedYear === 'all' ? 'All Time' : selectedYear", "selectedYear === 'all' ? 'Todo el Tiempo' : selectedYear"],
  ['value="all" label="All Time"', 'value="all" label="Todo el Tiempo"'],
  ['>Flights</h3>', '>Vuelos</h3>'],
  ['>Distance</h3>', '>Distancia</h3>'],
  ['>Duration</h3>', '>Duración</h3>'],
  ['>Airports</h3>', '>Aeropuertos</h3>'],
  ['>Countries</h3>', '>Países</h3>'],
  ['Add\n', 'Añadir\n'],
  ['>Flight Statistics</h3>', '>Estadísticas de Vuelos</h3>'],
  ['Country Statistics', 'Estadísticas de Países'],
  ['title="Visited Country Status"', 'title="Estado de Países Visitados"'],
  ['title="Countries by Continent"', 'title="Países por Continente"'],

  // ===================== Settings Modal =====================
  ['>Settings</h2>', '>Configuración</h2>'],
  ['Manage your account settings and preferences.', 'Administra la configuración y preferencias de tu cuenta.'],
  ['Manage your AirTrail instance and system configuration.', 'Administra tu instancia de AirTrail y la configuración del sistema.'],
  ["{ title: 'General', id: 'general' }", "{ title: 'General', id: 'general' }"],
  ["{ title: 'Security', id: 'security' }", "{ title: 'Seguridad', id: 'security' }"],
  ["{ title: 'Appearance', id: 'appearance' }", "{ title: 'Apariencia', id: 'appearance' }"],
  ["{ title: 'Share', id: 'share' }", "{ title: 'Compartir', id: 'share' }"],
  ["{ title: 'Import', id: 'import' }", "{ title: 'Importar', id: 'import' }"],
  ["{ title: 'Export', id: 'export' }", "{ title: 'Exportar', id: 'export' }"],
  ["{ title: 'Data', id: 'data' }", "{ title: 'Datos', id: 'data' }"],
  ["{ title: 'Custom Fields', id: 'custom-fields' }", "{ title: 'Campos Personalizados', id: 'custom-fields' }"],
  ["{ title: 'Integrations', id: 'integrations' }", "{ title: 'Integraciones', id: 'integrations' }"],
  ["{ title: 'Users', id: 'users' }", "{ title: 'Usuarios', id: 'users' }"],
  ["{ title: 'OAuth', id: 'oauth' }", "{ title: 'OAuth', id: 'oauth' }"],
  ['Powered by', 'Desarrollado con'],

  // ===================== AppearancePage =====================
  ['title="Appearance"', 'title="Apariencia"'],
  ['"Customize the appearance of the application."', '"Personaliza la apariencia de la aplicación."'],
  ['>Color Theme</h3>', '>Tema de Color</h3>'],
  ["By default, the application will use the system's theme.", "Por defecto, la aplicación usará el tema del sistema."],
  ['> Dark </span>', '> Oscuro </span>'],
  ['> Light </span>', '> Claro </span>'],

  // ===================== ExportPage =====================
  ['title="Export"', 'title="Exportar"'],
  ['Export your data. Learn more about the data formats', 'Exporta tus datos. Aprende más sobre los formatos de datos'],
  ['>in the documentation</a', '>en la documentación</a'],
  ["toast.info('Your download should start shortly')", "toast.info('Tu descarga debería comenzar en breve')"],

  // ===================== SharePage =====================
  ['title="Share"', 'title="Compartir"'],
  ['"Create and manage public shares of your flight data."', '"Crea y gestiona enlaces públicos de tus datos de vuelo."'],
  ['placeholder="Search shares"', 'placeholder="Buscar compartidos"'],
  ["toast.success('Share deleted')", "toast.success('Enlace compartido eliminado')"],
  ["toast.error('Failed to delete share')", "toast.error('Error al eliminar enlace compartido')"],
  ["toast.success('Share URL copied to clipboard')", "toast.success('URL del enlace compartido copiada al portapapeles')"],
  ["toast.error('Failed to copy URL')", "toast.error('Error al copiar URL')"],
  [">Loading shares...</p>", ">Cargando compartidos...</p>"],
  ['Error loading shares:', 'Error al cargar compartidos:'],
  ['>No shares created yet.</p>', '>Aún no se han creado compartidos.</p>'],
  ['No shares found matching your search.', 'No se encontraron compartidos que coincidan con tu búsqueda.'],
  ['• Never expires', '• No expira nunca'],
  ['content="Copy share URL"', 'content="Copiar URL del compartido"'],
  ['content="Preview in new tab"', 'content="Vista previa en nueva pestaña"'],
  ['content="Delete share"', 'content="Eliminar compartido"'],
  ['title="Delete Share"', 'title="Eliminar Compartido"'],
  ['"Are you sure you want to delete this share? This action cannot be undone."', '"¿Estás seguro de que quieres eliminar este compartido? Esta acción no se puede deshacer."'],
  ['>Map', '>Mapa'],
  ['Date Filtered', 'Filtrado por Fecha'],

  // ===================== CreateShare =====================
  ['section="Shares" title="Create share"', 'section="Compartidos" title="Crear compartido"'],

  // ===================== EditShare =====================
  ['content="Edit share"', 'content="Editar compartido"'],
  ['section="Shares" title="Edit share"', 'section="Compartidos" title="Editar compartido"'],
  ['>Update</Form.Button>', '>Actualizar</Form.Button>'],

  // ===================== ShareFormFields =====================
  ['>Share URL *</Form.Label>', '>URL del compartido *</Form.Label>'],
  ['>Generate\n', '>Generar\n'],
  ['>Share Duration</Form.Label>', '>Duración del compartido</Form.Label>'],
  ["{ value: 'never', label: 'Never expires' }", "{ value: 'never', label: 'No expira nunca' }"],
  ["{ value: '1day', label: '1 day' }", "{ value: '1day', label: '1 día' }"],
  ["{ value: '1week', label: '1 week' }", "{ value: '1week', label: '1 semana' }"],
  ["{ value: '1month', label: '1 month' }", "{ value: '1month', label: '1 mes' }"],
  ["{ value: '3months', label: '3 months' }", "{ value: '3months', label: '3 meses' }"],
  ["{ value: 'custom', label: 'Custom date' }", "{ value: 'custom', label: 'Fecha personalizada' }"],
  ["'Select duration'", "'Seleccionar duración'"],
  ['label="Expires At"', 'label="Expira el"'],
  ['>Content Visibility</Label>', '>Visibilidad del Contenido</Label>'],
  ['>Show Map</Form.Label>', '>Mostrar Mapa</Form.Label>'],
  ['>Show Statistics</Form.Label>', '>Mostrar Estadísticas</Form.Label>'],
  ['>Show Flight List</Form.Label>', '>Mostrar Lista de Vuelos</Form.Label>'],
  ['label="Date Range (Optional)"', 'label="Rango de Fechas (Opcional)"'],
  ['>Data Privacy</Label>', '>Privacidad de Datos</Label>'],
  ['>Show Flight Numbers</Form.Label>', '>Mostrar Números de Vuelo</Form.Label>'],
  ['>Show Airlines</Form.Label>', '>Mostrar Aerolíneas</Form.Label>'],
  ['>Show Aircraft Types</Form.Label>', '>Mostrar Tipos de Aeronave</Form.Label>'],
  ['>Show Flight Times</Form.Label>', '>Mostrar Horarios de Vuelo</Form.Label>'],
  ['>Show Flight Dates</Form.Label>', '>Mostrar Fechas de Vuelo</Form.Label>'],
  ['>Show Seat</Form.Label>', '>Mostrar Asiento</Form.Label>'],

  // ===================== OAuthPage =====================
  ['title="OAuth"', 'title="OAuth"'],
  ['"Configure OAuth for your AirTrail instance."', '"Configura OAuth para tu instancia de AirTrail."'],
  ['>Enable OAuth</Form.Label>', '>Habilitar OAuth</Form.Label>'],
  ['Enable OAuth for your AirTrail instance.', 'Habilita OAuth para tu instancia de AirTrail.'],
  ['>Issuer URL</Form.Label>', '>URL del Emisor</Form.Label>'],
  ['The URL of the OAuth provider.', 'La URL del proveedor OAuth.'],
  ['>Client ID</Form.Label>', '>ID de Cliente</Form.Label>'],
  ['The client ID provided by the OAuth provider.', 'El ID de cliente proporcionado por el proveedor OAuth.'],
  ['>Client Secret</Form.Label>', '>Secreto de Cliente</Form.Label>'],
  ['The client secret provided by the OAuth provider.', 'El secreto de cliente proporcionado por el proveedor OAuth.'],
  ['>Scope</Form.Label>', '>Alcance</Form.Label>'],
  ['The scope of the OAuth provider (space-separated).', 'El alcance del proveedor OAuth (separado por espacios).'],
  ['>Button Text</Form.Label>', '>Texto del Botón</Form.Label>'],
  ['The text to display on the OAuth login button.', 'El texto a mostrar en el botón de inicio de sesión OAuth.'],
  ['>Auto Register</Form.Label>', '>Registro Automático</Form.Label>'],
  ['Automatically register new users when they sign in with OAuth.', 'Registrar automáticamente nuevos usuarios cuando inicien sesión con OAuth.'],
  ['>Auto Login</Form.Label>', '>Inicio de Sesión Automático</Form.Label>'],
  ['Automatically redirect users to the OAuth provider when they\n                visit the login page.', 'Redirigir automáticamente a los usuarios al proveedor OAuth cuando\n                visiten la página de inicio de sesión.'],
  ['>Hide Password Form</Form.Label>', '>Ocultar Formulario de Contraseña</Form.Label>'],
  ['Hide password form when OAuth is enabled.', 'Ocultar formulario de contraseña cuando OAuth está habilitado.'],
  ['>Save</Form.Button>', '>Guardar</Form.Button>'],
  ['This setting is locked because it is configured via environment variables.', 'Esta configuración está bloqueada porque se configura mediante variables de entorno.'],
  ['To change this setting, update or delete the environment variable and\n    restart the server.', 'Para cambiar esta configuración, actualiza o elimina la variable de entorno y\n    reinicia el servidor.'],

  // ===================== IntegrationsPage =====================
  ['title="Integrations"', 'title="Integraciones"'],
  ['"Configure integrations for your AirTrail instance."', '"Configura las integraciones para tu instancia de AirTrail."'],
  ['>AeroDataBox API Key', '>Clave API de AeroDataBox'],
  ['API key for AeroDataBox (via RapidAPI) used for advanced flight\n              lookup, allowing AirTrail to prefill airports, departure and\n              arrival times, airline & aircraft information from just a flight\n              number.', 'Clave API de AeroDataBox (vía RapidAPI) utilizada para búsqueda avanzada de\n              vuelos, permitiendo a AirTrail autocompletar aeropuertos, horarios de salida y\n              llegada, información de aerolínea y aeronave a partir de un número de vuelo.'],
  ['placeholder="Enter your AeroDataBox API key"', 'placeholder="Introduce tu clave API de AeroDataBox"'],

  // ===================== VersionPage =====================
  ['title="Version"', 'title="Versión"'],
  ['"View version information and check for updates."', '"Ver información de versión y buscar actualizaciones."'],
  ['>Current Version</h3>', '>Versión Actual</h3>'],
  ['>Latest Version</h3>', '>Última Versión</h3>'],
  ['>Checking...</span>', '>Comprobando...</span>'],
  ['>Unable to get latest version.</span>', '>No se pudo obtener la última versión.</span>'],
  ['>Updating</h3>', '>Actualización</h3>'],
  ['How to update', 'Cómo actualizar'],

  // ===================== Visited Countries Modals =====================
  // (these need to be read to translate)
];

// Files to process
const filesToProcess = [];

function findSvelteAndTsFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.svelte-kit') continue;
      findSvelteAndTsFiles(fullPath);
    } else if (entry.name.endsWith('.svelte') || entry.name.endsWith('.ts') || entry.name.endsWith('.html')) {
      filesToProcess.push(fullPath);
    }
  }
}

findSvelteAndTsFiles(path.join(__dirname, 'src'));

let totalReplacements = 0;
let filesModified = 0;

for (const filePath of filesToProcess) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  for (const [eng, esp] of translations) {
    if (content.includes(eng)) {
      content = content.split(eng).join(esp);
      modified = true;
      totalReplacements++;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    filesModified++;
    console.log(`Modified: ${path.relative(__dirname, filePath)}`);
  }
}

console.log(`\nDone! ${totalReplacements} replacements in ${filesModified} files.`);
