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
// const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
const n = 1;
const cars = generateCars(n);
let tarzan = cars[0];
if (localStorage.getItem("bestTarzanBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestTarzanBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}

//We add the traffic for our car and also giving dummy controls to the car
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 3),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 3),
  new Car(road.getLaneCenter(2), -200, 30, 50, "DUMMY", 3),
  new Car(road.getLaneCenter(1), -400, 30, 50, "DUMMY", 3),
  new Car(road.getLaneCenter(0), -600, 30, 50, "DUMMY", 3),
  new Car(road.getLaneCenter(2), -600, 30, 50, "DUMMY", 3),
  new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 3),
  new Car(road.getLaneCenter(0), -800, 30, 50, "DUMMY", 3),
  new Car(road.getLaneCenter(1), -1000, 30, 50, "DUMMY", 3),
  new Car(road.getLaneCenter(2), -800, 30, 50, "DUMMY", 3),
  new Car(road.getLaneCenter(2), -1100, 30, 50, "DUMMY", 3),
  new Car(road.getLaneCenter(2), -1400, 30, 50, "DUMMY", 3),
  new Car(road.getLaneCenter(0), -1400, 30, 50, "DUMMY", 3),
  new Car(road.getLaneCenter(1), -1500, 30, 50, "DUMMY", 3),
];

animate();
//Added this block to check collision functionality
/*
document.addEventListener("keypress", (e) => {
  if (e.key === "r") {
    car = new Car(road.getLaneCenter(1), 100, 30, 50);
  }
});*/

//Adding block to save tarzanBrain
function saveTarzanBrain() {
  localStorage.setItem("bestTarzanBrain", JSON.stringify(tarzan.brain));
  saveTarzanBraintoFile(tarzan.brain, "tarzanBrain.json");
}
function clearTarzanBrain() {
  localStorage.removeItem("bestTarzanBrain");
}
function saveTarzanBraintoFile(data, filename) {
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
//Generate Cars to test parallelisation
function generateCars(n) {
  const cars = [];
  for (let i = 0; i < n; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}
function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }
  // car.update(road.borders, traffic);
  tarzan = cars.find((c) => c.y == Math.min(...cars.map((car) => car.y)));
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -tarzan.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "blue");
  }
  // car.draw(carCtx, "white");
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "white");
  }
  carCtx.globalAlpha = 1;
  tarzan.draw(carCtx, "white", true);
  networkCtx.lineDashOffset = -time / 50;
  NetworkVisualiser.drawNetwork(networkCtx, tarzan.brain);
  carCtx.restore();
  requestAnimationFrame(animate);
}
