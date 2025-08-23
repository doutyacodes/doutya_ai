# Razorpay Integration Setup Instructions

## Required Dependencies

Install the Razorpay Node.js SDK:

```bash
npm install razorpay
# or
yarn add razorpay
```

## Environment Variables

Add the following to your `.env.local` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="your_razorpay_key_id"

# Optional: Webhook secret for better security
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"
```

## Database Setup

1. Run the SQL commands in `table_alter.sql` to create the required tables:
   - `subscriptions`
   - `payment_transactions`
   - `subscription_plans`
   - Add fields to `user_details`

2. Execute the following SQL:

```bash
mysql -u your_username -p your_database < table_alter.sql
```

## Webhook Configuration

1. Login to your Razorpay Dashboard
2. Go to Settings > Webhooks
3. Create a new webhook with URL: `https://yourdomain.com/api/webhooks/razorpay`
4. Select the following events:
   - `payment.captured`
   - `payment.failed`
   - `subscription.activated`
   - `subscription.cancelled`
   - `subscription.completed`
5. Set a webhook secret and add it to your `.env.local` as `RAZORPAY_WEBHOOK_SECRET`

## Features Implemented

### Upgrade Plan Page
- ✅ Razorpay payment integration
- ✅ Monthly/Yearly billing toggle
- ✅ Real-time payment verification
- ✅ Subscription creation
- ✅ JWT token update with new plan
- ✅ Removed downgrade options
- ✅ User can only upgrade until subscription expires

### API Endpoints
- `/api/payments/create-order` - Creates Razorpay order
- `/api/payments/verify` - Verifies payment and creates subscription
- `/api/webhooks/razorpay` - Handles Razorpay webhooks

### Database Tables
- `subscriptions` - User subscription records
- `payment_transactions` - Payment history
- `subscription_plans` - Plan configurations
- Updated `user_details` with subscription fields

## Testing

### Test Mode
- Use test API keys from Razorpay Dashboard
- Use test card numbers for payments:
  - Success: 4111111111111111
  - Failure: 4000000000000002

### Production
- Replace test keys with live keys
- Update webhook URL to production domain
- Test all payment scenarios

## Security Notes

1. Never expose `RAZORPAY_KEY_SECRET` to frontend
2. Always verify webhook signatures
3. Validate all payment amounts on server-side
4. Store payment data securely
5. Implement rate limiting on payment APIs

## Subscription Logic

1. **New Subscription**: User pays → Creates subscription → Updates user plan
2. **Upgrade**: Creates new payment → Updates existing subscription
3. **Expiry**: Webhook updates user to 'starter' plan when subscription ends
4. **Cancellation**: Subscription continues until end date, then downgrades

## Support

For issues with Razorpay integration, check:
1. API key configuration
2. Webhook signature verification
3. Database table structure
4. Environment variables
5. Network connectivity to Razorpay APIs