const bcrypt = require('bcrypt');

function create(text) {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(text, salt);
    return hash
}

function compare(text, hash) {
    const check = bcrypt.compareSync(text, hash);
    return check;
}

module.exports = {
    enc: create,
    dec: compare
}