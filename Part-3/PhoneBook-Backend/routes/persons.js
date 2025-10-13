const express = require('express')
const router = express.Router()
const personController = require('../controllers/personController')

router.get('/', personController.getAll)
router.get('/:id', personController.getOne)
router.post('/', personController.create)
router.delete('/:id', personController.remove)
router.put('/:id', personController.update)

module.exports = router
