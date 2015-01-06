//import Header					= require("awayjs-stagegl/lib/aglsl/Header");
//import Token					= require("awayjs-stagegl/lib/aglsl/Token");
///<reference path="../reference.ts"/>
module stageJS.utils {
	export class Description {
		public regread:any[] = [
			[],
			[],
			[],
			[],
			[],
			[],
			[]
		];
		public regwrite:any[] = [
			[],
			[],
			[],
			[],
			[],
			[],
			[]
		];
		public hasindirect:boolean = false;
		public writedepth:boolean = false;
		public hasmatrix:boolean = false;
		public samplers:any[] = [];

		// added due to dynamic assignment 3*0xFFFFFFuuuu
		public tokens:Token[] = [];
		public header:Header = new Header();

		constructor() {
		}
	}
}
//export = Description;