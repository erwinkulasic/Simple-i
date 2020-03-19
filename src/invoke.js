'use strict';

var taskArray = [];

module.exports.push = async i_item => {
    await taskArray.push(i_item);
}

module.exports.execute = task => {
    taskArray.forEach(async e =>  await task(e) );
}

module.exports.clear = () => {
    taskArray = [];
}

const getTask = (name) => {
    return taskArray.find(i => i.taskName == name);
}

module.exports.parseArgs = (args, buffer = {}) => {
    var newParameters = [];
    args.forEach( e => {
        if(typeof e === "string") {
            if(e.includes("@return") || e.includes("@element")) {
                const arr = e.split(':');
                if(arr[0] === "@return") {
                    try {
                        var val = buffer.returnArr.find(i => i.name === getTask(arr[1]).taskName);
                        newParameters.push(val.value)
                    } catch(err) {
                        buffer.errors.push({ error: err });
                    }
                } else if(arr[0] === "@element") {
                    newParameters.push("@element")
                }
            } else {
                newParameters.push(e)
            }
        } else {
            newParameters.push(e)
        }
    })

    return newParameters;
}