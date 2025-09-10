// a_star.js
// Implements A* pathfinding for a grid maze

function aStar(grid, start, end) {
    const rows = grid.length, cols = grid[0].length;
    function heuristic(a, b) {
        return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
    }
    function neighbors(node) {
        const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
        return dirs.map(([dr,dc]) => ({row: node.row+dr, col: node.col+dc}))
            .filter(n => n.row>=0 && n.row<rows && n.col>=0 && n.col<cols && !grid[n.row][n.col].wall);
    }
    let openSet = [start];
    let cameFrom = {};
    let gScore = Array.from({length: rows}, () => Array(cols).fill(Infinity));
    gScore[start.row][start.col] = 0;
    let fScore = Array.from({length: rows}, () => Array(cols).fill(Infinity));
    fScore[start.row][start.col] = heuristic(start, end);
    let visited = [];
    while (openSet.length) {
        openSet.sort((a,b) => fScore[a.row][a.col] - fScore[b.row][b.col]);
        let current = openSet.shift();
        visited.push(current);
        if (current.row === end.row && current.col === end.col) {
            let path = [];
            let temp = current;
            while (cameFrom[temp.row+','+temp.col]) {
                path.push(temp);
                temp = cameFrom[temp.row+','+temp.col];
            }
            path.push(start);
            path.reverse();
            return {path, visited};
        }
        for (const neighbor of neighbors(current)) {
            let tentative_gScore = gScore[current.row][current.col] + 1;
            if (tentative_gScore < gScore[neighbor.row][neighbor.col]) {
                cameFrom[neighbor.row+','+neighbor.col] = current;
                gScore[neighbor.row][neighbor.col] = tentative_gScore;
                fScore[neighbor.row][neighbor.col] = tentative_gScore + heuristic(neighbor, end);
                if (!openSet.some(n => n.row === neighbor.row && n.col === neighbor.col)) {
                    openSet.push(neighbor);
                }
            }
        }
    }
    return {path: [], visited};
}
