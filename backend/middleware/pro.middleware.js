import { User } from "../models/User.model.js";

export const requirePro = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    if (user.plan !== 'pro') {
      return res.status(403).json({ 
        error: 'Эта функция доступна только на PRO плане',
        code: 'PRO_REQUIRED'
      });
    }
    
    next();
  } catch (error) {
    console.error('❌ requirePro error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};