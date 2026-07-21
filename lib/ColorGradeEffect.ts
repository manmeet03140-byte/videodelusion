'use client';

import { Effect } from 'postprocessing';
import { Uniform, Vector3 } from 'three';
import { colorGradeFragmentShader } from '@/shaders/colorGrade';

/**
 * postprocessing v6 Effect subclass for ASC-CDL color grading.
 *
 * The v6 Effect API does NOT use tDiffuse. Instead the fragment shader
 * implements:  mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
 * The base Effect class handles reading the scene render into inputColor automatically.
 */
export class ColorGradeEffect extends Effect {
  constructor() {
    super('ColorGradeEffect', colorGradeFragmentShader, {
      uniforms: new Map<string, Uniform>([
        ['uLift',  new Uniform(new Vector3(0, 0, 0))],
        ['uGamma', new Uniform(new Vector3(1, 1, 1))],
        ['uGain',  new Uniform(new Vector3(1, 1, 1))],
      ]),
    });
  }

  setLift(v: Vector3)  { (this.uniforms.get('uLift')  as Uniform).value = v; }
  setGamma(v: Vector3) { (this.uniforms.get('uGamma') as Uniform).value = v; }
  setGain(v: Vector3)  { (this.uniforms.get('uGain')  as Uniform).value = v; }
}
