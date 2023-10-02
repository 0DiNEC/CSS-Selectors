import { dataLevels, ILevels } from '../data/Levels'
import buildFood from './buildSelector';

function loadMark(markCodesArr: string): void {
  const isMarkCode = document.querySelector('.mark-code');
  if (isMarkCode) isMarkCode.remove();


  const markCodeBack: HTMLElement | null = document.querySelector('.mark-code_background');

  if (markCodeBack) {
    const markCode: HTMLElement = document.createElement('div');
    markCode.classList.add('mark-code');

    const template = markCodesArr.split('\n');
    for (let i: number = 0; i < template.length; i++) {
      const parentMark: HTMLElement = document.createElement('div');
      parentMark.classList.add('mark');
      if (template[i].trim() !== "") {
        if (template[i].trim().slice(-2) !== "/>") {
          parentMark.insertAdjacentText('afterbegin', template[i])
          const childMark: HTMLElement = document.createElement('div');
          childMark.classList.add('child-mark');
          childMark.textContent = template[i + 1];
          i += 2;
          parentMark.appendChild(childMark);
          parentMark.insertAdjacentText('beforeend', template[i]);
          markCode.appendChild(parentMark);
        }
        else {
          parentMark.textContent = template[i];
          markCode.appendChild(parentMark);
        }
      }
    }

    markCode.insertAdjacentText('afterbegin', '<div class="table">');
    markCode.insertAdjacentText('beforeend', '</div>');
    markCodeBack.appendChild(markCode);
  }
}

function loadHelper(title: string): void {
  const task: HTMLElement | null = document.querySelector('.game-task');
  if (task)
    task.textContent = title;
}

export default function loadLevel(level: number): void {
  const currentLevel: ILevels = dataLevels[level];
  loadHelper(currentLevel.title);
  loadMark(currentLevel.markCode);
  buildFood(currentLevel.markCode, currentLevel.target);
}
