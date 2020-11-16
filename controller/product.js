'use sctrict'

let response = require('../helper/resJson');
let postgre = require('../service/connection');
const { body, validationResult } = require('express-validator');

exports.index = (req, res) => {
    response.ok("Rest api pertama saya", res);
}

exports.getBarang = (req, res) => {
    postgre.query('SELECT * FROM barang', (error, result, fileds)=>{
        if(error) {
            response.json(400, null, 'Data barang gagal diambil', res);
        } else {
            response.json(200,result.rows, 'Data barang berhasil diambil', res);
        }
    })
}

exports.getBarangId = (req, res) => {
    let id = req.params.id;
    postgre.query('SELECT * FROM barang WHERE id = $1',[id],(error, result, fileds) => {
        if(error) {
            response.json(400, null, 'Data barang gagal diambil', res);
        } else {
            if(Array.isArray(result.rows) && result.rows.length) {
                response.json(200,result.rows,'Data barang berhasil diambil', res);
            } else {
                response.json(404, null, 'Data barang tidak ada', res);
            }
        }
    });
}

exports.postBarang = {
    content : [

        body('nama').notEmpty().withMessage('Nama tidak boleh kosong'),
        body('deskripsi').notEmpty().withMessage('Deskripsi tidak boleh kosong'),
        body('harga').notEmpty().withMessage('Harga tidak boleh kosong'),

        (req, res) => {
            let nama = req.body.nama;
            let deskripsi = req.body.deskripsi;
            let harga = req.body.harga;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors)
                console.log(errors.errors[0].msg)
                response.json(400, false, errors.errors[0].msg, res);
            } else {
                postgre.query('INSERT INTO barang (nama,deskripsi,harga) VALUES ($1,$2,$3)',[nama,deskripsi,harga],
                (error, result, fileds) => {
                    if(error) {
                        console.log(error);
                        response.json(400, false, 'Gagal menambah data barang', res);
                    } else {
                        response.json(200, true, 'Berhasil menambah data barang', res);
                    }
                })
            } 
        }
    ]
}

exports.editBarang = {
    content : [

        body('nama').notEmpty().withMessage('Nama tidak boleh kosong'),
        body('deskripsi').notEmpty().withMessage('Deskripsi tidak boleh kosong'),
        body('harga').notEmpty().withMessage('Harga tidak boleh kosong'),
    
        (req, res) => {
            let id = req.body.id;
            let nama = req.body.nama;
            let deskripsi = req.body.deskripsi;
            let harga = req.body.harga;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors)
                console.log(errors.errors[0].msg)
                response.json(400, false, errors.errors[0].msg, res);
            } else {
                postgre.query('UPDATE barang SET nama=$1, deskripsi=$2, harga=$3 WHERE id=$4',[nama,deskripsi,harga,id],
                (error, result, fileds) => {
                        if(error) {
                            console.log(error);
                            response.json(400, false, 'Gagal mengedit data barang', res);
                        } else {
                            response.json(200, true, 'Berhasil mengedit data barang', res);
                        }
                }) 
            }

       
        }
    ]
}

exports.deleteBarang = (req, res) => {
    let id = req.body.id;
        postgre.query('DELETE FROM barang WHERE id = $1',[id],(error, result, fileds) => {
        if(error) {
            response.json(400, null, 'Data barang gagal dihapus', res);
        } else {
            if(result.rowCount == 1) {
                response.json(200, true,'Data barang berhasil dihapus', res);
            } else {
                response.json(200, true,'Data barang tidak ada', res);
            }
        }
    });
}