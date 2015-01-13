// Stage3D Shoot-em-up Tutorial Part 2
// by Christer Kaitila - www.mcfunkypants.com

// GameMenu.as
// A simple title screen / logo screen and menu
// that is displayed during the idle "attract mode"

module shooter
{

	export class GameMenu
	{
		// the sprite sheet image
		public spriteSheet:GPUSprite.SpriteSheet;
		//[Embed(source="../assets/titlescreen.png")]
		//private SourceImage : Class;
		
		// all the polygons that make up the scene
		public batch:GPUSprite.SpriteRenderLayer; // : LiteSpriteBatch;
		
		// which menu item is active (0=none)
		public menuState:number = 0;
		
		// pixel regions of the buttons
		public menuWidth:number = 128;
		public menuItemHeight:number = 32;
		public menuY1:number = 0;
		public menuY2:number = 0;
		public menuY3:number = 0;
		
		// the sprites

		public logoSprite:GPUSprite.Sprite;//LiteSprite;

		// menu items when idle
		public menuPlaySprite:GPUSprite.Sprite;//LiteSprite;
		public menuControlsSprite:GPUSprite.Sprite;//LiteSprite;
		public menuAboutSprite:GPUSprite.Sprite;//LiteSprite;

		// menu items when active
		public amenuPlaySprite:GPUSprite.Sprite;//LiteSprite;
		public amenuControlsSprite:GPUSprite.Sprite;//LiteSprite;
		public amenuAboutSprite:GPUSprite.Sprite;//LiteSprite;

		// info screens
		public aboutSprite:GPUSprite.Sprite;//LiteSprite;
		public controlsSprite:GPUSprite.Sprite;//LiteSprite;
		
		public showingAbout:boolean = false;
		public showingControls:boolean = false;
		public showingControlsUntil:number = 0;
		public showingAboutUntil:number = 0;
			
		// where everything goes
		public logoX:number = 0;
		public logoY:number = 0;
		public menuX:number = 0;
		public menuY:number = 0;
		
		constructor(view:GPUSprite.Rectangle)
		{
			console.log("Init the game menu..");
			this.setPosition(view);
		}
		
		public setPosition(view:GPUSprite.Rectangle):void
		{
			this.logoX = view.width / 2;
			this.logoY = view.height / 2 - 64;
			this.menuX = view.width / 2;
			this.menuY = view.height / 2 + 64;
			this.menuY1 = this.menuY - (this.menuItemHeight / 2);
			this.menuY2 = this.menuY - (this.menuItemHeight / 2) + this.menuItemHeight;
			this.menuY3 = this.menuY - (this.menuItemHeight / 2) + (this.menuItemHeight * 2);
		}
		
