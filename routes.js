'use sctrict'

module.exports = (app) => {
    let product = require('./controller/product');

    app.route('/').get(product.index);

    app.route('/barang/').get(product.getBarang);

    app.route('/barang/:id').get(product.getBarangId);

    app.route('/barang/').post(product.postBarang);
}