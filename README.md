
[![npm version](https://badge.fury.io/js/simple-i.svg)](https://badge.fury.io/js/simple-i)
# :milky_way: Simple-i

This is a wonderful way to clean up your code and helps you avoid errors.

[![NPM](https://nodei.co/npm/simple-i.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/simple-i/)

# installation


Using npm:
```shell
npm i simple-i
```

# Example

/index.js
```javascript
const Invoke1 = require('simple-i');

Invoke1
    .i("num1")
    .i("num2")
    .i('result', ["@return:num1", "@return:num2"])
    .i('Hello', ["@element"], (process.env.NODE_ENV !== "production"), ["Hello", "World"])
    .run({ folder: 'dist' });
```

/dist/bla.js
```javascript
exports.num1 = () => {
    return 50;
}

exports.num2 = () => {
    return 20;
}

exports.result = (a, b) => {
    console.log(a + b)
}

exports.Hello = (res) => {
    console.log(res);
}
```

# Docs

## run( < options > )
 
## i( <function_name>, <arguments>, <condition>, <array> )

# License

Copyright (c) 2020 VerTical

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.