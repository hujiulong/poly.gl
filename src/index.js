import './init';

// WebGL
export {
    isWebGL,
    isWebGL2 } from './webgl-utils/webgl-checks';
export {
    getKeyValue,
    getKey } from './webgl-utils/constants-to-keys';

export {
    // context
    createGLContext,
    destroyGLContext,
    resizeGLContext,
    pollGLContext,
    setContextDefaults,
    destroyGLContext as deleteGLContext,
    pollGLContext as pollContext,

    trackContextCreation,
    trackContextState,

    // context-state
    resetParameters,
    getParameter,
    getParameters,
    setParameter,
    setParameters,
    withParameters,
    getModifiedParameters,

    // context-limits
    getContextInfo,
    getGLContextInfo,
    getContextLimits,
    glGetDebugInfo,

    // context-features
    FEATURES,
    hasFeature,
    hasFeatures,
    getFeatures,
    canCompileGLGSExtension,

    // debug context
    makeDebugContext,

} from './webgl-context';

// WebGL1 classes
export { default as Buffer } from './webgl/buffer';
export { Shader, VertexShader, FragmentShader } from './webgl/shader';
export { default as Program } from './webgl/program';
export { default as Framebuffer } from './webgl/framebuffer';
export { default as Renderbuffer } from './webgl/renderbuffer';
export { default as Texture2D } from './webgl/texture-2d';
export { default as TextureCube } from './webgl/texture-cube';

export { draw } from './webgl/draw';
export { clear, clearBuffer } from './webgl/clear';

// WebGL2 classes & Extensions
export { default as FenceSync } from './webgl/fence-sync';
export { default as Query } from './webgl/query';
export { default as Sampler } from './webgl/sampler';
export { default as Texture3D } from './webgl/texture-3d';
export { default as Texture2DArray } from './webgl/texture-2d-array';
export { default as TransformFeedback } from './webgl/transform-feedback';
export { default as VertexArray } from './webgl/vertex-array';
export { default as UniformBufferLayout } from './webgl/uniform-buffer-layout';

// Core Classes
export { default as Model } from './core/model';
export { default as AnimationLoop } from './core/animation-loop';
export { default as AnimationLoopProxy } from './core/animation-loop-proxy';

// Math
export * from './math';

// EXPERIMENTAL EXPORTS

import { clearBuffer } from './webgl/clear';
import { default as Transform } from './core/transform';

export const experimental = {
    clearBuffer,
    Transform
};

// DEPRECATED EXPORTS

export { // Should be optional import for application
    default as GL } from './constants';

export { readPixels } from './webgl/functions';
export { default as FramebufferObject } from './webgl/framebuffer';
