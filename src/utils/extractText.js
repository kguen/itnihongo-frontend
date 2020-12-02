const extractContent = str => {
  const span = document.createElement('span');
  span.innerHTML = str;
  return span.textContent || span.innerText;
};

export default extractContent;
