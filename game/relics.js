let relics = {
    standard_issue: {
        description: "the bare minimum required to survive... if that. incudes a one-way radio. where does a bag like this get made?",
        effect: "allows the use of some abilities",
        name: "standard issue",
        class: "standard-issue",
        id: "standard_issue",
        found: "mission 0",
        abilities: ["Shell", "Shotgun", "Terraform_beta", "Terraform_gamma", "Slice", "Heal", "Push"],
        canExamine: false,
        bonus: {
            hp: 4,
            movements: 4,
            power: 8,
        }
    },
    tape_measure: {
        description: "a yellow tape measure with the letters 'w' 'l' 'w' scratched in the side",
        effect: "allows use of meteor fire & meteor cryo",
        name: "tape measure",
        class: "tape-measure",
        id: "tape_measure",
        found: "mission 1",
        abilities: ["Meteor_fire", "Meteor_cryo"],
        canExamine: false,
        bonus: {
            hp: 0,
            movements: 0,
            power: 0,
        }
    },
    toothpaste: {
        description: "a tube of toothpaste... helps prevent gingivitis? feels very familiar",
        effect: "permanent +1 power & +1 hp",
        name: "toothpaste",
        class: "toothpaste",
        id: "toothpaste",
        found: "mission 2",
        abilities: [],
        canExamine: false,
        bonus: {
            hp: 1,
            movements: 0,
            power: 1,
        }
    },
    calculator: {
        description: "solar powered calculator... 9.8m/s² written on the cover",
        effect: "allows the use of rest and focus",
        name: "calculator",
        class: "calculator",
        id: "calculator",
        found: "mission 3",
        abilities: ["Focus", "Rest"],
        canExamine: false,
        bonus: {
            hp: 0,
            movements: 0,
            power: 0,
        }
    },
    research_paper: {
        description: "scientific research paper on irradiation and dna",
        effect: "allows the use of mine and leap",
        name: "research paper",
        class: "research-paper",
        id: "research_paper",
        found: "mission 4",
        abilities: ["Leap", "Mine"],
        bonus: {
            hp: 0,
            movements: 0,
            power: 0,
        },
        canExamine: true,
        examine: [
            "research_paper_01",
            "research_paper_02",
            // "pathToImg",
            // "pathToImg",
            // "pathToImg",
            // "pathToImg",
        ]
    },
    neptunium: {
        description: "small sample of NpF6 - neptunium(VI) fluoride ",
        effect: "allows the use of erupt and gives +1 hp & +1 movements",
        name: "neptunium",
        class: "neptunium",
        id: "neptunium",
        found: "mission 5",
        abilities: ["Erupt"],
        canExamine: false,
        bonus: {
            hp: 1,
            movements: 1,
            power: 0,
        }
    },
}