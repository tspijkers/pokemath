// PokeMath game data

// The original 151, as "Name:type1/type2"
const DEX_RAW = `Bulbasaur:grass/poison,Ivysaur:grass/poison,Venusaur:grass/poison,Charmander:fire,Charmeleon:fire,Charizard:fire/flying,Squirtle:water,Wartortle:water,Blastoise:water,Caterpie:bug,Metapod:bug,Butterfree:bug/flying,Weedle:bug/poison,Kakuna:bug/poison,Beedrill:bug/poison,Pidgey:normal/flying,Pidgeotto:normal/flying,Pidgeot:normal/flying,Rattata:normal,Raticate:normal,Spearow:normal/flying,Fearow:normal/flying,Ekans:poison,Arbok:poison,Pikachu:electric,Raichu:electric,Sandshrew:ground,Sandslash:ground,Nidoran♀:poison,Nidorina:poison,Nidoqueen:poison/ground,Nidoran♂:poison,Nidorino:poison,Nidoking:poison/ground,Clefairy:normal,Clefable:normal,Vulpix:fire,Ninetales:fire,Jigglypuff:normal,Wigglytuff:normal,Zubat:poison/flying,Golbat:poison/flying,Oddish:grass/poison,Gloom:grass/poison,Vileplume:grass/poison,Paras:bug/grass,Parasect:bug/grass,Venonat:bug/poison,Venomoth:bug/poison,Diglett:ground,Dugtrio:ground,Meowth:normal,Persian:normal,Psyduck:water,Golduck:water,Mankey:fighting,Primeape:fighting,Growlithe:fire,Arcanine:fire,Poliwag:water,Poliwhirl:water,Poliwrath:water/fighting,Abra:psychic,Kadabra:psychic,Alakazam:psychic,Machop:fighting,Machoke:fighting,Machamp:fighting,Bellsprout:grass/poison,Weepinbell:grass/poison,Victreebel:grass/poison,Tentacool:water/poison,Tentacruel:water/poison,Geodude:rock/ground,Graveler:rock/ground,Golem:rock/ground,Ponyta:fire,Rapidash:fire,Slowpoke:water/psychic,Slowbro:water/psychic,Magnemite:electric,Magneton:electric,Farfetch'd:normal/flying,Doduo:normal/flying,Dodrio:normal/flying,Seel:water,Dewgong:water/ice,Grimer:poison,Muk:poison,Shellder:water,Cloyster:water/ice,Gastly:ghost/poison,Haunter:ghost/poison,Gengar:ghost/poison,Onix:rock/ground,Drowzee:psychic,Hypno:psychic,Krabby:water,Kingler:water,Voltorb:electric,Electrode:electric,Exeggcute:grass/psychic,Exeggutor:grass/psychic,Cubone:ground,Marowak:ground,Hitmonlee:fighting,Hitmonchan:fighting,Lickitung:normal,Koffing:poison,Weezing:poison,Rhyhorn:ground/rock,Rhydon:ground/rock,Chansey:normal,Tangela:grass,Kangaskhan:normal,Horsea:water,Seadra:water,Goldeen:water,Seaking:water,Staryu:water,Starmie:water/psychic,Mr. Mime:psychic,Scyther:bug/flying,Jynx:ice/psychic,Electabuzz:electric,Magmar:fire,Pinsir:bug,Tauros:normal,Magikarp:water,Gyarados:water/flying,Lapras:water/ice,Ditto:normal,Eevee:normal,Vaporeon:water,Jolteon:electric,Flareon:fire,Porygon:normal,Omanyte:rock/water,Omastar:rock/water,Kabuto:rock/water,Kabutops:rock/water,Aerodactyl:rock/flying,Snorlax:normal,Articuno:ice/flying,Zapdos:electric/flying,Moltres:fire/flying,Dratini:dragon,Dragonair:dragon,Dragonite:dragon/flying,Mewtwo:psychic,Mew:psychic`;

const DEX = {};
DEX_RAW.split(',').forEach((entry, i) => {
  const [name, types] = entry.split(':');
  DEX[i + 1] = { id: i + 1, name, types: types.split('/') };
});
const DEX_COUNT = 151;

const LEGENDARY = new Set([144, 145, 146, 150, 151]);
// Fully evolved Pokémon show up a bit less often than first forms.
const FINAL_FORMS = new Set([3, 6, 9, 12, 15, 18, 20, 22, 24, 26, 28, 31, 34, 36, 38, 40, 42, 45, 47, 49, 51, 53, 55, 57, 59, 62, 65, 68, 71, 73, 76, 78, 80, 82, 85, 87, 89, 91, 94, 97, 99, 101, 103, 105, 110, 112, 117, 119, 121, 130, 134, 135, 136, 139, 141, 149]);

