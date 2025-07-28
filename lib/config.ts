// lib/config.ts
export interface WidgetConfig {
  id: string;
  organizationId: string;
  name: string;
  config: {
    theme: {
      primaryColor: string;
      secondaryColor: string;
      fontFamily: string;
      borderRadius: string;
    };
    causes: Array<{
      id: string;
      name: string;
      description?: string;
      isActive: boolean;
    }>;
    settings: {
      showProgressBar: boolean;
      showDonorList: boolean;  
      allowRecurring: boolean;
      minimumDonation: number;
      suggestedAmounts: number[];
      showCoverFees: boolean;
      defaultFrequency: 'one-time' | 'monthly';
    };
  };
  isActive: boolean;
}

class ConfigService {
  private cache = new Map<string, WidgetConfig>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async initialize(organizationId: string): Promise<WidgetConfig> {
    // Check cache first
    const cacheKey = `config-${organizationId}`;
    const cached = this.cache.get(cacheKey);
    const expiry = this.cacheExpiry.get(cacheKey);
    
    if (cached && expiry && Date.now() < expiry) {
      return cached;
    }

    try {
      // Try to fetch from dashboard API
      const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3001';
      const response = await fetch(`${dashboardUrl}/api/widget-config/${organizationId}`);
      
      if (response.ok) {
        const config = await response.json();
        
        // Cache the result
        this.cache.set(cacheKey, config);
        this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION);
        
        return config;
      }
    } catch (error) {
      console.error('Failed to fetch config from dashboard:', error);
    }

    // Fallback to default configuration
    const defaultConfig: WidgetConfig = {
      id: `widget-${organizationId}`,
      organizationId,
      name: 'Default Widget',
      config: {
        theme: {
          primaryColor: '#3b82f6',
          secondaryColor: '#64748b',
          fontFamily: 'inter',
          borderRadius: '8px'
        },
        causes: [
          {
            id: 'general-support',
            name: 'General Support',
            description: 'Support our mission',
            isActive: true
          }
        ],
        settings: {
          showProgressBar: true,
          showDonorList: false,
          allowRecurring: true,
          minimumDonation: 5,
          suggestedAmounts: [10, 25, 50, 100],
          showCoverFees: true,
          defaultFrequency: 'one-time'
        }
      },
      isActive: true
    };

    // Cache the default config
    this.cache.set(cacheKey, defaultConfig);
    this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION);

    return defaultConfig;
  }

  clearCache(organizationId?: string) {
    if (organizationId) {
      const cacheKey = `config-${organizationId}`;
      this.cache.delete(cacheKey);
      this.cacheExpiry.delete(cacheKey);
    } else {
      this.cache.clear();
      this.cacheExpiry.clear();
    }
  }
}

export const configService = new ConfigService();