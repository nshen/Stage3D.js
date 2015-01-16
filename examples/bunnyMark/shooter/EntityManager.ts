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
		// the sprite sheet image
		public _spriteSheet:GPUSprite.SpriteSheet;
		private _SpritesPerRow:number = 8;
		private _SpritesPerCol:number = 8;

		//[Embed(source="../assets/sprites.png")]
		//private SourceImage : Class;
		
		// a reusable pool of entities
		public _entityPool :Entity[] ;
		
		// all the polygons that make up the scene
		public _batch:GPUSprite.SpriteRenderLayer ; //LiteSpriteBatch
		
		// for statistics
		public numCreated : number = 0;
		public numReused : number = 0;
		
		public maxX:number;
		public minX:number;
		public maxY:number;
		public minY:number;

		// the player entity - a special case
		public thePlayer:Entity;
		
		constructor(view:GPUSprite.Rectangle)
		{
			this._entityPool = [];
			this.setPosition(view);
		}
		
		public setPosition(view:GPUSprite.Rectangle):void
		{
			// allow moving fully offscreen before looping around
			this.maxX = view.width + 32;
			this.minX = view.x - 32;
			this.maxY = view.height;
			this.minY = view.y;
		}
		
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
			this.thePlayer.sprite.rotation = 180 * (Math.PI/180); // degrees to radians
			this.thePlayer.sprite.scaleX = this.thePlayer.sprite.scaleY = 2;
			this.thePlayer.speedX = 0;
			this.thePlayer.speedY = 0;
			this.thePlayer.aiFunction = playerController;
			return this.thePlayer;
		}

		// shoot a bullet (from the player for now)
		public shootBullet():Entity
		{
			var anEntity:Entity;
			anEntity = this.respawn(39);
			anEntity.sprite.position.x = this.thePlayer.sprite.position.x + 8;
			anEntity.sprite.position.y = this.thePlayer.sprite.position.y + 4;
			anEntity.sprite.rotation = 180 * (Math.PI/180);
			anEntity.sprite.scaleX = anEntity.sprite.scaleY = 2;
			anEntity.speedX = 10;
			anEntity.speedY = 0;
			return anEntity;
		}


		// for this test, create random entities that move 
		// from right to left with random speeds and scales
		public addEntity():void 
		{
			var anEntity:Entity;
			var randomSpriteID:number = Math.floor(Math.random() * 64);
			// try to reuse an inactive entity (or create a new one)
			anEntity = this.respawn(randomSpriteID);
			// give it a new position and velocity
			anEntity.sprite.position.x = this.maxX;
			anEntity.sprite.position.y = Math.random() * this.maxY;
			anEntity.speedX = (-1 * Math.random() * 10) - 2;
			anEntity.speedY = (Math.random() * 5) - 2.5;
			anEntity.sprite.scaleX = 0.5 + Math.random() * 1.5;
			anEntity.sprite.scaleY = anEntity.sprite.scaleX;
			anEntity.sprite.rotation = 15 - Math.random() * 30;
		}



		
		// called every frame: used to update the simulation
		// this is where you would perform AI, physics, etc.
		public update(currentTime:number) : void
		{		
			var anEntity:Entity;
			for(var i:number=0; i<this._entityPool.length;i++)
			{
				anEntity = this._entityPool[i];
				if (anEntity.active)
				{
					anEntity.sprite.position.x += anEntity.speedX;
					anEntity.sprite.position.y += anEntity.speedY;

					// the player follows different rules
					if(anEntity.aiFunction != null)
						anEntity.aiFunction(anEntity);
					else
					{ // all other entities use the "demo" logic

						anEntity.sprite.rotation += 0.1;

						if (anEntity.sprite.position.x > this.maxX)
						{
							anEntity.speedX *= -1;
							anEntity.sprite.position.x = this.maxX;
						}
						else if (anEntity.sprite.position.x < this.minX)
						{
							// if we go past the left edge, become inactive
							// so the sprite can be respawned
							anEntity.die();
						}
						if (anEntity.sprite.position.y > this.maxY)
						{
							anEntity.speedY *= -1;
							anEntity.sprite.position.y = this.maxY;
						}
						else if (anEntity.sprite.position.y < this.minY)
						{
							anEntity.speedY *= -1;
							anEntity.sprite.position.y = this.minY;
						}
					}

				}
			}
		}
	} // end class
} // end package