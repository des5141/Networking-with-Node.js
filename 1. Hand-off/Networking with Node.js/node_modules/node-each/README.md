# Node Each

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![Travis](https://img.shields.io/travis/goncaloneves/node-each.svg?style=flat-square)](https://travis-ci.org/goncaloneves/node-each)
[![Codecov](https://img.shields.io/codecov/c/github/goncaloneves/node-each.svg?style=flat-square)](https://codecov.io/github/goncaloneves/node-each)
[![npm](https://img.shields.io/npm/v/node-each.svg?style=flat-square)](https://www.npmjs.com/package/node-each)
[![npm](https://img.shields.io/npm/l/node-each.svg?style=flat-square)](https://github.com/goncaloneves/node-each/blob/master/LICENSE)

**N**(ode) **E**(each)

If you are doing 'heavy lifting' loops in Node.js you can fork and allocate a new thread. But what if you want to run the loop in the same process and distribute iterations through multiple Event Loop cycles? 

Node Each is here to solve the later. It avoids blocking Node.js Event Loop while performing asynchronous and intensive for each loops. It allows to set next iteration to be run on the next Event Loop cycle, giving the opportunity for Node to process queued events.

## Install

```bash
$ npm install node-each
```
```javascript
var ne = require('node-each');
```

## Usage

### ne.each(Array, [Callback], [Options])

**Array: [*]**

Array to run each loop.

**Callback: Function(el, i)**

* e{*} - iteration element
* i{Number} - iteration index

If the callback function returns a Promise back to the iterator handler, the next iteration will only run after Promise fulfilment.

**Options: Object{debug, on, when}**

* debug{Boolean} - debug flag (default: false)
* on{String} - iteration or time (default: iteration)
* when{Number} - total iteration or total time in milliseconds (decimal allowed) to trigger next cycle (default: 1)

Trigger next Event Loop cycle iteration based 'on' iteration number or time in milliseconds since the last cycle.

By default it will trigger based 'on' iteration every time it reaches 'when', in this case 1. Simply put on every loop iteration.

NE uses [process.hrtime()](https://nodejs.org/api/process.html#process_process_hrtime) to calculate time, so decimals can be used to work with smaller units.

**Returns: Promise{fulfilled(debug)}**

**Debug: Object{average, cycles, duration, iterations, on, when}**

* average{Number} - average iteration time (ms)
* cycles{Number} - each total cycles
* duration{Number} - each duration time (ms)
* iterations{Number} - each iterations
* on{String} - each on setting
* when{String} - each when setting

### ne.stats

**Object{executing}: Number**

* executing{Number} - number of each loops running at this moment

## Examples

```javascript
var ne = require('node-each');

var names = ['Helen', 'John', 'Peter', 'Jim'];
```

### On: Iteration

```javascript
var options = {
    debug: true
};

ne.each(names, function(el, i){

    console.log('Name', el + ' has index of ' + i);
  
}, options).then(function(debug) {

    console.log('Finished', debug);
  
});

// Output
// Name Helen has index of 0 - Event Loop Cycle 1
// Name John has index of 1 - Event Loop Cycle 2
// Name Peter has index of 2 - Event Loop Cycle 3
// Name Jim has index of 3 - Event Loop Cycle 4
// Finished {
//    average: 1.58539575,
//    cycles: 4,
//    duration: 6.341583,
//    iterations: 4,
//    on: 'iteration',
//    when: 1
// }
```

### On: Time

```javascript
var options = {
    debug: true,
    on: 'time',
    when: 150.000001 // equals to 150000001 nanoseconds
};

/** Simulate asynchronous loop operation */
ne.each(names, function(el, i){

    return new Promise(function(resolve) {
    
        setTimeout(function(){

            console.log('Name', el + ' has index of ' + i);
            console.log('Loops executing', ne.stats.executing);
          
            resolve();
          
        }, 100);
      
    });
  
}, options).then(function(debug) {

    console.log('Finished', debug);
    console.log('Loops executing', ne.stats.executing);
  
});

// Output
// Name Helen has index of 0 - Event Loop Cycle 1
// Loops executing 1
// Name John has index of 1 - Event Loop Cycle 1
// Loops executing 1
// Name Peter has index of 2 - Event Loop Cycle 2
// Loops executing 1
// Name Jim has index of 3 - Event Loop Cycle 2
// Loops executing 1
// Finished { 
//    average: 105.3162665,
//    cycles: 2,
//    duration: 421.265066,
//    iterations: 4,
//    on: 'time',
//    when: 150
// }
// Loops executing 0
```

## Dependency

[Bluebird](https://github.com/petkaantonov/bluebird/)

## Contribute

Node Each module uses [semantic-release](https://github.com/semantic-release/semantic-release/) with [Commit Guidelines](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit).

```bash
$ mkdir node-each && cd node-each
$ git clone git@github.com:goncaloneves/node-each.git .
$ npm install
 
$ npm test # Tests with Coverage
$ npm run commit # Commit
$ gulp # Gulp Watch [Eslint, Test]
$ gulp lint # Gulp Eslint
$ gulp test # Gulp Tests
```

## License

MIT License
2015 © Gonçalo Neves