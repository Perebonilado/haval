const bcrypt = require('bcrypt');
const saltRounds = 10;

const encryptPassword = async (password) => {
    if(!password) return
    else {
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        if(hashedPassword) return hashedPassword
    }
}

module.exports = { encryptPassword }