const init = () => {
  const inject = document.createElement('div');

  inject.innerHTML = 'HELLO';
  document.body.appendChild(inject);
}

init();