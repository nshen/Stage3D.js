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
	} // end class
} // enDate package