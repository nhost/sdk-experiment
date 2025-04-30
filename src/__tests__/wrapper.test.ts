import { createClient, NhostClient } from '../index';
import { MemoryStorage } from '../auth/storage';
import axios from 'axios';

// Mock axios
jest.mock('axios', () => {
  return {
    create: jest.fn().mockReturnValue({
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      },
      get: jest.fn(),
      post: jest.fn()
    }),
    defaults: {
      headers: { common: {} }
    }
  };
});

describe('NhostClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create client with default options', () => {
    const client = createClient();
    expect(client).toBeInstanceOf(NhostClient);
    expect(axios.create).toHaveBeenCalledTimes(2);
    
    // Check default URLs
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://local.auth.local.nhost.run/v1'
    });
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://local.storage.local.nhost.run/v1'
    });
  });

  it('should create client with custom subdomain', () => {
    const client = createClient({ subdomain: 'testapp' });
    
    // Check URLs with subdomain
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://testapp.auth.nhost.run/v1'
    });
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://testapp.storage.nhost.run/v1'
    });
  });

  it('should create client with custom subdomain and region', () => {
    const client = createClient({ 
      subdomain: 'testapp',
      region: 'eu-central-1'
    });
    
    // Check URLs with subdomain and region
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://testapp.auth.eu-central-1.nhost.run/v1'
    });
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://testapp.storage.eu-central-1.nhost.run/v1'
    });
  });

  it('should create client with custom URLs', () => {
    const client = createClient({
      authUrl: 'https://custom.auth.example.com/v1',
      storageUrl: 'https://custom.storage.example.com/v1'
    });
    
    // Check custom URLs
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://custom.auth.example.com/v1'
    });
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://custom.storage.example.com/v1'
    });
  });

  it('should create client with custom storage', () => {
    const customStorage = new MemoryStorage();
    const client = createClient({
      storage: customStorage,
      storageKey: 'custom-session-key'
    });
    
    // Interceptors should be configured, but we can't easily verify their config
    // Just check that client was created
    expect(client).toBeInstanceOf(NhostClient);
  });

  it('should have auth and storage clients', () => {
    const client = createClient();
    expect(client.auth).toBeDefined();
    expect(client.storage).toBeDefined();
  });
}); 