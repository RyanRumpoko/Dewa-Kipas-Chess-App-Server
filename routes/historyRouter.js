const router = require('express').Router()
const HistoryController = require('../controllers/historyController')

router.get('/:id', HistoryController.findHistoryById)

module.exports = router