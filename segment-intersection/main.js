//We get the canvas and set it to full screen.
const segmentCanvas = document.getElementById("segmentCanvas");
segmentCanvas.width = window.innerWidth;
segmentCanvas.height = window.innerHeight;

//Now we draw some segments
const a = { x: 200, y: 100 };
const b = { x: 50, y: 300 };
const c = { x: 150, y: 100 };
const d = { x: 200, y: 300 };
let angle = 0;
//Adding segment details
const drawLabels = (point, label, tbool) => {
  ctx.beginPath();
  ctx.fillStyle = tbool ? "red" : "white";
  ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "15px sans-serif";
  ctx.fillText(label, point.x, point.y);
};

//Create a function to find midpoint of the segments using linear interpolation
const lerp = (pointA, pointB, t) => {
  return pointA + (pointB - pointA) * t;
};

const ctx = segmentCanvas.getContext("2d");
let t = -1;

//Using equation of a line formula we can formulate equaltions and get the intersection.
function getIntersection(pointA, pointB, pointC, pointD) {
  const top =
    (pointD.x - pointC.x) * (pointA.y - pointC.y) -
    (pointD.y - pointC.y) * (pointA.x - pointC.x);
  const bottom =
    (pointD.y - pointC.y) * (pointB.x - pointA.x) -
    (pointD.x - pointC.x) * (pointB.y - pointA.y);
  if (bottom != 0) {
    const t = top / bottom;
    if (t >= 0 && t <= 1) {
      return {
        x: lerp(pointA.x, pointB.x, t),
        y: lerp(pointA.y, pointB.y, t),
        offset: t,
      };
    }
  }
  return null;
}
let mouse = {
  x: 0,
  y: 0,
};
document.onmousemove = (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
};
animate();
function animate() {
  const radius = 50;
  a.x = mouse.x + Math.cos(angle) * radius;
  a.y = mouse.y - Math.sin(angle) * radius;
  b.x = mouse.x - Math.cos(angle) * radius;
  b.y = mouse.y + Math.sin(angle) * radius;
  //   angle += 0.02;
  ctx.clearRect(0, 0, segmentCanvas.width, segmentCanvas.height);
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.moveTo(c.x, c.y);
  ctx.lineTo(d.x, d.y);
  ctx.stroke();

  drawLabels(a, "A");
  drawLabels(b, "B");
  drawLabels(c, "C");
  drawLabels(d, "D");
  const M = {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
  };
  const N = {
    x: lerp(c.x, d.x, t),
    y: lerp(c.y, d.y, t),
  };
  const intersection = getIntersection(a, b, c, d);
  if (intersection) {
    drawLabels(intersection, "I");
  }
  //   drawLabels(M, "M", t < 0 || t > 1);
  //   drawLabels(N, "N", t < 0 || t > 1);
  //   t += 0.005;
  requestAnimationFrame(animate);
}

//Adjusting the t value in lerp will give you the distance in % away from the pointA argument
