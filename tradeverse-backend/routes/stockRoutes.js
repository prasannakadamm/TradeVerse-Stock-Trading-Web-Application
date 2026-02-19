const router = require("express").Router();
const { getStocks } = require("../controllers/stockController");

router.get("/", getStocks);

module.exports = router;
