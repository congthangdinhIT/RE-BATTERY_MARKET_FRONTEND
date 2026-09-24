import {
  MOCK_BATTERY_PACKS,
  MOCK_PASSPORTS,
  MOCK_LISTINGS,
  MOCK_ESCROW_TRANSACTIONS,
  MOCK_BESS_PROJECTS,
  MOCK_ORGS,
  MOCK_INSPECTIONS
} from '../data/mockData';
import type {
  BatteryPack,
  BatteryPassport,
  Listing,
  EscrowTransaction,
  BessProject,
  Organization,
  User
} from '../types';

const KEYS = {
  BATTERY_PACKS: 'rebatt_battery_packs',
  PASSPORTS: 'rebatt_passports',
  LISTINGS: 'rebatt_listings',
  ESCROWS: 'rebatt_escrows',
  BESS_PROJECTS: 'rebatt_bess_projects',
  ORGS: 'rebatt_orgs',
  INSPECTIONS: 'rebatt_inspections',
  AUTH_USER: 'rebatt_auth_user',
  AUTH_TOKEN: 'rebatt_auth_token'
};

export const initStorage = () => {
  if (!localStorage.getItem(KEYS.BATTERY_PACKS)) {
    localStorage.setItem(KEYS.BATTERY_PACKS, JSON.stringify(MOCK_BATTERY_PACKS));
  }
  if (!localStorage.getItem(KEYS.PASSPORTS)) {
    localStorage.setItem(KEYS.PASSPORTS, JSON.stringify(MOCK_PASSPORTS));
  }
  if (!localStorage.getItem(KEYS.LISTINGS)) {
    localStorage.setItem(KEYS.LISTINGS, JSON.stringify(MOCK_LISTINGS));
  }
  if (!localStorage.getItem(KEYS.ESCROWS)) {
    localStorage.setItem(KEYS.ESCROWS, JSON.stringify(MOCK_ESCROW_TRANSACTIONS));
  }
  if (!localStorage.getItem(KEYS.BESS_PROJECTS)) {
    localStorage.setItem(KEYS.BESS_PROJECTS, JSON.stringify(MOCK_BESS_PROJECTS));
  }
  if (!localStorage.getItem(KEYS.ORGS)) {
    localStorage.setItem(KEYS.ORGS, JSON.stringify(MOCK_ORGS));
  }
  if (!localStorage.getItem(KEYS.INSPECTIONS)) {
    localStorage.setItem(KEYS.INSPECTIONS, JSON.stringify(MOCK_INSPECTIONS));
  }
};

const getItem = <T>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
};

const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
};

export const StorageManager = {
  // Battery Packs
  getBatteryPacks: (): BatteryPack[] => getItem(KEYS.BATTERY_PACKS, MOCK_BATTERY_PACKS),
  saveBatteryPacks: (packs: BatteryPack[]): void => setItem(KEYS.BATTERY_PACKS, packs),
  addBatteryPack: (pack: BatteryPack): BatteryPack => {
    const packs = StorageManager.getBatteryPacks();
    const updated = [pack, ...packs];
    StorageManager.saveBatteryPacks(updated);
    
    // Auto-create passport if verified or listed
    const now = new Date().toISOString();
    const passportCode = `PASS-${now.substring(0, 10).replace(/-/g, '')}-${pack.id.substring(0, 5).toUpperCase()}`;
    const newPassport: BatteryPassport = {
      id: `pass-${pack.id}`,
      passportCode,
      batteryPackId: pack.id,
      qrCodeUrl: `/trace/${passportCode}`,
      latestHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      isVerified: true,
      issuedAt: now,
      batteryPack: pack,
      events: [
        {
          id: `evt-${pack.id}-genesis`,
          batteryPackId: pack.id,
          eventType: 'COLLECTED',
          title: 'Khởi tạo thông tin thu hồi pin',
          description: `Đăng ký pin ${pack.serialNumber} từ ${pack.manufacturer}`,
          location: pack.currentOrganizationName || 'Hệ thống REBATT',
          timestamp: now,
          performedById: 'user-supplier-staff',
          performedByName: pack.currentOrganizationName || 'Nhà cung cấp',
          organizationId: pack.currentOrganizationId,
          organizationName: pack.currentOrganizationName,
          previousHash: 'GENESIS',
          hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        }
      ]
    };
    StorageManager.addPassport(newPassport);

    // Auto-create listing if status === 'LISTED'
    if (pack.status === 'LISTED') {
      const newListing: Listing = {
        id: `listing-${pack.id}`,
        title: `${pack.vehicleModel} — ${(pack.currentCapacityKwh || pack.originalCapacityKwh).toFixed(1)} kWh`,
        batteryPackId: pack.id,
        batteryPack: pack,
        sellerOrganizationId: pack.currentOrganizationId,
        sellerOrganizationName: pack.currentOrganizationName,
        askingPriceVnd: Math.round((pack.currentCapacityKwh || 50) * 900000),
        description: `Pin ${pack.chemistry} từ ${pack.manufacturer}. SOH ${pack.currentSohPercent}%. Kèm Passport QR.`,
        isActive: true,
        isSold: false,
        createdAt: now,
        passportCode
      };
      StorageManager.addListing(newListing);
    }

    return pack;
  },

  // Passports
  getPassports: (): BatteryPassport[] => getItem(KEYS.PASSPORTS, MOCK_PASSPORTS),
  savePassports: (passports: BatteryPassport[]): void => setItem(KEYS.PASSPORTS, passports),
  addPassport: (passport: BatteryPassport): void => {
    const passports = StorageManager.getPassports();
    StorageManager.savePassports([passport, ...passports]);
  },

  // Listings
  getListings: (): Listing[] => getItem(KEYS.LISTINGS, MOCK_LISTINGS),
  saveListings: (listings: Listing[]): void => setItem(KEYS.LISTINGS, listings),
  addListing: (listing: Listing): void => {
    const listings = StorageManager.getListings();
    StorageManager.saveListings([listing, ...listings]);
  },

  // Escrows
  getEscrows: (): EscrowTransaction[] => getItem(KEYS.ESCROWS, MOCK_ESCROW_TRANSACTIONS),
  saveEscrows: (escrows: EscrowTransaction[]): void => setItem(KEYS.ESCROWS, escrows),
  addEscrow: (escrow: EscrowTransaction): EscrowTransaction => {
    const escrows = StorageManager.getEscrows();
    const updated = [escrow, ...escrows];
    StorageManager.saveEscrows(updated);
    return escrow;
  },

  // BESS Projects
  getBessProjects: (): BessProject[] => getItem(KEYS.BESS_PROJECTS, MOCK_BESS_PROJECTS),
  saveBessProjects: (projects: BessProject[]): void => setItem(KEYS.BESS_PROJECTS, projects),

  // Orgs
  getOrgs: (): Organization[] => getItem(KEYS.ORGS, MOCK_ORGS),

  // Auth User & Token
  getAuth: (): { user: User | null; token: string | null } => {
    const userStr = localStorage.getItem(KEYS.AUTH_USER);
    const token = localStorage.getItem(KEYS.AUTH_TOKEN);
    return {
      user: userStr ? JSON.parse(userStr) : null,
      token: token || null
    };
  },
  saveAuth: (user: User, token: string): void => {
    localStorage.setItem(KEYS.AUTH_USER, JSON.stringify(user));
    localStorage.setItem(KEYS.AUTH_TOKEN, token);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('token', token);
  },
  clearAuth: (): void => {
    localStorage.removeItem(KEYS.AUTH_USER);
    localStorage.removeItem(KEYS.AUTH_TOKEN);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
  }
};
