const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { tradeReport } = require("../controllers/reportController");

router.get("/", auth, tradeReport);

module.exports = router;
