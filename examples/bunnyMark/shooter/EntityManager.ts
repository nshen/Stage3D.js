// Stage3D Shoot-em-up Tutorial Part 4
// by Christer Kaitila - www.mcfunkypants.com

// EntityManager.as
// The entity manager handles a list of all known game entities.
// This object pool will allow for reuse (respawning) of
// sprites: for example, when enemy ships are destroyed,
// they will be re-spawned when needed as an optimization
// that increases fps and decreases ram use.


///<reference path="reference.ts"/>
module shooter
{

	export class EntityManager
	{
		public theBoss:Entity;
		public bossDestroyedCallback:Function = null;

		// the level data parser
		public level:GameLevels;
		// the current level number
		public levelNum:number = 0;
		// where in the level we are in pixels
		public levelCurrentScrollX:number = 0;
		// the last spawned column of level data
		public levelPrevCol:number = -1;
		// pixels we need to scroll before spawning the next col
		public levelTilesize:number = 48;
		// this is used to ensure all terrain tiles line up exactly
		public lastTerrainEntity:Entity;
		// we need to allow at least enough space for ship movement
		// entities that move beyond the edges of the screen
		// plus this amount are recycled (destroyed for reuse)
		public cullingDistance:number = 200;

		// a particle system class that updates our sprites
		public particles:shooter.GameParticles;

		// so that explosions can be played
		//public sfx:GameSound;

		// the sprite sheet image
		public _spriteSheet:GPUSprite.SpriteSheet;
		private _SpritesPerRow:number = 8;
		private _SpritesPerCol:number = 8;

		// the general size of the player and enemies
		public defaultScale:number = 1.5;
		// v6 how fast the default scroll (enemy flying) speed is
		public defaultSpeed:number = 160;
		// v6 how fast player bullets go per second
		public playerBulletSpeed:number = 300;
		// v6 how fast enemy bullets go per second
		public enemyBulletSpeed:number = 200;
		// v6 how big the bullet sprites are
		public bulletScale:number = 1;


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
		public midpoint:number;

		public sourceImage:string = "assets/sprites.png"; // must in lib.ImageLoader

		public levelTopOffset:number = 0;

		constructor(view:GPUSprite.Rectangle)
		{
			this._entityPool = [];
			this.allBullets = [];
			this.allEnemies = [];
			this.particles = new GameParticles(this);
			this.setPosition(view);
			this.level = new shooter.GameLevels();
		}
		
		public setPosition(view:{x:number;y:number;width:number;height:number}):void
		{
			// allow moving fully offscreen before looping around
			this.maxX = view.width + this.cullingDistance;
			this.minX = view.x - this.cullingDistance;
			this.maxY = view.height + this.cullingDistance;
			this.minY = view.y - this.cullingDistance;

			this.midpoint = view.height / 2;
			this.levelTopOffset = this.midpoint - 200;
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

		public createBatch(context3D:stageJS.Context3D , SpritesPerRow:number = 8 , SpritesPerCol:number = 8 , uvPadding:number=0):GPUSprite.SpriteRenderLayer//LiteSpriteBatch
		{
			var sourceBitmap:HTMLImageElement = lib.ImageLoader.getInstance().get(this.sourceImage);
			// create a spritesheet with 8x8 (64) sprites on it
			this._spriteSheet = new GPUSprite.SpriteSheet(stageJS.BitmapData.fromImageElement(sourceBitmap), SpritesPerRow, SpritesPerCol,uvPadding);
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
					anEntity.age = 0;
					anEntity.burstTimerStart = 0;
					anEntity.burstTimerEnd = 0;
					anEntity.fireTime = 0;

					this.numReused++;
					return anEntity;
				}
			}
			// none were found so we need to make a new one
			//console.log('Need to create a new Entity #' + i);
			var sprite:GPUSprite.Sprite; //LiteSprite
			sprite = this._batch.createChild(sprID);
			anEntity = new Entity(sprite,this);
			anEntity.age = 0; // v6
			anEntity.burstTimerStart = 0; // v6
			anEntity.burstTimerEnd = 0; // v6
			anEntity.fireTime = 0; // v6
			this._entityPool.push(anEntity); //todo:这里应该死掉再放在pool里效率才会高嘛?
			this.numCreated++;
			return anEntity;
		}


