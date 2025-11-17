'use client';

import { useState } from 'react';

const defaultForm = {
  prompt: 'Dramatic aerial shot of a futuristic coastal city at dawn, golden hour lighting, volumetric fog rolling across skyscrapers, cinematic atmosphere',
  negativePrompt: 'cartoon, low resolution, artifacts, overexposed, distorted faces',
  duration: '12',
  aspectRatio: '21:9',
  frameRate: '48',
  camera: 'Slow cinematic dolly with subtle parallax',
  lens: 'ARRI Signature Prime 35mm, T1.8',
  lighting: 'Sunrise light bloom, soft rim lighting, volumetric god rays',
  seed: ''
};

const aspectRatios = ['16:9', '21:9', '4:3', '9:16'];
const durations = ['6', '8', '12', '16'];
const frameRates = ['24', '30', '48', '60'];

export default function PromptBuilder({ onGenerate, disabled }) {
  const [form, setForm] = useState(defaultForm);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onGenerate(form);
  };

  return (
    <form onSubmit={handleSubmit} className="panel">
      <header className="panel-header">
        <div>
          <h2>Create a cinematic sequence</h2>
          <p>Engineer a shot-level prompt for Google Veo 3.1 and render in 8K.</p>
        </div>
        <button type="submit" className="primary" disabled={disabled}>
          {disabled ? 'Generating…' : 'Generate 8K Video'}
        </button>
      </header>

      <label className="field">
        <span>Primary prompt</span>
        <textarea
          required
          value={form.prompt}
          onChange={(event) => update('prompt', event.target.value)}
          minLength={20}
          rows={4}
          placeholder="Describe the scene, mood, motion, environment, and storytelling beats"
        />
      </label>

      <div className="grid two">
        <label className="field">
          <span>Duration (seconds)</span>
          <select
            value={form.duration}
            onChange={(event) => update('duration', event.target.value)}
          >
            {durations.map((option) => (
              <option key={option} value={option}>
                {option}s
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Frame rate</span>
          <select
            value={form.frameRate}
            onChange={(event) => update('frameRate', event.target.value)}
          >
            {frameRates.map((option) => (
              <option key={option} value={option}>
                {option} fps
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid two">
        <label className="field">
          <span>Aspect ratio</span>
          <select
            value={form.aspectRatio}
            onChange={(event) => update('aspectRatio', event.target.value)}
          >
            {aspectRatios.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Seed (optional)</span>
          <input
            value={form.seed}
            onChange={(event) => update('seed', event.target.value)}
            placeholder="Lock variation with a numeric seed"
          />
        </label>
      </div>

      <div className="grid two">
        <label className="field">
          <span>Camera direction</span>
          <input
            value={form.camera}
            onChange={(event) => update('camera', event.target.value)}
            placeholder="Describe camera movement, lens height, motion"
          />
        </label>

        <label className="field">
          <span>Lens & format</span>
          <input
            value={form.lens}
            onChange={(event) => update('lens', event.target.value)}
            placeholder="Lens selection, aperture, sensor format"
          />
        </label>
      </div>

      <label className="field">
        <span>Lighting notes</span>
        <input
          value={form.lighting}
          onChange={(event) => update('lighting', event.target.value)}
          placeholder="Key light, temperature, volumetric cues"
        />
      </label>

      <label className="field">
        <span>Negative prompt</span>
        <textarea
          value={form.negativePrompt}
          onChange={(event) => update('negativePrompt', event.target.value)}
          rows={3}
          placeholder="Elements to avoid in the render"
        />
      </label>
    </form>
  );
}
