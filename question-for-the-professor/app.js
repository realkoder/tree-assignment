const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let animalQuestions = [];
let animalQuestion;
let currentNode;

function loadAnimalQuestions() {
    try {
        const data = fs.readFileSync('animalsTest.json');
        animalQuestions = JSON.parse(data);
        animalQuestion = { ...animalQuestions[0] };
        currentNode = animalQuestions[0];
    } catch (err) {
        console.error('Error reading animals.json:', err);
        process.exit(1);
    }
}

function saveAnimalQuestions() {
    try {
        fs.writeFileSync('animalsTest.json', JSON.stringify(animalQuestions, null, 2));
    } catch (err) {
        console.error('Error writing to animals.json:', err);
        process.exit(1);
    }
}

function askQuestion() {

    rl.question(`${animalQuestion.question} (yes/no): `, (answer) => {
        if (answer.toLowerCase() === 'yes') {
            if (animalQuestion.yes !== undefined) {
                animalQuestion = animalQuestion.yes;
                askQuestion();
            } else {
                console.log(`I don't have more to ask.`);
                getQuestionAndAppendNode(animalQuestion.question, true);                
            }
        } else if (answer.toLowerCase() === 'no') {
            if (animalQuestion.no !== undefined) {
                animalQuestion = animalQuestion.no;
                askQuestion(animalQuestion.no);
            } else {
                console.log(`I give up! I couldn't guess your animal.`);                
                getQuestionAndAppendNode(animalQuestion.question, false);                               
            }
        } else {
            console.log('Invalid input. Please enter "yes" or "no".');
            askQuestion();
        }
    });
}

function getQuestionAndAppendNode(lastQuestion, isYesQuestion) {
    rl.question("Could you please provide me with one more question I could ask next time - must be yes or no answerable? ", (answer) => {
        if (answer.length > 5) {
            appendNewNode(currentNode, lastQuestion, answer, isYesQuestion);
            rl.close();
        } else {
            console.log('Invalid input. Please enter a question with at least 5 characters.');
            getQuestionAndAppendNode();
        }
    });
}

function appendNewNode(node, searchQuestion, newQuestion, isYesQuestion) {    
    if (node.question === searchQuestion) {
        if (isYesQuestion) {
            node.yes = { question: newQuestion };
        } else {
            node.no = { question: newQuestion };
        }
        return node;
    }

    if (node.yes) {
        const resultFromYesBranch = appendNewNode(node.yes, searchQuestion, newQuestion, isYesQuestion);
        if (resultFromYesBranch) {
            return resultFromYesBranch;
        }
    }

    if (node.no) {
        const resultFromNoBranch = appendNewNode(node.no, searchQuestion, newQuestion, isYesQuestion);
        if (resultFromNoBranch) {
            return resultFromNoBranch;
        }
    }

    return null;
}

console.log('Think of an animal, and I will try to guess it!');

loadAnimalQuestions();
askQuestion(0);

rl.on('close', () => {
    saveAnimalQuestions();
    process.exit(0);
});
