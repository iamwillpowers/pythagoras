class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(right) {
    this.x += right.x;
    this.y += right.y;
  }

  adding(right) {
    return new Point(this.x + right.x, this.y + right.y);
  }

  subtract(right) {
    this.x += right.x;
    this.y += right.y;
  }

  subtracting(right) {
    return new Point(this.x - right.x, this.y - right.y);
  }

  static distance(left, right) {
    const delta = left.subtracting(right);
    return Math.sqrt(delta.x*delta.x + delta.y*delta.y);
  }
}