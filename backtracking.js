// backtracking.js
// Sudoku Solver using Backtracking Algorithm

class SudokuSolver {
    constructor() {
        this.steps = 0;
        this.backtracks = 0;
    }

    // Check if placing num at grid[row][col] is valid
    isValid(grid, row, col, num) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num) return false;
        }
        
        // Check column
        for (let x = 0; x < 9; x++) {
            if (grid[x][col] === num) return false;
        }
        
        // Check 3x3 box
        const startRow = row - row % 3;
        const startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[i + startRow][j + startCol] === num) return false;
            }
        }
        
        return true;
    }

    // Find the first empty cell (with value 0)
    findEmptyCell(grid) {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (grid[r][c] === 0) return [r, c];
            }
        }
        return null; // No empty cell found - puzzle solved!
    }

    // Backtracking algorithm - recursive solution
    solve(grid) {
        this.steps = 0;
        this.backtracks = 0;
        
        const result = this.backtrack(grid);
        return {
            solved: result,
            steps: this.steps,
            backtracks: this.backtracks
        };
    }

    backtrack(grid) {
        // Find empty cell
        const empty = this.findEmptyCell(grid);
        if (!empty) return true; // Base case: no empty cells = solved!
        
        const [row, col] = empty;
        
        // Try numbers 1-9
        for (let num = 1; num <= 9; num++) {
            if (this.isValid(grid, row, col, num)) {
                // Place the number
                grid[row][col] = num;
                this.steps++;
                
                // Recursively solve the rest
                if (this.backtrack(grid)) {
                    return true; // Success!
                }
                
                // If we reach here, current placement didn't work
                // Backtrack: remove the number and try next
                grid[row][col] = 0;
                this.backtracks++;
            }
        }
        
        return false; // No valid number found for this cell
    }

    // Advanced backtracking with heuristics
    solveWithHeuristics(grid) {
        this.steps = 0;
        this.backtracks = 0;
        
        const result = this.backtrackWithMCV(grid);
        return {
            solved: result,
            steps: this.steps,
            backtracks: this.backtracks
        };
    }

    // Most Constrained Variable (MCV) heuristic
    // Choose the empty cell with fewest possible values
    findMostConstrainedCell(grid) {
        let minOptions = 10;
        let bestCell = null;
        
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (grid[r][c] === 0) {
                    const options = this.getPossibleValues(grid, r, c);
                    if (options.length < minOptions) {
                        minOptions = options.length;
                        bestCell = [r, c, options];
                    }
                }
            }
        }
        
        return bestCell;
    }

    // Get all possible values for a cell
    getPossibleValues(grid, row, col) {
        const possible = [];
        for (let num = 1; num <= 9; num++) {
            if (this.isValid(grid, row, col, num)) {
                possible.push(num);
            }
        }
        return possible;
    }

    // Backtracking with Most Constrained Variable heuristic
    backtrackWithMCV(grid) {
        const cellInfo = this.findMostConstrainedCell(grid);
        if (!cellInfo) return true; // No empty cells = solved!
        
        const [row, col, possibleValues] = cellInfo;
        
        // If no possible values, this path is invalid
        if (possibleValues.length === 0) return false;
        
        // Try each possible value
        for (const num of possibleValues) {
            grid[row][col] = num;
            this.steps++;
            
            if (this.backtrackWithMCV(grid)) {
                return true;
            }
            
            // Backtrack
            grid[row][col] = 0;
            this.backtracks++;
        }
        
        return false;
    }

    // Validate if a completed sudoku is correct
    isValidSolution(grid) {
        // Check all rows, columns, and 3x3 boxes
        for (let i = 0; i < 9; i++) {
            if (!this.isValidUnit(this.getRow(grid, i)) ||
                !this.isValidUnit(this.getColumn(grid, i)) ||
                !this.isValidUnit(this.getBox(grid, i))) {
                return false;
            }
        }
        return true;
    }

    isValidUnit(unit) {
        const seen = new Set();
        for (const num of unit) {
            if (num < 1 || num > 9 || seen.has(num)) {
                return false;
            }
            seen.add(num);
        }
        return seen.size === 9;
    }

    getRow(grid, row) {
        return grid[row];
    }

    getColumn(grid, col) {
        return grid.map(row => row[col]);
    }

    getBox(grid, boxIndex) {
        const box = [];
        const startRow = Math.floor(boxIndex / 3) * 3;
        const startCol = (boxIndex % 3) * 3;
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                box.push(grid[startRow + i][startCol + j]);
            }
        }
        return box;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SudokuSolver;
}
