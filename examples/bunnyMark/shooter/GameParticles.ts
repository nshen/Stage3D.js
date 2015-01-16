// Stage3D Shoot-em-up Tutorial Part 3
// by Christer Kaitila - www.mcfunkypants.com

// GameParticles.as
// A simple particle system class that is
// used by the EntityManager for explosions, etc.

module shooter
{

    export class GameParticles
    {
        public allParticles :Entity[] ;
        public gfx:EntityManager;

        constructor(entityMan:EntityManager)
        {
            this.allParticles = []();
            this.gfx = entityMan;
        }

        // a cool looking explosion effect with a big fireball,
        // a blue fast shockwave, smaller bursts of fire,
        // a bunch of small sparks and pieces of hull debris
        public addExplosion(pos:{x:number;y:number}):void
        {
            this.addShockwave(pos);
            this.addDebris(pos,6,12);
            this.addFireball(pos);
            this.addBursts(pos,10,20);
            this.addSparks(pos,8,16);
        }

        public addParticle(
            spr:number,					// sprite ID
            x:number, y:number,			// starting location
            startScale:number = 0.01,	// initial scale
            spdX:number = 0, 			// horizontal speed in px/sec
            spdY:number = 0, 			// vertical speed in px/sec
            startAlpha:number = 1, 		// initial transparency (1=opaque)
            rot:number = NaN,			// starting rotation in degrees/sec
            rotSpd:number = NaN,		// rotational speed in degrees/sec
            fadeSpd:number = NaN, 		// fade in/out speed per second
            zoomSpd:number = NaN 		// growth speed per second
        ):Entity
        {
            // Defaults tell us to to randomize some properties
            // Why NaN? Can't put fastRandom() inside a function declaration
            if (isNaN(rot)) rot = this.gfx.fastRandom() * 360;
            if (isNaN(rotSpd)) rotSpd = this.gfx.fastRandom() * 360 - 180;
            if (isNaN(fadeSpd)) fadeSpd = -1 * (this.gfx.fastRandom() * 1 + 1);
            if (isNaN(zoomSpd)) zoomSpd = this.gfx.fastRandom() * 2 + 1;

            var anEntity:Entity;
            anEntity = this.gfx.respawn(spr);
            anEntity.sprite.position.x = x;
            anEntity.sprite.position.y = y;
            anEntity.speedX = spdX;
            anEntity.speedY = spdY;
            anEntity.sprite.rotation = rot * this.gfx.DEGREES_TO_RADIANS;
            anEntity.rotationSpeed = rotSpd * this.gfx.DEGREES_TO_RADIANS;
            anEntity.collidemode = 0;
            anEntity.fadeAnim = fadeSpd;
            anEntity.zoomAnim = zoomSpd;
            anEntity.sprite.scaleX = startScale;
            anEntity.sprite.scaleY = startScale;
            anEntity.sprite.alpha = startAlpha;
            if (!anEntity.recycled)
                this.allParticles.push(anEntity);
            return anEntity;
        }

        // one big spinning ball of fire
        public addFireball(pos:Point):void
        {
            this.addParticle(this.gfx.spritenumFireball, pos.x, pos.y, 0.01, 0, 0, 1, NaN, NaN, NaN, 4);
        }

        // a shockwave ring that expands quickly
        public addShockwave(pos:Point):void
        {
            this.addParticle(this.gfx.spritenumShockwave, pos.x, pos.y, 0.01, 0, 0, 1, NaN, NaN, -3, 20);
        }

        // several small fireballs that move and spin
        public addBursts(pos:Point, mincount:number, maxcount:number):void
        {
            var nextparticle:number = 0;
            var numparticles:number = this.gfx.fastRandom() * mincount + (maxcount-mincount);
            for (nextparticle = 0; nextparticle < numparticles; nextparticle++)
            {
                this.addParticle(this.gfx.spritenumFireburst,
                    pos.x + this.gfx.fastRandom() * 16 - 8,
                    pos.y + + this.gfx.fastRandom() * 16 - 8,
                    0.02,
                    this.gfx.fastRandom() * 200 - 100,
                    this.gfx.fastRandom() * 200 - 100,
                    0.75);
            }
        }

        // several small bright glowing sparks that move quickly
        public addSparks(pos:Point, mincount:number, maxcount:number):void
        {
            var nextparticle:number = 0;
            var numparticles:number = this.gfx.fastRandom() * mincount + (maxcount-mincount);
            for (nextparticle = 0; nextparticle < numparticles; nextparticle++)
            {
                // small sparks that stay bright but get smaller
                this.addParticle(this.gfx.spritenumSpark, pos.x, pos.y, 1,
                    this.gfx.fastRandom() * 320 - 160,
                    this.gfx.fastRandom() * 320 - 160,
                    1, NaN, NaN, 0, -1.5);
            }
        }

        // small pieces of destroyed spaceship debris, moving on average slightly forward
        public addDebris(pos:Point, mincount:number, maxcount:number):void
        {
            var nextparticle:number = 0;
            var numparticles:number = this.gfx.fastRandom() * mincount + (maxcount-mincount);
            for (nextparticle = 0; nextparticle < numparticles; nextparticle++)
            {
                this.addParticle(this.gfx.spritenumDebris, pos.x, pos.y, 1,
                    this.gfx.fastRandom() * 180 - 120,
                    this.gfx.fastRandom() * 180 - 90,
                    1, NaN, NaN, -1, 0);
            }
        }

    } // end class

    interface Point {
        x:number;
        y:number;
    }
} // end package