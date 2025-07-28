// lib/webhook.ts
export interface DonationWebhookPayload {
  organizationId: string;
  widgetId: string;
  donationId: string;
  amount: number;
  currency: string;
  frequency: 'one-time' | 'monthly';
  cause: {
    name: string;
    id?: string;
  };
  donor: {
    email?: string;
    name?: string;
  };
  paymentMethod: 'card' | 'bank';
  coversFees: boolean;
  feeAmount: number;
  stripePaymentIntentId?: string;
  stripeSubscriptionId?: string;
  status: 'processing' | 'succeeded' | 'failed';
  createdAt: string;
  failureReason?: string;
}

class WebhookService {
  private readonly dashboardUrl: string;

  constructor() {
    this.dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3001';
  }

  generateDonationId(): string {
    return `donation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  calculateFeeAmount(amount: number, coverFee: boolean): number {
    if (!coverFee) return 0;
    
    // Stripe fees: 2.9% + $0.30 for cards, 0.8% for ACH (capped at $5)
    // Simplified calculation - in production, you'd want more precise fee calculation
    const percentageFee = Math.round(amount * 0.029); // 2.9%
    const fixedFee = 30; // $0.30 in cents
    
    return percentageFee + fixedFee;
  }

  async sendDonationWebhook(payload: DonationWebhookPayload): Promise<void> {
    try {
      console.log('Sending donation webhook to dashboard:', payload);
      
      const response = await fetch(`${this.dashboardUrl}/api/webhooks/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'PassItOn-Widget/1.0',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Webhook failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Webhook sent successfully:', result);
    } catch (error) {
      console.error('Failed to send webhook:', error);
      
      // In production, you might want to implement a retry mechanism
      // or queue the webhook for later processing
      throw error;
    }
  }

  async sendTestWebhook(organizationId: string): Promise<void> {
    const testPayload: DonationWebhookPayload = {
      organizationId,
      widgetId: 'test-widget',
      donationId: this.generateDonationId(),
      amount: 2500, // $25.00
      currency: 'USD',
      frequency: 'one-time',
      cause: {
        name: 'Test Donation',
        id: 'test-cause'
      },
      donor: {
        email: 'test@example.com',
        name: 'Test Donor'
      },
      paymentMethod: 'card',
      coversFees: true,
      feeAmount: 103, // $1.03
      stripePaymentIntentId: 'pi_test_' + Math.random().toString(36).substr(2, 9),
      status: 'succeeded',
      createdAt: new Date().toISOString()
    };

    await this.sendDonationWebhook(testPayload);
  }

  // Helper method to validate webhook payload
  validatePayload(payload: unknown): payload is DonationWebhookPayload {
    if (typeof payload !== 'object' || payload === null) {
      console.error('Payload must be an object');
      return false;
    }

    const required = [
      'organizationId', 'widgetId', 'donationId', 'amount', 
      'currency', 'frequency', 'cause', 'donor', 'paymentMethod',
      'coversFees', 'feeAmount', 'status', 'createdAt'
    ];

    for (const field of required) {
      if (!(field in payload)) {
        console.error(`Missing required field: ${field}`);
        return false;
      }
    }

    // Cast to any for property access after object type check
    const typedPayload = payload as any;

    // Validate specific field types
    if (typeof typedPayload.amount !== 'number' || typedPayload.amount <= 0) {
      console.error('Invalid amount');
      return false;
    }

    if (!['one-time', 'monthly'].includes(typedPayload.frequency)) {
      console.error('Invalid frequency');
      return false;
    }

    if (!['card', 'bank'].includes(typedPayload.paymentMethod)) {
      console.error('Invalid payment method');
      return false;
    }

    if (!['processing', 'succeeded', 'failed'].includes(typedPayload.status)) {
      console.error('Invalid status');
      return false;
    }

    return true;
  }
}

export const webhookService = new WebhookService();