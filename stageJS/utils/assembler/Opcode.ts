//import Flags				= require("awayjs-stagegl/lib/aglsl/assembler/Flags");
//import FS					= require("awayjs-stagegl/lib/aglsl/assembler/FS");

///<reference path="../../reference.ts"/>
module stageJS.utils.assembler {
	export class Opcode {
		public dest:string;
		public a:FS;
		public b:FS;
		public opcode:number;
		public flags:Flags;

		constructor(dest:string, aformat:string, asize:number, bformat:string, bsize:number, opcode:number, simple:boolean, horizontal:boolean, fragonly:boolean, matrix:boolean) {
			this.a = new FS();
			this.b = new FS();
			this.flags = new Flags();

			this.dest = dest;
			this.a.format = aformat;
			this.a.size = asize;
			this.b.format = bformat;
			this.b.size = bsize;
			this.opcode = opcode;
			this.flags.simple = simple;
			this.flags.horizontal = horizontal;
			this.flags.fragonly = fragonly;
			this.flags.matrix = matrix;
		}
	}
}
//export = Opcode;
