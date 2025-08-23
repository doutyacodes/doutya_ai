-- Add relevance tracking fields to user_news table
-- These fields will store whether a custom viewpoint is relevant to the news and the reason for the relevance assessment

ALTER TABLE user_news 
ADD COLUMN is_relevant BOOLEAN DEFAULT TRUE COMMENT 'Whether the custom viewpoint is relevant to the news topic',
ADD COLUMN relevance_reason TEXT COMMENT 'AI-generated explanation for the relevance assessment';

-- Create subscriptions table for tracking user subscriptions and payments
CREATE TABLE IF NOT EXISTS subscriptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  plan_type ENUM('starter', 'pro', 'elite') NOT NULL,
  status ENUM('active', 'cancelled', 'expired', 'pending') DEFAULT 'pending',
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  razorpay_subscription_id VARCHAR(255) UNIQUE,
  razorpay_plan_id VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  billing_cycle ENUM('monthly', 'yearly') DEFAULT 'monthly',
  auto_renew BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_details(id) ON DELETE CASCADE,
  INDEX idx_user_subscription (user_id),
  INDEX idx_status (status),
  INDEX idx_end_date (end_date)
);

-- Create payment_transactions table for tracking all payment transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  subscription_id INT,
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255) UNIQUE,
  razorpay_signature VARCHAR(512),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status ENUM('created', 'paid', 'failed', 'cancelled', 'refunded') DEFAULT 'created',
  payment_method VARCHAR(100),
  payment_gateway VARCHAR(50) DEFAULT 'razorpay',
  transaction_date DATETIME,
  failure_reason TEXT,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_details(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL,
  INDEX idx_user_payment (user_id),
  INDEX idx_payment_id (razorpay_payment_id),
  INDEX idx_order_id (razorpay_order_id),
  INDEX idx_status (status),
  INDEX idx_transaction_date (transaction_date)
);

-- Create subscription_plans table for storing plan configurations
CREATE TABLE IF NOT EXISTS subscription_plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  plan_id VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  monthly_price DECIMAL(10, 2) NOT NULL,
  yearly_price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  features JSON,
  limitations JSON,
  razorpay_monthly_plan_id VARCHAR(255),
  razorpay_yearly_plan_id VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_plan_id (plan_id),
  INDEX idx_active (is_active)
);

-- Insert default subscription plans
INSERT INTO subscription_plans (plan_id, name, description, monthly_price, yearly_price, features, limitations, sort_order) VALUES 
('starter', 'Starter', 'Perfect for beginners starting their competitive exam journey', 29.99, 299.99, '["Save up to 25 articles", "Organize with folders", "View global trending articles", "Basic current affairs coverage", "Mobile app access", "Email support"]', '["No personal notes", "No exam-specific trending", "Limited article saves"]', 1),
('pro', 'Pro', 'Most popular choice for serious competitive exam aspirants', 49.99, 499.99, '["Save up to 75 articles", "Personal notes & insights", "Exam-specific trending", "Weekly analysis reports", "Priority support", "Advanced search filters", "Bookmark collections", "Study progress tracking"]', '["Limited to 75 article saves"]', 2),
('elite', 'Elite', 'Ultimate package for civil services & defense exam aspirants', 99.99, 999.99, '["Unlimited article saves", "AI-powered recommendations", "All exam trending insights", "Expert-curated content", "Advanced analytics", "Custom study plans", "1-on-1 support sessions", "Early access to features"]', '[]', 3);

-- Add subscription tracking fields to user_details table
ALTER TABLE user_details 
ADD COLUMN current_subscription_id INT,
ADD COLUMN subscription_end_date DATETIME,
ADD COLUMN subscription_status ENUM('active', 'expired', 'cancelled') DEFAULT 'expired',
ADD FOREIGN KEY (current_subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL;