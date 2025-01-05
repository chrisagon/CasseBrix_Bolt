import { gsap } from 'gsap';
    import { Howl } from 'howler';

    export class Game {
      constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.ball = { x: 0, y: 0, radius: 10, dx: 4, dy: -4 };
        this.paddle = { x: 0, y: 0, width: 100, height: 10 };
        this.bricks = [];
        this.score = 0;
        this.init();
      }

      init() {
        this.setup();
        this.addEventListeners();
        this.gameLoop();
      }

      setup() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height - 30;
        this.paddle.x = (this.canvas.width - this.paddle.width) / 2;
        this.paddle.y = this.canvas.height - 20;
        this.createBricks();
      }

      createBricks() {
        const rows = 5;
        const cols = 10;
        const brickWidth = 75;
        const brickHeight = 20;
        const padding = 10;
        const offsetTop = 30;
        const offsetLeft = 30;

        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            const brickX = c * (brickWidth + padding) + offsetLeft;
            const brickY = r * (brickHeight + padding) + offsetTop;
            this.bricks.push({ x: brickX, y: brickY, status: 1 });
          }
        }
      }

      addEventListeners() {
        window.addEventListener('mousemove', (e) => {
          const relativeX = e.clientX - this.canvas.offsetLeft;
          if (relativeX > 0 && relativeX < this.canvas.width) {
            this.paddle.x = relativeX - this.paddle.width / 2;
          }
        });
      }

      gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
      }

      update() {
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        // Collision avec les bords gauche et droit
        if (this.ball.x + this.ball.radius > this.canvas.width || this.ball.x - this.ball.radius < 0) {
          this.ball.dx = -this.ball.dx;
        }

        // Collision avec le bord supérieur
        if (this.ball.y - this.ball.radius < 0) {
          this.ball.dy = -this.ball.dy;
        }

        // Collision avec la raquette
        if (
          this.ball.y + this.ball.radius > this.paddle.y &&
          this.ball.x > this.paddle.x &&
          this.ball.x < this.paddle.x + this.paddle.width
        ) {
          this.ball.dy = -this.ball.dy;
        }

        // Collision avec le bord inférieur (perte de balle)
        if (this.ball.y + this.ball.radius > this.canvas.height) {
          this.resetBall();
        }

        // Collision avec les briques
        this.bricks.forEach((brick) => {
          if (brick.status === 1) {
            if (
              this.ball.x > brick.x &&
              this.ball.x < brick.x + 75 &&
              this.ball.y > brick.y &&
              this.ball.y < brick.y + 20
            ) {
              this.ball.dy = -this.ball.dy;
              brick.status = 0;
              this.score++;
            }
          }
        });
      }

      draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dessiner la balle
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#00ffcc';
        this.ctx.fill();
        this.ctx.closePath();

        // Dessiner la raquette
        this.ctx.beginPath();
        this.ctx.rect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
        this.ctx.fillStyle = '#ff00cc';
        this.ctx.fill();
        this.ctx.closePath();

        // Dessiner les briques
        this.bricks.forEach((brick) => {
          if (brick.status === 1) {
            this.ctx.beginPath();
            this.ctx.rect(brick.x, brick.y, 75, 20);
            this.ctx.fillStyle = '#cc00ff';
            this.ctx.fill();
            this.ctx.closePath();
          }
        });

        // Afficher le score
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText(`Score: ${this.score}`, 8, 20);
      }

      resetBall() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height - 30;
        this.ball.dx = 4;
        this.ball.dy = -4;
      }
    }
