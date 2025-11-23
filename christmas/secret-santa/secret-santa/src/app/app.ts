import { Component, OnInit, signal } from '@angular/core';
import { ListSelector } from '../list-selector/list-selector';
import RandomState from './app.model';

@Component({
  selector: 'app-root',
  imports: [ListSelector],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly selectedParticipant = signal<string | null>(null);

  protected readonly PARTICIPANTS = [
    "Jon",
    "Mariana",
    "Tom",
    "Sabina",
    "Ida",
    "Sebastian",
    "Kris",
    "Marta",
    "Mamma",
    "Pappa",
  ]

  protected readonly excludeList: { [key: string]: string[] } = {
    Jon: ["Mariana"],
    Mariana: ["Jon"],
    Tom: ["Sabina"],
    Sabina: ["Tom"],
    Ida: [],
    Sebastian: [],
    Kris: ["Marta"],
    Marta: ["Kris"],
    Mamma: ["Pappa"],
    Pappa: ["Mamma"],
  }

  protected readonly fruits: { [key: string]: string } = {
    Jon: "banan",
    Mariana: "grape",
    Tom: "ananas",
    Sabina: "apple",
    Ida: "kirsebær",
    Sebastian: "jordbær",
    Kris: "banan",
    Marta: "kiwi",
    Mamma: "eple",
    Pappa: "sitron"
  }

  private readonly drawsPerParticipant = 2;

  private readonly BUDGET = 200;
  private readonly BUDGET_MARGIN = 50;
  protected readonly BUDGET_DETAILS = {
    perGift: this.BUDGET,
    perGiftMax: this.BUDGET + this.BUDGET_MARGIN,
    perGiftMin: this.BUDGET - this.BUDGET_MARGIN,
    combinedMax: this.BUDGET * this.drawsPerParticipant + this.BUDGET_MARGIN,
  }

  private readonly RANDOM_STATE: RandomState = { seed: new Date().getFullYear() };
  private readonly draws: { [key: string]: string[] } = {};
  private authenticated = false;

  get selectedParticipantData() {
    return {
      name: this.selectedParticipant() ?? '',
      authenticated: this.authenticated,
      gifters: this.authenticated ? this.draws[this.selectedParticipant() ?? ''] ?? [] : []
    }
  }


  ngOnInit(): void {
    for (let participant of this.PARTICIPANTS) {
      this.draws[participant] = [];
    }

    for (let participant of this.PARTICIPANTS) {
      let candidateGifters = this.PARTICIPANTS.filter(p => (
        this.draws[p].length < this.drawsPerParticipant
        && p != participant
        && !this.excludeList[participant].includes(p)));
      let gifters = shuffle(candidateGifters, this.RANDOM_STATE).splice(0, this.drawsPerParticipant);
      for (let gifter of gifters)
        this.draws[gifter].push(participant);
    }

    for (let participant of this.PARTICIPANTS) {
      this.draws[participant].sort();
    }
  }

  updateSelection(participant: string) {
    this.authenticated = false;
    this.selectedParticipant.set(participant);
    this.scrollDown();
  }

  scrollDown() {
    // Wait for new content to be loaded
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth' // smooth scrolling
      });
    }, 1);
  }

  typeAuthField(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const query = (event.target as HTMLInputElement).value;
      const pwd = this.fruits[this.selectedParticipant() ?? ''];
      this.authenticated = query.toLowerCase() == pwd.toLowerCase();
      if (this.authenticated) {
        this.scrollDown();
      }
    }
  }
}

function randint(a: number, b: number, state: RandomState) {
  // xorshift32
  let x = state.seed |= 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  state.seed = x >>> 0;   // store updated seed (ensure uint32)
  return a + (state.seed % (b - a + 1));
}

function shuffle(collection: string[], state: RandomState) {
  return structuredClone(collection).sort((_, __) => randint(0, 1, state) * 2 - 1);
}