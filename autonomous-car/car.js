class Car {
  constructor(x, y, width, height, controlType, maxSpeed = 5) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = maxSpeed;
    this.friction = 0.05;
    this.angle = 0;
    this.aiBrain = controlType === "AI";
    if (controlType != "DUMMY") {
      this.sensor = new Sensor(this);
      this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
    }
    this.controls = new Controls(controlType);
    this.polygon = {};
    this.crashed = false;
  }

  update(roadBorders, traffic) {
    if (!this.crashed) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.crashed = this.#checkCrashed(roadBorders, traffic);
    }
    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
      const offset = this.sensor.readings.map((s) =>
        s == null ? 0 : 1 - s.offset
      );
      const outputs = NeuralNetwork.feedForward(offset, this.brain);
      if (this.aiBrain) {
        this.controls.forward = outputs[0];
        this.controls.left = outputs[1];
        this.controls.right = outputs[2];
        this.controls.reverse = outputs[3];
      }
    }
  }
  //We create a method to understand the polygon of the car
  //i.e the area of the car to be considered as offset from intersection of rays to avoid collision.
  #checkCrashed(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (carPolyCrashed(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      if (carPolyCrashed(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    return false;
  }
  #createPolygon() {
    const points = [];
    const radius = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);
    //top right corner
    points.push({
      x: this.x - radius * Math.sin(this.angle - alpha),
      y: this.y - radius * Math.cos(this.angle - alpha),
    });
    //top left corner
    points.push({
      x: this.x - radius * Math.sin(this.angle + alpha),
      y: this.y - radius * Math.cos(this.angle + alpha),
    });
    //bottom right corner
    points.push({
      x: this.x - radius * Math.sin(Math.PI + this.angle - alpha),
      y: this.y - radius * Math.cos(Math.PI + this.angle - alpha),
    });
    //bottom left corner
    points.push({
      x: this.x - radius * Math.sin(Math.PI + this.angle + alpha),
      y: this.y - radius * Math.cos(Math.PI + this.angle + alpha),
    });
    return points;
  }
  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }

    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  draw(ctx, color, flag = false) {
    // ctx.save();
    // ctx.translate(this.x, this.y);
    // ctx.rotate(-this.angle);

    // ctx.beginPath();
    // ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    // ctx.fill();

    // ctx.restore();

    //Now we draw the polygon instead of the rectangle:
    if (this.crashed) {
      ctx.fillStyle = "black";
    } else {
      ctx.fillStyle = color;
    }
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();
    if (this.sensor && flag) {
      this.sensor.draw(ctx);
    }
  }
}
