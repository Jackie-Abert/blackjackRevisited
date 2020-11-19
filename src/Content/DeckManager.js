const newDeck = {
  deckOfCards() {
    let suits = ["diamonds", "hearts", "spades", "clubs"];
    let faceValue = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
    let key = 1;

    let deck = [];
    for (let i = 0; i < suits.length; i++) {
      for (let j = 0; j < faceValue.length; j++) {
        let numValue = faceValue[j];
        if (
          faceValue[j] === "J" ||
          faceValue[j] === "Q" ||
          faceValue[j] === "K"
        ) {
          numValue = 10;
        }
        if (faceValue[j] === "A") {
          numValue = 11;
        }
        let card = {
          key: key++,
          suit: suits[i],
          faceValue: faceValue[j],
          numberValue: numValue,
        };
        deck.push(card);
      }
    }
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
    }

    return deck;
  },
};

export default newDeck
