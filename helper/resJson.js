'use strict'

exports.json = (status, values, message, res) => {
    let data = {
        'status' : status,
        'message': message,
        'data' : values
    };

    res.json(data);
    res.send();
}