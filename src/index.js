// WebGL
export {
    default as GL,
    glGet,
    glKey } from './webgl/gl-constants';
export {
    trackContextCreation,
    trackContextState } from './webgl-utils';
export {
    isWebGL,
    isWebGL2,
    setContextDefaults,
    createGLContext,
    deleteGLContext,
    pollContext } from './webgl/context';
export {
    resetParameters,
    getParameter,
    getParameters,
    setParameter,
    setParameters,
    withParameters,
    getModifiedParameters } from './webgl/context-state';
export {
    getContextInfo,
    getGLContextInfo,
    getContextLimits,
    glGetDebugInfo } from './webgl/context-limits';
export {
    FEATURES,
    hasFeature,
    hasFeatures,
    getFeatures,
    canCompileGLGSExtension } from './webgl/context-features';

export { default as Buffer } from './webgl/buffer';
export { Shader, VertexShader, FragmentShader } from './webgl/shader';
export { default as Program } from './webgl/program';
export { default as Framebuffer } from './webgl/framebuffer';
export { default as Renderbuffer } from './webgl/renderbuffer';
export { default as Texture2D } from './webgl/texture-2d';
export { default as TextureCube } from './webgl/texture-cube';

export { draw } from './webgl/draw';
export { clear, clearBuffer } from './webgl/clear';

// WebGL2 & Extensions
export { default as FenceSync } from './webgl/fence-sync';
export { default as Query } from './webgl/query';
export { default as Sampler } from './webgl/sampler';
export { default as Texture3D } from './webgl/texture-3d';
export { default as Texture2DArray } from './webgl/texture-2d-array';
export { default as TransformFeedback } from './webgl/transform-feedback';
export { default as VertexArray } from './webgl/vertex-array';
export { default as UniformBufferLayout } from './webgl/uniform-buffer-layout';

// Core Classes
export { default as AnimationLoop } from './core/animation-loop';
export { default as AnimationLoopProxy } from './core/animation-loop-proxy';
// export {default as Object3D} from './core/object-3d';
// export {default as Group} from './core/group';

// EXPERIMENTAL EXPORTS

import { clearBuffer } from './webgl/clear';

export const experimental = {
    clearBuffer
};

// DEPRECATED EXPORTS

// DEPRECATED IN V4.1

export * from './math';

// DEPRECATED IN V3.0
export { readPixels } from './webgl/functions';
// Alias FramebufferObject to Framebuffer - API is fairly similar
export { default as FramebufferObject } from './webgl/framebuffer';
