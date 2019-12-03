#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float time;

void main() {

	vec3 hLine = vec3(1.0, 1.0, 1.0);
	vec2 st = vTextureCoord.xy;
	vec2 coords = vTextureCoord.xy;
	float dist = 0.0;
	float lineSpeed = 5.0;
	float nLines = 10.0;
	float lineL = 12.0;

	dist = distance(st, vec2(0.5, 0.5));

	vec4 filter = vec4(abs(1.0 - dist), abs(1.0 - dist), abs(1.0 - dist), 1.0);
	vec4 texture = texture2D(uSampler, vTextureCoord);
	
	//nLines and 12 values for number of lines displayed and lenght of lines, respectively
	float lines = abs(sin((coords.y * nLines) - time * lineSpeed) * lineL);


	gl_FragColor = texture * filter * vec4(hLine, lines);
}