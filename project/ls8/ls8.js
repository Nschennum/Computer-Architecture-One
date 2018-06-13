const RAM = require('./ram');
const CPU = require('./cpu');
const fs = require('fs');





/**
 * Load an LS8 program into memory
 *
 * TODO: load this from a file on disk instead of having it hardcoded
 */

function loadMemory(cpu, filename) {
    const content = fs.readFileSync(filename, 'utf-8');
    //console.log(line); 
    const lines = content.trim().split(/[\r\n]+/g);
    program = [];

    for (let line of lines) {
        const val = parseInt(line, 2);

        if (isNaN(val)) {
            continue;
        }
        program.push(val);

        //console.log(line); 

    }

    // function loadMemory() {
    //     // Hardcoded program to print the number 8 on the console
    //     try {
    //         const regexp = /[0-9]{8}/gi;
    //         const program = fs.readFileSync(`${args[2]}`, "utf-8").match(regexp);

    //Load the program into the CPU's memory a byte at a time
    for (let i = 0; i < program.length; i++) {
        cpu.poke(i, program[i]);
    }
}
//     catch (err) {
//         console.log('invalid file, try again');
//         process.exit();
//     }
// }

//     "10011001", // LDI R0,8  Store 8 into R0
//     "00000000",
//     "00001000",
//     "01000011", // PRN R0    Print the value in R0
//     "00000000",
//     "00000001"  // HLT       Halt and quit
// ];

// const program = fs
//     .readFileSync(filename)
//     .toString()
//     .split('\n')
//     .reduce((array, line) => {
//         if (line[0] !== '#' && line[0] !== '\r' && line !== '') {
//             return array.concat(line.slice(0, 8));
//         }
//         return array;
//     }, []);

// Load the program into the CPU's memory a byte at a time


/**
 * Main
 */
if (process.argv.length != 3) {
    console.error("usage: ls8 filename");
    process.exit(1);
}

let ram = new RAM(256);
let cpu = new CPU(ram);

// TODO: get name of ls8 file to load from command line

loadMemory(cpu, process.argv[2]);

cpu.startClock();
 //node ls8 print8.ls8