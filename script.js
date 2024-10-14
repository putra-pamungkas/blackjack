const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];
let dealerHand = [];
let playerHand = [];

let dealerScore = 0;
let playerScore = 0;
let isGameOver = false;

let playerWallet = 100;
let dealerWallet = 1000;
let betAmount = 10;

// Get elements
const dealButton = document.getElementById('deal-button');
const betInput = document.getElementById('bet');

// Function to create and shuffle the deck
function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value, suit });
        }
    }
    shuffleDeck();
}

// Function to shuffle the deck
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Function to deal initial cards
function dealInitialCards() {
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    updateScores();
    updateUI();
}

// Function to calculate score
function calculateHand(hand) {
    let sum = 0;
    let aceCount = 0;

    hand.forEach(card => {
        if (card.value === 'A') {
            aceCount++;
            sum += 11;
        } else if (['J', 'Q', 'K'].includes(card.value)) {
            sum += 10;
        } else {
            sum += parseInt(card.value);
        }
    });

    // Adjust for aces if sum > 21
    while (sum > 21 && aceCount > 0) {
        sum -= 10;
        aceCount--;
    }

    return sum;
}

// Function to update the scores
function updateScores() {
    playerScore = calculateHand(playerHand);
    dealerScore = calculateHand(dealerHand);
}

// Function to update the UI (showing cards and scores)
function updateUI() {
    const dealerCardsDiv = document.getElementById('dealer-cards');
    const playerCardsDiv = document.getElementById('player-cards');
    
    dealerCardsDiv.innerHTML = dealerHand.map(card => `${card.value} of ${card.suit}`).join(', ');
    playerCardsDiv.innerHTML = playerHand.map(card => `${card.value} of ${card.suit}`).join(', ');
    
    document.getElementById('player-score').innerText = `${playerScore}`;
    document.getElementById('dealer-score').innerText = `${dealerScore}`;

    // Update wallets
    document.getElementById('player-wallet').innerText = playerWallet;
    document.getElementById('dealer-wallet').innerText = dealerWallet;

    // Check for game over
    if (isGameOver) {
        const resultDiv = document.getElementById('result');
        resultDiv.innerText = getResultMessage();
        resultDiv.className = getResultClass(); // Set the color class
        
        // Re-enable deal button after game ends
        dealButton.style.visibility = 'visible';  // Make "Deal" button visible again
        betInput.disabled = false;  // Enable bet input after match ends
    }
}

// Function to handle "Hit" action
function hit() {
    if (!isGameOver) {
        playerHand.push(deck.pop());
        updateScores();
        updateUI();
        if (playerScore > 21) {
            isGameOver = true;
            updateWallets();
            updateUI();
        }
    }
}

// Function to handle "Stand" action
function stand() {
    if (!isGameOver) {
        while (dealerScore < 17) {
            dealerHand.push(deck.pop());
            updateScores();
        }
        isGameOver = true;
        updateWallets();
        updateUI();
    }
}

// Function to get the result message
function getResultMessage() {
    if (playerScore > 21) {
        return 'You Busted! Dealer Wins!';
    } else if (dealerScore > 21) {
        return 'Dealer Busted! You Win!';
    } else if (playerScore > dealerScore) {
        return 'You Win!';
    } else if (playerScore < dealerScore) {
        return 'Dealer Wins!';
    } else {
        return 'It\'s a Tie!';
    }
}

// Function to get the result class for coloring the result
function getResultClass() {
    if (playerScore > 21) {
        return 'lose';
    } else if (dealerScore > 21 || playerScore > dealerScore) {
        return 'win';
    } else if (playerScore < dealerScore) {
        return 'lose';
    } else {
        return 'tie';
    }
}

// Function to update wallets based on the result
function updateWallets() {
    if (playerScore > 21) {
        dealerWallet += betAmount;
        playerWallet -= betAmount;
    } else if (dealerScore > 21 || playerScore > dealerScore) {
        playerWallet += betAmount;
        dealerWallet -= betAmount;
    } else if (playerScore < dealerScore) {
        dealerWallet += betAmount;
        playerWallet -= betAmount;
    }
}

// Function to start a new game
function newGame() {
    isGameOver = false;
    document.getElementById('result').innerText = '';

    // Retrieve the bet amount
    betAmount = parseInt(betInput.value);

    // Ensure bet is valid
    if (betAmount > playerWallet || betAmount > dealerWallet) {
        alert('Bet amount exceeds wallet balance!');
        return;
    }

    // Disable "Deal" button and hide it after it's clicked
    dealButton.style.visibility = 'hidden';  // Hide the "Deal" button
    betInput.disabled = true;  // Disable bet input after deal

    createDeck();
    dealInitialCards();
}

// Event listeners for buttons
dealButton.addEventListener('click', newGame);
document.getElementById('hit-button').addEventListener('click', hit);
document.getElementById('stand-button').addEventListener('click', stand);

// Initialize game when page loads
createDeck();

// Function to get image path for a card
function getCardImagePath(card) {
    return `images/cards/${card.value.toLowerCase()}_of_${card.suit.toLowerCase()}.png`;
}

// Function to update the UI (showing cards and scores)
function updateUI() {
    const dealerCardsDiv = document.getElementById('dealer-cards');
    const playerCardsDiv = document.getElementById('player-cards');

    dealerCardsDiv.innerHTML = dealerHand.map(card => `<img src="${getCardImagePath(card)}" alt="${card.value} of ${card.suit}">`).join('');
    playerCardsDiv.innerHTML = playerHand.map(card => `<img src="${getCardImagePath(card)}" alt="${card.value} of ${card.suit}">`).join('');

    document.getElementById('player-score').innerText = `${playerScore}`;
    document.getElementById('dealer-score').innerText = `${dealerScore}`;

    // Update wallets
    document.getElementById('player-wallet').innerText = playerWallet;
    document.getElementById('dealer-wallet').innerText = dealerWallet;

    // Check for game over
    if (isGameOver) {
        const resultDiv = document.getElementById('result');
        resultDiv.innerText = getResultMessage();
        resultDiv.className = getResultClass(); // Set the color class
        
        // Re-enable deal button after game ends
        dealButton.style.visibility = 'visible';  // Make "Deal" button visible again
        betInput.disabled = false;  // Enable bet input after match ends
    }
}
