export const modules = {
  sales: {
    title: 'Income & Sales',
    description: 'Create sales records, track payments, manage estimates, and review customer balances.',
    amountLabel: 'Sale / Payment Amount',
    actions: [
      'Create Invoice',
      'Record Payment',
      'Create Sales Receipt',
      'Create Estimate / Quote',
      'Convert Estimate to Invoice',
      'Track Customer Balances',
      'View Sales Reports',
    ],
  },
  vendors: {
    title: 'Vendors',
    description: 'Manage vendors, bills, outstanding balances, and vendor payments.',
    amountLabel: 'Bill / Payment Amount',
    actions: ['Add Vendor', 'Record Vendor Bills', 'Track Outstanding Bills', 'Pay Vendors'],
  },
  banking: {
    title: 'Banking',
    description: 'Record deposits, withdrawals, reconciliations, cash flow, and bank imports.',
    amountLabel: 'Transaction Amount',
    actions: ['Record Deposit', 'Record Withdrawal', 'Reconcile Bank Transactions', 'View Cash Flow', 'Import Bank Transactions'],
  },
  payroll: {
    title: 'Payroll',
    description: 'Track employees, payroll runs, employee payments, and payroll reports.',
    amountLabel: 'Payroll Amount',
    actions: ['Add Employee', 'Record Payroll', 'Track Employee Payments', 'Generate Payroll Reports'],
  },
  taxes: {
    title: 'Taxes',
    description: 'Track sales tax, tax payments, reports, and export records for tax preparation.',
    amountLabel: 'Tax Amount',
    actions: ['Track Sales Tax', 'Record Tax Payments', 'Generate Tax Reports', 'Export Records for Tax Preparation'],
  },
  products: {
    title: 'Products & Services',
    description: 'Manage products, services, pricing, inventory, and inventory reports.',
    amountLabel: 'Price / Value',
    actions: ['Add Product', 'Add Service', 'Update Pricing', 'Track Inventory', 'View Inventory Reports'],
  },
  reports: {
    title: 'Reports',
    description: 'Generate the core financial, customer, tax, sales, and cash flow reports.',
    amountLabel: 'Report Value',
    actions: [
      'Profit & Loss Report',
      'Balance Sheet',
      'Income Report',
      'Expense Report',
      'Sales Report',
      'Customer Report',
      'Tax Summary Report',
      'Cash Flow Report',
    ],
  },
  documents: {
    title: 'Documents',
    description: 'Store receipts, business documents, tax documents, and downloadable reports.',
    amountLabel: 'Document Amount',
    actions: ['Upload Receipts', 'Upload Business Documents', 'Store Tax Documents', 'Download Reports'],
  },
} as const;

export type ModulePage = keyof typeof modules;
