import { dataLevels } from '../data/Levels';
import { buildLevelsBlock, reloadCompleteLevels, selectLevel } from './buildLevelBlock';
import { IProgress, initializeProgress, loadProgress, saveProgress } from './progressLevels';

let helpInfoElement: HTMLElement | null;
function setFocus(): void {
  document.querySelector('.game-setting')!.addEventListener('click', () => {
    const input: HTMLElement | null = document.querySelector('.input-code');
    if (input) input.focus();
  });
}

let tableWidth: number | null = null;
function setHelpPositionAndText(target: HTMLElement, hoverTarget: HTMLElement): void {
  const targetText = Array.from(target.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent)
    .join('\n...\n');
  const hoverTargetText = Array.from(hoverTarget.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent)
    .join('\n\t...\n');

  if (target.classList.contains('child-food')) target = target.parentElement!;
  else if (target.classList.contains('child-mark')) {
    target = target.parentElement!;
    hoverTarget = hoverTarget.parentElement!;
  }

  if (!tableWidth)
    // cache table width
    tableWidth = (document.querySelector('.table-foods')! as HTMLElement).offsetWidth;

  const helpElementWidth = helpInfoElement!.offsetWidth;
  let leftPosition = 0;

  if (target.classList.contains('mark')) {
    helpInfoElement!.innerText = targetText;
    leftPosition = hoverTarget.offsetLeft;
    leftPosition += (hoverTarget.offsetWidth - helpElementWidth) / 2;
  } else {
    helpInfoElement!.innerText = hoverTargetText;
    leftPosition = target.offsetLeft;
    leftPosition += (target.offsetWidth - helpElementWidth) / 2;
  }

  leftPosition = Math.max(leftPosition, 0);
  leftPosition = Math.min(leftPosition, tableWidth - helpElementWidth);

  helpInfoElement!.style.left = `${leftPosition}px`;
}

// border hover
function setColorByHover(classElements: string, hoverElements: string, isChild = false) {
  const marks: NodeListOf<Element> = document.querySelectorAll(`.${classElements}`);
  if (marks) {
    marks.forEach((mark: Element) => {
      mark.addEventListener('mouseenter', (e: Event) => {
        const target = e.target as HTMLElement;
        const marksParent = target.parentNode as HTMLElement;
        const index = isChild
          ? Array.from(document.querySelectorAll(`.${classElements}`)).indexOf(mark)
          : Array.from(marksParent.children).indexOf(target);
        const hoverElement = document.querySelectorAll(`.${hoverElements}`)[index] as HTMLElement;
        if (!hoverElement.classList.contains('._hovered')) {
          hoverElement.classList.add('_hovered');
          target.classList.add('_hovered');
          if (helpInfoElement) {
            helpInfoElement.classList.add('help');
            setHelpPositionAndText(target, hoverElement);
          }
        }
        if (isChild) {
          const parentHoverElement = hoverElement.parentNode as HTMLElement;
          marksParent.classList.toggle('_hovered');
          parentHoverElement.classList.toggle('_hovered');
          if (helpInfoElement) {
            helpInfoElement.classList.add('help');
          }
        }
      });

      mark.addEventListener('mouseleave', (e: Event) => {
        const target = e.target as HTMLElement;
        const marksParent = target.parentNode as HTMLElement;
        const index = isChild
          ? Array.from(document.querySelectorAll(`.${classElements}`)).indexOf(mark)
          : Array.from(marksParent.children).indexOf(target);
        const hoverElement = document.querySelectorAll(`.${hoverElements}`)[index] as HTMLElement;
        if (!hoverElement.classList.contains('._hovered')) {
          hoverElement.classList.remove('_hovered');
          target.classList.remove('_hovered');
        }
        if (isChild) {
          const parentHoverElement = hoverElement.parentElement as HTMLElement;
          marksParent.classList.add('_hovered');
          parentHoverElement.classList.add('_hovered');
          if (helpInfoElement) {
            if (parentHoverElement.classList.contains('food')) {
              setHelpPositionAndText(target.parentElement!, parentHoverElement);
            }
            if (parentHoverElement.classList.contains('mark')) setHelpPositionAndText(target, parentHoverElement);
          }
        } else {
          if (helpInfoElement) {
            helpInfoElement.classList.remove('help');
          }
        }
      });
    });
  }
}

