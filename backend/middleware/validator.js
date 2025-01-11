export const hydrationValidator = {
  validateAddEntry: (req, res, next) => {
    const { amount } = req.body;
    
    if (!amount) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'amount is required'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        error: 'Invalid amount',
        details: 'Amount must be greater than 0'
      });
    }

    next();
  },

  validateGetEntries: (req, res, next) => {
    const { period } = req.query;
    const validPeriods = ['daily', 'weekly', 'monthly'];
    
    if (period && !validPeriods.includes(period)) {
      return res.status(400).json({
        error: 'Invalid period',
        details: `Period must be one of: ${validPeriods.join(', ')}`
      });
    }

    next();
  }
};
