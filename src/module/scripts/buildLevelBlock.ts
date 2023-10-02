import { dataLevels } from '../data/Levels';
import { IProgress, loadProgress } from './progressLevels';

function buildLevelsBlock(): void {
  const isLevelList = document.querySelector('.level-list');
  if (isLevelList) isLevelList.remove();

  const levels: HTMLElement | null = document.querySelector('.levels');
  if (levels) {
    const levelList = document.createElement('div');
    levelList.classList.add('level-list');
    for (let i = 0; i < dataLevels.length; i++) {
      const level = document.createElement('div');
      level.classList.add('level');
      const checkMark = document.createElement('span');
      checkMark.classList.add('check-mark');
      const levelNum = document.createElement('span');
      levelNum.classList.add('level-number');
      levelNum.textContent = (i + 1).toString();
      level.appendChild(checkMark);
      level.appendChild(levelNum);
      level.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const targetChild = target.lastChild as HTMLElement;
        const sNum: string = targetChild.textContent ? (+targetChild.textContent - 1).toString() : '0';
        localStorage.setItem('level', sNum);
        selectLevel(sNum);
        document.dispatchEvent(new CustomEvent('rebuild'));
      });
      levelList.appendChild(level);
    }
    levels.appendChild(levelList);
  }
}

function selectLevel(saveLevel: string): void {
  saveLevel = (+saveLevel + 1).toString();
  const levels: NodeListOf<HTMLElement> = document.querySelectorAll('.level');
  const progress: IProgress | null = loadProgress();
  levels.forEach((level: HTMLElement) => {
    const child = level.lastChild as HTMLElement;
    const levelNumber: string = child.textContent!;
    if (levelNumber === saveLevel) level.classList.add('select');
    else if (level.classList.contains('select')) level.classList.remove('select');
    if (progress) if (progress[levelNumber] && !level.classList.contains('complete')) level.classList.add('complete');
  });
}

function reloadCompleteLevels(): void {
  const levels: NodeListOf<HTMLElement> = document.querySelectorAll('.level');
  levels.forEach((level: HTMLElement) => {
    const child = level.lastChild as HTMLElement;
    if (level.classList.contains('complete')) level.classList.remove('complete');
  });
}

export { buildLevelsBlock, selectLevel, reloadCompleteLevels };
