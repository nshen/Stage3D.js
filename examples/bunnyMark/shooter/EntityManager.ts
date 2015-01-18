// Stage3D Shoot-em-up Tutorial Part 1
// by Christer Kaitila - www.mcfunkypants.com

// EntityManager.as
// The entity manager handles a list of all known game entities.
// This object pool will allow for reuse (respawning) of
// sprites: for example, when enemy ships are destroyed,
// they will be re-spawned when <an> needed optimization 
// that increases fps and decreases ram use.
// This is where you would add all in-game simulation steps,
// <gravity> such, movement, collision detection and more.

///<reference path="reference.ts"/>
module shooter
{

	export class EntityManager
	{
		// a particle system class that updates our sprites
		public particles:shooter.GameParticles;

		// so that explosions can be played
		//public sfx:GameSound;

		// the sprite sheet image
		public _spriteSheet:GPUSprite.SpriteSheet;
		private _SpritesPerRow:number = 8;
		private _SpritesPerCol:number = 8;

		// the general size of the player and enemies
		private shipScale:number = 1.5;
		// how fast player bullets go per second
		public bulletSpeed:number = 250;

		// for framerate-independent timings
		public currentFrameSeconds:number = 0;

		// sprite IDs (indexing the spritesheet)
		public spritenumFireball:number = 63;
		public spritenumFireburst:number = 62;
		public spritenumShockwave:number = 61;
		public spritenumDebris:number = 60;
		public spritenumSpark:number = 59;
		public spritenumBullet3:number = 58;
		public spritenumBullet2:number = 57;
		public spritenumBullet1:number = 56;
		public spritenumPlayer:number = 10;
		public spritenumOrb:number = 17;

		// reused for calculation speed
		public DEGREES_TO_RADIANS:number = Math.PI / 180;
		public RADIANS_TO_DEGREES:number = 180 / Math.PI;

		// the player entity - a special case
		public thePlayer:Entity;
		// a "power orb" that orbits the player
		public theOrb:Entity;

		// a reusable pool of entities
		// this contains every known Entity
		// including the contents of the lists below
		public _entityPool :Entity[];
		// these pools contain only certain types of <an> entity optimization for smaller loops
		public allBullets:Entity[];
		public allEnemies:Entity[];

		// all the polygons that make up the scene
		public _batch:GPUSprite.SpriteRenderLayer ; //LiteSpriteBatch


		// for statistics
		public numCreated : number = 0;
		public numReused : number = 0;
		
		public maxX:number;
		public minX:number;
		public maxY:number;
		public minY:number;

		constructor(view:GPUSprite.Rectangle)
		{
			this._entityPool = [];
			this.allBullets = [];
			this.allEnemies = [];
			this.particles = new GameParticles(this);
			this.setPosition(view);
		}
		
		public setPosition(view:GPUSprite.Rectangle):void
		{
			// allow moving fully offscreen before looping around
			this.maxX = view.width + 64;
			this.minX = view.x - 64;
			this.maxY = view.height + 64;
			this.minY = view.y - 64;
		}

		//todo: not work in js
		// this XOR based fast random number generator runs 4x faster
		// than Math.random() and also returns a number from 0 to 1
		// see http://www.calypso88.com/?cat=7
		//private FASTRANDOMTOFLOAT:number = 1 / Number.MAX_VALUE;
		//private fastrandomseed:number = Math.random() * Number.MAX_VALUE;
		//public fastRandom():number
		//{
		//
		//	this.fastrandomseed ^= (this.fastrandomseed << 21);
		//	this.fastrandomseed ^= (this.fastrandomseed >>> 35);
		//	this.fastrandomseed ^= (this.fastrandomseed << 4);
		//	return (this.fastrandomseed * this.FASTRANDOMTOFLOAT);
		//}

		public createBatch(context3D:stageJS.Context3D):GPUSprite.SpriteRenderLayer//LiteSpriteBatch
		{
			var sourceBitmap:HTMLImageElement = lib.ImageLoader.getInstance().get("assets/sprites.png");

			// create a spritesheet with 8x8 (64) sprites on it
			this._spriteSheet = new GPUSprite.SpriteSheet(stageJS.BitmapData.fromImageElement(sourceBitmap), 8, 8);
			
			// Create new render batch 
			this._batch = new GPUSprite.SpriteRenderLayer(context3D, this._spriteSheet);
			return this._batch;
		}
		
