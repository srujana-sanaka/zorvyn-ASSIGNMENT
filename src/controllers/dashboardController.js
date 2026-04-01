const { asyncHandler } = require('../utils/asyncHandler');
const { dashboardService } = require('../services/dashboardService');

const dashboardController = {
  summary: asyncHandler(async (req, res) => {
    const recentLimit = req.query.recentLimit ? Number(req.query.recentLimit) : 10;
    const data = await dashboardService.getSummary({ recentLimit });
    res.json({ dashboard: data });
  })
};

module.exports = { dashboardController };
