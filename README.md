# Polynomial Secret Recovery using Lagrange Interpolation

## Problem Description
This solution implements a secret sharing scheme decoder using Lagrange interpolation. Given multiple points encoded in different number bases, the program:
1. Decodes each point from its respective base to decimal
2. Uses Lagrange interpolation to find the polynomial
3. Extracts the constant term (secret) of the polynomial

## Mathematical Background
- **Secret Sharing**: A polynomial of degree m is used where the constant term is the secret
- **k = m + 1**: We need k points to uniquely determine a polynomial of degree m
- **Lagrange Interpolation**: Used to find f(0), which gives us the constant term

## Solution Approach

### 1. Base Conversion
Each point's y-value is encoded in a different base. The solution:
- Converts values from any base (2-16) to decimal
- Handles both numeric digits (0-9) and alphabetic digits (a-f for bases > 10)

### 2. Lagrange Interpolation
To find the constant term f(0):
```
f(0) = Σ(i=0 to k-1) yi * Li(0)
```
Where Li(0) is the Lagrange basis polynomial evaluated at x=0:
```
Li(0) = Π(j≠i) (0 - xj)/(xi - xj)
```

### 3. Verification
When more than k points are provided, the solution verifies the result using different subsets of points.

## How to Run

### Prerequisites
- Node.js installed on your system

### Running the Code

1. **Direct execution with embedded test cases:**
```bash
node polynomial_secret.js
```

2. **With external JSON file:**
```bash
node polynomial_secret.js testcase.json
```

3. **As a module in another script:**
```javascript
const { solvePolynomialSecret } = require('./polynomial_secret');
const result = solvePolynomialSecret(jsonData);
```

## Test Case Results

### Test Case 1 (Sample)
- Input: 4 points, need 3 for degree-2 polynomial
- Points after decoding:
  - (1, 4) - base 10
  - (2, 7) - base 2: "111" = 7
  - (3, 12) - base 10
  - (6, 39) - base 4: "213" = 39
- **Secret (constant term): 3**

### Test Case 2 (Main)
- Input: 10 points, need 7 for degree-6 polynomial
- All points decoded from various bases (3, 6, 7, 8, 12, 15, 16)
- **Secret extracted using Lagrange interpolation**

## Code Structure

```
polynomial_secret.js
├── baseToDecimal()      # Converts any base to decimal
├── lagrangeInterpolation()  # Finds f(0) using Lagrange method
└── solvePolynomialSecret()  # Main solver function
```

## Manual Verification

To verify the solution manually:
1. Decode each point from its base to decimal
2. Use k points to set up a system of equations
3. Solve for polynomial coefficients
4. The constant term (c₀) is the secret

Example for degree-2 polynomial ax² + bx + c:
- Point (1, y₁): a(1)² + b(1) + c = y₁
- Point (2, y₂): a(2)² + b(2) + c = y₂
- Point (3, y₃): a(3)² + b(3) + c = y₃
- Solve for c (the secret)

## GitHub Repository Structure
```
polynomial-secret-recovery/
├── README.md
├── polynomial_secret.js
├── package.json
├── test_cases/
│   ├── test1.json
│   └── test2.json
└── output.txt
```

## Output Format
The program outputs:
1. Decoded values for each point
2. Selected points used for interpolation
3. The calculated secret (constant term)
4. Verification using different point subsets (if applicable)
