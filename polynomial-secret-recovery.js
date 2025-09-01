// Polynomial Secret Recovery using Lagrange Interpolation
// This solution reads a JSON input with encoded points and recovers the secret (constant term)

const fs = require('fs');

// Function to convert a value from any base to decimal
function baseToDecimal(value, base) {
    const digits = value.toString();
    let decimal = 0;
    let power = 0;
    
    // Process from right to left
    for (let i = digits.length - 1; i >= 0; i--) {
        const digit = digits[i];
        let digitValue;
        
        // Handle both numeric and alphabetic digits
        if (digit >= '0' && digit <= '9') {
            digitValue = parseInt(digit);
        } else {
            // For bases > 10, a=10, b=11, etc.
            digitValue = digit.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0) + 10;
        }
        
        decimal += digitValue * Math.pow(base, power);
        power++;
    }
    
    return decimal;
}

// Function to perform Lagrange interpolation and find the constant term
function lagrangeInterpolation(points) {
    const n = points.length;
    let constantTerm = 0;
    
    // We only need to find f(0) which is the constant term
    for (let i = 0; i < n; i++) {
        let term = points[i].y;
        
        // Calculate the Lagrange basis polynomial at x=0
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                // L_i(0) = product of (0 - x_j) / (x_i - x_j) for all j != i
                term *= (0 - points[j].x) / (points[i].x - points[j].x);
            }
        }
        
        constantTerm += term;
    }
    
    return Math.round(constantTerm);
}

// Main function to solve the problem
function solvePolynomialSecret(jsonInput) {
    let data;
    
    // Parse JSON input
    if (typeof jsonInput === 'string') {
        data = JSON.parse(jsonInput);
    } else {
        data = jsonInput;
    }
    
    const n = data.keys.n;
    const k = data.keys.k;
    
    console.log(`Total roots provided: ${n}`);
    console.log(`Minimum roots required: ${k}`);
    console.log(`Polynomial degree: ${k - 1}`);
    console.log();
    
    // Extract and decode all points
    const points = [];
    for (let key in data) {
        if (key !== 'keys') {
            const x = parseInt(key);
            const base = parseInt(data[key].base);
            const encodedValue = data[key].value;
            const y = baseToDecimal(encodedValue, base);
            
            points.push({ x, y });
            console.log(`Point ${x}: base=${base}, encoded="${encodedValue}", decoded=${y}`);
        }
    }
    
    // Sort points by x value for consistency
    points.sort((a, b) => a.x - b.x);
    
    // We need exactly k points for a degree k-1 polynomial
    // Since we have more points than needed, we can use any k points
    // For better accuracy, let's use the first k points
    const selectedPoints = points.slice(0, k);
    
    console.log(`\nUsing first ${k} points for interpolation:`);
    selectedPoints.forEach(p => console.log(`  (${p.x}, ${p.y})`));
    
    // Find the constant term using Lagrange interpolation
    const secret = lagrangeInterpolation(selectedPoints);
    
    console.log(`\nThe secret (constant term) is: ${secret}`);
    
    // Verify with different sets of points if we have extra points
    if (points.length > k) {
        console.log('\nVerification with different point sets:');
        
        // Try with last k points
        const verifyPoints = points.slice(-k);
        const verifySecret = lagrangeInterpolation(verifyPoints);
        console.log(`  Using last ${k} points: ${verifySecret}`);
        
        // Try with middle k points if possible
        if (points.length >= k + 2) {
            const midStart = Math.floor((points.length - k) / 2);
            const midPoints = points.slice(midStart, midStart + k);
            const midSecret = lagrangeInterpolation(midPoints);
            console.log(`  Using middle ${k} points: ${midSecret}`);
        }
    }
    
    return secret;
}

// Test with the provided test case
const testCase1 = {
    "keys": { "n": 4, "k": 3 },
    "1": { "base": "10", "value": "4" },
    "2": { "base": "2", "value": "111" },
    "3": { "base": "10", "value": "12" },
    "6": { "base": "4", "value": "213" }
};

const testCase2 = {
    "keys": { "n": 10, "k": 7 },
    "1": { "base": "6", "value": "13444211440455345511" },
    "2": { "base": "15", "value": "aed7015a346d635" },
    "3": { "base": "15", "value": "6aeeb69631c227c" },
    "4": { "base": "16", "value": "e1b5e05623d881f" },
    "5": { "base": "8", "value": "316034514573652620673" },
    "6": { "base": "3", "value": "2122212201122002221120200210011020220200" },
    "7": { "base": "3", "value": "20120221122211000100210021102001201112121" },
    "8": { "base": "6", "value": "20220554335330240002224253" },
    "9": { "base": "12", "value": "45153788322a1255483" },
    "10": { "base": "7", "value": "1101613130313526312514143" }
};

console.log("=== Test Case 1 ===");
solvePolynomialSecret(testCase1);

console.log("\n\n=== Test Case 2 ===");
solvePolynomialSecret(testCase2);

// If running with file input
if (process.argv.length > 2) {
    const filename = process.argv[2];
    console.log(`\n\n=== Reading from file: ${filename} ===`);
    
    try {
        const fileContent = fs.readFileSync(filename, 'utf8');
        const jsonData = JSON.parse(fileContent);
        solvePolynomialSecret(jsonData);
    } catch (error) {
        console.error('Error reading or parsing file:', error.message);
    }
}

// Export for use as module
module.exports = { baseToDecimal, lagrangeInterpolation, solvePolynomialSecret };