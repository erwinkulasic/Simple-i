const tes = require('./index')

tes.i("Test")
    .i('result1', [Math.PI * 2])
    .run({ folder: "dist" });