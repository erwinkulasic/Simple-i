'use strict';
const { push, execute, parseArgs, clear } = require('./invoke');
const { getFiles } = require('./filestream');
const { parse } = require('./parser');
const path = require('path');
const colors = require('colors');

var error = colors.red;

var returnArr = [];
var buffer = [];

module.exports.i = (taskName, args = [], condition = undefined, eachElements = undefined) => {
    push({ taskName, args, condition, eachElements })
    return this;
}

module.exports.run = (options = { folder: 'dist' }) => {
    returnArr = [];
    buffer = [];

    //const _PATH = path.join(__dirname, "..\\" + options.folder); // DEVELOPMENT
    const _PATH = path.join(__dirname, "..\\..\\..\\" + options.folder); //PUBLIC
    const _parse = async () => {
        const raw = getFiles(_PATH, 'js');
        await raw.forEach(data => {
            const tree = parse(data.src);
            tree.body.forEach(async func => {
                var name = undefined;
                var returnsValue = false;

                if (func.type === "ExpressionStatement") {
                    name = func.expression.left.property.name;

                    if (func.expression.right.body.body.find(i => (i.type === "ReturnStatement" && i.argument !== null))) {
                        returnsValue = true;
                    }
                }
                await buffer.push({ path: data.filePath, name, returnsValue })
            })
        })
    }

    const _invokeScript = async () => {
        execute(e => {
            var getFunc = buffer.find(i => i.name === e.taskName);
            if (getFunc) {
                let params = [];
                if (e.args && e.args.length) {
                    params = parseArgs(e.args, { returnArr });
                }
                var pa = getFunc.path.split('.')[0] || getFunc.path.split('.')[0]
                var task = require(`${pa}`);
                const _action_ = () => {
                    if (!getFunc.returnsValue) {
                        if (e.eachElements && e.eachElements !== undefined) {
                            let pos = params.indexOf('@element');
                            e.eachElements.forEach(getData => {
                                var newEachParams = params;
                                newEachParams[pos] = getData;
                                task[e.taskName](...newEachParams)
                            })
                        } else if (e.eachElements === undefined) {
                            task[e.taskName](...params)
                        }
                    } else {
                        const t = task[e.taskName](...params);
                        returnArr.push({ value: t, name: e.taskName });
                    }
                }
                if (e.condition && e.condition !== undefined) {
                    _action_();
                } else if (e.condition === undefined) {
                    _action_();
                }
            }
        })
    }

    (async () => {
        await new Promise(function (resolve, reject) {
            _parse().then(resolve, reject);
            _invokeScript().then(resolve, reject);
            clear();
        }).catch(err => {
            console.log(error({ message: err.message }))
        })
    })();
}
