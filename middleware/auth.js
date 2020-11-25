const postgre = require('../service/connection');
const md5 = require('MD5');
const bcrypt = require('bcrypt');
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
            let salt = bcrypt.genSaltSync(10);
            let post = {
                username: req.body.username,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, salt),
                role: 2,
                created_at: new Date()
            }

            console.log(post.password)

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

exports.login = (req, res) => {
    try {
        
        let post = {
            password: req.body.password,
            email: req.body.email
        }
    
        postgre.query('SELECT * FROM users WHERE email=$1',
        [
            post.email
        ],(error,result) => {
               if(error){
                   console.log(error);
               } else {
                   if(Array.isArray(result.rows) && result.rows.length) {
    
                        bcrypt.compare(post.password, result.rows[0].password, function(err, hash) {
                            if(hash) {
                                
                                //Create access token with JWT
                                let data = result.rows;
                                let token = jwt.sign({data}, config.secret,{
                                expiresIn: 1440 
                                });
                                id_user = data[0].id;
                                username = data[0].username;
                                let inputData = {
                                    id_user:id_user,
                                    access_token: token,
                                    ip_address: ip.address()
                                }
                
                                postgre.query('INSERT INTO access_token (id_user,access_token,ip_address) VALUES ($1,$2,$3)',
                                [
                                    inputData.id_user,
                                    inputData.access_token,
                                    inputData.ip_address
                                ],(error,rows) => {
                                    if(error){
                                        console.log(error);
                                    } else {
                                        res.json({
                                            success: true,
                                            message: 'Token JWT tergenerate !',
                                            token: token,
                                            user: data.id_user,
                                            username: username  
                                        });
                                    }
                                });
                                
                            } else {
                                
                                res.json({
                                    "Error":true,
                                    "message": "Password anda salah !"
                                }); 
                                console.log(err)
    
                            }
                        });
    
                   } else {
                    res.json({
                        "Error":true,
                        "message": "Email anda Tidak terdaftar !"
                    }); 
                   }
               } 
            })

    } catch (error) {
        console.log(error)
    }
}

exports.secret = (req, res) => {
     res.json({
         "Message": "Halaman ini hanya untuk user dengan role 2"
     });
}