		// this entity is the PLAYER
		public addPlayer(playerController:Function):Entity
		{
			this.thePlayer = this.respawn(this.spritenumPlayer); // sprite #10 looks nice for now
			this.thePlayer.sprite.position.x = 64;
			this.thePlayer.sprite.position.y = this.midpoint;
			this.thePlayer.sprite.rotation = 180 * this.DEGREES_TO_RADIANS; // degrees to radians
			this.thePlayer.sprite.scaleX = this.thePlayer.sprite.scaleY = this.defaultScale;
			this.thePlayer.speedX = 0;
			this.thePlayer.speedY = 0;
			this.thePlayer.active = true;
			this.thePlayer.collidemode = 1;
			this.thePlayer.collideradius = 10;
			this.thePlayer.owner = this.thePlayer; // collisions require this
			this.thePlayer.aiFunction = playerController;
			this.thePlayer.name = "thePlayer"
			//this.thePlayer.leavesTrail = true;

			// just for fun, spawn an orbiting "power orb"
			this.theOrb = this.respawn(this.spritenumOrb);
			this.theOrb.rotationSpeed = 720 * this.DEGREES_TO_RADIANS;
			this.theOrb.sprite.scaleX = this.theOrb.sprite.scaleY = this.defaultScale / 2;
			this.theOrb.leavesTrail = true;
			this.theOrb.collidemode = 1;
			this.theOrb.collideradius = 12;
			this.theOrb.isBullet = true;
			this.theOrb.owner = this.thePlayer;
			this.theOrb.orbiting = this.thePlayer;
			this.theOrb.orbitingDistance = 180;
			this.theOrb.name = "theOrb";

			return this.thePlayer;
		}

		// shoot a bullet
		public shootBullet(powa:number = 1 , shooter:Entity = null , angle:number = NaN):Entity
		{
			// just in case the AI is running during the main menu
			// and we've not yet created the player entity
			if (this.thePlayer == null) return null;

			// assume the player shot it
			// otherwise maybe an enemy did
			if (shooter == null)
				shooter = this.thePlayer;

			var theBullet:Entity;
			if (powa == 1)
				theBullet = this.respawn(this.spritenumBullet1);
			else if (powa == 2)
				theBullet = this.respawn(this.spritenumBullet2);
			else
				theBullet = this.respawn(this.spritenumBullet3);

			theBullet.name = "bullet";
			theBullet.sprite.position.x = shooter.sprite.position.x + 8;
			theBullet.sprite.position.y = shooter.sprite.position.y + 2;

			//theBullet.sprite.rotation = 180 * this.DEGREES_TO_RADIANS;
			theBullet.sprite.scaleX = theBullet.sprite.scaleY = this.bulletScale;
			if (shooter == this.thePlayer)
			{
				theBullet.speedX = this.playerBulletSpeed;
				theBullet.speedY = 0;
			} else // enemy bullets move slower and towards the player // v6 UNLESS SPECIFIED
			{
				if(isNaN(angle))
				{

					theBullet.sprite.rotation =
						this.pointAtRad(theBullet.sprite.position.x - this.thePlayer.sprite.position.x,
							theBullet.sprite.position.y - this.thePlayer.sprite.position.y) - (90 * this.DEGREES_TO_RADIANS);

				}else
				{
					theBullet.sprite.rotation = angle;
				}


				// move in the direction we're facing // v6
				theBullet.speedX = this.enemyBulletSpeed*Math.cos(theBullet.sprite.rotation);
				theBullet.speedY = this.enemyBulletSpeed*Math.sin(theBullet.sprite.rotation);

				// optionally, we could just fire straight ahead in the direction we're heading:
				// theBullet.speedX = shooter.speedX * 1.5;
				// theBullet.speedY = shooter.speedY * 1.5;
				// and we could point where we're going like this:
				// pointAtRad(theBullet.speedX,theBullet.speedY) - (90*DEGREES_TO_RADIANS);
			}

			theBullet.owner = shooter;
			theBullet.collideradius = 10;
			theBullet.collidemode = 1;
			theBullet.isBullet = true;

			if(!theBullet.recycled)
				this.allBullets.push(theBullet);
			return theBullet;
		}


