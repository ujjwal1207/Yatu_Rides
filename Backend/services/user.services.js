const usermodel = require('../models/user.model')
module.exports.createuser = async ({
  firstname,
  lastname,
  email,
  password
}) => {
  try {
    if (!firstname || !lastname || !email || !password) {
      throw new Error('All fields are required')
    }
    const user = usermodel.create({
      fullname: { firstname, lastname },
      email,
      password
    })
    return user
  } catch (error) {
    return { 'error in creating user': error.message }
  }
}
