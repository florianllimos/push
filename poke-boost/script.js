document.getElementById('openBoosterButton').addEventListener('click', function () {
    fetch('open_booster.php')
        .then(response => response.json())
        .then(data => {
            const boosterContainer = document.getElementById('boosterContainer');
            const cardDisplay = document.getElementById('cardDisplay');
            boosterContainer.classList.remove('hidden');
            cardDisplay.innerHTML = '';
            cardDisplay.classList.remove('visible');
            let currentIndex = 0;

            const newCardDisplay = cardDisplay.cloneNode(true);
            cardDisplay.parentNode.replaceChild(newCardDisplay, cardDisplay);

            function createFireworks() {
                let pokemonCard = document.querySelector('#cardDisplay');
                pokemonCard.classList.add("shiny-card");
            }

            function removeAnim() {
                let pokemonCard = document.querySelector('#cardDisplay');
                pokemonCard.classList.remove("shiny-card");
            }

            function showCard(index) {
                if (index >= data.length) return;

                const pokemon = data[index];
                console.log(pokemon);

                newCardDisplay.innerHTML = `
                <div class='container-top'>
                    <h3 class="pokemon-name">${pokemon.name}</h3>
                    <p>${pokemon.hp} HP</p>
                </div>
                <div class="pokemon">
                    <img src="${pokemon.image}" alt="${pokemon.name}">
                </div>
                `;

                newCardDisplay.classList.add('visible');

                // If shiny, trigger fireworks
                if (pokemon.image.includes('shiny')) {
                    createFireworks();
                } else {
                    removeAnim();
                }

                // Add mousemove event to tilt the card
                newCardDisplay.addEventListener('mousemove', (e) => {
                    const rect = newCardDisplay.getBoundingClientRect();
                    const x = e.clientX - rect.left; // Position X relative
                    const y = e.clientY - rect.top;  // Position Y relative

                    // Calculate the angle
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = ((y - centerY) / centerY) * 25; // Rotation in X
                    const rotateY = ((x - centerX) / centerX) * -25; // Rotation in Y

                    // Apply transformations
                    newCardDisplay.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                });

                // Reset the angle when mouse leaves the card
                newCardDisplay.addEventListener('mouseleave', () => {
                    newCardDisplay.style.transform = `rotateX(0deg) rotateY(0deg)`;
                });
            }

            showCard(currentIndex);

            newCardDisplay.addEventListener('click', function () {
                currentIndex++;

                if (currentIndex < data.length && currentIndex < 6) {
                    newCardDisplay.classList.remove('visible');
                    setTimeout(() => showCard(currentIndex), 300);
                } else {
                    boosterContainer.classList.add('hidden'); // Masque le container après 6 cartes
                }
            });
        })
        .catch(error => console.error('Erreur:', error));
});