		public createBatch(context3D:stageJS.Context3D) : GPUSprite.SpriteRenderLayer//LiteSpriteBatch
		{
			var source:stageJS.BitmapData = stageJS.BitmapData.fromImageElement(shooter.ImageLoader.getInstance().get("assets/titlescreen.png"));

			// create a spritesheet using the titlescreen image
			this.spriteSheet = new GPUSprite.SpriteSheet(source, 0, 0);
			
			// Create new render batch 
			this.batch = new GPUSprite.SpriteRenderLayer(context3D, this.spriteSheet);

			// set up all required sprites right now
			var logoID:number = this.spriteSheet.defineSprite(0, 0, 512, 256);
			this.logoSprite = this.batch.createChild(logoID);
			this.logoSprite.position.x = this.logoX;
			this.logoSprite.position.y = this.logoY;

			var menuPlaySpriteID:number = this.spriteSheet.defineSprite(0, 256, this.menuWidth, 48);
			this.menuPlaySprite = this.batch.createChild(menuPlaySpriteID);
			this.menuPlaySprite.position.x = this.menuX;
			this.menuPlaySprite.position.y = this.menuY;

			var amenuPlaySpriteID:number = this.spriteSheet.defineSprite(0, 256+128, this.menuWidth, 48);
			this.amenuPlaySprite = this.batch.createChild(amenuPlaySpriteID);
			this.amenuPlaySprite.position.x = this.menuX;
			this.amenuPlaySprite.position.y = this.menuY;
			this.amenuPlaySprite.alpha = 0;

			var menuControlsSpriteID:number = this.spriteSheet.defineSprite(0, 304, this.menuWidth, 32);
			this.menuControlsSprite = this.batch.createChild(menuControlsSpriteID);
			this.menuControlsSprite.position.x = this.menuX;
			this.menuControlsSprite.position.y = this.menuY + this.menuItemHeight;

			var amenuControlsSpriteID:number = this.spriteSheet.defineSprite(0, 304+128, this.menuWidth, 32);
			this.amenuControlsSprite = this.batch.createChild(amenuControlsSpriteID);
			this.amenuControlsSprite.position.x = this.menuX;
			this.amenuControlsSprite.position.y = this.menuY + this.menuItemHeight;
			this.amenuControlsSprite.alpha = 0;

			var menuAboutSpriteID:number = this.spriteSheet.defineSprite(0, 336, this.menuWidth, 48);
			this.menuAboutSprite = this.batch.createChild(menuAboutSpriteID);
			this.menuAboutSprite.position.x = this.menuX;
			this.menuAboutSprite.position.y = this.menuY + this.menuItemHeight + this.menuItemHeight;

			var amenuAboutSpriteID:number = this.spriteSheet.defineSprite(0, 336+128, this.menuWidth, 48);
			this.amenuAboutSprite = this.batch.createChild(amenuAboutSpriteID);
			this.amenuAboutSprite.position.x = this.menuX;
			this.amenuAboutSprite.position.y = this.menuY + this.menuItemHeight + this.menuItemHeight;
			this.amenuAboutSprite.alpha = 0;

			var aboutSpriteID:number = this.spriteSheet.defineSprite(128, 256, 384, 128);
			this.aboutSprite = this.batch.createChild(aboutSpriteID);
			this.aboutSprite.position.x = this.menuX;
			this.aboutSprite.position.y = this.menuY + 64;
			this.aboutSprite.alpha = 0;

			var controlsSpriteID:number = this.spriteSheet.defineSprite(128, 384, 384, 128);
			this.controlsSprite = this.batch.createChild(controlsSpriteID);
			this.controlsSprite.position.x = this.menuX;
			this.controlsSprite.position.y = this.menuY + 64;
			this.controlsSprite.alpha = 0;

			return this.batch;
		}
		
		// our game will call these based on user input
		public nextMenuItem():void
		{
			this.menuState++;
			if (this.menuState > 3) this.menuState = 1;
			this.updateState();
		}
		public prevMenuItem():void
		{
			this.menuState--;
			if (this.menuState < 1) this.menuState = 3;
			this.updateState();
		}
		
		public mouseHighlight(x:number, y:number):void
		{
			//console.log('mouseHighlight ' + x + ',' + y);
			// when mouse moves, assume it moved OFF all items
			this.menuState = 0;
			
			var menuLeft:number = this.menuX - (this.menuWidth / 2);
			var menuRight:number = this.menuX + (this.menuWidth / 2);
			if ((x >= menuLeft) && (x <= menuRight))
			{
				//console.log('inside ' + menuLeft + ',' + menuRight);
				if ((y >= this.menuY1) && (y <= (this.menuY1 + this.menuItemHeight)))
				{
					this.menuState = 1;
				}
				if ((y >= this.menuY2) && (y <= (this.menuY2 + this.menuItemHeight)))
				{
					this.menuState = 2;
				}
				if ((y >= this.menuY3) && (y <= (this.menuY3 + this.menuItemHeight)))
				{
					this.menuState = 3;
				}
			}
			this.updateState();
		}
		
