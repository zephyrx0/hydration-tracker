export const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const { method, url, body, query } = req;
  
  console.log(`[${timestamp}] ${method} ${url}`);
  if (Object.keys(body).length) console.log('Body:', body);
  if (Object.keys(query).length) console.log('Query:', query);
  
  next();
};
