import "./style.css";

import Phaser from "phaser";

import sky from "/assets/sky.png";
import star from "/assets/star.png";
import bomb from "/assets/bomb.png";
import platform from "/assets/platform.png";
import dude from "/assets/dude.png";

let player, platforms;

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
}

function create() {
  this.add.image(400, 300, "sky");

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
}

function update() {}