		// adjust the opacity of menu items
		public updateState():void
		{
			// ignore if menu is not visible:
			if (this.showingAbout || this.showingControls) return;
			// user clicked or pressed fire on a menu item:
			switch (this.menuState)
			{
				case 0: // nothing selected
					this.menuAboutSprite.alpha = 1;
					this.menuControlsSprite.alpha = 1;
					this.menuPlaySprite.alpha = 1;
					this.amenuAboutSprite.alpha = 0;
					this.amenuControlsSprite.alpha = 0;
					this.amenuPlaySprite.alpha = 0;
					break;
				case 1: // play selected
					this.menuAboutSprite.alpha = 1;
					this.menuControlsSprite.alpha = 1;
					this.menuPlaySprite.alpha = 0;
					this.amenuAboutSprite.alpha = 0;
					this.amenuControlsSprite.alpha = 0;
					this.amenuPlaySprite.alpha = 1;
					break;
				case 2: // controls selected
					this.menuAboutSprite.alpha = 1;
					this.menuControlsSprite.alpha = 0;
					this.menuPlaySprite.alpha = 1;
					this.amenuAboutSprite.alpha = 0;
					this.amenuControlsSprite.alpha = 1;
					this.amenuPlaySprite.alpha = 0;
					break;
				case 3: // about selected
					this.menuAboutSprite.alpha = 0;
					this.menuControlsSprite.alpha = 1;
					this.menuPlaySprite.alpha = 1;
					this.amenuAboutSprite.alpha = 1;
					this.amenuControlsSprite.alpha = 0;
					this.amenuPlaySprite.alpha = 0;
					break;
			}
		}
	
		// activate the currently selected menu item
		// returns true if we should start the game
		public activateCurrentMenuItem(currentTime:number):boolean
		{
			// ignore if menu is not visible:
			if (this.showingAbout || this.showingControls) return false;
			// activate the proper option:
			switch (this.menuState)
			{
				case 1: // play selected
					return true;
					break;
				case 2: // controls selected
					this.menuAboutSprite.alpha = 0;
					this.menuControlsSprite.alpha = 0;
					this.menuPlaySprite.alpha = 0;
					this.amenuAboutSprite.alpha = 0;
					this.amenuControlsSprite.alpha = 0;
					this.amenuPlaySprite.alpha = 0;
					this.controlsSprite.alpha = 1;
					this.showingControls = true;
					this.showingControlsUntil = currentTime + 2000;
					break;
				case 3: // about selected
					this.menuAboutSprite.alpha = 0;
					this.menuControlsSprite.alpha = 0;
					this.menuPlaySprite.alpha = 0;
					this.amenuAboutSprite.alpha = 0;
					this.amenuControlsSprite.alpha = 0;
					this.amenuPlaySprite.alpha = 0;
					this.aboutSprite.alpha = 1;
					this.showingAbout = true;
					this.showingAboutUntil = currentTime + 2000;
					break;
			}
			return false;
		}
		
		// called every frame: used to update the animation
		public update(currentTime:number) : void
		{
			this.logoSprite.position.x = this.logoX;
			this.logoSprite.position.y = this.logoY;
			var wobble:number = (Math.cos(currentTime / 500) / Math.PI) * 0.2;
			this.logoSprite.scaleX = 1 + wobble;
			this.logoSprite.scaleY = 1 + wobble;
			wobble = (Math.cos(currentTime / 777) / Math.PI) * 0.1;
			this.logoSprite.rotation = wobble;

			// pulse the active menu item
			wobble = (Math.cos(currentTime / 150) / Math.PI) * 0.1;
			this.amenuAboutSprite.scaleX =
			this.amenuAboutSprite.scaleY =
			this.amenuControlsSprite.scaleX =
			this.amenuControlsSprite.scaleY =
			this.amenuPlaySprite.scaleX =
			this.amenuPlaySprite.scaleY = 1.1 + wobble;
			
			// show the about/controls for a while
			if (this.showingAbout)
			{
				if (this.showingAboutUntil > currentTime)
				{
					this.aboutSprite.alpha = 1;
				}
				else
				{
					this.aboutSprite.alpha = 0;
					this.showingAbout = false;
					this.updateState();
				}
			}

			if (this.showingControls)
			{
				if (this.showingControlsUntil > currentTime)
				{
					this.controlsSprite.alpha = 1;
				}
				else
				{
					this.controlsSprite.alpha = 0;
					this.showingControls = false;
					this.updateState();
				}
			}
		}
	} // end class
} // end package