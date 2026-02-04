import React, { useEffect, useState, useContext } from 'react';
import { getReceipts, getOrders } from '../../services/api';
import { Payment, Receipt, OrderWithDetails } from '../../types';
import ReceiptList from '../../components/common/ReceiptList';
import OrderList from '../../components/common/OrderList';
import { useSettings } from '../../context/SettingsContext';
import { useTheme } from '../../context/ThemeContext';
import { useShift } from '../../hooks/useShift';
import { AuthContext } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';

type ReceiptLike = Receipt | Payment;

const CashierReceipts: React.FC = () => {
  const { settings, t } = useSettings();
  const { isDarkMode } = useTheme();
  const { isActive: shiftActive } = useShift();
  const { user } = useContext(AuthContext);
  const [viewMode, setViewMode] = useState<'orders' | 'receipts'>('orders');
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [message, setMessage] = useState('');
  const [emailModal, setEmailModal] = useState<{ show: boolean; receipt: Receipt | null }>({
    show: false,
    receipt: null
  });
  const [emailAddress, setEmailAddress] = useState('');

  useEffect(() => {
    console.log('CashierReceipts mounted, user:', user);
    if (viewMode === 'receipts') {
      loadReceipts();
    } else {
      loadOrders();
    }
    
    // Refresh data every 10 seconds to keep data up to date
    const interval = setInterval(() => {
      if (viewMode === 'receipts') {
        loadReceipts();
      } else {
        loadOrders();
      }
    }, 10000);
    
    // Listen for order placed events to immediately refresh
    const handleOrderPlaced = () => {
      console.log('Order placed event received, refreshing data...');
      if (viewMode === 'receipts') {
        loadReceipts();
      } else {
        loadOrders();
      }
    };
    
    window.addEventListener('orderPlaced', handleOrderPlaced);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('orderPlaced', handleOrderPlaced);
    };
  }, [viewMode]);

  const loadOrders = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      console.log('Loading orders...');
      const response = await getOrders({});
      console.log('Orders response:', response.data);
      setOrders(response.data);
      
    } catch (error: any) {
      console.error('Error loading orders:', error);
      setMessage(`Error loading orders: ${error?.response?.data?.message || error.message}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const loadReceipts = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      console.log('Loading receipts...');
      const response = await getReceipts({});
      console.log('Receipts response:', response.data);
      setReceipts(response.data);
      
    } catch (error: any) {
      console.error('Error loading receipts:', error);
      setMessage(`Error loading receipts: ${error?.response?.data?.message || error.message}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleReprint = (receiptLike: ReceiptLike) => {
    if (!('total' in receiptLike)) {
      setMessage('This record is a payment, not a receipt');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const receipt = receiptLike;
    const order = receipt.order;
    if (!order) {
      setMessage('Order data not found for reprint');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Generate receipt HTML for printing
    const receiptHTML = generateReceiptHTML(receipt, order);
    
    // Open print window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      printWindow.print();
      setMessage('Receipt sent to printer');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Unable to open print window');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEmail = (receiptLike: ReceiptLike) => {
    if (!('total' in receiptLike)) {
      setMessage('This record is a payment, not a receipt');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const receipt = receiptLike;
    const order = receipt.order;
    if (!order) {
      setMessage('Order data not found for email');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    setEmailModal({ show: true, receipt });
  };

  const handleSendEmail = async () => {
    if (!emailModal.receipt || !emailAddress.trim()) {
      setMessage('Please enter a valid email address');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    const order = emailModal.receipt.order;
    if (!order) {
      setMessage('Order data not found for email');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      const emailData = {
        to: emailAddress.trim(),
        subject: `Receipt #${emailModal.receipt.id}`,
        body: generateEmailContent(emailModal.receipt, order)
      };
      
      console.log('Sending email with data:', emailData);
      setMessage('Email sent successfully!');
      setEmailModal({ show: false, receipt: null });
      setEmailAddress('');
      setTimeout(() => setMessage(''), 3000);
      
    } catch (error: any) {
      console.error('Error sending email:', error);
      setMessage(`Failed to send email: ${error?.response?.data?.message || error.message}`);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const generateReceiptHTML = (receipt: Receipt, order: OrderWithDetails) => {
    const now = new Date();
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt #${receipt.id}</title>
        <style>
          body { font-family: monospace; font-size: 12px; margin: 20px; max-width: 300px; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
          .item { display: flex; justify-content: space-between; margin: 5px 0; }
          .total-section { border-top: 1px solid #000; padding-top: 10px; margin-top: 10px; }
          .total { font-weight: bold; border-top: 2px solid #000; padding-top: 5px; }
          .footer { text-align: center; margin-top: 20px; border-top: 1px solid #000; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>RESTAURANT RECEIPT</h2>
          <p>Receipt #${receipt.id}</p>
          <p>Order #${order.id}</p>
          <p>${now.toLocaleDateString()} ${now.toLocaleTimeString()}</p>
          <p>Customer: ${order.customer?.username || 'N/A'}</p>
        </div>
        
        <div class="items">
          ${order.items.map(item => `
            <div class="item">
              <span>${item.menuItem.name} x${item.quantity}</span>
              <span>${formatCurrency(item.subtotal, settings.currency, settings.language)}</span>
            </div>
          `).join('')}
        </div>
        
        <div class="total-section">
          <div class="item total">
            <span>TOTAL:</span>
            <span>${formatCurrency(receipt.total, settings.currency, settings.language)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p>Payment Method: ${receipt.paymentMethod.replace('_', ' ')}</p>
          <p>Status: ${order?.payment?.status || 'COMPLETED'}</p>
          <p>Thank you for your business!</p>
        </div>
      </body>
      </html>
    `;
  };

  const generateEmailContent = (receipt: Receipt, order: OrderWithDetails) => {
    return `
Dear ${order.customer?.username || 'Customer'},

Thank you for your order! Here are your receipt details:

Receipt #${receipt.id}
Order #${order.id}
Date: ${new Date(receipt.createdAt).toLocaleDateString()}
Time: ${new Date(receipt.createdAt).toLocaleTimeString()}

Order Items:
${order.items.map(item => `- ${item.menuItem.name} x${item.quantity} = ${formatCurrency(item.subtotal, settings.currency, settings.language)}`).join('\n')}

Total Amount: ${formatCurrency(receipt.total, settings.currency, settings.language)}
Payment Method: ${receipt.paymentMethod.replace('_', ' ')}
Status: ${order?.payment?.status || 'COMPLETED'}

Thank you for choosing our restaurant!

Best regards,
Restaurant Management Team
    `.trim();
  };

  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = receipt.id.toString().includes(searchTerm) ||
                         receipt.orderId.toString().includes(searchTerm);
    const matchesMethod = methodFilter === 'ALL' || receipt.paymentMethod === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toString().includes(searchTerm) ||
                         (order.customer?.username ?? '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getTotalRevenue = () => {
    if (viewMode === 'receipts') {
      return filteredReceipts.reduce((total, receipt) => total + receipt.total, 0);
    } else {
      return filteredOrders
        .filter(order => order.status === 'DELIVERED')
        .reduce((total, order) => total + order.totalAmount, 0);
    }
  };

  const getMethodStats = () => {
    const stats = { CASH: 0, CREDIT_CARD: 0, DEBIT_CARD: 0, MOBILE_PAYMENT: 0 };
    filteredReceipts
      .forEach(receipt => {
        stats[receipt.paymentMethod] += receipt.total;
      });
    return stats;
  };

  const methodStats = getMethodStats();

  return (
    <div className="receipts-page">
      <div className="receipts-container">
        {/* Header */}
        <div className="receipts-header">
          <h1>{viewMode === 'orders' ? 'Orders' : 'Receipts & Payment'}</h1>
          <p>{viewMode === 'orders' ? 'View and manage customer orders' : 'View and manage payment receipts. Search by receipt or order ID.'}</p>
          
          {!shiftActive && (
            <div className="shift-warning">
              <p><strong>Shift: Inactive</strong></p>
            </div>
          )}
        </div>

        {message && (
          <div className="message-alert">
            {message}
          </div>
        )}

        {/* View Mode Toggle */}
        <div className="view-mode-toggle" style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: isDarkMode ? '#2d3748' : '#f7fafc',
          borderRadius: '8px'
        }}>
          <button
            onClick={() => setViewMode('orders')}
            style={{
              padding: '10px 20px',
              backgroundColor: viewMode === 'orders' ? (isDarkMode ? '#1976d2' : '#d81b60') : 'transparent',
              color: viewMode === 'orders' ? 'white' : isDarkMode ? '#e2e8f0' : '#2d3748',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            📋 Orders
          </button>
          <button
            onClick={() => setViewMode('receipts')}
            style={{
              padding: '10px 20px',
              backgroundColor: viewMode === 'receipts' ? (isDarkMode ? '#1976d2' : '#d81b60') : 'transparent',
              color: viewMode === 'receipts' ? 'white' : isDarkMode ? '#e2e8f0' : '#2d3748',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            🧾 Receipts
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon revenue">
              <span>💰</span>
            </div>
            <div className="stat-content">
              <h3>Total Revenue</h3>
              <p className="stat-value">{formatCurrency(getTotalRevenue(), settings.currency, settings.language)}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon receipts">
              <span>📄</span>
            </div>
            <div className="stat-content">
              <h3>{viewMode === 'orders' ? 'Total Orders' : 'Total Receipts'}</h3>
              <p className="stat-value">{viewMode === 'orders' ? orders.length : receipts.length}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon payments">
              <span>✅</span>
            </div>
            <div className="stat-content">
              <h3>{viewMode === 'orders' ? 'Completed Orders' : 'Completed Payments'}</h3>
              <p className="stat-value">
                {viewMode === 'orders' 
                  ? orders.filter(o => o.status === 'DELIVERED').length
                  : receipts.filter(r => r.order?.payment?.status === 'COMPLETED').length
                }
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method Breakdown - Only for receipts */}
        {viewMode === 'receipts' && (
          <div className="payment-breakdown">
            <h3>Payment Method Breakdown</h3>
            <div className="payment-grid">
              <div className="payment-method">
                <div className="payment-amount">{formatCurrency(methodStats.CASH, settings.currency, settings.language)}</div>
                <div className="payment-label">Cash</div>
              </div>
              <div className="payment-method">
                <div className="payment-amount">{formatCurrency(methodStats.CREDIT_CARD, settings.currency, settings.language)}</div>
                <div className="payment-label">Credit Card</div>
              </div>
              <div className="payment-method">
                <div className="payment-amount">{formatCurrency(methodStats.DEBIT_CARD, settings.currency, settings.language)}</div>
                <div className="payment-label">Debit Card</div>
              </div>
              <div className="payment-method">
                <div className="payment-amount">{formatCurrency(methodStats.MOBILE_PAYMENT, settings.currency, settings.language)}</div>
                <div className="payment-label">Mobile Payment</div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="search-section">
          <div className="search-grid">
            <div className="search-field">
              <label>Search {viewMode === 'orders' ? 'Orders' : 'Receipts'}</label>
              <input
                type="text"
                placeholder={viewMode === 'orders' ? 'Search by order ID or customer...' : 'Search by receipt or order ID...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            {viewMode === 'orders' ? (
              <div className="filter-field">
                <label>Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="PREPARING">Preparing</option>
                  <option value="READY">Ready</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            ) : (
              <div className="filter-field">
                <label>Payment Method</label>
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="ALL">All Methods</option>
                  <option value="CASH">Cash</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="DEBIT_CARD">Debit Card</option>
                  <option value="MOBILE_PAYMENT">Mobile Payment</option>
                </select>
              </div>
            )}

            <div className="refresh-container">
              <button onClick={viewMode === 'orders' ? loadOrders : loadReceipts} className="refresh-btn">
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Orders or Receipts List */}
        {viewMode === 'orders' ? (
          <div className="orders-list">
            <div className="orders-list-header">
              <h3>Orders ({filteredOrders.length})</h3>
            </div>
            
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📋</span>
                <p>No orders found</p>
                <p className="empty-hint">Orders will appear here when customers place them</p>
              </div>
            ) : (
              <OrderList orders={filteredOrders} userRole="CASHIER" />
            )}
          </div>
        ) : (
          <div className="receipts-list">
            <div className="receipts-list-header">
              <h3>Receipts ({filteredReceipts.length})</h3>
            </div>
            
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading receipts...</p>
              </div>
            ) : filteredReceipts.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🧾</span>
                <p>No receipts found</p>
                <p className="empty-hint">Receipts will appear here after orders are completed</p>
              </div>
            ) : (
              <ReceiptList
                receipts={filteredReceipts}
                onReprint={handleReprint}
                onEmail={handleEmail}
              />
            )}
          </div>
        )}

        {/* Email Modal */}
        {emailModal.show && emailModal.receipt && emailModal.receipt.order && (
          <div className="email-modal-overlay">
            <div className="email-modal">
              <div className="email-modal-header">
                <h3>Email Receipt</h3>
                <button 
                  onClick={() => setEmailModal({ show: false, receipt: null })}
                  className="close-btn"
                >
                  ×
                </button>
              </div>
              
              <div className="email-modal-content">
                <div className="receipt-preview">
                  <h4>Receipt #{emailModal.receipt.id}</h4>
                  <p><strong>Order:</strong> #{emailModal.receipt.order.id}</p>
                  <p><strong>Amount:</strong> {formatCurrency(emailModal.receipt.total, settings.currency, settings.language)}</p>
                  <p><strong>Payment Method:</strong> {emailModal.receipt.paymentMethod.replace('_', ' ')}</p>
                  <p><strong>Status:</strong> {emailModal.receipt.order.payment?.status || 'COMPLETED'}</p>
                </div>
                
                <div className="email-input-section">
                  <label>Email Address:</label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="customer@example.com"
                    className="email-input"
                  />
                </div>
              </div>
              
              <div className="email-modal-actions">
                <button 
                  onClick={() => setEmailModal({ show: false, receipt: null })}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendEmail}
                  className="send-btn"
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>        )}
      </div>
    </div>
  );
};

export default CashierReceipts;