const PARTICIPANTS = [
    "Jon",
    "Tom",
    "Sabina",
    "Ida",
    "Sebastian",
    "Kris",
    "Marta",
    "Mariana",
];

const RANDOM_STATE = { seed: new Date().getFullYear() };

function randint(a, b, state) {
    // xorshift32
    let x = state.seed |= 0;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    state.seed = x >>> 0;   // store updated seed (ensure uint32)
    return a + (state.seed % (b - a + 1));
}

function shuffle(collection, state) {
    return structuredClone(collection).sort((_, __) => randint(0, 1, state) * 2 - 1);
}

const drawsPerParticipant = 2;

const draws = {};
for (let participant of PARTICIPANTS) {
    draws[participant] = [];
}

for (let participant of PARTICIPANTS) {
    let candidateGifters = PARTICIPANTS.filter(p => draws[p].length < drawsPerParticipant && p != participant);
    let gifters = shuffle(candidateGifters, RANDOM_STATE).splice(0, drawsPerParticipant);
    for (let gifter of gifters)
        draws[gifter].push(participant);
}

for (let participant of PARTICIPANTS) {
    draws[participant].sort();
}