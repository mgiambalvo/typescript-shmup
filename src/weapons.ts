//  Our core Bullet class
//  This is a simple Sprite object that we set a few properties on
//  It is fired by all of the Weapon classes
import * as Phaser from 'phaser'

class Bullet extends Phaser.Sprite {
  scaleSpeed: number
  checkWorldBounds: boolean
  outOfBoundsKill: boolean
  exists: boolean
  tracking: boolean

  constructor(game, key) {
		super(game, 0, 0, key);

		this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

		this.anchor.set(0.5);

		this.checkWorldBounds = true;
		this.outOfBoundsKill = true;
		this.exists = false;

		this.tracking = false;
		this.scaleSpeed = 0;
  }

  fire(x, y, angle, speed, gx, gy) {
		gx = gx || 0;
		gy = gy || 0;

		this.reset(x, y);
		this.scale.set(1);

		this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);

		this.angle = angle;
		this.body.gravity.set(gx, gy);
  }

  update() {
		if (this.tracking) {
				this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
		}

		if (this.scaleSpeed > 0) {
				this.scale.x += this.scaleSpeed;
				this.scale.y += this.scaleSpeed;
		}
  }
}

abstract class Weapon extends Phaser.Group {
  nextFire: number
  bulletSpeed: number
  fireRate: number

  constructor (game, name) {
		super(game, game.world, name, false, true, Phaser.Physics.ARCADE);
  }
}

////////////////////////////////////////////////////
//  A single bullet is fired in front of the ship //
////////////////////////////////////////////////////

export class SingleBullet extends Weapon {
  constructor (game) {
		super(game, 'Single Bullet');

		this.nextFire = 0;
		this.bulletSpeed = 600;
		this.fireRate = 100;

		for (var i = 0; i < 64; i++) {
				this.add(new Bullet(game, 'bullet5'), true);
		}

		return this;
  }

  fire(source) {
		if (this.game.time.time < this.nextFire) { return; }

		var x = source.x + 10;
		var y = source.y + 10;

		this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
		this.nextFire = this.game.time.time + this.fireRate;
  }
}

/////////////////////////////////////////////////////////
//  A bullet is shot both in front and behind the ship //
/////////////////////////////////////////////////////////

export class FrontAndBack extends Weapon {
  constructor(game) {
		super(game, 'Front And Back');

		this.nextFire = 0;
		this.bulletSpeed = 600;
		this.fireRate = 100;

		for (var i = 0; i < 64; i++) {
				this.add(new Bullet(game, 'bullet5'), true);
		}

		return this;
  }

  fire (source) {
		if (this.game.time.time < this.nextFire) { return; }

		var x = source.x + 10;
		var y = source.y + 10;

		this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
		this.getFirstExists(false).fire(x, y, 180, this.bulletSpeed, 0, 0);

		this.nextFire = this.game.time.time + this.fireRate;
  }
}

//////////////////////////////////////////////////////
//  3-way Fire (directly above, below and in front) //
//////////////////////////////////////////////////////

export class ThreeWay extends Weapon {
  constructor(game) {
		super(game, 'Three Way');

		this.nextFire = 0;
		this.bulletSpeed = 600;
		this.fireRate = 100;

		for (var i = 0; i < 96; i++)
		{
				this.add(new Bullet(game, 'bullet7'), true);
		}

		return this;
  }

fire(source) {

		if (this.game.time.time < this.nextFire) { return; }

		var x = source.x + 10;
		var y = source.y + 10;

		this.getFirstExists(false).fire(x, y, 270, this.bulletSpeed, 0, 0);
		this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
		this.getFirstExists(false).fire(x, y, 90, this.bulletSpeed, 0, 0);

		this.nextFire = this.game.time.time + this.fireRate;
};

};

/////////////////////////////////////////////
//  8-way fire, from all sides of the ship //
/////////////////////////////////////////////

