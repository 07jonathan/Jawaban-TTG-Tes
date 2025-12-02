const readline = require('readline');

function findMissingNumber(arr) {
    if (arr.length === 0) return null;
    
    arr.sort((a, b) => a - b);
    
    const min = arr[0];
    
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== min + i) {
            return min + i;
        }
    }
    
    return min + arr.length;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Masukkan angka-angka (pisahkan dengan spasi/koma): ', (input) => {
    try {
        const arr = input.split(/[,\s]+/)
            .map(num => parseInt(num.trim()))
            .filter(num => !isNaN(num));
        
        console.log(`Array input: [${arr.join(', ')}]`);
        
        const missingNumber = findMissingNumber(arr);
        console.log(`Angka yang hilang: ${missingNumber}`);
        
    } catch (error) {
        console.error('Error:', error.message);
    }
    
    rl.close();
});

// input 100 nomor
// 12, 35, 8, 47, 23, 1, 19, 42, 50, 31, 28, 5, 14, 39, 10, 45, 26, 3, 37, 17, 48, 30, 7, 22, 41, 16, 49, 33, 9, 24, 6, 44, 20, 38, 11, 29, 4, 15, 46, 27, 34, 13, 2, 40, 18, 32, 25, 21, 43, 36