import './style.css';
import loadLevel from './module/scripts/levelLoader';
import setEvents from './module/scripts/gameSettingEvents';
import { selectLevel } from './module/scripts/buildLevelBlock';
import { initializeProgress, loadProgress } from './module/scripts/progressLevels';

function main(): void {
  let saveLevel: string | null = localStorage.getItem('level');
  if (!saveLevel) {
    // current level
    saveLevel = '0';
    localStorage.setItem('level', saveLevel);
  }
  if (!loadProgress()) initializeProgress();

  loadLevel(+saveLevel);
  setEvents();
  selectLevel(saveLevel);
}

main();

document.addEventListener('rebuild', () => {
  main();
  const input: HTMLInputElement | null = document.querySelector('.input-code');
  if (input) input.value = '';
});

document.addEventListener('nextLevel', () => {
  setTimeout(() => main(), 1000);
});
