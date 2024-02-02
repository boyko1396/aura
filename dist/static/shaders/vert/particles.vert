#include <commonMain>
#include <chank>



uniform float uPointsCount;
uniform vec3 uMousePosSphere;


varying vec3 vPos;
varying float vDepth;
varying float vSpeed;
varying float vVertID;

uniform sampler2D tNoise;


void main() {

  vec3 pos = vec3(position);
  float idx = float(gl_VertexID);
  vec3 view = uViewPos;
  float t = uTime;
  vec2 m = (uMouse.xy/uResolution);



    float radius = 1.0;
    vec3 center = vec3(0.0);
    vec3 direction = normalize(pos - center);
    float angleSpeed = 0.0;
    float zAngleSpeed = 0.05;


    float angle = (surface3(vec3(pos.xy*0.3+t*angleSpeed+10.0, 0.0)))*2.0;
    float zAngle = (surface3(vec3(pos.xy*0.3+t*zAngleSpeed, 0.0)))*2.0;

    vSpeed = (abs(angle)+abs(zAngle))*0.5;



    //! RANDOM
    angle += (surface3(vec3(pos.xy*100.0, 0.0)))*0.1;
    zAngle -= (surface3(vec3(pos.yx*100.0, 0.0)))*0.1;



    //! WAVE HEIGHT
    radius += (surface3(vec3(pos.xy+t*0.1, 0.0)))*0.1;
    //radius += (surface3(vec3(pos.xy*5.0+t*0.01, 0.0)))*0.1;



    //! AURA
    //radius += sin(idx*40.0)*0.025;


    //! ROTATION
    mat3 rotationMatrix = mat3(
        cos(angle), 0.0, sin(angle),
        0.0, 1.0, 0.0,
        -sin(angle), 0.0, cos(angle)
    );
    mat3 zRotationMatrix = mat3(
        cos(zAngle), -sin(zAngle), 0.0,
        sin(zAngle), cos(zAngle), 0.0,
        0.0, 0.0, 1.0
    );

    vec3 rotatedDirection = zRotationMatrix * rotationMatrix * direction;
    pos = center + rotatedDirection * radius;











    //! MOUSE
    m = m * 2.0 - 1.0;
    float mD = 0.08-distance(m, vec2(0.0))*0.18;
    mD = clamp(mD, 0.0, 1.0);

    vec3 repelDirection = normalize(uMousePosSphere - pos)+sin(uTime+pos*10.0)*0.1;
    pos -= repelDirection * (tan(distance(uMousePosSphere, pos)*10.0)*mD);

/*
    if (distance(pos, uMousePosSphere) < 0.3)
    pos += repelDirection*(tan(distance(uMousePosSphere, pos)*10.0)*mD)*3.0;
*/




/*
  if (pos.z <= 0.0) {
    pos.z *= -1.0;
  }
*/


  vPos = position;
  vVertID = idx;
  vDepth = length((modelViewMatrix * vec4(pos, 1.0)).xyz)
  -distance(view, vec3(0.0))+(6.0-INSIDE_SHERE_SIZE);


  vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
  gl_PointSize = 1.0;
}