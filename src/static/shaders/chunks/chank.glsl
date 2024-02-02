#define PI 3.14159265359
#define PI2 6.28318530718

vec2 Sample(in float theta, inout float r)
{
  r += 1.0 / r;
	return (r-1.0) * vec2(cos(theta), sin(theta)) * .06;
}


const float Depth = 3.;
const float OffsetDist = 4.;
const float Samples = 8.;
#define TAU 6.28318530718
vec4 RadialBlur(sampler2D tex, vec2 coord, vec2 res, float radius) {
    if(radius <= 0.) return texture2D(tex, coord/res.xy);
    vec2 offset;
    float angle = 0.;
    vec4 color = vec4(0.);
    
    for(float angle = 0.; angle < TAU; angle += (TAU/Samples)) {
        
        offset = vec2(cos(angle), sin(angle)) * radius;
        color += texture2D(tex, (coord + offset)/res.xy);
    }
    
    return color/Samples;
}
vec4 FastBlur(sampler2D tex, vec2 coord, vec2 res, float radius) {
    vec4 color;
    vec2 offset;
    float fib = 2.;
    float fibTotal = 0.;
    
    for(float i = 1.; i <= Depth; ++i) {
        fib += i;
        color += RadialBlur(tex, coord, res, i * OffsetDist)/ fib;
        fibTotal += 1./fib;
    }
    return color/fibTotal;
}
/*
vec3 fastBlur(sampler2D tex, vec2 uv, vec2 res, vec2 kd){
    float r = kd.x * kd.y;
    float rr = 1.0/r;
    vec2 texel = (1.0 / res);
    
    vec3 col = vec3(0.0);
    float a = 1.0;
    for(float x = -r; x <= r; x += kd.y)
    {       
        for(float y = -r; y <= r; y += kd.y)
        {
            a++;
            vec2 c = uv + vec2(x,y) * texel;

            col += texture2D(tex, c 
            + fract(sin(dot(c, vec2(12.9898, 78.233))) * 43758.5453) * texel * kd.y * 2.0
            - kd.yy * texel
            ).rgb * (2.0 - distance(vec2(x,y) * rr, vec2(0.0)));
        }
        
    }
    return col / a;
}*/
/*
vec3 blurBokeh(sampler2D tex, vec2 uv, vec2 tSize, float radius, float amount)
{
  float ITERATIONS = 150.0;
  float ONEOVER_ITR = 1.0 / ITERATIONS;
  float GOLDEN_ANGLE = 2.39996323;

	vec3 acc = vec3(0.0);
	vec3 div = vec3(0.0);
  vec2 pixel = vec2(tSize.y/tSize.x, 1.0) * radius * .025;
  float r = 1.0;

	for (float j = 0.0; j < GOLDEN_ANGLE * ITERATIONS; j += GOLDEN_ANGLE)
    {

		vec3 col = texture2D(tex, uv + pixel * Sample(j, r)).xyz;
       // col = col * col * 1.2; // ...contrast it for better highlights
		vec3 bokeh = vec3(.5) + pow(col, vec3(10.0)) * amount;
		acc += col * bokeh;
		div += bokeh;
	}
	return acc / div;
}*/

float rand (in vec2 st) {
    return fract(sin(dot(st.xy,
    vec2(12.9898,78.233)))
    * 43758.5453123);
}

vec2 rand2( vec2 p)	{
	return fract(vec2(sin(p.x * 591.32 + p.y * 154.077), cos(p.x * 391.32 + p.y * 49.077)));
}

vec3 randomOnSphere(in vec2 st) {
  vec3 randN = vec3(rand(st), rand(st), rand(st)); 
  float theta = randN.x * 2.0 * 3.14159265;
  float v = randN.y;

  float phi = acos(2.0 * v - 1.0);
  float r = pow(randN.z, 1.0 / 3.0);
  float x = r * sin(phi) * cos(theta);
  float y = r * sin(phi) * sin(theta);
  float z = r * cos(phi);

  return vec3(x, y, z);
}

float cnoise (vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float surface3 ( vec3 coord ) {
        float frequency = 4.0;
        float n = 0.0;  
        n += 1.0    * abs( cnoise( vec2(coord * frequency) ) );
        n += 0.5    * abs( cnoise( vec2(coord * frequency * 2.0) ) );
        n += 0.25   * abs( cnoise( vec2(coord * frequency * 4.0) ) );
        return n;
}

vec3 warp3d(vec3 pos, float t) {
    float curv =.35, a = 1.2, b = 0.2;
    pos *= 3.;
    for(float k = 1.0; k < 4.0; k += 1.0){ 
        pos.x += curv * sin(t + k * a * pos.y) + t * b;
        pos.y += curv * cos(t + k * a * pos.x);
        pos.y += curv * sin(t + k * a * pos.z) + t * b;
        pos.z += curv * cos(t + k * a * pos.y);
        pos.z += curv * sin(t + k * a * pos.x) + t * b;
        pos.x += curv * cos(t + k * a * pos.z);
    }
    return 0.5 + 0.5 * cos(pos.xyz + vec3(1,2,4));
}

vec2 rotate2D(vec2 v, float deg) {
  float theta = deg / 180.0 * PI;
  float c = cos(theta);
  float s = sin(theta);
  return vec2(v.x * c - v.y * s, v.x * s + v.y * c);
}

float normalizeRange (float value, float minValue, float maxValue) {
  return ((value - minValue) / (maxValue - minValue))*2.0-0.5;
}

vec3 generateNormal(sampler2D tex, vec2 texCoord, vec2 texelSize) {
    vec3 dx = vec3(texelSize.x, 0.0, texture2D(tex, texCoord + vec2(texelSize.x, 0.0)).r - texture2D(tex, texCoord - vec2(texelSize.x, 0.0)).r);
    vec3 dy = vec3(0.0, texelSize.y, texture2D(tex, texCoord + vec2(0.0, texelSize.y)).r - texture2D(tex, texCoord - vec2(0.0, texelSize.y)).r);
    return normalize(cross(dy, -dx));
}
/*
int vec3ToInt(vec3 color) {
  vec3 scaledColor = color * 255.0;
  vec3 roundedColor = round(scaledColor);
  int intValue = int(roundedColor.r) * 256 * 256 + int(roundedColor.g) * 256 + int(roundedColor.b);
  return intValue;
}*/

float sumVec3(vec3 vec) {
  return vec.x+vec.y+vec.z;
}

vec3 powVec3(vec3 vec, float n) {
  return vec3(pow(vec.x, n), pow(vec.y, n), pow(vec.z, n));
}

float linearizeDepth(float depth, float near, float far)
{
    float z = depth * 2.0 - 1.0; 
    return (2.0 * near * far) / (far + near - z * (far - near));
}

vec3 clampVec3(vec3 value, vec3 minVal, vec3 maxVal) {
  return vec3(
    clamp(value.x, minVal.x, maxVal.x),
    clamp(value.y, minVal.y, maxVal.y),
    clamp(value.z, minVal.z, maxVal.z)
  );
}