const canvas = document.getElementById("carCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9);
//Only allotting controls to main car
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS");
//We add the traffic for our car and also giving dummy controls to the car
const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 3)];

animate();
//Added this block to check collision functionality
/*
document.addEventListener("keypress", (e) => {
  if (e.key === "r") {
    car = new Car(road.getLaneCenter(1), 100, 30, 50);
  }
});*/
function animate() {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  car.update(road.borders, traffic);

  canvas.height = window.innerHeight;

  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.7);

  road.draw(ctx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(ctx, "blue");
  }
  car.draw(ctx, "white");

  ctx.restore();
  requestAnimationFrame(animate);
}
