const socket = io();

socket.on('serve cards', (cards) => {
    const userCardsImg = document.querySelectorAll('.user-card');

    userCardsImg.forEach((card, i) => {
        card.setAttribute('src', `${cards.cards[i].image}`)
    })
    // console.log(cards)
});