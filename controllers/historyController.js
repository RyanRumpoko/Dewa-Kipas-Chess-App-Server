const { History } = require('../models')
const {Op} =require('sequelize')
class HistoryController {

  static addHistory(req, res, next) {
    const { playerOne, playerTwo, status } = req.body
    if(!playerOne || !playerTwo || !status) {
      throw { name: "INVALID_DATA", message: "fields cannot be empty" };
    }
    History.create({
      playerOne,
      playerTwo,
      status
    })
    .then((history) => {
      res.status(201).json({
        id: history.id,
        playerOne: history.playerOne,
        playerTwo: history.playerTwo,
        status: history.status,
      })
    })
    .catch((err) => next(err))
  }

  static findHistoryById(req, res, next) {
    History.findAll({
      where: {
        [Op.or]: [{playerOne:+req.params.id },{playerTwo:+req.params.id}]
      }
    }).then(histories => {
      console.log(histories)
      res.status(200).json(histories)
    })
      .catch(err => {
        console.log(err, 'error dari histories')
        next(err)})
  } 
}

module.exports = HistoryController