const postgre = require('../service/connection');
const md5 = require('MD5');
const response = require('../helper/resJson');
const jwt = require('jsonwebtoken');
const config = require('../helper/generate')
const ip = require('ip');
const { body, validationResult } = require('express-validator');

exports.register = {
    auth : [
    
        body('username').notEmpty().withMessage('Username tidak boleh kosong'),
        body('email')
        .notEmpty().withMessage('Email tidak boleh kosong')
        .isEmail().withMessage('Isi format email dengan benar'),
        body('password')
        .notEmpty().withMessage('Password tidak boleh kosong')
        .isLength({ min: 8 }).withMessage('Jumlah karakter harus lebih dari 8'),
        
        (req, res) => {
            let post = {
                username: req.body.username,
                email: req.body.email,
                password: md5(req.body.password),
                role: 2,
                created_at: new Date()
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors)
                response.json(400, false, errors.errors[0].msg, res);
            } else {
        
                postgre.query('SELECT email FROM users WHERE email = $1',[post.email],(error, result) => {
                    if(error) {
                        console.log(error);
                    } else {
                        if(Array.isArray(result.rows) && result.rows.length) {
            
                            response.json(200, true, "Email sudah terdaftar !", res);
            
                        } else {
                            postgre.query('INSERT INTO users (username,email,password,role,created_at) VALUES ($1,$2,$3,$4,$5)',[
                                post.username,
                                post.email,
                                post.password,
                                post.role,
                                post.created_at,
                            ],(error, rows) => {
                                if(error) {
                                    console.log(error);
                                } else {
                                    response.json(200, null, 'Berhasil mendaftar !', res);
                                }
                            });
                        }
                    }
                });

            }
        }
    ]
}