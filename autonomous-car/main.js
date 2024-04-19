const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
//Only allotting controls to main car
// const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS");
//This will give the car a NN controls
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
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
function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  car.update(road.borders, traffic);

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -car.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "blue");
  }
  car.draw(carCtx, "white");
  carCtx.restore();
  networkCtx.lineDashOffset = -time / 50;
  NetworkVisualiser.drawNetwork(networkCtx, car.brain);
  carCtx.restore();
  requestAnimationFrame(animate);
}
