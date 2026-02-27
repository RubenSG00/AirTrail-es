import type { Airline, Airport } from '$lib/db/types';

export type PlatformOptions = {
  filterOwner: boolean;
  airlineFromFlightNumber: boolean;
  airportMapping?: Record<string, Airport>;
  airlineMapping?: Record<string, Airline>;
  userMapping?: Record<string, string>; // exported user id -> local user id
};

export const platforms = [
  {
    name: 'FlightRadar24',
    value: 'fr24',
    description: 'Exportación CSV desde la configuración de MyFlightRadar24.',
    extensions: ['.csv'],
    options: {
      filterOwner: false,
      airlineFromFlightNumber: false,
    },
  },
  {
    name: 'App in the Air',
    value: 'aita',
    description: 'Exportación de texto desde App in the Air (por correo).',
    extensions: ['.txt'],
    options: {
      filterOwner: true,
      airlineFromFlightNumber: true,
    },
  },
  {
    name: 'JetLog',
    value: 'jetlog',
    description: 'Exportación CSV desde la configuración de JetLog.',
    extensions: ['.csv'],
    options: {
      filterOwner: false,
      airlineFromFlightNumber: true,
    },
  },
  {
    name: 'TripIt (ICS)',
    value: 'tripit',
    description: 'Exportación de viaje desde TripIt como archivo ICS.',
    extensions: ['.ics'],
    options: {
      filterOwner: false,
      airlineFromFlightNumber: true,
    },
  },
  {
    name: 'Flighty',
    value: 'flighty',
    description: 'Exportación CSV desde la app Flighty.',
    extensions: ['.csv'],
    options: {
      filterOwner: false,
      airlineFromFlightNumber: false,
    },
  },
  {
    name: 'byAir',
    value: 'byair',
    description: 'Exportación CSV desde el rastreador de vuelos byAir.',
    extensions: ['.csv'],
    options: {
      filterOwner: true,
      airlineFromFlightNumber: true,
    },
  },
  {
    name: 'AirTrail',
    value: 'airtrail',
    description: 'Exportación JSON desde AirTrail (reimportar datos).',
    extensions: ['.json'],
    options: {
      filterOwner: false,
      airlineFromFlightNumber: false,
    },
  },
  {
    name: 'AirTrail (pre-v3)',
    value: 'legacy-airtrail',
    description:
      'JSON export from AirTrail (exported from a pre-v3 version of AirTrail).',
    extensions: ['.json'],
    options: {
      filterOwner: false,
      airlineFromFlightNumber: false,
    },
  },
] as const;