		// search the entity pool for unused entities and reuse one
		// if they are all in use, create a brand new one
		public respawn(sprID:number=0):Entity
		{
			var currentEntityCount:number = this._entityPool.length;
			var anEntity:Entity;
			// search for an inactive entity
			for (var i:number = 0; i < currentEntityCount; i++ )
			{
				anEntity = this._entityPool[i];
				if (!anEntity.active && (anEntity.sprite.spriteId == sprID))
				{
					//console.log('Reusing Entity #' + i);
					anEntity.active = true;
					anEntity.sprite.visible = true;
					anEntity.recycled = true;
					this.numReused++;
					return anEntity;
				}
			}
			// none were found so we need to make a new one
			//console.log('Need to create a new Entity #' + i);
			var sprite:GPUSprite.Sprite; //LiteSprite
			sprite = this._batch.createChild(sprID);
			anEntity = new Entity(sprite);
			this._entityPool.push(anEntity); //todo:这里应该死掉再放在pool里效率才会高嘛?
			this.numCreated++;
			return anEntity;
		}


		// this entity is the PLAYER
		public addPlayer(playerController:Function):Entity
		{
			this.thePlayer = this.respawn(10); // sprite #10 looks nice for now
			this.thePlayer.sprite.position.x = 32;
			this.thePlayer.sprite.position.y = this.maxY / 2;
			this.thePlayer.sprite.rotation = 180 * this.DEGREES_TO_RADIANS; // degrees to radians
			this.thePlayer.sprite.scaleX = this.thePlayer.sprite.scaleY = this.shipScale;
			this.thePlayer.speedX = 0;
			this.thePlayer.speedY = 0;
			this.thePlayer.active = true;
			this.thePlayer.aiFunction = playerController;
			this.thePlayer.leavesTrail = true;

			// just for fun, spawn an orbiting "power orb"
			this.theOrb = this.respawn(this.spritenumOrb);
			this.theOrb.rotationSpeed = 720 * this.DEGREES_TO_RADIANS;
			this.theOrb.leavesTrail = true;
			this.theOrb.collidemode = 1;
			this.theOrb.collideradius = 12;
			this.theOrb.isBullet = true;
			this.theOrb.owner = this.thePlayer;
			this.theOrb.orbiting = this.thePlayer;
			this.theOrb.orbitingDistance = 180;

			return this.thePlayer;
		}

		// shoot a bullet (from the player for now)
		public shootBullet(powa:number = 1):Entity
		{
			var anEntity:Entity;

			if(powa == 1)
				anEntity = this.respawn(this.spritenumBullet1);
			else if(powa == 2)
				anEntity = this.respawn(this.spritenumBullet2);
			else
				anEntity = this.respawn(this.spritenumBullet3);

			anEntity.sprite.position.x = this.thePlayer.sprite.position.x + 8;
			anEntity.sprite.position.y = this.thePlayer.sprite.position.y + 4;
			anEntity.sprite.rotation = 180 * this.DEGREES_TO_RADIANS;
			anEntity.sprite.scaleX = anEntity.sprite.scaleY = 1;
			anEntity.speedX = this.bulletSpeed;
			anEntity.speedY = 0;
			anEntity.owner = this.thePlayer;
			anEntity.collideradius = 10;
			anEntity.collidemode = 1;
			anEntity.isBullet = true;

			if(!anEntity.recycled)
				this.allBullets.push(anEntity);
			return anEntity;
		}


		// for this test, create random entities that move 
		// from right to left with random speeds and scales
		public addEntity():void
		{
			var anEntity:Entity;
			var randomSpriteID:number = Math.floor(Math.random() * 55);
			// try to reuse an inactive entity (or create a new one)
			anEntity = this.respawn(randomSpriteID);
			// give it a new position and velocity
			anEntity.sprite.position.x = this.maxX;
			anEntity.sprite.position.y = Math.random() * this.maxY;
			anEntity.speedX = 15 * ((-1 * Math.random() * 10) - 2);
			anEntity.speedY = 15 * ((Math.random() * 5) - 2.5);
			anEntity.sprite.scaleX = this.shipScale;
			anEntity.sprite.scaleY = this.shipScale;
			anEntity.sprite.rotation =  this.pointAtRad(anEntity.speedX,anEntity.speedY) - (90 * this.DEGREES_TO_RADIANS);
			anEntity.collidemode = 1;
			anEntity.collideradius = 16;

			if(!anEntity.recycled)
				this.allEnemies.push(anEntity);
		}

		// returns the angle in radians of two points
		public pointAngle(point1:{x:number;y:number}, point2:{x:number;y:number}):number
		{
			var dx:number = point2.x - point1.x;
			var dy:number = point2.y - point1.y;
			return -Math.atan2(dx,dy); //todo:应该是yx吧
		}

