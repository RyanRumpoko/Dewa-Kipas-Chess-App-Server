const router = require('express').Router()
const UserController = require('../controllers/userController')
const auth = require('../middlewares/authenticate')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/leaderboard', auth, UserController.getLeaderboard)

module.exports = router