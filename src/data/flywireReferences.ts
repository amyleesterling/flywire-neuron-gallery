// Reference publications mapped to each gallery card.
//
// Each Reference has a stable short ID (FW1, MB1, etc.) that's surfaced as a
// small badge in the Lightbox sidebar. CARD_REFERENCES and
// INTERACTIVE_VIEW_REFERENCES wire image titles / view titles to the
// reference IDs that should appear when that card is opened.

export type ReferenceId = string;

export interface Reference {
  id: ReferenceId;
  authors: string; // short form, e.g. "Dorkenwald et al."
  year: string;
  journal: string;
  title: string;
  url: string;
}

export const REFERENCES: Record<ReferenceId, Reference> = {
  // ── FlyWire / FAFB / whole-connectome package ────────────────────────
  FW1: {
    id: "FW1",
    authors: "Dorkenwald et al.",
    year: "2024",
    journal: "Nature",
    title: "Neuronal wiring diagram of an adult brain",
    url: "https://www.nature.com/articles/s41586-024-07558-y",
  },
  FW2: {
    id: "FW2",
    authors: "Schlegel et al.",
    year: "2024",
    journal: "Nature",
    title: "Whole-brain annotation and multi-connectome cell typing of Drosophila",
    url: "https://www.nature.com/articles/s41586-024-07686-5",
  },
  FW3: {
    id: "FW3",
    authors: "Matsliah et al.",
    year: "2024",
    journal: "Nature",
    title: "Neuronal parts list and wiring diagram for a visual system",
    url: "https://www.nature.com/articles/s41586-024-07981-1",
  },
  FW4: {
    id: "FW4",
    authors: "Lin et al.",
    year: "2024",
    journal: "Nature",
    title: "Network statistics of the whole-brain connectome of Drosophila",
    url: "https://www.nature.com/articles/s41586-024-07968-y",
  },
  FW5: {
    id: "FW5",
    authors: "Shiu et al.",
    year: "2024",
    journal: "Nature",
    title: "A Drosophila computational brain model reveals sensorimotor processing",
    url: "https://www.nature.com/articles/s41586-024-07763-9",
  },
  FW6: {
    id: "FW6",
    authors: "Garner et al.",
    year: "2024",
    journal: "Nature",
    title: "Connectomic reconstruction predicts visual features used for navigation",
    url: "https://www.nature.com/articles/s41586-024-07967-z",
  },
  FW7: {
    id: "FW7",
    authors: "Pospisil et al.",
    year: "2024",
    journal: "Nature",
    title: "The fly connectome reveals a path to the effectome",
    url: "https://www.nature.com/articles/s41586-024-07982-0",
  },
  FW8: {
    id: "FW8",
    authors: "Zheng et al.",
    year: "2018",
    journal: "Cell",
    title: "A Complete Electron Microscopy Volume of the Brain of Adult Drosophila melanogaster",
    url: "https://www.cell.com/cell/fulltext/S0092-8674(18)30787-6",
  },
  FW9: {
    id: "FW9",
    authors: "Nature Collection",
    year: "2024",
    journal: "Nature",
    title: "The FlyWire connectome",
    url: "https://www.nature.com/collections/hgcfafejia",
  },

  // ── Mushroom body / learning / memory ────────────────────────────────
  MB1: {
    id: "MB1",
    authors: "Aso et al.",
    year: "2014",
    journal: "eLife",
    title: "The neuronal architecture of the mushroom body provides a logic for associative learning",
    url: "https://elifesciences.org/articles/04577",
  },
  APL1: {
    id: "APL1",
    authors: "Lin et al.",
    year: "2014",
    journal: "Nat. Neurosci.",
    title: "A GABAergic anterior paired lateral neuron suppresses and is suppressed by olfactory learning",
    url: "https://www.nature.com/articles/nn.3660",
  },
  DPM1: {
    id: "DPM1",
    authors: "Keene et al.",
    year: "2006",
    journal: "Curr. Biol.",
    title: "Drosophila Dorsal Paired Medial Neurons Provide a General Mechanism for Memory Consolidation",
    url: "https://www.sciencedirect.com/science/article/pii/S0960982206017076",
  },
  DPM2: {
    id: "DPM2",
    authors: "Haynes et al.",
    year: "2015",
    journal: "eLife",
    title: "Dopamine neurons modulate dorsal paired medial neuron activity and promote memory consolidation in Drosophila",
    url: "https://elifesciences.org/articles/08318",
  },

  // ── Sex / courtship ───────────────────────────────────────────────────
  COURT1: {
    id: "COURT1",
    authors: "Demir & Dickson",
    year: "2005",
    journal: "Cell",
    title: "fruitless Splicing Specifies Male Courtship Behavior in Drosophila",
    url: "https://www.cell.com/cell/fulltext/S0092-8674(05)00403-5",
  },
  COURT2: {
    id: "COURT2",
    authors: "Manoli et al.",
    year: "2005",
    journal: "Nature",
    title: "Male-specific fruitless specifies the neural substrates of Drosophila courtship behaviour",
    url: "https://www.nature.com/articles/nature03859",
  },
  COURT3: {
    id: "COURT3",
    authors: "Kimura et al.",
    year: "2008",
    journal: "Cell",
    title: "fruitless and doublesex coordinate to generate male-specific neurons that can initiate courtship",
    url: "https://www.cell.com/cell/fulltext/S0092-8674(08)00729-2",
  },

  // ── Visual feature detection / optic lobe ────────────────────────────
  VIS1: {
    id: "VIS1",
    authors: "Wu et al.",
    year: "2016",
    journal: "eLife",
    title: "Visual projection neurons in the Drosophila lobula link feature detection to distinct behavioral programs",
    url: "https://elifesciences.org/articles/21022",
  },
  VIS2: {
    id: "VIS2",
    authors: "Klapoetke et al.",
    year: "2017",
    journal: "Nature",
    title: "Ultra-selective looming detection from radial motion opponency",
    url: "https://www.nature.com/articles/nature24626",
  },
  VIS3: {
    id: "VIS3",
    authors: "Takemura et al.",
    year: "2013",
    journal: "Nature",
    title: "A visual motion detection circuit suggested by Drosophila connectomics",
    url: "https://www.nature.com/articles/nature12450",
  },
  VIS4: {
    id: "VIS4",
    authors: "Strother et al.",
    year: "2017",
    journal: "Neuron",
    title: "The Emergence of Directional Selectivity in the Visual Motion Pathway of Drosophila",
    url: "https://www.cell.com/neuron/fulltext/S0896-6273(17)30087-4",
  },
  VIS5: {
    id: "VIS5",
    authors: "Meier et al.",
    year: "2014",
    journal: "Curr. Biol.",
    title: "Neural Circuit Components of the Drosophila OFF Motion Vision Pathway",
    url: "https://www.cell.com/current-biology/fulltext/S0960-9822(14)00366-8",
  },
  VIS6: {
    id: "VIS6",
    authors: "Fischbach & Dittrich",
    year: "1989",
    journal: "Cell Tissue Res.",
    title: "The optic lobe of Drosophila melanogaster. I. A Golgi analysis of wild-type structure",
    url: "https://link.springer.com/article/10.1007/BF00312180",
  },

  // ── Auditory / mechanosensory / AMMC ─────────────────────────────────
  AUD1: {
    id: "AUD1",
    authors: "Tootoonian et al.",
    year: "2012",
    journal: "J. Neurosci.",
    title: "Neural Representations of Courtship Song in the Drosophila Brain",
    url: "https://www.jneurosci.org/content/32/3/787",
  },
  AUD2: {
    id: "AUD2",
    authors: "Zhou et al.",
    year: "2015",
    journal: "eLife",
    title: "Central neural circuitry mediating courtship song perception in male Drosophila",
    url: "https://elifesciences.org/articles/08477",
  },

  // ── Navigation / central complex / ring neurons ──────────────────────
  CX1: {
    id: "CX1",
    authors: "Seelig & Jayaraman",
    year: "2015",
    journal: "Nature",
    title: "Neural dynamics for landmark orientation and angular path integration",
    url: "https://www.nature.com/articles/nature14446",
  },
  CX2: {
    id: "CX2",
    authors: "Green et al.",
    year: "2017",
    journal: "Nature",
    title: "A neural circuit architecture for angular integration in Drosophila",
    url: "https://www.nature.com/articles/nature22343",
  },
  CX3: {
    id: "CX3",
    authors: "Turner-Evans et al.",
    year: "2017",
    journal: "eLife",
    title: "Angular velocity integration in a fly heading circuit",
    url: "https://elifesciences.org/articles/23496",
  },
  AOTU1: {
    id: "AOTU1",
    authors: "Omoto et al.",
    year: "2020",
    journal: "iScience",
    title: "Parallel Visual Pathways with Topographic versus Nontopographic Organization Connect the Drosophila Eyes to the Central Brain",
    url: "https://www.sciencedirect.com/science/article/pii/S2589004220307823",
  },

  // ── Olfaction / antennal lobe / octopamine ───────────────────────────
  OLF1: {
    id: "OLF1",
    authors: "Seki et al.",
    year: "2017",
    journal: "BMC Biology",
    title: "Olfactory coding from the periphery to higher brain centers in the Drosophila brain",
    url: "https://bmcbiol.biomedcentral.com/articles/10.1186/s12915-017-0389-z",
  },
  OLF2: {
    id: "OLF2",
    authors: "Semmelhack & Wang",
    year: "2009",
    journal: "Nature",
    title: "Select Drosophila glomeruli mediate innate olfactory attraction and aversion",
    url: "https://www.nature.com/articles/nature07983",
  },
  OLF3: {
    id: "OLF3",
    authors: "Münch & Galizia",
    year: "2016",
    journal: "Sci. Rep.",
    title: "DoOR 2.0 — Comprehensive Mapping of Drosophila melanogaster Odorant Responses",
    url: "https://www.nature.com/articles/srep21841",
  },
  OA1: {
    id: "OA1",
    authors: "Busch et al.",
    year: "2009",
    journal: "J. Comp. Neurol.",
    title: "A map of octopaminergic neurons in the Drosophila brain",
    url: "https://onlinelibrary.wiley.com/doi/10.1002/cne.22066",
  },
  OA2: {
    id: "OA2",
    authors: "Suver et al.",
    year: "2012",
    journal: "J. Neurosci.",
    title: "Octopamine Neurons Mediate Flight-Induced Modulation of Visual Processing in Drosophila",
    url: "https://www.jneurosci.org/content/32/33/11224",
  },

  // ── Locomotion / descending neurons / motor programs ─────────────────
  LOCO1: {
    id: "LOCO1",
    authors: "Bidaye et al.",
    year: "2014",
    journal: "Science",
    title: "Neuronal control of Drosophila walking direction",
    url: "https://www.science.org/doi/10.1126/science.1249964",
  },
  LOCO2: {
    id: "LOCO2",
    authors: "Rayshubskiy et al.",
    year: "2020",
    journal: "Nat. Commun.",
    title: "Distributed control of motor circuits for backward walking in Drosophila",
    url: "https://www.nature.com/articles/s41467-020-19936-x",
  },
  LOCO3: {
    id: "LOCO3",
    authors: "Bidaye et al.",
    year: "2020",
    journal: "Neuron",
    title: "Two Brain Pathways Initiate Distinct Forward Walking Programs in Drosophila",
    url: "https://www.cell.com/neuron/fulltext/S0896-6273(20)30576-6",
  },
  LOCO4: {
    id: "LOCO4",
    authors: "Sapkal et al.",
    year: "2024",
    journal: "Nature",
    title: "Neural circuit mechanisms underlying context-specific halting in Drosophila",
    url: "https://www.nature.com/articles/s41586-024-07854-7",
  },
};

