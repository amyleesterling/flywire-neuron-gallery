export interface NeuropilDef {
  id: string;
  label: string;
  color: string;
}

// Actual FlyWire neuropil IDs — each has a downloaded GLB at public/meshes/neuropils/{id}.glb
export const NEUROPILS: NeuropilDef[] = [
  { id: "ME_R",    label: "Medulla (R)",               color: "#00d4ff" },
  { id: "ME_L",    label: "Medulla (L)",               color: "#00d4ff" },
  { id: "LA_R",    label: "Lamina (R)",                color: "#80e8ff" },
  { id: "LA_L",    label: "Lamina (L)",                color: "#80e8ff" },
  { id: "LO_R",    label: "Lobula (R)",                color: "#ff9500" },
  { id: "LO_L",    label: "Lobula (L)",                color: "#ff9500" },
  { id: "LOP_R",   label: "Lobula Plate (R)",          color: "#ff44aa" },
  { id: "LOP_L",   label: "Lobula Plate (L)",          color: "#ff44aa" },
  { id: "MB_CA_R", label: "Mushroom Body Calyx (R)",   color: "#ffdd00" },
  { id: "MB_CA_L", label: "Mushroom Body Calyx (L)",   color: "#ffdd00" },
  { id: "MB_PED_R",label: "Mushroom Body Ped (R)",     color: "#ffcc00" },
  { id: "MB_PED_L",label: "Mushroom Body Ped (L)",     color: "#ffcc00" },
  { id: "MB_VL_R", label: "Mushroom Body VL (R)",      color: "#ffbb00" },
  { id: "MB_VL_L", label: "Mushroom Body VL (L)",      color: "#ffbb00" },
  { id: "MB_ML_R", label: "Mushroom Body ML (R)",      color: "#ffaa00" },
  { id: "MB_ML_L", label: "Mushroom Body ML (L)",      color: "#ffaa00" },
  { id: "EB",      label: "Ellipsoid Body",            color: "#00ff88" },
  { id: "FB",      label: "Fan-shaped Body",           color: "#0099ff" },
  { id: "PB",      label: "Protocerebral Bridge",      color: "#44ffcc" },
  { id: "AMMC_R",  label: "AMMC (R)",                  color: "#aa66ff" },
  { id: "AMMC_L",  label: "AMMC (L)",                  color: "#aa66ff" },
  { id: "GNG",     label: "Gnathal Ganglia",           color: "#ff4455" },
  { id: "AOTU_R",  label: "AOTU (R)",                  color: "#aaff00" },
  { id: "AOTU_L",  label: "AOTU (L)",                  color: "#aaff00" },
  { id: "WED_R",   label: "Wedge (R)",                 color: "#ff88aa" },
  { id: "WED_L",   label: "Wedge (L)",                 color: "#ff88aa" },
  { id: "AVLP_R",  label: "AVLP (R)",                  color: "#bb88ff" },
  { id: "AVLP_L",  label: "AVLP (L)",                  color: "#bb88ff" },
  { id: "LH_R",    label: "Lateral Horn (R)",          color: "#ff6644" },
  { id: "LH_L",    label: "Lateral Horn (L)",          color: "#ff6644" },
  { id: "AL_R",    label: "Antennal Lobe (R)",         color: "#ff99cc" },
  { id: "AL_L",    label: "Antennal Lobe (L)",         color: "#ff99cc" },
  { id: "SLP_R",   label: "Superior Lat. Proto (R)",   color: "#88ddff" },
  { id: "SLP_L",   label: "Superior Lat. Proto (L)",   color: "#88ddff" },
  { id: "SMP_R",   label: "Superior Med. Proto (R)",   color: "#aaeeff" },
  { id: "SMP_L",   label: "Superior Med. Proto (L)",   color: "#aaeeff" },
];

// Maps Brain-Wide Connectivity image filenames to neuropil IDs to highlight
const MB_R = ["MB_CA_R", "MB_PED_R", "MB_VL_R", "MB_ML_R"];
const MB_L = ["MB_CA_L", "MB_PED_L", "MB_VL_L", "MB_ML_L"];

export const FILENAME_TO_NEUROPILS: Record<string, string[]> = {
  "1_ME_output_whole.view.cam_0000.png":         ["ME_R", "ME_L"],
  "1.1_AMMC_input_.png":                         ["AMMC_R", "AMMC_L"],
  "1.1_AMMC_output_.png":                        ["AMMC_R", "AMMC_L"],
  "1.2_GNG_input_.png":                          ["GNG"],
  "1.2_GNG_output_.png":                         ["GNG"],
  "1.3_ME_input_whole.view.cam_0000.png":        ["ME_R", "ME_L"],
  "1.4_EB_input_.png":                           ["EB"],
  "1.4_EB_output_.png":                          ["EB"],
  "1.5_FB_input_.png":                           ["FB"],
  "1.5_FB_output_.png":                          ["FB"],
  "1.6_WED_R_to_AVLP_R_bilateral_nonreciprocal_.png": ["WED_R", "WED_L", "AVLP_R", "AVLP_L"],
  "1.7_LA_ME_whole.view.cam.png":                ["LA_R", "LA_L", "ME_R", "ME_L"],
  "1.8_AOTU_input_.png":                         ["AOTU_R", "AOTU_L"],
  "1.8_AOTU_output_.png":                        ["AOTU_R", "AOTU_L"],
  "1.9_Highest_cross-brain-connectivity_ME_L-ME_R_4k_neuropil.view.cam_0000.png": ["ME_R", "ME_L"],
  "1.10.c_keynyon_cmap_3600c.png":               [...MB_R, ...MB_L],
};
