class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 6;
    this.friction = 0.05;
    this.angle = 0;

    this.sensor = new Sensor(this);
    this.controls = new Controls();
    this.polygon = {};
    this.crashed = false;
  }

  update(roadBorders) {
    if (!this.crashed) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.crashed = this.#checkCrashed(roadBorders);
    }
    this.sensor.update(roadBorders);
  }
  //We create a method to understand the polygon of the car
  //i.e the area of the car to be considered as offset from intersection of rays to avoid collision.
  #checkCrashed(roadBorders) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (carPolyCrashed(this.polygon, roadBorders[i])) {
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

  draw(ctx) {
    // ctx.save();
    // ctx.translate(this.x, this.y);
    // ctx.rotate(-this.angle);

    // ctx.beginPath();
    // ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    // ctx.fill();

    // ctx.restore();

    //Now we draw the polygon instead of the rectangle:
    if (this.crashed) {
      ctx.fillStyle = "gray";
    } else {
      ctx.fillStyle = "black";
    }
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();
    this.sensor.draw(ctx);
  }
}