function checkAnswer(): void {
  const input: HTMLInputElement | null = document.querySelector('.input-code');
  let level = localStorage.getItem('level');
  let numLevel = level ? +level : 0;
  if (input) {
    // animate
    const target: string = dataLevels[numLevel].target;
    const value = input.value;
    if (value === target) {
      const targets: NodeListOf<HTMLElement> = document.querySelectorAll('.food_target')!;
      targets.forEach((target) => target.classList.add('win'));
      numLevel = numLevel + 1 >= dataLevels.length ? 0 : numLevel + 1;
      localStorage.setItem('level', numLevel.toString());
      const progress: IProgress | null = loadProgress();
      if (progress) {
        progress[`${numLevel}`] = true;
        saveProgress(progress);
      }
      document.dispatchEvent(new CustomEvent('nextLevel'));
      input.value = '';
      return;
    } else if (!document.querySelector('.win')) {
      const code = document.querySelector('.code')!;
      code.classList.add('wrong');
      setTimeout(() => {
        code.classList.remove('wrong');
      }, 500);
    }
  }
}

function setChecksToWin(): void {
  const button: HTMLElement | null = document.querySelector('.enter-button');
  if (button) {
    button.addEventListener('click', () => {
      button.classList.add('enter_press');
      checkAnswer();
    });
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        button.classList.add('enter_press');
        checkAnswer();
        setTimeout(() => {
          button.classList.remove('enter_press');
        }, 100);
      }
    });
  }
}

function setHoverForAllElements(food: string, mark: string) {
  // Parent
  setColorByHover(food, mark);
  setColorByHover(mark, food);
  // Child
  setColorByHover(`child-${food}`, `child-${mark}`, true);
  setColorByHover(`child-${mark}`, `child-${food}`, true);
}

function removeInputAnswer(input: HTMLInputElement): Promise<void> {
  return new Promise<void>((resolve) => {
    if (input.value.length > 0) {
      activePromise = true;
      const interval = setInterval(() => {
        if (input.value.length > 0) input.value = input.value.slice(0, -1);
        else {
          clearInterval(interval);
          resolve();
          activePromise = false;
        }
      }, 150);
    } else resolve();
  });
}

function writeInputAnswer(input: HTMLInputElement, target: string): Promise<void> {
  return new Promise<void>((resolve) => {
    let currentIndex = 0;
    activePromise = true;
    const interval = setInterval(() => {
      if (currentIndex < target.length) {
        input.value += target[currentIndex];
        currentIndex++;
      } else {
        clearInterval(interval);
        resolve();
        activePromise = false;
      }
    }, 250);
  });
}

let activePromise: boolean = false;
document.querySelector('.game-help-btn')?.addEventListener('click', () => {
  const input: HTMLInputElement | null = document.querySelector('.input-code');
  if (input) {
    input.focus();
    const level = localStorage.getItem('level');
    let numLevel = level ? +level : 0;
    const target = dataLevels[numLevel].target;
    if (!activePromise && input.value !== target) {
      removeInputAnswer(input).then(() => writeInputAnswer(input, target));
    }
  }
});

document.querySelector('.reset-btn')?.addEventListener('click', () => {
  initializeProgress();
  reloadCompleteLevels();
});

export default function setEvents(): void {
  helpInfoElement = document.querySelector('.info');
  setFocus();
  setHoverForAllElements('food', 'mark');
  setChecksToWin();
  buildLevelsBlock();
}
