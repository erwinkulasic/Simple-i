const tes = require('./index')

require("./index")
    .i("A", [100 / 2 * 70 || 60])
    .i("A1", ["lol: ", "@element"], true, [])
    .run({ folder: "dist" });

    require("./index")
    .i("A", ["LOL"])
    .run({ folder: "dist" });