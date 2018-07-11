// @flow

const ROOM_VARIANTS = [
    [ { x: 0, y: 0 } ],
    [ { x: 0, y: 0 }, { x: 1, y: 0 } ],
    [ { x: 0, y: 0 }, { x: 0, y: 0 } ],
];

function createEmptyMaze(size: Number) {
    const map = new Array(size).fill(null);
    for (let i = 0; i < map.length; i++) {
        map[i] = new Array(size).fill(null);
    }
    return map;
}

function fixCellToCurrentPos(pos, cell) {
    return { x: pos.x + cell.x, y: pos.y + cell.y };
}

function fillMazeByRooms(map) {
    let currBlock = 0;

    const graphs = {};

    for (let line = 0; line < map.length; line++) {
        for (let cell = 0; cell < map[line].length; cell++) {
            if (map[line][cell] === null) {
                const roomsBlueprint = ROOM_VARIANTS[Math.floor(Math.random() * ROOM_VARIANTS.length)];
                currBlock += 1;
                graphs[currBlock] = {
                    cells: [],
                    neighbor: new Set(),
                    portals: new Set(),
                };

                roomsBlueprint.forEach(roomCell => {
                    const rightCell = fixCellToCurrentPos(roomCell, {x: line, y: cell});

                    if (rightCell.x < map.length &&
                        rightCell.y < map[line].length) {
                        graphs[currBlock].cells.push(rightCell);
                        map[rightCell.x][rightCell.y] = currBlock;
                    }
                });
            }
        }
    }

    return {
        map: map,
        graphs: graphs,
    };
}

function getGraphNeighbors(map, graphCells) {
    const checkedCell = [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 0, y: -1 },
    ];

    const neighbors = new Set();
    graphCells.cells.forEach(cell => {
         checkedCell.forEach(i => {
             const graphTag = map[cell.x][cell.y];
             const project = fixCellToCurrentPos(cell, i);
             if (project.x >= 0 && project.x < map.length &&
                 project.y >= 0 && project.y < map[cell.x].length &&
                 map[project.x][project.y] !== graphTag) {
                 neighbors.add(map[project.x][project.y]);
             }
         });
    });

    return neighbors;
}

function getAllNeighbors({map, graphs}) {
    for (let graph in graphs) {
        const g = graphs[graph];
        g.neighbor = getGraphNeighbors(map, g);
    }

    return {map, graphs};
}

function setRandomPortals({map, graphs}) {
    for (let graph in graphs) {
        const g = graphs[graph];

    }

    return {map, graphs};
}


export function generateRandomMaze(size: Number) {
    const mapInfo = setRandomPortals(getAllNeighbors(fillMazeByRooms(createEmptyMaze(size))));

    return mapInfo;
}