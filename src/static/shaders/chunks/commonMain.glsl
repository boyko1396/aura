uniform float uTime;
uniform int uFrame;
uniform vec2 uResolution;
uniform float uAspect;
uniform vec4 uMouse;
uniform float uMouseTime;
uniform vec3 uViewPos;
uniform float uDPR;
uniform bool uIsMobile;



    #define STATE_VALUE 0

    #define SPHERE_RADIUS 1.0;
    #define SPHERE_POS vec3(0.0, 0.0, 0.0);

    #define ANGLE_SPEED 0.5;
    #define ANGLE_NOISE_SIZE 4.5
    #define ANGLE_VALUE 0.45
    #define RAND_SCALE 0.05
    #define ROTATION_SPHERE_SPEED 0.1
    #define AURA vec3(5.0, 10.0, 0.025)
    #define AURA_INSIDE vec3(10.0, 5.0, 0.3)
    #define IS_RAND
    //#define IS_AURA
    //#define IS_AURA_INSIDE
    //#define IS_ROTATION_SHERE
    #define IS_BACK_TO_FRONT
    //#define IS_MOUSE_EFFECT 





#define fragColor gl_FragColor
#define fragCoord gl_FragCoord



#define INSIDE_SHERE_SIZE 3.1
