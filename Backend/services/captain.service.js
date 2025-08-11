const captainModel = require('../models/captain.model')
module.exports.createCaptain = async ({
  firstname,
  lastname,
  email,
  password,
  color,
  number,
  capacity,
  type
}) => {
  if (
    !firstname ||
    !lastname ||
    !email ||
    !password ||
    !color ||
    !number ||
    !capacity ||
    !type
  ) {
    throw new Error('All fields are required')
  }
  const captain = await captainModel.create({
    fullname: {
      firstname,
      lastname
    },
    email,
    password,
    vehicle: {
      color,
      number,
      capacity,
      type
    }
  })

  return captain
}
