let relics = {
    standard_issue: {
        description: "the bare minimum required to survive... if that",
        effect: "allows the use of some abilities and base hp, movements, and power",
        name: "standard issue",
        class: "standard-issue",
        id: "standard_issue",
        found: "mission 0",
        abilities: ["Shell", "Shotgun", "Terraform_beta", "Terraform_gamma", "Slice", "Focus"],
        bonus: {
            hp: 4,
            movements: 2,
            power: 5,
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
        bonus: {
            hp: 0,
            movements: 0,
            power: 0,
        }
    },
    toothpaste: {
        description: "a tube of toothpaste... helps prevent gingivitis?",
        effect: "permanent +1 power & +1 hp",
        name: "toothpaste",
        class: "toothpaste",
        id: "toothpaste",
        found: "mission 2",
        abilities: [],
        bonus: {
            hp: 1,
            movements: 0,
            power: 1,
        }
    },
    calculator: {
        description: "solar powered calculator",
        effect: "allows the use of rest and focus",
        name: "calculator",
        class: "calculator",
        id: "calculator",
        found: "mission 3",
        abilities: ["Heal", "Rest"],
        bonus: {
            hp: 0,
            movements: 0,
            power: 0,
        }
    },
}