export class EightWay extends Weapon {
  constructor(game) {
		super(game, 'Eight Way');

		this.nextFire = 0;
		this.bulletSpeed = 600;
		this.fireRate = 100;

		for (var i = 0; i < 96; i++)
		{
				this.add(new Bullet(game, 'bullet5'), true);
		}

		return this;
  }

fire(source) {

		if (this.game.time.time < this.nextFire) { return; }

		var x = source.x + 16;
		var y = source.y + 10;

		this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
		this.getFirstExists(false).fire(x, y, 45, this.bulletSpeed, 0, 0);
		this.getFirstExists(false).fire(x, y, 90, this.bulletSpeed, 0, 0);
		this.getFirstExists(false).fire(x, y, 135, this.bulletSpeed, 0, 0);
		this.getFirstExists(false).fire(x, y, 180, this.bulletSpeed, 0, 0);
		this.getFirstExists(false).fire(x, y, 225, this.bulletSpeed, 0, 0);
		this.getFirstExists(false).fire(x, y, 270, this.bulletSpeed, 0, 0);
		this.getFirstExists(false).fire(x, y, 315, this.bulletSpeed, 0, 0);

		this.nextFire = this.game.time.time + this.fireRate;
}

}

////////////////////////////////////////////////////
//  Bullets are fired out scattered on the y axis //
////////////////////////////////////////////////////

export class ScatterShot extends Weapon {
  constructor(game) {
		super(game, 'Scatter Shot');

		this.nextFire = 0;
		this.bulletSpeed = 600;
		this.fireRate = 40;

		for (var i = 0; i < 32; i++)
		{
				this.add(new Bullet(game, 'bullet5'), true);
		}

		return this;
  }

fire(source) {

		if (this.game.time.time < this.nextFire) { return; }

		var x = source.x + 16;
		var y = (source.y + source.height / 2) + this.game.rnd.between(-10, 10);

		this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);

		this.nextFire = this.game.time.time + this.fireRate;

}
}

//////////////////////////////////////////////////////////////////////////
//  Fires a streaming beam of lazers, very fast, in front of the player //
//////////////////////////////////////////////////////////////////////////

export class Beam extends Weapon {
  constructor(game) {
		super(game, 'Beam');

		this.nextFire = 0;
		this.bulletSpeed = 1000;
		this.fireRate = 45;

		for (var i = 0; i < 64; i++)
		{
				this.add(new Bullet(game, 'bullet11'), true);
		}

		return this;
  }

fire(source) {

		if (this.game.time.time < this.nextFire) { return; }

		var x = source.x + 40;
		var y = source.y + 10;

		this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);

		this.nextFire = this.game.time.time + this.fireRate;
}
};