		// for this test, create random entities that move 
		// from right to left with random speeds and scales
		public addRandomEntity():void
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
			anEntity.sprite.scaleX = this.defaultScale;
			anEntity.sprite.scaleY = this.defaultScale;
			anEntity.sprite.rotation =  this.pointAtRad(anEntity.speedX,anEntity.speedY) - (90 * this.DEGREES_TO_RADIANS);
			anEntity.collidemode = 1;
			anEntity.collideradius = 16;
			anEntity.name = "randomEnemy";

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

		// as an optimization to saver millions of checks, only
		// the player's bullets check for collisions with all enemy ships
		// (enemy bullets only check to hit the player)
		public checkCollisions(checkMe:Entity):Entity
		{
			if(!this.thePlayer)
				return null;

			var anEntity:Entity;
			var collided:boolean = false;

			if(checkMe.owner != this.thePlayer)
			{ // quick check ONLY to see if we have hit the player
				anEntity = this.thePlayer;
				if (checkMe.colliding(anEntity))
				{
					collided = true;
				}
			}else // check all active enemies
			{
				for(var i:number = 0; i< this.allEnemies.length;i++)
				{
					anEntity = this.allEnemies[i];
					if (anEntity.active && anEntity.collidemode)
					{
						if (checkMe.colliding(anEntity))
						{
							collided = true;

							if(this.thePlayer.sprite.visible)
								this.thePlayer.score += anEntity.collidepoints;

							break;
						}
					}
				}

			}
			if(collided)
			{
				// handle player health and possible gameover
				if((anEntity == this.thePlayer) || (checkMe == this.thePlayer))
				{
					// when the player gets damaged, they become
					// invulnerable for a short perod of time
					if (this.thePlayer.invulnerabilityTimeLeft <= 0)
					{
						this.thePlayer.health -= anEntity.damage;
						this.thePlayer.invulnerabilityTimeLeft = this.thePlayer.invulnerabilitySecsWhenHit;
						// extra explosions for a bigger boom
						var explosionPos:{x:number;y:number} = {x:0,y:0};
						for (var numExplosions:number = 0; numExplosions < 6; numExplosions++)
						{
							explosionPos.x = this.thePlayer.sprite.position.x + Math.random() * 64 - 32;
							explosionPos.y = this.thePlayer.sprite.position.y + Math.random() * 64 - 32;
							this.particles.addExplosion(explosionPos);
						}
						if (this.thePlayer.health > 0)
						{
							console.log("Player was HIT!");
						}
						else
						{
							console.log('Player was HIT... and DIED!');
							this.thePlayer.lives--;
							// will be reset after transition
							// thePlayer.health = 100;
							this.thePlayer.invulnerabilityTimeLeft = this.thePlayer.invulnerabilitySecsWhenHit + this.thePlayer.transitionSeconds;
							this.thePlayer.transitionTimeLeft = this.thePlayer.transitionSeconds;
						}
					}
					else // we are currently invulnerable and flickering
					{	// ignore the collision
						collided = false;
					}

				}

				if (collided) // still
				{
					//if (this.sfx) sfx.playExplosion(number(Math.random() * 2 + 1.5)); // todo：声音

					this.particles.addExplosion(checkMe.sprite.position);

					if(anEntity == this.theBoss)
					{
						this.theBoss.health -= 2; // 50 hits to destroy
						console.log("Boss hit. HP = " + this.theBoss.health);
						// knockback for more vidual feedback
						this.theBoss.sprite.position.x += 8;
						if (this.theBoss.health < 1)
						{
							console.log("Boss has been destroyed!");

							// huge shockwave
							this.particles.addParticle(this.spritenumShockwave, this.theBoss.sprite.position.x,
								this.theBoss.sprite.position.y, 0.01, 0, 0, 1, NaN, NaN, -1, 30);
							// extra explosions for a bigger boom
							var bossexpPos:{x:number;y:number} = {x:0,y:0};
							for (var bossnumExps:number = 0; bossnumExps < 6; bossnumExps++)
							{
								bossexpPos.x = this.theBoss.sprite.position.x + Math.random() * 128 - 64;
								bossexpPos.y = this.theBoss.sprite.position.y + Math.random() * 128 - 64;
								this.particles.addExplosion(bossexpPos);
							}

							this.theBoss.die();
							this.theBoss = null;
							if (this.bossDestroyedCallback != null)
								this.bossDestroyedCallback();
						}
					}
					else if ((anEntity != this.theOrb) && (anEntity != this.thePlayer))
						anEntity.die(); // the victim

					if ((checkMe != this.theOrb) && ((checkMe != this.thePlayer)))
						checkMe.die(); // the bullet

					return anEntity;
				}
			}
			return null;
		}


