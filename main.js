import "./style.css";

import Phaser from "phaser";

import sky from "/assets/sky.png";
import star from "/assets/star.png";
import bomb from "/assets/bomb.png";
import platform from "/assets/platform.png";
import dude from "/assets/dude.png";
import jump from "/audio/jump.mp3";
import explosion from "/audio/explosion.mp3";
import eat from "/audio/eat.mp3";

let player,
  platforms,
  cursors,
  stars,
  score,
  scoreText,
  bombs,
  gameOver,
  jumpSound,
  explosionSound,
  eatSound;

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload,
    create,
    update,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image("sky", sky);
  this.load.image("star", star);
  this.load.image("bomb", bomb);
  this.load.image("platform", platform);
  this.load.spritesheet("dude", dude, {
    frameWidth: 32,
    frameHeight: 48,
  });

  this.load.audio("jump", jump);
  this.load.audio("explosion", explosion);
  this.load.audio("eat", eat);
}

function create() {
  gameOver = false;

  jumpSound = this.sound.add("jump");
  explosionSound = this.sound.add("explosion");
  eatSound = this.sound.add("eat");

  this.add.image(400, 300, "sky");
  score = 0;
  scoreText = this.add.text(16, 16, "Score: 0", {
    fontSize: "32px",
    fill: "#000",
  });

  platforms = this.physics.add.staticGroup();

  platforms.create(400, 568, "platform").setScale(2).refreshBody();
  platforms.create(600, 400, "platform");
  platforms.create(50, 250, "platform");
  platforms.create(750, 220, "platform");

  player = this.physics.add.sprite(100, 450, "dude");
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20,
  });
  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  this.physics.add.collider(player, platforms);

  cursors = this.input.keyboard.createCursorKeys();

  stars = this.physics.add.group({
    key: "star",
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 },
  });
  stars.children.iterate((child) => {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });
  this.physics.add.collider(stars, platforms);
  this.physics.add.overlap(player, stars, collectStar, null, this);

  bombs = this.physics.add.group();
  this.physics.add.collider(player, bombs, hitBomb, null, this);
  this.physics.add.collider(platforms, bombs);
}

function update() {
  // ! Game over
  if (gameOver) {
    return;
  }

  // ! Move left
  if (cursors.left.isDown) {
    player.setVelocityX(-160);

    player.anims.play("left", true);
  }

  // ! Move right
  if (cursors.right.isDown) {
    player.setVelocityX(160);

    player.anims.play("right", true);
  }

  // ! Stop
  if (cursors.left.isUp && cursors.right.isUp) {
    player.setVelocityX(0);

    player.anims.play("turn");
  }

  // ! Jump
  if (cursors.up.isDown && player.body.touching.down) {
    jumpSound.play();
    player.setVelocityY(-330);
  }
}

function collectStar(player, star) {
  eatSound.play();
  star.disableBody(true, true);

  score++;
  scoreText.setText("Score: " + score);

  if (stars.countActive(true) === 0) {
    stars.children.iterate((child) => {
      child.enableBody(true, child.x, 0, true, true);
    });

    const x =
      player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);

    const bomb = bombs.create(x, 16, "bomb");
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
  }
}

function hitBomb(player, bomb) {
  explosionSound.play();
  this.physics.pause();
  player.setTint(0xff0000);
  player.anims.play("turn");
  gameOver = true;
}
