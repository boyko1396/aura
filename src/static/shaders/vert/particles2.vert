#include <commonMain>
#include <chank>



uniform float uPointsCount;
uniform vec3 uMousePosSphere;
uniform sampler2D voronoi;


varying vec3 vPos;
varying vec2 vUV;
varying vec3 vNormal;
varying float vDepth;
varying float vVertID;
varying vec3 vAngle;
varying float vAngleSpeed;
varying float vLoadValue;
varying float vPostLoad;

mat3 rotateX(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat3(
        1.0, 0.0, 0.0,
        0.0, c, -s,
        0.0, s, c
    );
}

mat3 rotateY(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat3(
        c, 0.0, s,
        0.0, 1.0, 0.0,
        -s, 0.0, c
    );
}

mat3 rotateZ(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat3(
        c, -s, 0.0,
        s, c, 0.0,
        0.0, 0.0, 1.0
    );
}

void main() {
  //float idx = float(gl_VertexID);
  vec3 pos = vec3(position);
  vec3 view = uViewPos;
  float t = uTime;

  float radius = SPHERE_RADIUS;
  vec3 center = SPHERE_POS;
  vec3 direction = normalize(pos - center);




  //! ROTATION
  t *= ANGLE_SPEED; 
  float angleNoiseSize = ANGLE_NOISE_SIZE;
  float angleValue = ANGLE_VALUE;
  vec3 angle;


  //! STATE LOADING
  float loadVal = 2.0;//sin(uTime*0.1)*2.0;
  float postLoad = 0.0;

  loadVal = clamp(loadVal, 0.0, 2.0);

  if (loadVal > 1.0) {
      postLoad = mix(0.0, 1.0, (loadVal - 1.0) / 1.0);
  }
  postLoad = clamp(postLoad, 0.0, 1.0);

  vLoadValue = loadVal;
  vPostLoad = postLoad;



  //! EXPLOSION VALUE
  /*float explosion = 0.0;

  if (uTime > 2.0*PI) 
  explosion = sin(uTime*0.75)*1.0+1.0;
  
  t -= exp(explosion*2.0)*0.1;
  */



  angle.x = (
    sin(pos.x*angleNoiseSize+t)
    +cos(pos.y*angleNoiseSize+t)
    -sin(pos.z*angleNoiseSize+t)
  ) * angleValue;
  angle.y = (
    -sin(pos.x*angleNoiseSize+t)
    +sin(pos.y*angleNoiseSize+t)
    +cos(pos.z*angleNoiseSize+t)
  ) * angleValue;
  angle.z = (
    cos(pos.x*angleNoiseSize+t)
    -sin(pos.y*angleNoiseSize+t)
    +cos(pos.z*angleNoiseSize+t)
  ) * angleValue;


  angle *= postLoad;





  //! RANDOM
  #ifdef IS_RAND
    float randScale = RAND_SCALE;
    angle += vec3(
      surface3(vec3(pos.xy*100.0, 0.0))*randScale,
      surface3(vec3(pos.yz*100.0, 0.0))*randScale,
      surface3(vec3(pos.zx*100.0, 0.0))*randScale
    );
  #endif

  vAngle = angle;

/*
  //! AURA
  #ifdef IS_AURA
    vec3 aura = AURA;
    if (mod(idx, aura.x) <= 0.0) {
      radius += tan(surface3(vec3(pos.xy*aura.y+t*0.01, 0.0)))*aura.z;
    }
  #endif


  //! AURA INSIDE
  #ifdef IS_AURA_INSIDE
    vec3 auraIns = AURA_INSIDE;
    if (mod(idx, auraIns.x) <= 0.0) {
      radius -= fract(surface3(vec3(pos.xy*auraIns.y+t*0.01, 0.0)))*auraIns.z;
    }
  #endif
*/


  //! STATE EXPLOSION
  /*
  if (explosion > 1.5) {
    radius += explosion*0.4-0.9;
  } else {
    radius -= explosion*0.2;
  }

  explosion -= 1.0;
  explosion = clamp(explosion, 0.0, 1.0);


  if (explosion > 0.0)
  angle *= 1.0-(explosion*2.0)*0.7; 



  //radius += (tan(uTime*3.0+surface3(vec3(pos.xy*100.0+uTime*0.1, 0.0)))*0.2)*(explosion*0.1);
  radius += tan(uTime+exp(surface3(vec3(pos.xy*100.0+uTime*0.1, 0.0))))*(explosion*0.1);
*/



  //! SPEED
  vAngleSpeed = (abs(angle.x)+abs(angle.y)+abs(angle.z));
  //vAngleSpeed = exp(radius*0.1)*0.7+0.05;


  //! ROTATION SHERE
  #ifdef IS_ROTATION_SHERE
    angle.y = mod(angle.y+t*ROTATION_SPHERE_SPEED, PI);
  #endif


  //! STATE 1
  vec3 rotatedDirection = rotateX(angle.x) * rotateY(angle.y) * rotateZ(angle.z) * direction;
  vec3 posState1 = center + rotatedDirection * radius;
  pos = posState1;

  //! STATE 2



  //! STATE MIX
/*
  float stateValue = 0.0;uMouse.x/uResolution.x;
  pos = mix(posState1, posState2, stateValue);
  vSpeed = mix(speedState1, speedState2, stateValue);
*/






  //! BACK PARTICLES TO FRONT
  #ifdef IS_BACK_TO_FRONT
    pos.z = abs(pos.z);
  #endif






  vUV = uv;
  vNormal = normal;
  vPos = position;
  //vVertID = idx;
  vDepth = length((modelViewMatrix * vec4(pos, 1.0)).xyz)
  -distance(view, vec3(0.0))+(6.0-INSIDE_SHERE_SIZE);


  vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
  gl_PointSize = 1.0;
}





    /*
      vec3 randNoise = vec3(
        surface3(vec3(pos.xyz*0.1)),
        surface3(vec3(pos.xyz*0.1+vec3(10., 20., 30.0))),
        surface3(vec3(pos.xyz*0.1+vec3(50., 40., 80.0)))
      );

      angle.x = (
        cos(pos.x*angleNoiseSize+t+randNoise.x)
        +sin(pos.y*angleNoiseSize+t+randNoise.y)
        -cos(pos.z*angleNoiseSize+t+randNoise.z)
      ) * angleValue;
      angle.y = (
          -cos(pos.x*angleNoiseSize+t+randNoise.x)
          +cos(pos.y*angleNoiseSize+t+randNoise.y)
          +sin(pos.z*angleNoiseSize+t+randNoise.z)
      ) * angleValue;

      angle.z = (
          sin(pos.x*angleNoiseSize+t+randNoise.x)
          -cos(pos.y*angleNoiseSize+t+randNoise.y)
          +sin(pos.z*angleNoiseSize+t+randNoise.z)
      ) * angleValue;
      */    
      
      
      
  /*#ifdef IS_AURA
    vec3 aura = AURA;
    float modCondition = step(mod(idx, aura.x), 0.0);
    radius += modCondition * tan(surface3(vec3(pos.xy*aura.y+t*0.01, 0.0)))*aura.z;
  #endif*/

  /*#ifdef IS_AURA_INSIDE
    vec3 auraIns = AURA_INSIDE;
    float modConditionIns = step(mod(idx, auraIns.x), 0.0);
    radius -= modConditionIns * fract(surface3(vec3(pos.xy*auraIns.y+t*0.01, 0.0)))*auraIns.z;
  #endif*/


  /*
    vec3 voronoiN = texture(voronoi, uv).rgb;
    float x = (voronoiN.b);

    vec3 normD = vec3(normalize(voronoiN.rg), 1.0)*(x*0.25);
    vec3 posState2 = center - normalize(normD - normalize(pos)) * radius;
    float speedState2 = (sin((x)*PI))*3.0-min(0.0, pos.z);
    //vSpeed = (sin(x*PI/PI*0.5))*15.0;
    //vSpeed = x*8.0;
*/