console.log('linked!');

// A function to set the --vh custom property to the window's inner height
const setViewHeight = () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Run it once on initial load
setViewHeight();

// Run it again whenever the window is resized
window.addEventListener('resize', setViewHeight);