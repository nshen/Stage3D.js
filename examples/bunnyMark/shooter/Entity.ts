// Stage3D Shoot-em-up Tutorial Part 1
// by Christer Kaitila - www.mcfunkypants.com

// Entity.as
// The Entity class will eventually hold all game-specific entity logic
// for the spaceships, bullets and effects in our game. For now,
// it simply holds a reference to a gpu sprite and a few demo properties.
// This is where you would add hit points, weapons, ability scores, etc.

///<reference path="reference.ts" />

module shooter
{
	export class Entity
	{
		private _speedX : number;
		private _speedY : number;
		private _sprite:GPUSprite.Sprite; //LiteSprite

		public active : boolean = true;

		// if this is set, custom behaviors are run
		public aiFunction : Function;

		// collision detection
		public isBullet:boolean = false; // only these check collisions
		public leavesTrail:boolean = false; //creates <it> particles moves
		public collidemode:number = 0; // 0=none, 1=sphere, 2=box, etc.
		public collideradius:number = 32; // used for sphere collision

		public touching:Entity; // what entity just hit us?
		public owner:Entity; // so your own bullets don't hit you
		public orbiting:Entity; // entities can orbit (circle) others
		public orbitingDistance:number; // how far in px from the orbit center

		//box collision is not implemented (yet)

		// used for particle animation (in units per second)
		public fadeAnim:number = 0;
		public zoomAnim:number = 0;
		public rotationSpeed:number = 0;

		// used to mark whether or not this entity was
		// freshly created or reused from an inactive one
		public recycled:boolean = false;

		constructor(gs:GPUSprite.Sprite = null)
		{
			this._sprite = gs;
			this._speedX = 0.0;
			this._speedY = 0.0;
		}
		
		public die() : void
		{
			// allow this entity to be reused by the entitymanager
			this.active = false;
			// skip all drawing and updating
			this._sprite.visible = false;

			//reset some things that might affect future resuses
			this.leavesTrail = false;
			this.isBullet = false;
			this.touching = null;
			this.collidemode = 0;
		}
		
		public get speedX() : number 
		{
			return this._speedX;
		}
		public set speedX(sx:number)
		{
			this._speedX = sx;
		}
		public get speedY() : number 
		{
			return this._speedY;
		}
		public set speedY(sy:number)
		{
			this._speedY = sy;
		}
		public get sprite():GPUSprite.Sprite
		{	
			return this._sprite;
		}
		public set sprite(gs:GPUSprite.Sprite)
		{
			this._sprite = gs;
		}

		// used for collision callback performed in GameActorpool
		public colliding(checkme:Entity):Entity
		{
			if (this.collidemode == 1) // sphere
			{
				if (this.isCollidingSphere(checkme))
					return checkme;
			}
			return null;
		}

		// simple sphere to sphere collision
		public isCollidingSphere(checkme:Entity):boolean
		{
			// never collide with yourself
			if (this == checkme) return false;
			// only check if these shapes are collidable
			if (!this.collidemode || !checkme.collidemode) return false;
			// don't check your own bullets
			if (checkme.owner == this) return false;
			// don't check things on the same "team"
			if (checkme.owner == this.owner) return false;
			// don't check if no radius
			if (this.collideradius == 0 || checkme.collideradius == 0) return false;

			// this is the simpler way to do it, but it runs really slow
			// var dist:number = Point.distance(sprite.position, checkme.sprite.position);
			// if (dist <= (collideradius+checkme.collideradius))

			// this looks wierd but is 6x faster than the above
			// see: http://www.emanueleferonato.com/2010/10/13/as3-geom-point-vs-trigonometry/
			if (((this.sprite.position.x - checkme.sprite.position.x) *
				(this.sprite.position.x - checkme.sprite.position.x) +
				(this.sprite.position.y - checkme.sprite.position.y) *
				(this.sprite.position.y - checkme.sprite.position.y))
				<=
				(this.collideradius+checkme.collideradius)*(this.collideradius+checkme.collideradius))
			{
				this.touching = checkme; // remember who hit us
				return true;
			}

			// default: too far away
			// console.log("No collision. Dist = "+dist);
			return false;

		}


	} // end class
} // enDate package