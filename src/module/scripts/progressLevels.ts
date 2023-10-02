interface IProgress {
  [level: string]: boolean;
}

function initializeProgress(): void {
  const progress: IProgress = {};
  for (let i: number = 0; i < 10; i++) progress[`${i}`] = false;
  saveProgress(progress);
}

function loadProgress(): IProgress | null {
  const progress = localStorage.getItem('progress');
  if (progress) {
    return JSON.parse(progress) as IProgress;
  }
  return null;
}

function saveProgress(progress: IProgress): void {
  localStorage.setItem('progress', JSON.stringify(progress));
}

export { initializeProgress, loadProgress, saveProgress, IProgress };
