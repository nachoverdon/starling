import Starling from "./../../starling/core/Starling";
import Error from "openfl/errors/Error";
import MissingContextError from "./../../starling/errors/MissingContextError";
import Program from "./../../starling/rendering/Program";
import StringTools from "./../../StringTools";
import VertexDataFormat from "./../../starling/rendering/VertexDataFormat";
import Matrix3D from "openfl/geom/Matrix3D";


declare namespace starling.rendering
{
	/** An effect encapsulates all steps of a Stage3D draw operation. It configures the
	 *  render context and sets up shader programs as well as index- and vertex-buffers, thus
	 *  providing the basic mechanisms of all low-level rendering.
	 *
	 *  <p><strong>Using the Effect class</strong></p>
	 *
	 *  <p>Effects are mostly used by the <code>MeshStyle</code> and <code>FragmentFilter</code>
	 *  classes. When you extend those classes, you'll be required to provide a custom effect.
	 *  Setting it up for rendering is done by the base class, though, so you rarely have to
	 *  initiate the rendering yourself. Nevertheless, it's good to know how an effect is doing
	 *  its work.</p>
	 *
	 *  <p>Using an effect always follows steps shown in the example below. You create the
	 *  effect, configure it, upload vertex data and then: draw!</p>
	 *
	 *  <listing>
	 *  // create effect
	 *  effect:MeshEffect = new MeshEffect();
	 *  
	 *  // configure effect
	 *  effect.mvpMatrix3D = painter.state.mvpMatrix3D;
	 *  effect.texture = getHeroTexture();
	 *  effect.color = 0xf0f0f0;
	 *  
	 *  // upload vertex data
	 *  effect.uploadIndexData(indexData);
	 *  effect.uploadVertexData(vertexData);
	 *  
	 *  // draw!
	 *  effect.render(0, numTriangles);</listing>
	 *
	 *  <p>Note that the <code>VertexData</code> being uploaded has to be created with the same
	 *  format as the one returned by the effect's <code>vertexFormat</code> property.</p>
	 *
	 *  <p><strong>Extending the Effect class</strong></p>
	 *
	 *  <p>The base <code>Effect</code>-class can only render white triangles, which is not much
	 *  use in itself. However, it is designed to be extended; subclasses can easily implement any
	 *  kinds of shaders.</p>
	 *
	 *  <p>Normally, you won't extend this class directly, but either <code>FilterEffect</code>
	 *  or <code>MeshEffect</code>, depending on your needs (i.e. if you want to create a new
	 *  fragment filter or a new mesh style). Whichever base class you're extending, you should
	 *  override the following methods:</p>
	 *
	 *  <ul>
	 *    <li><code>createProgram():Program</code> — must create the actual program containing 
	 *        vertex- and fragment-shaders. A program will be created only once for each render
	 *        context; this is taken care of by the base class.</li>
	 *    <li><code>get programVariantName():number</code> (optional) — override this if your
	 *        effect requires different programs, depending on its settings. The recommended
	 *        way to do this is via a bit-mask that uniquely encodes the current settings.</li>
	 *    <li><code>get vertexFormat():String</code> (optional) — must return the
	 *        <code>VertexData</code> format that this effect requires for its vertices. If
	 *        the effect does not require any special attributes, you can leave this out.</li>
	 *    <li><code>beforeDraw(context:Context3D):void</code> — Set up your context by
	 *        configuring program constants and buffer attributes.</li>
	 *    <li><code>afterDraw(context:Context3D):void</code> — Will be called directly after
	 *        <code>context.drawTriangles()</code>. Clean up any context configuration here.</li>
	 *  </ul>
	 *
	 *  <p>Furthermore, you need to add properties that manage the data you require on rendering,
	 *  e.g. the texture(s) that should be used, program constants, etc. I recommend looking at
	 *  the implementations of Starling's <code>FilterEffect</code> and <code>MeshEffect</code>
	 *  classes to see how to approach sub-classing.</p>
	 *
	 *  @see FilterEffect
	 *  @see MeshEffect
	 *  @see starling.styles.MeshStyle
	 *  @see starling.filters.FragmentFilter
	 *  @see starling.utils.RenderUtil
	 */
	export class Effect
	{
		/** The vertex format expected by <code>uploadVertexData</code>:
		 *  <code>"position:number2"</code> */
		public static VERTEX_FORMAT:VertexDataFormat;
	