// Map gallery image title → ordered list of reference IDs.
export const CARD_REFERENCES: Record<string, ReferenceId[]> = {
  // ── The Whole Connectome ────────────────────────────────────────────
  "Fifty Giants of the Fly Brain": ["FW1", "FW2", "FW4", "VIS5"],
  "Every Neuron in the Fly Brain": ["FW1", "FW8", "FW9"],

  // ── Infographics & Posters ──────────────────────────────────────────
  "FlyWire Official Poster": ["FW1", "FW2", "FW8", "FW9"],
  "FlyWire Widescreen Poster": ["FW1", "FW2", "FW9"],
  "Fly Neuron Infographic": ["FW1", "FW2", "FW8"],
  "Fly Brain: Science Fiction Aesthetic": ["FW1", "FW2", "FW4", "FW9"],
  "Perception Concepts": ["FW1", "FW2", "FW9"],

  // ── The Superclasses ────────────────────────────────────────────────
  "Optic Lobe Neurons": ["FW1", "FW2", "FW3", "VIS6"],
  "Visual Projection Neurons": ["FW2", "FW3", "VIS1"],
  "Visual Centrifugal Neurons": ["FW2", "FW3", "OA2"],
  "Central Brain Neurons": ["FW1", "FW2", "FW4"],
  "Ascending Neurons": ["FW1", "FW2", "FW5"],
  "Descending Neurons": ["FW1", "FW2", "LOCO1", "LOCO4"],
  "Motor Neurons": ["FW1", "FW2", "FW5"],
  "Sensory Neurons": ["FW1", "FW2", "FW5"],
  "Endocrine Neurons": ["FW1", "FW2"],

  // ── Brain-Wide Connectivity ─────────────────────────────────────────
  "Outputs from the Medulla (Whole Brain)": ["FW3", "VIS3", "VIS6"],
  "Inputs to the Antennal Mechanosensory and Motor Center": ["AUD1", "AUD2", "FW5"],
  "Outputs from the Antennal Mechanosensory and Motor Center": ["AUD1", "AUD2", "FW5"],
  "Inputs to the Gnathal Ganglia": ["FW5", "FW1", "FW2"],
  "Outputs from the Gnathal Ganglia": ["FW5", "FW1", "FW2"],
  "Inputs to the Medulla (Whole Brain)": ["FW3", "VIS3", "VIS6"],
  "Inputs to the Ellipsoid Body": ["CX1", "CX2", "CX3", "FW6"],
  "Outputs from the Ellipsoid Body": ["CX1", "CX2", "CX3", "FW6"],
  "Inputs to the Fan-shaped Body": ["CX1", "CX2", "CX3", "FW4"],
  "Outputs from the Fan-shaped Body": ["CX1", "CX2", "CX3", "FW4"],
  "Wedge to Anterior Ventrolateral Protocerebrum, Bilateral Non-Reciprocal": ["FW2", "FW4", "FW7"],
  "Lamina and Medulla (Whole Brain)": ["FW3", "VIS6", "VIS3"],
  "Inputs to the Anterior Optic Tubercle": ["FW6", "AOTU1", "CX1"],
  "Outputs from the Anterior Optic Tubercle": ["FW6", "AOTU1", "CX1"],
  "Highest Cross-Brain Connectivity, Left and Right Medulla": ["FW4", "FW3"],

  // ── The Mushroom Body ───────────────────────────────────────────────
  "Mushroom Body Output Neurons, Colored by Type (Central)": ["MB1", "FW2"],
  "Kenyon Cells Colored by Primary Type (Left Lobe)": ["MB1", "FW2"],
  "Kenyon Cells Colored by Primary Type (Right Lobe)": ["MB1", "FW2"],
  "Kenyon Cells and Mushroom Body Input Neurons (Left Lobe)": ["MB1", "FW2"],
  "Kenyon Cells and Mushroom Body Input Neurons (Right Lobe)": ["MB1", "FW2"],
  "Kenyon Cells and Mushroom Body Input Neurons (Whole)": ["MB1", "FW2"],
  "3,600 Kenyon Cells, Colored by Type": ["MB1", "FW2"],
  "Mushroom Body Input Neurons (Left Lobe)": ["MB1", "FW2"],
  "Mushroom Body Input Neurons (Right Lobe)": ["MB1", "FW2"],
  "Mushroom Body Input Neurons (Whole)": ["MB1", "FW2"],

  // ── Sex & Courtship Circuits ────────────────────────────────────────
  "Doublesex Neurons (Central)": ["COURT3", "COURT1", "COURT2", "FW2"],
  "Doublesex Neurons (Left Lobe)": ["COURT3", "COURT1", "COURT2", "FW2"],
  "Doublesex Neurons with Neuropil Context": ["COURT3", "COURT1", "COURT2", "FW2"],
  "Fruitless Neurons (Left Lobe)": ["COURT1", "COURT2", "COURT3", "FW2"],
  "Fruitless Neurons with Neuropil Context": ["COURT1", "COURT2", "COURT3", "FW2"],

  // ── Visual Feature Detectors ────────────────────────────────────────
  "Lobula Plate/Lobula Columnar Neurons (Central)": ["VIS1", "VIS2", "FW3"],
  "Lobula Plate/Lobula Columnar Neurons, Colored by Type": ["VIS1", "VIS2", "FW3"],
  "Lobula Columnar Neurons, Colored by Primary Type": ["VIS1", "FW3"],
  "Lobula Columnar Visual Projection Neurons with Neuropil": ["VIS1", "FW3"],
  "LC9 Lobula Columnar Neurons, High Definition (Left Lobe)": ["VIS1", "LOCO3", "FW3"],
  "LC9 and LC16 Lobula Columnar Neurons, High Definition (Left Lobe)": ["VIS1", "LOCO3", "FW3"],
  "LC14 Lobula Columnar Neurons, 4K (Left Lobe)": ["VIS1", "FW3"],
  "LC14 Lobula Columnar Neurons, 4K with Neuropil": ["VIS1", "FW3"],

  // ── Specialized Cell Types ──────────────────────────────────────────
  "Lobula Intrinsic Neuron Type 33, 4K with Neuropil": ["FW3", "VIS6"],
  "Octopaminergic AL2b2 Neurons with Neuropil Context": ["OA1", "OA2", "FW2"],
  "DM4 Antennal Lobe Glomerulus (Left Lobe)": ["OLF1", "OLF2", "OLF3", "FW2"],
  "DM4 Antennal Lobe Glomerulus with Neuropil Context": ["OLF1", "OLF2", "OLF3", "FW2"],
  "DM4 Antennal Lobe Glomerulus (Right Lobe)": ["OLF1", "OLF2", "OLF3", "FW2"],
  "Centrifugal Medulla Cell Type 15, 4K with Neuropil": ["FW2", "FW3", "OA2"],
  "Protocerebral Cell Types 1a–1e with Neuropil Context": ["FW2", "FW4", "FW7"],

  // ── Mi1: A Cell Portrait ────────────────────────────────────────────
  "Medulla Intrinsic Neuron Type 1, Viridis Colormap (90°)": ["FW3", "VIS3"],
  "Medulla Intrinsic Neuron Type 1, Viridis Colormap (180°)": ["FW3", "VIS3"],
  "Medulla Intrinsic Neuron Type 1, Viridis Colormap (270°)": ["FW3", "VIS3"],
  "Medulla Intrinsic Neuron Type 1, Viridis Colormap (360°)": ["FW3", "VIS3"],
  "A Single Optic Column": ["FW3", "VIS3", "VIS6"],
  "Mi1 Neurons Colored by Optic Column (180°)": ["FW3", "VIS3"],
  "Mi1 Optic Columns, FlyWire Colormap (Front)": ["FW3", "VIS3"],
  "Mi1 Optic Columns, FlyWire Colormap (90°)": ["FW3", "VIS3"],

  // ── Visual Neuron Diversity ─────────────────────────────────────────
  "Visual Neuron Types, Top 100 from Right Brain (Left Lobe)": ["FW3", "VIS1"],
  "Visual Neuron Types, Top 100 from Right Brain (Whole)": ["FW3", "VIS1"],
  "Optic Chiasms, Colored by Type": ["FW3", "VIS6"],

  // ── Serpentine Neurons ──────────────────────────────────────────────
  "Serpentine Neurons (Side View)": ["FW3"],
  "Serpentine Neurons (Frontal View)": ["FW3"],
  "3,600 Serpentine Neurons, Full Color": ["FW3"],
  "3,600 Serpentine Neurons, 4K": ["FW3"],

  // ── The Lobula Complex ──────────────────────────────────────────────
  "Transmedullary Neurons by Subclass (Left Lobe)": ["FW3", "VIS6"],
  "Transmedullary Neurons by Subclass (Whole Brain)": ["FW3", "VIS6"],
  "Lobula Intrinsic Neurons, 4K": ["FW3", "VIS6"],
  "Lobula Intrinsic Neurons, High Definition (Left Lobe)": ["FW3", "VIS6"],
  "Lobula Plate Intrinsic Neurons, 4K": ["FW3", "VIS4", "VIS5"],
  "Lobula Plate Intrinsic Neurons (LPi), 4K": ["FW3", "VIS4", "VIS5"],

  // ── Featured Renderings ─────────────────────────────────────────────
  "APL: One Cell, the Whole Lobe": ["APL1", "MB1", "FW2"],
  "Bolt: A Dedicated Circuit for Going Fast": ["LOCO3", "LOCO4", "FW7"],
  "Moonwalker: The Reverse Gear of the Fly Brain": ["LOCO1", "LOCO2", "LOCO4"],
  "Keystone: A Pair That Reads the Whole Nose": ["OLF1", "FW2"],
  "LPsP: Pillars in the Lateral Protocerebrum": ["FW2", "FW6", "FW7"],
  "DM4: A Glomerulus Tuned to the Smell of Fruit": ["OLF1", "OLF2", "OLF3", "FW2"],
  "AVLP538: A New Cell Type from a Complete Map": ["FW2", "FW4", "FW7"],
  "DPM: Memory's Quiet Broadcaster": ["DPM1", "DPM2", "MB1"],
  "CT1: A Single Cell That Touches Every Visual Column": ["VIS5", "FW3", "VIS4"],
  "OA-AL2i1: An Octopamine Line into the Protocerebrum": ["OA1", "OA2", "FW2"],
  "The Whole Brain, Holographic": ["FW1", "FW8", "FW9"],
};

// Map Interactive 3D View title → reference IDs.
export const INTERACTIVE_VIEW_REFERENCES: Record<string, ReferenceId[]> = {
  "Thermosensory to DN": ["FW5", "FW7"],
  "Photoreceptor to DN": ["FW3", "FW5", "FW7"],
  "ORN and DM1 Neurons": ["OLF1", "OLF2", "FW2"],
  "Ring Neurons": ["CX1", "CX2", "CX3", "FW6"],
};

export function referencesFor(title: string): Reference[] {
  const ids = CARD_REFERENCES[title] ?? [];
  return ids.map((id) => REFERENCES[id]).filter(Boolean);
}

export function viewReferencesFor(title: string): Reference[] {
  const ids = INTERACTIVE_VIEW_REFERENCES[title] ?? [];
  return ids.map((id) => REFERENCES[id]).filter(Boolean);
}
