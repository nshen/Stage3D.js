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

		public name:string = "null" ; //for debug

		// if this is set, custom behaviors are run
		public aiFunction : Function;
		// the AI routines might want access to the entity manager
		public gfx:EntityManager;
		// AI needs to have access to time passing (in seconds)
		public age:number = 0;
		public fireTime:number = 0;
		public fireDelayMin:number = 1;
		public fireDelayMax:number = 6;
		// an array of points defining a movement path for the AI
		public aiPathWaypoints:any[];
		// how fast we travel from one spline node to the next in seconds
		public pathNodeTime:number = 1;
		// these offsets are added to the sprite location
		// so that ships move around but eventually scroll offscreen
		public aiPathOffsetX:number = 0;
		public aiPathOffsetY:number = 0;
		// how much big the path is (max)
		public aiPathSize:number = 128;
		// how many different nodes in the path
		public aiPathWaypointCount:number = 8;


		private _speedX : number;
		private _speedY : number;
		private _sprite:GPUSprite.Sprite; //LiteSprite

		public active : boolean = true;

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


		//v5---------------------------------------
		// v5 stats used by the player entity
		// but could optionally be used by some enemies too
		public health:number = 100;
		// how many reserve ships you have until game over
		public lives:number = 3;
		// matches the score on the GUI
		public score:number = 0;
		// what level the player is on
		public level:number = 0;
		// when you get hit, for a short while you are impervious
		// to damage (otherwise nearby ships could add up to instant death)
		public invulnerabilityTimeLeft:number = 0;
		public invulnerabilitySecsWhenHit:number = 4;
		// when you die, change levels or get to a game over state,
		// this is the period of time that the GUI tells you
		// before switching to the new state
		public transitionTimeLeft:number = 0;
		public transitionSeconds:number = 5;
		// how much damage the player will take when getting hit
		// since the player has 100HP, 49 means you can be hit 3x
		public damage:number = 49;

		public collidepoints:number = 25; // score earned if destroyed

		constructor(gs:GPUSprite.Sprite ,myManager:shooter.EntityManager)
		{
			this._sprite = gs;
			this.gfx = myManager;
			this._speedX = 0.0;
			this._speedY = 0.0;
			this.fireTime = (Math.random() * (this.fireDelayMax - this.fireDelayMin)) + this.fireDelayMin;
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
			this.owner = null;
			this.age = 0 ;
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

		// Calculates 2D cubic Catmull-Rom spline.
		// See http://www.mvps.org/directx/articles/catmull/
		public spline (p0:{x:number;y:number},
					   p1:{x:number;y:number},
					   p2:{x:number;y:number},
					   p3:{x:number;y:number},
					   t:number):{x:number;y:number}
		{
			var xx:number = 0.5 * ((2 * p1.x) +
				t * (( -p0.x + p2.x) +
				t * ((2 * p0.x -5 * p1.x +4 * p2.x -p3.x) +
				t * ( -p0.x +3 * p1.x -3 * p2.x +p3.x))));

			var yy:number = 0.5 * ((2 * p1.y) +
				t * (( -p0.y + p2.y) +
				t * ((2 * p0.y -5 * p1.y +4 * p2.y -p3.y) +
				t * (  -p0.y +3 * p1.y -3 * p2.y +p3.y))))

			return {x:xx,y:yy};

		}



		// generate a random path
		public generatePath():void
		{
			//console.log("Generating AI path");
			this.aiPathWaypoints = [];
			var N:number = this.aiPathWaypointCount;
			for (var i:number = 0; i < N; i++)
			{
				this.aiPathWaypoints.push ( {x:this.aiPathSize * Math.random(),
											 y:this.aiPathSize * Math.random()});
			}
		}

		// find the point on a spline at ratio (0 to 1)
		public calculatePathPosition(ratio:number = 0):{x:number;y:number}
		{
			var i:number = Math.floor(ratio);
			var pointratio:number = ratio - i;
			//console.log(ratio + ' ratio = path point ' + i + ' segment ratio ' + pointratio);
			var p0:{x:number;y:number} = this.aiPathWaypoints [(i -1 + this.aiPathWaypoints.length) % this.aiPathWaypoints.length];
			var p1:{x:number;y:number} = this.aiPathWaypoints [i % this.aiPathWaypoints.length];
			var p2:{x:number;y:number} = this.aiPathWaypoints [(i +1 + this.aiPathWaypoints.length) % this.aiPathWaypoints.length];
			var p3:{x:number;y:number} = this.aiPathWaypoints [(i +2 + this.aiPathWaypoints.length) % this.aiPathWaypoints.length];
			// figure out current position
			var q:{x:number;y:number} = this.spline (p0, p1, p2, p3, pointratio);
			return q;
		}

		///////////////////////
		// optional AI routines
		///////////////////////

		// we could optionally implement many different
		// versions of this routine with different randomness
		public maybeShoot(bulletNum:number = 1,
						  delayMin:number = NaN,
						  delayMax:number = NaN):void
		{
			// is it time to shoot a bullet?
			if (this.fireTime < this.age)
			{
				// if delay parameters were not set, use class defaults
				if (isNaN(delayMin)) delayMin = this.fireDelayMin;
				if (isNaN(delayMax)) delayMax = this.fireDelayMax;

				// shoot one from the current location
				this.gfx.shootBullet(bulletNum, this);
				// randly choose the next time to shoot
				this.fireTime = this.age + (Math.random() * (delayMax - delayMin)) + delayMin;
			}
		}

		// moves forward and points at current destination based on speed
		public straightAI(seconds:number):void
		{
			this.age += seconds;
			this.maybeShoot(1);
			this.sprite.rotation = this.gfx.pointAtRad(this.speedX, this.speedY) - (90 * this.gfx.DEGREES_TO_RADIANS);
		}

		public wobbleAI(seconds:number):void
		{
			this.age += seconds;
			this.maybeShoot(1);
			this.aiPathOffsetY = (Math.sin(this.age * 2) / Math.PI) * 128;
		}

		// simply point at the player: good for sentry guns
		public sentryAI(seconds:number):void
		{
			this.age += seconds;
			this.maybeShoot(3,3,6);
			if (this.gfx.thePlayer)
				this.sprite.rotation = this.gfx.pointAtRad(
					this.gfx.thePlayer.sprite.position.x - this.sprite.position.x,
					this.gfx.thePlayer.sprite.position.y - this.sprite.position.y)
				- (90 * this.gfx.DEGREES_TO_RADIANS);
		}

		// move around on a random spline path
		// in future versions, you could upgrade this function
		// to (instead of random) follow a predefined array of points
		// that were designed by hand in code (or even in the level editor!)
		public droneAI(seconds:number):void
		{
			//console.log('droneAI');

			this.age += seconds;
			this.maybeShoot(1);

			// movement style inspired by Galaga, R-Type, Centipede
			// performed by easing through a catmull-rom spline curve
			// defined by an array of points
			if (this.aiPathWaypoints == null)
				this.generatePath();

			// how many spline nodes have we passed? (loops around to beginning)
			var pathProgress:number = this.age / this.pathNodeTime;

			var newPos:{x:number;y:number} = this.calculatePathPosition(pathProgress);

			// point in the correct direction
			//sprite.rotation = gfx.pointAtRad(newPos.x-sprite.position.x,newPos.y-sprite.position.y) - (90*gfx.DEGREES_TO_RADIANS);
			this.sprite.rotation = this.gfx.pointAtRad(newPos.x-this.aiPathOffsetX,newPos.y-this.aiPathOffsetY) - (90 * this.gfx.DEGREES_TO_RADIANS);

			// change path offset location
			// this is added to the sprite scrolling location
			// so that ships eventually move offscreen
			// sprite.position.x = newPos.x;
			// sprite.position.y = newPos.y;

			this.aiPathOffsetX = newPos.x;
			this.aiPathOffsetY = newPos.x;

		}

	} // end class
} // enDate package