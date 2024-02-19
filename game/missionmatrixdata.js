let missionmatrixdata = {
    missions: {
        "1": {
            relics: [{id: "tape_measure", row: 5, column: 5}],
            player: {row: 10, column: 5},
            enemies: [{id: "Seeker", row: 0, column: 5}],
            constructs: [{id: "Wall", row: 5, column: 1},{id: "Wall", row: 5, column: 3},{id: "Wall", row: 5, column: 5},{id: "Wall", row: 5, column: 7},{id: "Wall", row: 5, column: 9}],
            mechanisms: [],
            tile: {id: "Plains"},
            tile_overides: [],
        },
        "2": {
            relics: [{id: "toothpaste", row: 5, column: 5}],
            player: {row: 10, column: 5},
            enemies: [{id: "Seeker", row: 0, column: 0}, {id: "Seeker", row: 0, column: 10}],
            constructs: [{id: "Wall", row: 4, column: 5},{id: "Wall", row: 5, column: 4},{id: "Reinforced_wall", row: 5, column: 5},{id: "Wall", row: 5, column: 6},{id: "Wall", row: 6, column: 5}],
            mechanisms: [],
            tile: {id: "Cracked_earth"},
            tile_overides: [
                {row: 3, column: 5, id: "Plains"},
                {row: 4, column: 4, id: "Plains"},
                {row: 4, column: 5, id: "Plains"},
                {row: 4, column: 6, id: "Plains"},
                {row: 5, column: 3, id: "Plains"},
                {row: 5, column: 4, id: "Plains"},
                {row: 5, column: 5, id: "Plains_pool"},
                {row: 5, column: 6, id: "Plains"},
                {row: 5, column: 7, id: "Plains"},
                {row: 6, column: 4, id: "Plains"},
                {row: 6, column: 5, id: "Plains"},
                {row: 6, column: 6, id: "Plains"},
                {row: 7, column: 5, id: "Plains"},
            ]   
        },
        "3": {
            relics: [{id: "calculator", row: 5, column: 3}],
            player: {row: 10, column: 5},
            enemies: [{id: "Seeker", row: 0, column: 5}],
            constructs: [
                {id: "Boolean_block", row: 3, column: 4, state: true},
                {id: "Boolean_block", row: 3, column: 5, state: true},
                {id: "Boolean_block", row: 3, column: 6, state: true},
                {id: "Boolean_block", row: 7, column: 4, state: false},
                {id: "Boolean_block", row: 7, column: 5, state: false},
                {id: "Boolean_block", row: 7, column: 6, state: false},
                {id: "Wall", row: 4, column: 3},
                {id: "Wall", row: 5, column: 3},
                {id: "Wall", row: 6, column: 3},
                {id: "Wall", row: 4, column: 7},
                {id: "Wall", row: 5, column: 7},
                {id: "Wall", row: 6, column: 7},
            ],
            mechanisms: [{id: "Switch", row: 5, column: 5}],
            tile: {id: "Plains"},
            tile_overides: []
        },
    }
}