		// returns the angle in degrees of 0,0 to x,y
		public pointAtDeg(x:number, y:number):number
		{
			return -Math.atan2(x,y) * this.RADIANS_TO_DEGREES;
		}

		// returns the angle in radians of 0,0 to x,y
		public pointAtRad(x:number, y:number):number
		{
			return -Math.atan2(x,y);
		}

		public checkCollisions(checkMe:Entity):Entity
		{
			//checkMe is a bullet , a orb or thePlayer
			var anEntity:Entity;
			for(var i:number=0; i< this.allEnemies.length;i++)
			{
				anEntity = this.allEnemies[i];
				if (anEntity.active && anEntity.collidemode)
				{
					if (checkMe.colliding(anEntity))
					{
						//console.log('Collision! checkMe.owner == anEntity.owner is ' + (checkMe.owner == anEntity.owner ? "TRUE!" : "FALSE"));

						//if (this.sfx) sfx.playExplosion(number(fastRandom() * 2 + 1.5)); // todo：声音

						this.particles.addExplosion(checkMe.sprite.position);
						if ((checkMe != this.theOrb) && (checkMe != this.thePlayer))
							checkMe.die(); // the bullet
						if ((anEntity != this.theOrb) && ((anEntity != this.thePlayer)))
							anEntity.die(); // the victim
						return anEntity;
					}
				}
			}
			return null;
		}


		// called every frame: used to update the simulation
		// this is where you would perform AI, physics, etc.

		//currentTime is seconds since the previous frame
		public update(currentTime:number) : void
		{		
			var anEntity:Entity;

			// what portion of a full second has passed since the previous update?
			this.currentFrameSeconds = currentTime / 1000;


			var max:number = this._entityPool.length;
			for(var i:number=0; i < max;i++)
			{
				anEntity = this._entityPool[i];
				if (anEntity.active)
				{
					anEntity.sprite.position.x += anEntity.speedX * this.currentFrameSeconds;
					anEntity.sprite.position.y += anEntity.speedY * this.currentFrameSeconds;

					// the player follows different rules
					if(anEntity.aiFunction != null)
						anEntity.aiFunction(anEntity);
					else
					{ // all other entities use the "demo" logic

						if(anEntity.isBullet && anEntity.collidemode)
							this.checkCollisions(anEntity);

						// entities can orbit other entities
						// (uses their <the> rotation position)
						if (anEntity.orbiting != null)
						{
							anEntity.sprite.position.x = anEntity.orbiting.sprite.position.x + ((Math.sin(anEntity.sprite.rotation/4)/Math.PI) * anEntity.orbitingDistance);
							anEntity.sprite.position.y = anEntity.orbiting.sprite.position.y - ((Math.cos(anEntity.sprite.rotation/4)/Math.PI) * anEntity.orbitingDistance);
						}

						// entities can leave an engine emitter trail
						if (anEntity.leavesTrail)
						{
							// leave a trail of particles
							if (anEntity == this.theOrb)
								this.particles.addParticle(63, anEntity.sprite.position.x, anEntity.sprite.position.y, 0.25, 0, 0, 0.6, NaN, NaN, -1.5, -1);
							else // player
								this.particles.addParticle(63, anEntity.sprite.position.x + 12, anEntity.sprite.position.y + 2, 0.5, 3, 0, 0.6, NaN, NaN, -1.5, -1);

						}
						if ((anEntity.sprite.position.x > this.maxX) ||
							(anEntity.sprite.position.x < this.minX) ||
							(anEntity.sprite.position.y > this.maxY) ||
							(anEntity.sprite.position.y < this.minY))
						{
							// if we go past any edge, become inactive
							// so the sprite can be respawned
							if ((anEntity != this.thePlayer) && (anEntity != this.theOrb))
								anEntity.die();
						}

					}
					if (anEntity.rotationSpeed != 0)
						anEntity.sprite.rotation += anEntity.rotationSpeed * this.currentFrameSeconds;

					if (anEntity.fadeAnim != 0)
					{
						anEntity.sprite.alpha += anEntity.fadeAnim * this.currentFrameSeconds;
						if (anEntity.sprite.alpha <= 0.001)
						{
							anEntity.die();
						}
						else if (anEntity.sprite.alpha > 1)
						{
							anEntity.sprite.alpha = 1;
						}
					}
					if (anEntity.zoomAnim != 0)
					{
						anEntity.sprite.scaleX += anEntity.zoomAnim * this.currentFrameSeconds;
						anEntity.sprite.scaleY += anEntity.zoomAnim * this.currentFrameSeconds;
						if (anEntity.sprite.scaleX < 0 || anEntity.sprite.scaleY < 0)
							anEntity.die();
					}

				}
			}
		}
	} // end class
} // end package