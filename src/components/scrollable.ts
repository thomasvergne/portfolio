const scrollable = document.querySelector<HTMLDivElement>(".scrollable");

if (!scrollable) {
  throw new Error("Scrollable element not found");
}

scrollable.scrollLeft = (scrollable.scrollWidth - scrollable.clientWidth) / 2;

let isScrolling = false;

scrollable?.addEventListener("mousedown", (e) => {
  e.preventDefault();

  isScrolling = true;
  scrollable.style.cursor = "grabbing";
});

scrollable?.addEventListener("wheel", (e) => {
  const movement = e.deltaX;

  if (Math.abs(movement) < Math.abs(e.deltaY)) return;

  if (movement < 0 && scrollable.scrollLeft === 0) return;
  if (
    movement > 0 &&
    scrollable.scrollLeft === scrollable.scrollWidth - scrollable.clientWidth
  )
    return;

  e.preventDefault();

  scrollable.scrollLeft += movement;
});

scrollable?.addEventListener("mousemove", (e) => {
  if (!isScrolling) return;

  if (e.movementX >= 0 && scrollable.scrollLeft === 0) return;
  if (
    e.movementX <= 0 &&
    scrollable.scrollLeft === scrollable.scrollWidth - scrollable.clientWidth
  )
    return;

  e.preventDefault();

  scrollable.scrollLeft -= e.movementX;
});

scrollable?.addEventListener("mouseup", () => {
  isScrolling = false;
  scrollable.style.cursor = "grab";
});

scrollable?.addEventListener("mouseleave", () => {
  isScrolling = false;
  scrollable.style.cursor = "grab";
});