// ---------- Levels: math difficulty + which Pokémon can be found ----------
// add/sub: numbers 1..max for + and − (answers never below zero)
// mul: numbers 1..max for ×
const MATH_LEVELS = {
  1: { addSub: 20, mul: 0, label: '+ and − up to 20' },
  2: { addSub: 20, mul: 5, label: '+ and − up to 20, × up to 5' },
  3: { addSub: 50, mul: 5, label: '+ and − up to 50, × up to 5' },
  4: { addSub: 0, mul: 10, label: '× up to 10' },
};
const LEVEL_POKEMON = {
  // 55: first forms (incl. the four partners) + Ditto
  1: [1, 4, 7, 25, 10, 13, 16, 19, 21, 23, 27, 29, 32, 35, 37, 39, 41, 43, 46, 48, 50, 52, 54, 56, 58, 60, 63, 66, 69, 72,
    74, 77, 79, 81, 84, 86, 88, 90, 92, 96, 98, 100, 102, 104, 109, 111, 116, 118, 120, 129, 133, 138, 140, 147, 132],
  // 50: middle evolutions, one-of-a-kind Pokémon, easier final forms
  2: [2, 5, 8, 11, 14, 17, 30, 33, 44, 61, 64, 67, 70, 75, 93, 148,
    83, 95, 106, 107, 108, 113, 114, 115, 122, 123, 124, 125, 126, 127, 128, 131, 137, 142,
    12, 15, 20, 22, 24, 28, 36, 40, 42, 47, 49, 51, 53, 57, 85, 119],
  // 30: tougher final forms + legendary birds
  3: [18, 38, 45, 55, 62, 71, 73, 78, 80, 82, 87, 89, 91, 97, 99, 101, 103, 105, 110, 112, 117, 121, 134, 135, 136, 139, 141,
    144, 145, 146],
  // 16: Mew, Mewtwo and the strongest final evolutions
  4: [151, 150, 3, 6, 9, 149, 130, 65, 94, 68, 76, 59, 143, 26, 34, 31],
};
const LEVEL_OF = {};
for (const [lv, ids] of Object.entries(LEVEL_POKEMON)) ids.forEach((id) => (LEVEL_OF[id] = +lv));

// Starter order as the player sees it
const STARTERS = [7, 1, 4, 25];

// One new move per level (index 0 = level 1)
const PARTNER_MOVES = {
  7: [
    { name: 'Tackle', type: 'normal', power: 20 },
    { name: 'Bubble', type: 'water', power: 25 },
    { name: 'Water Gun', type: 'water', power: 30 },
    { name: 'Bite', type: 'normal', power: 35 },
    { name: 'Hydro Pump', type: 'water', power: 45 },
  ],
  1: [
    { name: 'Tackle', type: 'normal', power: 20 },
    { name: 'Vine Whip', type: 'grass', power: 25 },
    { name: 'Razor Leaf', type: 'grass', power: 30 },
    { name: 'Seed Bomb', type: 'grass', power: 35 },
    { name: 'Solar Beam', type: 'grass', power: 45 },
  ],
  4: [
    { name: 'Scratch', type: 'normal', power: 20 },
    { name: 'Ember', type: 'fire', power: 25 },
    { name: 'Fire Fang', type: 'fire', power: 30 },
    { name: 'Flamethrower', type: 'fire', power: 35 },
    { name: 'Fire Blast', type: 'fire', power: 45 },
  ],
  25: [
    { name: 'Quick Attack', type: 'normal', power: 20 },
    { name: 'Thunder Shock', type: 'electric', power: 25 },
    { name: 'Spark', type: 'electric', power: 30 },
    { name: 'Thunderbolt', type: 'electric', power: 35 },
    { name: 'Thunder', type: 'electric', power: 45 },
  ],
};

// What wild / trainer Pokémon use when they fight back
const FOE_MOVE = {
  normal: 'Tackle', fire: 'Ember', water: 'Water Gun', grass: 'Vine Whip', electric: 'Thunder Shock',
  ice: 'Ice Shard', fighting: 'Karate Chop', poison: 'Poison Sting', ground: 'Mud Slap', flying: 'Gust',
  psychic: 'Confusion', bug: 'Bug Bite', rock: 'Rock Throw', ghost: 'Lick', dragon: 'Twister',
};

const TYPE_LABEL = {
  normal: 'Normal', fire: 'Fire', water: 'Water', grass: 'Grass', electric: 'Electric', ice: 'Ice',
  fighting: 'Fighting', poison: 'Poison', ground: 'Ground', flying: 'Flying', psychic: 'Psychic',
  bug: 'Bug', rock: 'Rock', ghost: 'Ghost', dragon: 'Dragon',
};

const TRAINER_NAMES = [
  'Bernie', 'Mama', 'Papa', 'GiGi', 'Pop', 'Opa', 'Oma', 'Zander',
  'Henrik', 'Rezza', 'Spancer', 'Ari', 'Bruin', 'Theodore', 'Vaughn', 'Lucy',
];
// How each trainer is drawn: 'dog', 'grey' (grey hair), or default
const TRAINER_STYLE = { Lucy: 'dog', GiGi: 'grey', Pop: 'grey', Opa: 'grey', Oma: 'grey' };

const PRAISE = ['Great!', 'Awesome!', 'Super!', 'You got it!', 'Nice!', 'Correct!', 'Wow!', 'Yes!'];