/*
///////////////////////////////////////////////////////////////////////
//  A three-way fire where the top and bottom bullets bend on a path //
///////////////////////////////////////////////////////////////////////

Weapon.SplitShot = function (game) {

		Phaser.Group.call(this, game, game.world, 'Split Shot', false, true, Phaser.Physics.ARCADE);

		this.nextFire = 0;
		this.bulletSpeed = 700;
		this.fireRate = 40;

		for (var i = 0; i < 64; i++)
		{
				this.add(new Bullet(game, 'bullet8'), true);
		}

		return this;

};

Weapon.SplitShot.prototype = Object.create(Phaser.Group.prototype);
Weapon.SplitShot.prototype.constructor = Weapon.SplitShot;

Weapon.SplitShot.prototype.fire = function (source) {

		if (this.game.time.time < this.nextFire) { return; }

		var x = source.x + 20;
		var y = source.y + 10;

		this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, -500);
		this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
		this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 500);

		this.nextFire = this.game.time.time + this.fireRate;

};

///////////////////////////////////////////////////////////////////////
//  Bullets have Gravity.y set on a repeating pre-calculated pattern //
///////////////////////////////////////////////////////////////////////

Weapon.Pattern = function (game) {

		Phaser.Group.call(this, game, game.world, 'Pattern', false, true, Phaser.Physics.ARCADE);

		this.nextFire = 0;
		this.bulletSpeed = 600;
		this.fireRate = 40;

		this.pattern = Phaser.ArrayUtils.numberArrayStep(-800, 800, 200);
		this.pattern = this.pattern.concat(Phaser.ArrayUtils.numberArrayStep(800, -800, -200));

		this.patternIndex = 0;

		for (var i = 0; i < 64; i++)
		{
				this.add(new Bullet(game, 'bullet4'), true);
		}

		return this;

};

Weapon.Pattern.prototype = Object.create(Phaser.Group.prototype);
Weapon.Pattern.prototype.constructor = Weapon.Pattern;

Weapon.Pattern.prototype.fire = function (source) {

		if (this.game.time.time < this.nextFire) { return; }

		var x = source.x + 20;
		var y = source.y + 10;

		this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, this.pattern[this.patternIndex]);

		this.patternIndex++;

		if (this.patternIndex === this.pattern.length)
		{
				this.patternIndex = 0;
		}

		this.nextFire = this.game.time.time + this.fireRate;

};

///////////////////////////////////////////////////////////////////
//  Rockets that visually track the direction they're heading in //
///////////////////////////////////////////////////////////////////

Weapon.Rockets = function (game) {

		Phaser.Group.call(this, game, game.world, 'Rockets', false, true, Phaser.Physics.ARCADE);

		this.nextFire = 0;
		this.bulletSpeed = 400;
		this.fireRate = 250;

		for (var i = 0; i < 32; i++)
		{
				this.add(new Bullet(game, 'bullet10'), true);
		}

		this.setAll('tracking', true);

		return this;

};

Weapon.Rockets.prototype = Object.create(Phaser.Group.prototype);
Weapon.Rockets.prototype.constructor = Weapon.Rockets;

Weapon.Rockets.prototype.fire = function (source) {

		if (this.game.time.time < this.nextFire) { return; }

		var x = source.x + 10;
		var y = source.y + 10;

		this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, -700);
		this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 700);

		this.nextFire = this.game.time.time + this.fireRate;

};

////////////////////////////////////////////////////////////////////////
//  A single bullet that scales in size as it moves across the screen //
////////////////////////////////////////////////////////////////////////

Weapon.ScaleBullet = function (game) {

		Phaser.Group.call(this, game, game.world, 'Scale Bullet', false, true, Phaser.Physics.ARCADE);

		this.nextFire = 0;
		this.bulletSpeed = 800;
		this.fireRate = 100;

		for (var i = 0; i < 32; i++)
		{
				this.add(new Bullet(game, 'bullet9'), true);
		}

		this.setAll('scaleSpeed', 0.05);

		return this;

};

Weapon.ScaleBullet.prototype = Object.create(Phaser.Group.prototype);
Weapon.ScaleBullet.prototype.constructor = Weapon.ScaleBullet;

Weapon.ScaleBullet.prototype.fire = function (source) {

		if (this.game.time.time < this.nextFire) { return; }

		var x = source.x + 10;
		var y = source.y + 10;

		this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);

		this.nextFire = this.game.time.time + this.fireRate;

};

/////////////////////////////////////////////
//  A Weapon Combo - Single Shot + Rockets //
/////////////////////////////////////////////

Weapon.Combo1 = function (game) {

		this.name = "Combo One";
		this.weapon1 = new Weapon.SingleBullet(game);
		this.weapon2 = new Weapon.Rockets(game);

};

Weapon.Combo1.prototype.reset = function () {

		this.weapon1.visible = false;
		this.weapon1.callAll('reset', null, 0, 0);
		this.weapon1.setAll('exists', false);

		this.weapon2.visible = false;
		this.weapon2.callAll('reset', null, 0, 0);
		this.weapon2.setAll('exists', false);

};

Weapon.Combo1.prototype.fire = function (source) {

		this.weapon1.fire(source);
		this.weapon2.fire(source);

};

/////////////////////////////////////////////////////
//  A Weapon Combo - ThreeWay, Pattern and Rockets //
/////////////////////////////////////////////////////

Weapon.Combo2 = function (game) {

		this.name = "Combo Two";
		this.weapon1 = new Weapon.Pattern(game);
		this.weapon2 = new Weapon.ThreeWay(game);
		this.weapon3 = new Weapon.Rockets(game);

};

Weapon.Combo2.prototype.reset = function () {

		this.weapon1.visible = false;
		this.weapon1.callAll('reset', null, 0, 0);
		this.weapon1.setAll('exists', false);

		this.weapon2.visible = false;
		this.weapon2.callAll('reset', null, 0, 0);
		this.weapon2.setAll('exists', false);

		this.weapon3.visible = false;
		this.weapon3.callAll('reset', null, 0, 0);
		this.weapon3.setAll('exists', false);

};

Weapon.Combo2.prototype.fire = function (source) {

		this.weapon1.fire(source);
		this.weapon2.fire(source);
		this.weapon3.fire(source);

};
*/
