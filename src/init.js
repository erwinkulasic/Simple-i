const { push, execute, parseArgs, clear } = require('./invoke');
const { getFiles } = require('./filestream');
const { parse } = require('./parser');

var returnArr = [];
var buffer = [];
var errors = [];

module.exports.i = (taskName, args = [], condition = undefined, eachElements = undefined) => {
    push({ taskName, args, condition, eachElements })
    return this;
}

module.exports.run = (options = { folder: 'dist' }) => {

    returnArr = [];
    buffer = [];
    errors = [];

    const _parse = async () => {
        const raw = getFiles(options)
        await raw.forEach(data => {
            const tree = parse(data.result);
            const path = data.p;
            tree.body.forEach(async func => {
                var name = undefined;
                var returnsValue = false;

                if (func.type === "ExpressionStatement") {
                    name = func.expression.left.property.name;

                    if (func.expression.right.body.body.find(i => (i.type === "ReturnStatement" && i.argument !== null))) {
                        returnsValue = true;
                    }
                }
                await buffer.push({ path, name, returnsValue })
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
                var getPath = getFunc.path.split('\\')[1].split('.')[0];
                var task = require(`../${options.folder}/${getPath}`);
                const _action_ = () => {
                    if (!getFunc.returnsValue) {
                        try {
                            if(e.eachElements && e.eachElements !== undefined) {
                                let pos = params.indexOf('@element');
                                e.eachElements.forEach(getData => {
                                    var newEachParams = params;
                                    newEachParams[pos] = getData;
                                    task[e.taskName](...newEachParams)
                                })
                            } else if (e.eachElements === undefined) {
                                task[e.taskName](...params)
                            }
                        } catch (err) {
                            errors.push({ error: err })
                        }
                    } else {
                        try {
                            const t = task[e.taskName](...params);
                            returnArr.push({ value: t, name: e.taskName });
                        } catch (err) {
                            errors.push({ error: err })
                        }
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
        let response = await new Promise(function (resolve, reject) {
            _parse().then(resolve, reject);
            _invokeScript().then(resolve, reject);
        });
    })();
}