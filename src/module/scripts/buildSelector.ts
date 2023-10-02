import '../css/food.css';

export default function buildFood(foods: string, target: string): void {
  const isFoodsObject = document.querySelector(`.table-foods`);
  if (isFoodsObject) isFoodsObject.remove();

  const foodsArr: string[] = foods.split('\n').filter((item: string) => item.trim().length > 0);
  const table = document.querySelector('.table');

  if (table) {
    function makeFoodElement(arr: string[], isChild = false, basicName = 'food'): HTMLElement {
      const foodRes = document.createElement('div');
      foodRes.classList.add('table-foods');
      for (let i = 0; i < arr.length; i++) {
        const foodNameStr = `${arr[i].trim().replace('</', '').replace('<', '')}`;

        const idAtr = foodNameStr.match(/id="([^"]+)"/);
        const classAtr = foodNameStr.match(/class="([^"]+)"/);
        const hasChild = foodNameStr.slice(-2) !== '/>' ? true : false;

        let foodName: string = foodNameStr.replace('/>', '').replace('>', '');
        let foodID: string = '';
        let foodClass: string = '';
        if (idAtr) {
          foodID = idAtr[1];
          foodName = foodName.replace(`id="${foodID}"`, '').trim();
        }
        if (classAtr) {
          foodClass = classAtr[1];
          foodName = foodName.replace(`class="${foodClass}"`, '').trim();
        }
        let food: HTMLElement = document.createElement(foodName);
        food.classList.add(basicName);
        if (foodName === target) food.classList.add('food_target');
        if (foodID !== '') food.classList.add(foodID);
        if (foodClass !== '') food.classList.add(foodClass);
        if (target[0] === '#' || target[0] === '.')
          if (target === `#${foodID}` || target === `.${foodClass}`) food.classList.add('food_target');
        if (hasChild) {
          const childFood = foodsArr[i + 1];
          food.appendChild(makeFoodElement([childFood], true, 'child-food'));
          i += 2;
        }
        if (isChild) return food;
        foodRes.appendChild(food);
      }
      return foodRes;
    }

    table.appendChild(makeFoodElement(foodsArr));
  }
}