		/** Creates a new effect. */
		public constructor();
	
		/** Purges the index- and vertex-buffers. */
		public dispose():void;
	
		/** Purges one or both of the vertex- and index-buffers. */
		public purgeBuffers(vertexBuffer?:boolean, indexBuffer?:boolean):void;
	
		/** Uploads the given index data to the internal index buffer. If the buffer is too
		 *  small, a new one is created automatically.
		 *
		 *  @param indexData   The IndexData instance to upload.
		 *  @param bufferUsage The expected buffer usage. Use one of the constants defined in
		 *                     <code>Context3DBufferUsage</code>. Only used when the method call
		 *                     causes the creation of a new index buffer.
		 */
		public uploadIndexData(indexData:IndexData,
										bufferUsage?:string):void;
	
		/** Uploads the given vertex data to the internal vertex buffer. If the buffer is too
		 *  small, a new one is created automatically.
		 *
		 *  @param vertexData  The VertexData instance to upload.
		 *  @param bufferUsage The expected buffer usage. Use one of the constants defined in
		 *                     <code>Context3DBufferUsage</code>. Only used when the method call
		 *                     causes the creation of a new vertex buffer.
		 */
		public uploadVertexData(vertexData:VertexData,
										 bufferUsage?:string):void;
	
		// rendering
	
		/** Draws the triangles described by the index- and vertex-buffers, or a range of them.
		 *  This calls <code>beforeDraw</code>, <code>context.drawTriangles</code>, and
		 *  <code>afterDraw</code>, in this order. */
		public render(firstIndex?:number, numTriangles?:number):void;
	
		/** Override this method if the effect requires a different program depending on the
		 *  current settings. Ideally, you do this by creating a bit mask encoding all the options.
		 *  This method is called often, so do not allocate any temporary objects when overriding.
		 *
		 *  @default 0
		 */
		public readonly programVariantName:number;
		protected get_programVariantName():number;
	
		/** Returns the base name for the program.
		 *  @default the fully qualified class name
		 */
		public programBaseName:string;
		protected get_programBaseName():string;
		protected set_programBaseName(value:string):string;
	
		/** Returns the full name of the program, which is used to register it at the current
		 *  <code>Painter</code>.
		 *
		 *  <p>The default implementation efficiently combines the program's base and variant
		 *  names (e.g. <code>LightEffect#42</code>). It shouldn't be necessary to override
		 *  this method.</p>
		 */
		public readonly programName:string;
		protected get_programName():string;
	
		/** Returns the current program, either by creating a new one (via
		 *  <code>createProgram</code>) or by getting it from the <code>Painter</code>.
		 *  Do not override this method! Instead, implement <code>createProgram</code>. */
		protected readonly program:Program;
		protected get_program():Program;
	
		// properties
	
		/** The that you provide here will be called after a context loss.
		 *  Call both "upload..." methods from within the callback to restore any vertex or
		 *  index buffers. The callback will be executed with the effect as its sole parameter. */
		public onRestore:(Effect)=>Void;
		protected get_onRestore():(Effect)=>Void;
		protected set_onRestore(value:(Effect)=>Void):(Effect)=>Void;
	
		/** The data format that this effect requires from the VertexData that it renders:
		 *  <code>"position:number2"</code> */
		public readonly vertexFormat:VertexDataFormat;
		protected get_vertexFormat():VertexDataFormat;
	
		/** The MVP (modelview-projection) matrix transforms vertices into clipspace. */
		public mvpMatrix3D:Matrix3D;
		protected get_mvpMatrix3D():Matrix3D;
		protected set_mvpMatrix3D(value:Matrix3D):Matrix3D;
	
		/** The internally used index buffer used on rendering. */
		protected readonly indexBuffer:IndexBuffer3D;
		protected get_indexBuffer():IndexBuffer3D;
	
		/** The current size of the index buffer (in number of indices). */
		protected readonly indexBufferSize:number;
		protected get_indexBufferSize():number;
	
		/** The internally used vertex buffer used on rendering. */
		protected readonly vertexBuffer:VertexBuffer3D;
		protected get_vertexBuffer():VertexBuffer3D;
		
		/** The current size of the vertex buffer (in blocks of 32 bits). */
		protected readonly vertexBufferSize:number; 
		protected get_vertexBufferSize():number;
	}
}

export default starling.rendering.Effect;