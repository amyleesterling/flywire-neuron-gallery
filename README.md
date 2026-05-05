# FlyWire Neuron Gallery

Connectome renders by **Tyler Sloan** and **Amy Sterling** for [FlyWire](https://flywire.ai). Real *Drosophila* brain reconstructions, mapped synapse by synapse.

**Live:** [amyleesterling.github.io/flywire-neuron-gallery/](https://amyleesterling.github.io/flywire-neuron-gallery/)

## Stack
- Vite + React 19 + TypeScript
- Tailwind CSS v4
- Three.js (interactive neuropil brain at the Brain-Wide Connectivity section)
- Framer Motion
- React Router v7

## Develop
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

Output goes to `dist/`. Production base path is `/flywire-neuron-gallery/`.

## Deploy
GitHub Actions workflow at `.github/workflows/deploy.yml` builds on every push to `main` and publishes to GitHub Pages. The repo's Pages source must be set to **GitHub Actions** (Settings → Pages → Build and deployment).

## Credit & contact
Visualizations by Tyler Sloan and Amy Sterling for FlyWire. Please contact [flywire@princeton.edu](mailto:flywire@princeton.edu) for per-image captions and credits.

Neuropil meshes (3D viewer) sourced from `gs://flywire_neuropil_meshes/neuropils/neuropil_mesh_v141_v3` (publicly available).
