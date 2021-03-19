const { History } = require('../models')

class HistoryController {
  static addHistory(req, res, next) {

  }
  static findHistoryById(req, res, next) {
    History.findAll({
      where: {
        [op.or]: {
          player1: {
            [op.like]: +req.params.id
          },
          player2: {
            [op.like]: +req.params.id
          }
        }
      }
    }).then(histories => res.status(200).json(histories))
      .catch(err => next(err))
  } 
}

module.exports = HistoryController