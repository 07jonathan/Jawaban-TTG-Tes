function findMathExpression(source, target) {
    const operators = ['+', '-', '*', '/'];
    const solutions = [];
    
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (j === i) continue;
            for (let k = 0; k < 4; k++) {
                if (k === i || k === j) continue;
                for (let l = 0; l < 4; l++) {
                    if (l === i || l === j || l === k) continue;
                    
                    const a = source[i];
                    const b = source[j];
                    const c = source[k];
                    const d = source[l];
                    
                    // Manual operator combinations - 3 nested loops
                    for (let op1 = 0; op1 < 4; op1++) {
                        for (let op2 = 0; op2 < 4; op2++) {
                            for (let op3 = 0; op3 < 4; op3++) {
                                const operator1 = operators[op1];
                                const operator2 = operators[op2];
                                const operator3 = operators[op3];
                                
                                // Pola 1: ((a op1 b) op2 c) op3 d
                                let result = calculate(a, b, operator1);
                                if (result === null) continue;
                                
                                result = calculate(result, c, operator2);
                                if (result === null) continue;
                                
                                result = calculate(result, d, operator3);
                                if (result !== null && Math.abs(result - target) < 0.0001) {
                                    const expr = `((${a} ${operator1} ${b}) ${operator2} ${c}) ${operator3} ${d}`;
                                    return expr; // Langsung return solusi pertama
                                }
                                
                                // Pola 2: (a op1 (b op2 c)) op3 d
                                let result2 = calculate(b, c, operator2);
                                if (result2 === null) continue;
                                
                                result2 = calculate(a, result2, operator1);
                                if (result2 === null) continue;
                                
                                result2 = calculate(result2, d, operator3);
                                if (result2 !== null && Math.abs(result2 - target) < 0.0001) {
                                    const expr = `(${a} ${operator1} (${b} ${operator2} ${c})) ${operator3} ${d}`;
                                    return expr; // Langsung return solusi pertama
                                }
                                
                                // Pola 3: (a op1 b) op2 (c op3 d)
                                let result3a = calculate(a, b, operator1);
                                if (result3a === null) continue;
                                
                                let result3b = calculate(c, d, operator3);
                                if (result3b === null) continue;
                                
                                let result3 = calculate(result3a, result3b, operator2);
                                if (result3 !== null && Math.abs(result3 - target) < 0.0001) {
                                    const expr = `(${a} ${operator1} ${b}) ${operator2} (${c} ${operator3} ${d})`;
                                    return expr; // return ke solusi pertama
                                }
                                
                                // Pola 4: a op1 (b op2 (c op3 d))
                                let result4a = calculate(c, d, operator3);
                                if (result4a === null) continue;
                                
                                let result4b = calculate(b, result4a, operator2);
                                if (result4b === null) continue;
                                
                                let result4 = calculate(a, result4b, operator1);
                                if (result4 !== null && Math.abs(result4 - target) < 0.0001) {
                                    const expr = `${a} ${operator1} (${b} ${operator2} (${c} ${operator3} ${d}))`;
                                    return expr; // return ke solusi pertama
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    return null; // Return null jika tidak ditemukan solusi
}

function calculate(a, b, op) {
    if (op === '+') {
        return a + b;
    } else if (op === '-') {
        return a - b;
    } else if (op === '*') {
        return a * b;
    } else if (op === '/') {
        if (b === 0) {
            return null;
        }
        return a / b;
    }
    return null;
}

console.log("=== PROGRAM PENCARI EKSPRESI MATEMATIKA ===");
console.log("\n=== VERSI 2: Input dari Console (koma atau spasi) ===");
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function parseInputNumbers(inputStr) {
    const cleaned = inputStr.trim();
    
    if (cleaned.includes(',')) {
        return cleaned.split(',').map(num => {
            return parseFloat(num.trim());
        }).filter(num => !isNaN(num));
    } else {
        return cleaned.split(/\s+/).map(num => {
            return parseFloat(num.trim());
        }).filter(num => !isNaN(num));
    }
}

function getUserInput() {
    console.log("\n" + "=".repeat(50));
    rl.question('Masukkan 4 angka (pisahkan dengan koma atau spasi): ', (numbersInput) => {
        const numArray = parseInputNumbers(numbersInput);
        
        console.log(`Angka yang diinput: [${numArray.join(', ')}]`);
        
        // Validasi harus tepat 4 angka
        if (numArray.length !== 4) {
            console.log(`ERROR: Input harus tepat 4 angka. Anda memasukkan ${numArray.length} angka.`);
            console.log('Contoh input yang valid:');
            console.log('  - "1 2 3 4" (dengan spasi)');
            console.log('  - "1,2,3,4" (dengan koma)');
            console.log('  - "1, 2, 3, 4" (dengan koma dan spasi)');
            
            getUserInput();
            return;
        }
        
        // Validasi semua angka valid
        if (numArray.some(isNaN)) {
            console.log('ERROR: Ada angka yang tidak valid dalam input.');
            getUserInput();
            return;
        }
        
        rl.question('Masukkan target angka: ', (targetStr) => {
            const target = parseFloat(targetStr);
            
            if (isNaN(target)) {
                console.log('ERROR: Target tidak valid. Harus berupa angka.');
            } else {
                console.log(`\nMencari ekspresi untuk: [${numArray.join(', ')}] = ${target}`);
                
                const solution = findMathExpression(numArray, target);
                
                if (solution) {
                    console.log(`\n Solusi:`);
                    console.log(`  ${solution}`);
                } else {
                    console.log("\n Tidak ditemukan solusi");
                }
            }
            
            rl.question('\nApakah ingin mencoba lagi? (y/n): ', (answer) => {
                if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'ya') {
                    getUserInput();
                } else {
                    console.log('Program ditutup...');
                    rl.close();
                }
            });
        });
    });
}

getUserInput();