import axios from 'axios'

const PAYSTACK_BASE_URL = 'https://api.paystack.co'

interface InitializePaymentParams {
  email: string
  amount: number // in kobo (₦1 = 100 kobo)
  reference: string
  metadata?: Record<string, any>
  callback_url?: string
}

interface InitializePaymentResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

interface VerifyPaymentResponse {
  status: boolean
  message: string
  data: {
    id: number
    status: string
    reference: string
    amount: number
    currency: string
    paid_at: string
    customer: {
      email: string
    }
    metadata: Record<string, any>
  }
}

export class PaystackService {
  private secretKey: string

  constructor(secretKey?: string) {
    this.secretKey = secretKey || process.env.PAYSTACK_SECRET_KEY || ''
    
    if (!this.secretKey) {
      throw new Error('Paystack secret key is required')
    }
  }

  /**
   * Initialize a payment transaction
   */
  async initializePayment(params: InitializePaymentParams): Promise<InitializePaymentResponse> {
    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transaction/initialize`,
        params,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return response.data
    } catch (error) {
      console.error('Paystack initialization error:', error)
      throw new Error('Failed to initialize payment')
    }
  }

  /**
   * Verify a payment transaction
   */
  async verifyPayment(reference: string): Promise<VerifyPaymentResponse> {
    try {
      const response = await axios.get(
        `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        }
      )

      return response.data
    } catch (error) {
      console.error('Paystack verification error:', error)
      throw new Error('Failed to verify payment')
    }
  }

  /**
   * Initiate a refund
   */
  async initiateRefund(transactionId: string, amount?: number): Promise<any> {
    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/refund`,
        {
          transaction: transactionId,
          ...(amount && { amount }), // Optional partial refund
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return response.data
    } catch (error) {
      console.error('Paystack refund error:', error)
      throw new Error('Failed to initiate refund')
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const crypto = require('crypto')
    const hash = crypto
      .createHmac('sha512', this.secretKey)
      .update(payload)
      .digest('hex')
    
    return hash === signature
  }
}

// Export a singleton instance
export const paystackService = new PaystackService()
