
const multiply = number => number * 2;
const addString = number => number + ' is my number';
const saveInLocalStorage = number => {
  localStorage.setItem('myNumber', number);
  return number;
};
const insertToDom = text => {
  const body = document.querySelector('body');
  const node = document.createElement('p');
  node.innerHTML = text;

  body.appendChild(node);
};

const number = 5;

Promise.resolve(number)
  .then(multiply)
  .then(addString)
  .then(saveInLocalStorage)
  .then(insertToDom);