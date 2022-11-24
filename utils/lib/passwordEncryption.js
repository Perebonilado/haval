const bcrypt = require('bcrypt');
const saltRounds = 10;

const encryptPassword = async (password) => {
    if(!password) return
    else {
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        if(hashedPassword) return hashedPassword
    }
}

const comparePassword = async ({plainPassword, hashedPassword}) => {
    if(!plainPassword) return false
    else {
        const result = await bcrypt.compare(plainPassword, hashedPassword)
        if(result) return result
    }
}

module.exports = { encryptPassword, comparePassword }