		// called every frame: used to update the simulation
		// this is where you would perform AI, physics, etc.
		// in this version, currentTime is seconds since the previous frame
		public update(currentTime:number) : void
		{		
			var anEntity:Entity;
			// what portion of a full second has passed since the previous update?
			this.currentFrameSeconds = currentTime / 1000;
			var max:number = this._entityPool.length;
			for(var i:number = 0; i < max;i++)
			{
				anEntity = this._entityPool[i];
				if (anEntity.active)
				{
					// subtract the previous aiPathOffset
					anEntity.sprite.position.x -= anEntity.aiPathOffsetX;
					anEntity.sprite.position.y -= anEntity.aiPathOffsetY;

					// calculate location on screen with scrolling
					anEntity.sprite.position.x += anEntity.speedX * this.currentFrameSeconds;
					anEntity.sprite.position.y += anEntity.speedY * this.currentFrameSeconds;

					// the player follows different rules
					if(anEntity.aiFunction != null)
						anEntity.aiFunction(this.currentFrameSeconds);

					// add the new aiPathOffset
					anEntity.sprite.position.x += anEntity.aiPathOffsetX;
					anEntity.sprite.position.y += anEntity.aiPathOffsetY;

					// collision detection
					if(anEntity.collidemode)
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
						{
							if(this.theOrb.sprite.visible)
								this.particles.addParticle(63, anEntity.sprite.position.x, anEntity.sprite.position.y, 0.25, 0, 0, 0.6, NaN, NaN, -1.5, -1);
						}
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
							//anEntity.fadeAnim = 0; //todo:加上这句？
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

		// kill (recycle) all known entities
		// this is run when we change levels
		public killEmAll():void
		{
			//console.log('Killing all entities...');
			var anEntity:Entity;
			var i:number;
			var max:number;
			max = this._entityPool.length;
			for (i = 0; i < max; i++)
			{
				anEntity = this._entityPool[i];
				if ((anEntity != this.thePlayer) && (anEntity != this.theOrb))
					anEntity.die();
			}
		}

		// load a new level for entity generation
		public changeLevels(lvl:string):void
		{
			this.killEmAll();
			this.level.loadLevel(lvl);
			this.levelCurrentScrollX = 0;
			this.levelPrevCol = -1;
			this.lastTerrainEntity = null;
		}

		// check to see if another row from the level data should be spawned
		public streamLevelEntities(theseAreEnemies:boolean = false):void
		{
			var anEntity:Entity;
			var sprID:number;

			// time-based with overflow remembering (increment and floor)
			this.levelCurrentScrollX += this.defaultSpeed * this.currentFrameSeconds;

			// is it time to spawn the next col from our level data?
			if (this.levelCurrentScrollX >= this.levelTilesize)
			{
				this.levelCurrentScrollX = 0;
				this.levelPrevCol++;

				// this prevents small "seams" due to floating point inaccuracies over time
				var currentLevelXCoord:number;
				if (this.lastTerrainEntity && !theseAreEnemies)
					currentLevelXCoord = this.lastTerrainEntity.sprite.position.x + this.levelTilesize;
				else
					currentLevelXCoord = this.maxX;

				var rows:number = this.level.data.length;
				//console.log('levelCurrentScrollX = ' + levelCurrentScrollX +
				//' - spawning next level column ' + levelPrevCol + ' row count: ' + rows);

				if (this.level.data && this.level.data.length)
				{
					for (var row:number = 0; row < rows; row++)
					{
						if (this.level.data[row].length > this.levelPrevCol) // data exists? NOP?
						{
							//console.log('Next row data: ' + string(level.data[row]));
							sprID = this.level.data[row][this.levelPrevCol];
							if (sprID > -1) // zero is a valid number, -1 means blank
							{
								anEntity = this.respawn(sprID);
								anEntity.sprite.position.x = currentLevelXCoord;
								anEntity.sprite.position.y = (row * this.levelTilesize) + (this.levelTilesize/2)+ this.levelTopOffset; // v6
								//console.log('Spawning a level sprite ID ' + sprID + ' at ' + anEntity.sprite.position.x + ',' + anEntity.sprite.position.y);
								anEntity.speedX = -this.defaultSpeed;
								anEntity.speedY = 0;
								anEntity.sprite.scaleX = this.defaultScale;
								anEntity.sprite.scaleY = this.defaultScale;
								anEntity.name = "tile";
								if (theseAreEnemies)
								{
									anEntity.name = "tile_enemy";
									// which AI should we give this enemy?
									switch (sprID)
									{
										case 1:
										case 2:
										case 3:
										case 4:
										case 5:
										case 6:
										case 7:
											// move forward at a random angle
											anEntity.speedX = 15 * ((-1 * Math.random() * 10) - 2);
											anEntity.speedY = 15 * ((Math.random() * 5) - 2.5);
											anEntity.aiFunction = anEntity.straightAI;
											break;
										case 8:
										case 9:
										case 10:
										case 11:
										case 12:
										case 13:
										case 14:
										case 15:
											// move straight with a wobble
											anEntity.aiFunction = anEntity.wobbleAI;
											break
										case 16:
										case 24: // sentry guns don't move and always look at the player
											anEntity.aiFunction = anEntity.sentryAI;
											anEntity.speedX = -90; // same <background> speed
											break;
										case 17:
										case 18:
										case 19:
										case 20:
										case 21:
										case 22:
										case 23:
											// move at a random angle with a wobble
											anEntity.speedX = 15 * ((-1 * Math.random() * 10) - 2);
											anEntity.speedY = 15 * ((Math.random() * 5) - 2.5);
											anEntity.aiFunction = anEntity.wobbleAI;
											break;
										case 32:
										case 40:
										case 48: // asteroids don't move or shoot but they do spin and drift
											anEntity.aiFunction = null;
											anEntity.rotationSpeed = Math.random() * 8 - 4;
											anEntity.speedY = Math.random() * 64 - 32;
											break;
										default: // follow a complex random spline curve path
											anEntity.aiFunction = anEntity.droneAI;
											break;
									}

									anEntity.sprite.rotation = this.pointAtRad(anEntity.speedX, anEntity.speedY)
									- (90 * this.DEGREES_TO_RADIANS);
									anEntity.collidemode = 1;
									anEntity.collideradius = 16;
									if (!anEntity.recycled)
										this.allEnemies.push(anEntity);
								} // end if these were enemies
							}// end loop for level data rows
						}
					}
				}
				// remember the last created terrain entity
				// (might be null if the level data was blank for this column)
				// to avoid slight seams due to terrain scrolling speed over time
				if (!theseAreEnemies) this.lastTerrainEntity = anEntity;
			}
		}
	} // end class
} // end package