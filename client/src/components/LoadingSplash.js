import React from "react";

class LoadingSplash extends React.Component {
  state = {
    canvas: {
      x: 0,
      y: 0,
    },
  };

  spinDots = [];

  handleResize = () => {
    this.setState({
      canvas: {
        x: window.innerWidth / 2 - this.Canvas.width / 2,
        y: window.innerHeight / 2 - this.Canvas.height / 2,
      },
    });
  };

  draw = () => {
    const { ctx } = this;

    ctx.font = "40px sans-serif";
    ctx.fillStyle = "black";
    ctx.fillText("Loading...", 65, 160);

    if (this.spinDots.length) {
      this.spinDots.forEach((spinDot, i) => {
        spinDot.x += spinDot.velX;
        spinDot.y += spinDot.velY;

        if (spinDot.x > Math.PI * 2) {
          spinDot.x -= Math.PI * 2;
        }
        if (spinDot.y > Math.PI * 2) {
          spinDot.y -= Math.PI * 2;
        }

        const position = {
          x: this.Canvas.width / 2 + Math.sin(spinDot.x) * spinDot.maxX,
          y: this.Canvas.height / 2 + Math.cos(spinDot.y) * spinDot.maxY,
        };

        ctx.fillStyle = `#${spinDot.color}`;

        if (i % 2) {
          ctx.beginPath();
          ctx.moveTo(position.x, position.y);
          ctx.lineTo(
            this.Canvas.width / 2 +
              Math.sin(this.spinDots[i - 1].x) * this.spinDots[i - 1].maxX,
            this.Canvas.height / 2 +
              Math.cos(this.spinDots[i - 1].y) * this.spinDots[i - 1].maxY
          );
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(position.x, position.y, spinDot.size, 0, Math.PI * 2);
        ctx.fill();
      });
    } else {
      for (let i = 0; i < 16; i++) {
        const spinDot = {
          maxX: Math.random() * 100 + 25,
          maxY: Math.random() * 100 + 25,
          velX: Math.random() * 0.05 + 0.01,
          velY: Math.random() * 0.05 + 0.01,
          x: Math.random() * (Math.PI * 2),
          y: Math.random() * (Math.PI * 2),
          size: Math.random() * 5 + 5,
          color: Math.floor(Math.random() * 16777215).toString(16),
        };
        this.spinDots.push(spinDot);
      }
    }
  };

  componentDidMount() {
    const ctx = (this.ctx = this.Canvas.getContext("2d"));

    this.handleResize();
    window.addEventListener("resize", this.handleResize);

    this.drawInteval = setInterval(() => {
      ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);

      this.draw();
    }, 1000 / 60);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  render() {
    return (
      <div
        style={{
          position: "absolute",
          width: "100vw",
          height: "100vh",
          zIndex: "999",
        }}
        className="purple"
      >
        <canvas
          style={{
            position: "absolute",
            transform: `translate(${this.state.canvas.x}px, ${this.state.canvas.y}px)`,
          }}
          width="300"
          height="300"
          ref={(Canvas) => {
            this.Canvas = Canvas;
          }}
        ></canvas>
      </div>
    );
  }
}

export default LoadingSplash;
