export const auth = (req, res, next) => {
  const { userId } = req.headers;
  
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  req.userId = userId;
  next();
};
