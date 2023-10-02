interface ILevels {
  title: string;
  target: string;
  markCode: string;
}

const dataLevels: ILevels[] = [
  {
    title: 'Select the plates',
    target: 'plate',
    markCode: `
    <plate/>
    <plate/>
    `
  },
  {
    title: 'Select the apple',
    target: 'apple',
    markCode: `
    <plate/>
    <apple/>
    <plate/>
    `
  },
  {
    title: 'Select the plates cool plate',
    target: '#cool-plate',
    markCode: `
    <plate id="cool-plate"/>
    <plate/>
    `
  },
  {
    title: 'Select the gold apple',
    target: '.gold',
    markCode: `
    <apple class="gold"/>
    <apple/>
    <plate/>
    `
  },
  {
    title: 'Select the small egg',
    target: '.small',
    markCode: `
      <plate>
        <egg class="small"/>
      </plate>
      <plate>
        <egg class="ugly"/>
      </plate>
    `
  },
  {
    title: 'Select the all small objects',
    target: '.small',
    markCode: `
      <plate>
        <egg class="small"/>
      </plate>
      <apple class="small"/>
      <plate>
        <egg class="ugly"/>
      </plate>
    `
  },
  {
    title: 'Select all apples',
    target: 'apple',
    markCode: `
      <apple class="small"/>
      <apple class="gold"/>
      <apple class="ugly"/>
    `
  },
  {
    title: 'Select all ugly apples',
    target: '.ugly',
    markCode: `
      <apple/>
      <apple/>
      <apple class="ugly"/>
    `
  },
  {
    title: 'Select all plates',
    target: 'plate',
    markCode: `
      <plate>
      <apple/>
      </plate>
      <plate/>
      <plate>
      <apple class="ugly"/>
      </plate>
    `
  },
  {
    title: 'Select only plate with gold apple',
    target: '#golden-apple',
    markCode: `
      <plate id="golden-apple">
      <apple class="gold"/>
      </plate>
      <plate class="golden"/>
      <plate class="golden-apple">
      <apple class="ugly"/>
      </plate>
    `
  }
];

export { ILevels, dataLevels };
