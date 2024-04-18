// Get the element
const element = document.querySelector('.show')!

// Create the observer
const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry: IntersectionObserverEntry) => {
    if (entry.isIntersecting) {
      // Element is in the viewport, add the class
      entry.target.classList.add('in-viewport')
    } else {
      // Element is not in the viewport, remove the class
      entry.target.classList.remove('in-viewport')
    }
  })
})

// Start observing the element
observer.observe(element)

// const observer = new IntersectionObserver((entries) => {
//     entries.forEach((entry) => {
//         console.log(entry);
//         if (entry.isIntersecting) {
//         entry.target.classList.add("show");
//         } else {
//                 entry.target.classList.remove("show");
//                }
//     });
//     }
// );

// const hiddenElements = document.querySelectorAll(".hidden");
// hiddenElements.forEach((element) => {
//     observer.observe(element);
// });
