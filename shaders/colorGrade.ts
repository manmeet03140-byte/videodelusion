// Color Grade GLSL — ASC-CDL Lift / Gamma / Gain
// For postprocessing v6: Effect subclass receives `inputColor` (vec4) directly.
// No tDiffuse sampler needed — just read inputColor and write outputColor.

export const colorGradeFragmentShader = /* glsl */ `
  uniform vec3 ulift;    // shadows  (0.0 = neutral)
  uniform vec3 uGamma;   // midtones (1.0 = neutral)
  uniform vec3 uGain;    // highlights (1.0 = neutral)

  // ASC-CDL grade: out = pow(clamp(in * gain + lift, 0.0, 1.0), 1.0 / gamma)
  vec3 colorGrade(vec3 color, vec3 lift, vec3 gamma, vec3 gain) {
    vec3 graded = color * gain + lift;
    graded = clamp(graded, 0.0, 1.0);
    vec3 safeGamma = max(gamma, vec3(0.01));
    graded = pow(graded, 1.0 / safeGamma);
    return graded;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec3 graded = colorGrade(inputColor.rgb, uLift, uGamma, uGain);
    outputColor = vec4(graded, inputColor.a);
  }
`;

