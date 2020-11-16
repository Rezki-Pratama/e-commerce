'use sctrict'

let response = require('../helper/resJson')
let postgre = require('../service/connection')

exports.index = (req, res) => {
    response.ok("Rest api pertama saya", res)
}

exports.getBarang = (req, res) => {
    postgre.query('SELECT * FROM barang', (error, result, fileds)=>{
        if(error) {
            response.json(400, null, 'Data barang gagal diambil', res)
        } else {
            response.json(200,result.rows, 'Data barang berhasil diambil', res);
        }
    })
}

exports.getBarangId = (req, res) => {
    let id = req.params.id;
    postgre.query('SELECT * FROM barang WHERE id = $1',[id],(error, result, fileds) => {
        console.log(result.rows);
        if(error) {
            response.json(400, null, 'Data barang gagal diambil', res);
        } else {
            if(Array.isArray(result.rows) && result.rows.length) {
                response.json(200,result.rows,'Data barang berhasil diambil', res);
            } else {
                response.json(404, null, 'Data barang tidak ada', res)
            }
        }
    });
}

exports.postBarang = (req, res) => {
    let nama = req.body.nama;
    let deskripsi = req.body.deskripsi;
    let harga = req.body.harga;
    console.log(nama)
    console.log(deskripsi)
    console.log(harga)
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