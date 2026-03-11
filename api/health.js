/**
 * Health check endpoint
 */
module.exports = (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'WALeads API',
    version: '1.0.0'
  });
};
