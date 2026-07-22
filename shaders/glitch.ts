// Glitch / Datamosh displacement — vertex + fragment shaders for VideoPlane

export const glitchVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uGlitch;    // 0.0 = calm, 1.0 = full chaos
  uniform sampler2D uNoise; // optional noise texture; we generate analytically
  varying vec2 vUv;
  varying float vDisplace;

  // Analytical noise (hash-based, no texture needed)
  float hash(vec2 p) {
    p = fract(p * vec2(443.897, 441.423));
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vUv = uv;

    // Block-level glitch: quantise UVs into coarse blocks that shift
    float blockSize = mix(1.0, 0.05, uGlitch);
    vec2 blockUv = floor(uv / blockSize) * blockSize;

    // Horizontal scan-line tear
    float scanTear = step(0.98, noise(vec2(blockUv.y * 40.0, uTime * 5.0)));
    float tearAmount = scanTear * uGlitch * 0.4;

    // Z displacement
    float n = noise(blockUv * 8.0 + uTime * 0.5);
    float displaceZ = n * uGlitch * 1.5;

    // X displacement (datamosh pixel shift)
    float displaceX = (noise(blockUv * 20.0 + uTime * 3.0) - 0.5) * uGlitch * 0.8;

    vDisplace = displaceZ;

    vec3 pos = position;
    pos.z += displaceZ;
    pos.x += displaceX + tearAmount;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const glitchFragmentShader = /* glsl */ `
  uniform sampler2D uVideoTexture;
  uniform float uGlitch;
  uniform float uTime;
  uniform float uGradeAmount;
  varying vec2 vUv;
  varying float vDisplace;

  void main() {
    // Chromatic aberration — RGB channel split proportional to glitch
    float aberration = uGlitch * 0.025;
    vec2 dir = vUv - 0.5;

    float r = texture2D(uVideoTexture, vUv + dir * aberration).r;
    float g = texture2D(uVideoTexture, vUv).g;
    float b = texture2D(uVideoTexture, vUv - dir * aberration).b;

    vec3 color = vec3(r, g, b);

    // LOG Simulation (flat, low contrast, low saturation)
    vec3 logColor = color;
    logColor = mix(vec3(0.5), logColor, 0.4); // reduce contrast
    logColor = mix(vec3(dot(logColor, vec3(0.299, 0.587, 0.114))), logColor, 0.4); // reduce saturation
    logColor *= 1.1; // slightly brighten
    
    // Smooth transition from LOG to original graded video based on scroll
    color = mix(logColor, color, uGradeAmount);

    // Scanline flicker on high glitch
    float scan = sin(vUv.y * 800.0 + uTime * 60.0) * 0.04 * uGlitch;
    color += scan;

    // Brightness flash on displacement peaks
    color += vDisplace * 0.15 * uGlitch;

    gl_FragColor = vec4(clamp(color, 0.0, 1.5), 1.0);
  }
`;
