import "./style.css";

import Phaser from "phaser";

import sky from "/assets/sky.png";
import star from "/assets/star.png";
import bomb from "/assets/bomb.png";
import platform from "/assets/platform.png";
import dude from "/assets/dude.png";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload,
    create,
    update,
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

function create() {}

function update() {}
