const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { skillReport } = require("../controllers/skillController");

router.get("/", auth, skillReport);

module.exports = router;
