import { User } from "../models/User.model.js";

export const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('settings');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const defaultSettings = {
      background: {
        image: null,
        size: 'cover',
        position: 'center',
        attachment: 'fixed'
      }
    };
    
    res.json({ 
      settings: user.settings || defaultSettings 
    });
  } catch (error) {
    console.error('❌ Get settings error:', error);
    res.status(500).json({ error: 'Ошибка получения настроек' });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { settings } },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      settings: user.settings 
    });
  } catch (error) {
    console.error('❌ Update settings error:', error);
    res.status(500).json({ error: 'Ошибка обновления настроек' });
  }
};

export const updateSettingsSection = async (req, res) => {
  try {
    const { section } = req.params;
    const { data } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.settings) {
      user.settings = {
        background: {
          image: null,
          size: 'cover',
          position: 'center',
          attachment: 'fixed'
        }
      };
    }
    
    if (!user.settings[section]) {
      user.settings[section] = {};
    }
    
    user.settings[section] = { ...user.settings[section], ...data };
    await user.save();
    
    res.json({ 
      success: true, 
      settings: user.settings 
    });
  } catch (error) {
    console.error('❌ Update settings section error:', error);
    res.status(500).json({ error: 'Ошибка обновления настроек' });
  }
};