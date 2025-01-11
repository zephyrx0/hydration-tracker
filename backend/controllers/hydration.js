import Hydration from '../models/hydration.js';

export const getHydrationLogs = async (req, res) => {
  try {
    const { period, year, month } = req.query;
    let query = {};

    if (period === 'monthly' && year && month) {
      const yearNum = parseInt(year);
      const monthNum = parseInt(month);
      
      // Set waktu start date ke awal hari (00:00:00.000)
      const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1, 0, 0, 0));
      // Set waktu end date ke akhir hari (23:59:59.999)
      const endDate = new Date(Date.UTC(yearNum, monthNum, 0, 23, 59, 59, 999));
      
      query = {
        date: {
          $gte: startDate,
          $lte: endDate
        }
      };
    } else if (period === 'weekly') {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      query = {
        date: {
          $gte: startDate
        }
      };
    } else {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      query = {
        date: {
          $gte: startDate
        }
      };
    }

    const logs = await Hydration.find(query).sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    console.error('Error in getHydrationLogs:', error);
    res.status(500).json({ message: error.message });
  }
};

export const addEntry = async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Log incoming data
    console.log('Received data:', {
      amount,
      type: typeof amount
    });

    const newLog = new Hydration({
      userId: 'user123', // Tambahkan userId
      amount: Number(amount), // Pastikan amount adalah number
      date: new Date()
    });

    console.log('Document to save:', newLog.toObject());

    await newLog.save();
    res.status(201).json(newLog);
  } catch (error) {
    console.error('Full error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        details: error.errors
      });
    }
    res.status(500).json({ 
      message: error.message,
      code: error.code,
      details: error.errInfo
    });
  }
};