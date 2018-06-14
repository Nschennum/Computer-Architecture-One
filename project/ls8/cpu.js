/**
 * LS-8 v2.0 emulator skeleton code
 */
let SP = 0x07; //Stack position 0x07-holding value/invalid character

//CPU operation codes
const LDI = 0b10011001; //register immediate
const PRN = 0b01000011; //register pseudo-instruction
const HLT = 0b00000001; //halt CPU (exit emulator)

const ADD = 0b10101000;
const MUL = 0b10101010;

const POP = 0b01001100;
const PUSH = 0b01001101; //push register

const CALL = 0b01001000;//call register-calls address
const RET = 0b00001001; //return from subroutine

const JMP = 0b01010000;
/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {

    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;

        this.reg = new Array(8).fill(0); // General-purpose registers R0-R7

        // Special-purpose registers
        this.PC = 0; // Program Counter
    //Reg7(pointer) points to F4 in stack
        this.reg[SP] = 0xf4; //0xf4 address for key pressed with 'keyboard interrupt'
    }

    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        this.ram.write(address, value);
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        this.clock = setInterval(() => {
            this.tick();
        }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
    }

    /**
     * Stops the clock
     */
    stopClock() {
        clearInterval(this.clock);
    }

    /**
     * ALU functionality
     *
     * The ALU is responsible for math and comparisons.
     *
     * If you have an instruction that does math, i.e. MUL, the CPU would hand
     * it off to it's internal ALU component to do the actual work.
     *
     * op can be: ADD SUB MUL DIV INC DEC CMP etc. 
     */


    alu(op, regA, regB) {
        switch (op) {
            case 'MUL':
                // !!! IMPLEMENT ME
                //this.reg[regA] *=this.reg[regB]
                this.reg[regA] = (this.reg[regA] * this.reg[regB]) & 0xf;
                break;
            case 'ADD':
                this.reg[regA] = this.reg[regA] + this.reg[regB];
                break;
        }
    }

   interruptEnabled() {}; 
   interruptHappened() {}; 
    /**
     * Advances the CPU one cycle
     */
    tick() {
        // Load the instruction register (IR--can just be a local variable here)
        // from the memory address pointed to by the PC. (I.e. the PC holds the
        // index into memory of the instruction that's about to be executed
        // right now.)
        if (interruptEnabled) {
            if (interruptHappened){
                RET(this.PC) = 
            }
        }
        // !!! IMPLEMENT ME
        let IR = this.ram.read(this.PC); //instruction register
        // Debugging output
        // console.log(`${this.PC}: ${IR.toString(2)}`);

        // Get the two bytes in memory _after_ the PC in case the instruction
        // needs them.

        // !!! IMPLEMENT ME
        let operandA = this.ram.read(this.PC + 1); //byte 1
        let operandB = this.ram.read(this.PC + 2); //byte 2

        // Execute the instruction. Perform the actions for the instruction as
        // outlined in the LS-8 spec.

        // !!! IMPLEMENT ME
        //   switch(IR) {
        //       case LDI: 
        //       //set value in register
        //       this.reg[operandA] = operandB;
        //       this.PC += 3; //Next instruction
        //       break; 

        //       case PRN: 
        //       console.log(this.reg[operandA]); 
        //       this.PC += 2; 
        //       break; 

        //       case HLT: 
        //       this.stopClock(); 
        //       this.PC += 1; 

        //       case MUL: 
        //       this.alu("MUL", operandA, operandB); 
        //       break; 

        //       default: 
        //       console.log("Unknown instruciton: " + IR.toString(2)); 
        //       this.stopClock(); 
        //       return; 
        //   }

        const handle_LDI = (operandA, operandB) => {
            this.reg[operandA] = operandB;
        };
        //kindly prints our returned data
        const handle_PRN = operandA => {
            console.log(this.reg[operandA]);
        };
        const handle_HLT = () => {
            this.stopClock();
        };

        // handle math operations by calling alu
        const handle_ADD = (operandA, operandB) => {
            this.alu('ADD', operandA, operandB);
        };
        const handle_MUL = (operandA, operandB) => {
            this.alu('MUL', operandA, operandB);
        };

        //PUSH and POP handle stack instructions 
        const handle_POP = operA => {
            this.reg[operA] = this.ram.read(this.reg[SP]);
            this.reg[SP]++;
        };
        const handle_PUSH = operA => {
            this.reg[SP] = this.reg[SP] - 1;
            this.ram.write(this.reg[SP], this.reg[operA]);
        };
       
        //subroutine calls to CALL TO and memory location and RETurn from 
        const handle_CALL = operA => {
            this.reg[SP] = this.reg[SP] - 1;
            this.ram.write(this.reg[SP], this.PC + 2);
            return this.reg[operA];
        };
        const handle_RET = () => {
            const value = this.ram.read(this.reg[SP]);
            this.reg[SP]++;
            return value;
        };

        const branchTable = {
            [LDI]: handle_LDI,
            [PRN]: handle_PRN,
            [HLT]: handle_HLT,
            [ADD]: handle_ADD,
            [MUL]: handle_MUL,
            [POP]: handle_POP,
            [PUSH]: handle_PUSH,
            [CALL]: handle_CALL,
            [RET]: handle_RET
        };

        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.


        // !!! IMPLEMENT ME
        const returnHandler = branchTable[IR](operandA, operandB);
        if (returnHandler === undefined) {
            this.PC += (IR >>> 6) + 1;
        } else {
            this.PC = returnHandler;
        }
    }
}


module.exports = CPU;
