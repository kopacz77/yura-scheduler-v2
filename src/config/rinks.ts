export type Rink = {
  timezone: string;
  address: string;
  maxCapacity?: number;
};

export const DEFAULT_RINKS: Record<string, Rink> = {
  'East West Ice Palace': {
    timezone: 'America/Los_Angeles',
    address: '23770 S Western Ave, Harbor City, CA 90710',
    maxCapacity: 25
  },
  'Great Park Ice': {
    timezone: 'America/Los_Angeles',
    address: '888 Ridge Valley, Irvine, CA 92618',
    maxCapacity: 30
  },
  'Lakewood Ice': {
    timezone: 'America/Los_Angeles',
    address: '3975 Pixie Ave, Lakewood, CA 90712',
    maxCapacity: 25
  },
  'KHS': {
    timezone: 'America/Los_Angeles',
    address: 'Skating Club of Boston, 750 University Ave, Norwood, MA 02062',
    maxCapacity: 20
  },
  'San Jose Sharks Arena': {
    timezone: 'America/Los_Angeles',
    address: '1500 S 10th St, San Jose, CA 95112',
    maxCapacity: 30
  },
  'Novi Ice Arena': {
    timezone: 'America/Detroit',
    address: '42400 Nick Lidstrom Dr, Novi, MI 48375',
    maxCapacity: 25
  }
};

// Helper function to add a new rink
export const addRink = (name: string, rink: Rink) => {
  DEFAULT_RINKS[name] = rink;
};

// Helper function to get rink details
export const getRink = (name: string): Rink | undefined => {
  return DEFAULT_RINKS[name];
};

// Helper function to get all rink names
export const getRinkNames = (): string[] => {
  return Object.keys(DEFAULT_RINKS);
};

// Helper function to get all rinks
export const getAllRinks = (): Record<string, Rink> => {
  return DEFAULT_RINKS;
};
