<?php
// Connexion à la base de données (ajouter ici les détails de connexion si nécessaire)
// Vérifier si l'utilisateur est connecté (ajoute ici la logique si nécessaire)

// Fonction pour obtenir un Pokémon aléatoire via l'API
function getRandomPokemon($shiny = false) {
    $pokemon_id = rand(1, 151); // Pour les premiers 151 Pokémon, change si tu veux plus
    $api_url = "https://pokeapi.co/api/v2/pokemon/$pokemon_id";
    $pokemon_data = json_decode(file_get_contents($api_url), true);

    // Extraire les types
    $types = array_map(function($type) {
        return ucfirst($type['type']['name']);
    }, $pokemon_data['types']);
    
    // Extraire les statistiques
    $stats = [];
    foreach ($pokemon_data['stats'] as $stat) {
        $stats[$stat['stat']['name']] = $stat['base_stat'];
    }

    // Si shiny est activé, récupérer le sprite shiny
    $image_url = $shiny ? $pokemon_data['sprites']['front_shiny'] : $pokemon_data['sprites']['front_default'];

    return [
        'name' => ucfirst($pokemon_data['name']),
        'image' => $image_url, // Sprite shiny ou normal
        'types' => implode(', ', $types), // Liste des types
        'hp' => $stats['hp'], // PV
        'attack' => $stats['attack'], // Attaque
        'defense' => $stats['defense'], // Défense
        'special_attack' => $stats['special-attack'], // Attaque spéciale
        'special_defense' => $stats['special-defense'], // Défense spéciale
        'speed' => $stats['speed'], // Vitesse
        'weight' => $pokemon_data['weight'], // Poids
        'height' => $pokemon_data['height'], // Taille
        'id' => $pokemon_data['id'], // ID
        'habitat' => isset($pokemon_data['species']['habitat']) ? $pokemon_data['species']['habitat']['name'] : 'Unknown', // Habitat
        'color' => isset($pokemon_data['species']['color']) ? $pokemon_data['species']['color']['name'] : 'Unknown', // Couleur
        'shiny' => $shiny // Ajoute un flag pour savoir si le Pokémon est shiny
    ];
}

// Ouvrir un booster et obtenir toujours 6 Pokémon
$booster_pokemons = [];
for ($i = 0; $i < 6; $i++) {
    // 10% de chance que chaque Pokémon soit shiny
    $is_shiny = rand(1, 100) <= 10; 
    $pokemon = getRandomPokemon($is_shiny);
    $booster_pokemons[] = $pokemon;

    // Sauvegarder dans la base de données si nécessaire (ajoute ici la logique de sauvegarde)
}

// Afficher le booster sous forme JSON
header('Content-Type: application/json');
echo json_encode($booster_pokemons);