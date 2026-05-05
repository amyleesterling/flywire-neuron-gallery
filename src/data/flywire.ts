export interface FlyWireImage {
  filename: string;
  title: string;
  caption: string;
  group: string;
  // Optional per-image credit override. When omitted, callers should fall back
  // to the default "Render by Tyler Sloan for FlyWire" for every section
  // except Infographics & Posters (which has no blanket credit).
  credit?: string;
}

export const FLYWIRE_GROUPS = [
  "The Superclasses",
  "Brain-Wide Connectivity",
  "The Mushroom Body",
  "Sex & Courtship Circuits",
  "Visual Feature Detectors",
  "Specialized Cell Types",
  "Mi1: A Cell Portrait",
  "Visual Neuron Diversity",
  "Serpentine Neurons",
  "The Lobula Complex",
  "The Whole Connectome",
  "Featured Renderings",
  "Infographics & Posters",
] as const;

// Sections whose images get the default "Render by Tyler Sloan for FlyWire"
// credit when no per-image override is set. Anything not in this set (currently
// just Infographics & Posters) defaults to no credit, and individual entries
// supply their own.
export const DEFAULT_TYLER_CREDIT_GROUPS: ReadonlySet<string> = new Set([
  "The Superclasses",
  "Brain-Wide Connectivity",
  "The Mushroom Body",
  "Sex & Courtship Circuits",
  "Visual Feature Detectors",
  "Specialized Cell Types",
  "Mi1: A Cell Portrait",
  "Visual Neuron Diversity",
  "Serpentine Neurons",
  "The Lobula Complex",
  "Featured Renderings",
]);

export const DEFAULT_TYLER_CREDIT = "Render by Tyler Sloan for FlyWire";

export function creditFor(image: FlyWireImage): string | null {
  if (image.credit) return image.credit;
  if (DEFAULT_TYLER_CREDIT_GROUPS.has(image.group)) return DEFAULT_TYLER_CREDIT;
  return null;
}

export const FLYWIRE_GROUP_BLURBS: Record<string, string> = {
  "The Superclasses":
    "The highest-level view of the FlyWire connectome, all 139,255 neurons organized into their fundamental functional classes, from sensory inputs and motor outputs to the central circuits that tie everything together.",
  "Brain-Wide Connectivity":
    "Inputs and outputs of major neuropils across the Drosophila brain, revealing the large-scale architecture of sensation, navigation, and motor control.",
  "The Mushroom Body":
    "The insect learning and memory center, dissected into its component cell types, Kenyon Cells, output neurons, and the teaching inputs that write new memories.",
  "Sex & Courtship Circuits":
    "Neurons shaped by the doublesex and fruitless genes, the molecular architects of sex-specific anatomy and courtship behavior.",
  "Visual Feature Detectors":
    "Lobula Columnar and Lobula Plate neurons that extract specific visual features, looming objects, edges, small targets, from the stream of visual data.",
  "Specialized Cell Types":
    "A cross-section of the fly brain's extraordinary cell-type diversity: intrinsic neurons, neuromodulatory cells, olfactory circuits, and centrifugal feedback pathways.",
  "Mi1: A Cell Portrait":
    "Medulla Intrinsic neuron type 1, a key node in ON-motion detection, shown in four rotations, single-column detail, and column maps colored by identity and position.",
  "Visual Neuron Diversity":
    "A sampled cross-section of the fly's 200+ visual projection neuron types, color-coded to reveal the breathtaking diversity of specialized detectors packed into the optic lobes.",
  "Serpentine Neurons":
    "A distinct class of medullary interneurons whose characteristic winding processes span multiple layers simultaneously, integrating signals across the fly's visual processing cascade.",
  "The Lobula Complex":
    "The Lobula, Lobula Plate, and their intrinsic neurons, where transmedullary signals are transformed into higher-order visual features including direction-selective motion responses.",
  "The Whole Connectome":
    "Two flagship renders of the entire FlyWire reconstruction, the fifty largest cells that dominate the brain's volume, and every one of the 139,255 neurons painted at full resolution.",
  "Featured Renderings":
    "A curated set of single cells and special-feature renderings from the FlyWire connectome, the giants, the modulators, and the command neurons whose names appear repeatedly in the literature.",
  "Infographics & Posters":
    "Scientific communication pieces created for the FlyWire project, from posters and infographics designed to convey the scale and beauty of the connectome to wide-format renders built for press and public engagement.",
};

export const flyWireImages: FlyWireImage[] = [
  // ── The Superclasses ─────────────────────────────────────────────────
  {
    filename: "sc_optic.png",
    title: "Optic Lobe Neurons",
    caption:
      "The optic lobes are where visual processing begins, home to over half the neurons in the fly brain. This rendering captures their intrinsic cell populations: the columnar neurons, wide-field cells, and local interneurons that transform raw light signals from 1,400 ommatidia into a rich representation of the visual world.",
    group: "The Superclasses",
  },
  {
    filename: "sc_visual_projection.png",
    title: "Visual Projection Neurons",
    caption:
      "Visual projection neurons are the optic lobe's ambassadors to the rest of the brain, each type carrying a specific visual feature, an edge, a color, a looming shape, a direction of motion, from the eye to the circuits that decide what the fly should do about it. FlyWire identified over 200 distinct types, each a different perceptual channel.",
    group: "The Superclasses",
  },
  {
    filename: "sc_visual_centrifugal.png",
    title: "Visual Centrifugal Neurons",
    caption:
      "Visual centrifugal neurons project from the central brain back into the optic lobes, a counterintuitive flow that gives the brain direct control over its own visual input. These feedback pathways allow the fly to effectively tune its eyes based on what it's doing, suppressing irrelevant signals during flight and enhancing detection of specific stimuli during pursuit or courtship.",
    group: "The Superclasses",
  },

  {
    filename: "sc_central.png",
    title: "Central Brain Neurons",
    caption:
      "Central neurons are intrinsic to the brain itself, forming the dense associative networks that underlie memory, navigation, decision-making, and sensory integration. They constitute the majority of the fly brain by cell count, interconnecting the brain's specialized neuropils into a unified computational architecture.",
    group: "The Superclasses",
  },
  {
    filename: "sc_ascending.png",
    title: "Ascending Neurons",
    caption:
      "Ascending neurons originate in the ventral nerve cord, the fly's spinal cord equivalent, and project upward into the brain. They carry sensory signals from the body, legs, and wings, reporting proprioception, touch, and internal state to brain circuits that integrate this with vision and olfaction to coordinate whole-body behavior.",
    group: "The Superclasses",
  },
  {
    filename: "sc_descending.png",
    title: "Descending Neurons",
    caption:
      "Descending neurons are the brain's executive messengers, carrying commands from higher brain regions down into the ventral nerve cord, where they drive the motor circuits that move the wings, legs, and body. There are only a few hundred of them in the fly, yet they coordinate the full repertoire of fly behavior.",
    group: "The Superclasses",
  },
  {
    filename: "sc_motor.png",
    title: "Motor Neurons",
    caption:
      "Motor neurons are the final output of the nervous system, directly innervating muscles throughout the fly's body. Each motor neuron's activity pattern determines exactly which muscles contract and when, translating the brain's computational output into the precise, coordinated movements of flight, walking, feeding, and courtship.",
    group: "The Superclasses",
  },
  {
    filename: "sc_sensory.png",
    title: "Sensory Neurons",
    caption:
      "Sensory neurons are the brain's interface with the outside world, detecting light, odor, sound, taste, temperature, and touch. Their diversity mirrors the fly's remarkable sensory range: some respond to individual odorant molecules, others to the polarization angle of sunlight, and still others to the microsecond timing of sound waves from a courting male.",
    group: "The Superclasses",
  },
  {
    filename: "sc_endocrine.png",
    title: "Endocrine Neurons",
    caption:
      "Neuroendocrine neurons release hormones directly into the fly's circulatory system, linking neural activity to body-wide physiological states. They regulate development, reproduction, stress responses, and metabolic rate, a reminder that the brain governs not just behavior but the body's entire internal environment.",
    group: "The Superclasses",
  },

  // ── Brain-Wide Connectivity ──────────────────────────────────────────
  {
    filename: "1_ME_output_whole.view.cam_0000.png",
    title: "Outputs from the Medulla (Whole Brain)",
    caption:
      "The Medulla is the fly brain's primary visual relay, a dense, layered structure that transforms raw light signals from the retina into meaningful visual information. These output neurons carry processed signals deeper into the brain, feeding circuits for motion detection, color, and object recognition. Think of it as the fly's visual cortex, packed into a structure smaller than a grain of sand.",
    group: "Brain-Wide Connectivity",
  },
  {
    filename: "1.1_AMMC_input_.png",
    title: "Inputs to the Antennal Mechanosensory and Motor Center",
    caption:
      "The Antennal Mechanosensory and Motor Center receives a constant stream of touch, vibration, and sound signals from the fly's antennae, including the wing-song a male fly uses to court a female. These input neurons are the brain's first listeners, converting mechanical whispers from the world into neural language.",
    group: "Brain-Wide Connectivity",
  },
  {
    filename: "1.1_AMMC_output_.png",
    title: "Outputs from the Antennal Mechanosensory and Motor Center",
    caption:
      "Once the AMMC has processed what the antennae are feeling and hearing, its output neurons broadcast those signals to higher brain centers for interpretation and action. This is where raw sensation becomes something the fly can act on, turning a vibration in the air into a decision to approach, flee, or sing back.",
    group: "Brain-Wide Connectivity",
  },
  {
    filename: "1.2_GNG_input_.png",
    title: "Inputs to the Gnathal Ganglia",
    caption:
      "The Gnathal Ganglia governs the fly's mouthparts, controlling when and how it chews, sips, and tastes. Input neurons here carry signals about what's touching or entering the mouth, making this region the brain's gatekeeper for feeding decisions.",
    group: "Brain-Wide Connectivity",
  },
  {
    filename: "1.2_GNG_output_.png",
    title: "Outputs from the Gnathal Ganglia",
    caption:
      "From the Gnathal Ganglia, output neurons relay feeding-related decisions to motor circuits that move the mouthparts with remarkable precision. A fly that pauses before eating sugar, or recoils from bitter, owes that behavior in part to these carefully tuned output connections.",
    group: "Brain-Wide Connectivity",
  },
  {
    filename: "1.3_ME_input_whole.view.cam_0000.png",
    title: "Inputs to the Medulla (Whole Brain)",
    caption:
      "Every visual experience the fly has begins here: input neurons pouring signals into the Medulla from the retina's 800 individual lenses. This whole-brain view captures the breathtaking scale of the fly's visual investment, roughly a third of all neurons in the brain are dedicated to sight.",
    group: "Brain-Wide Connectivity",
  },
  {
    filename: "1.4_EB_input_.png",
    title: "Inputs to the Ellipsoid Body",
    caption:
      "The Ellipsoid Body sits at the heart of the fly's navigational compass, helping it track which direction it's heading and remember where it has been. These input neurons deliver sensory and spatial information to the EB, feeding a ring-shaped circuit that acts like an internal GPS needle.",
    group: "Brain-Wide Connectivity",
  },
  {
    filename: "1.4_EB_output_.png",
    title: "Outputs from the Ellipsoid Body",
    caption:
      "After the Ellipsoid Body has updated its internal heading estimate, output neurons carry that directional signal to motor and memory circuits throughout the brain. This is how a fly walking in darkness can still maintain a surprisingly straight course, its neural compass keeps ticking even without visual landmarks.",
    group: "Brain-Wide Connectivity",
  },
  {
    filename: "1.5_FB_input_.png",
    title: "Inputs to the Fan-shaped Body",
    caption:
      "The Fan-shaped Body is the fly brain's executive hub, coordinating sleep, motivation, and goal-directed movement. Its input neurons arrive from across the brain, converging here like dispatches to a central command. This structure is ancient: its architecture is recognizable all the way from insects to mammals.",
    group: "Brain-Wide Connectivity",
  },
  {
    filename: "1.5_FB_output_.png",
    title: "Outputs from the Fan-shaped Body",
    caption:
      "Fan-shaped Body output neurons broadcast decisions about movement, arousal, and behavioral state to the rest of the brain and down into the nerve cord. When a fly decides to walk toward a light or pause to rest, these neurons are part of the circuit making that call.",
    group: "Brain-Wide Connectivity",
  },
  {
    filename: "1.6_WED_R_to_AVLP_R_bilateral_nonreciprocal_.png",
    title: "Wedge to Anterior Ventrolateral Protocerebrum, Bilateral Non-Reciprocal",
    caption:
      "This image traces a one-way conversation between two sensory hubs, the right Wedge neuropil and the right Anterior Ventrolateral Protocerebrum. Sound and touch signals processed in the Wedge are passed forward to the AVLP, where they meet visual and olfactory signals for richer, multimodal perception. Notably, the connection runs in only one direction, a reminder that information flow in the brain is rarely a simple dialogue.",
    group: "Brain-Wide Connectivity",
  },
  {
    filename: "1.7_LA_ME_whole.view.cam.png",
    title: "Lamina and Medulla (Whole Brain)",
    caption:
      "The Lamina and Medulla together form the fly's outer visual processing cascade, the Lamina as a first rough filter directly behind the retina, the Medulla as the deeper stage where real computation begins. Seeing both together reveals how visually ambitious this tiny brain truly is, with layer upon layer of neurons dedicated entirely to decoding light.",
    group: "Brain-Wide Connectivity",
  },
  {
    filename: "1.8_AOTU_input_.png",
    title: "Inputs to the Anterior Optic Tubercle",
    caption:
      "The Anterior Optic Tubercle is a compact relay station bridging the eye's optic lobes with the central brain. Input neurons here funnel visual signals, particularly about sky polarization and celestial cues, inward, helping the fly orient itself like a tiny biological compass using the sun as a reference.",
    group: "Brain-Wide Connectivity",
  },
  {
    filename: "1.8_AOTU_output_.png",
    title: "Outputs from the Anterior Optic Tubercle",
    caption:
      "AOTU output neurons carry refined visual orientation signals into deeper brain regions, including the central complex where navigation and spatial memory are computed. This small cluster of cells is a crucial link in the chain that lets a fly hold a heading across an open field or a cluttered forest.",
    group: "Brain-Wide Connectivity",
  },
  {
    filename: "1.9_Highest_cross-brain-connectivity_ME_L-ME_R_4k_neuropil.view.cam_0000.png",
    title: "Highest Cross-Brain Connectivity, Left and Right Medulla",
    caption:
      "The two Medullae, left and right, are the most heavily interconnected structures across the two brain hemispheres. This image highlights the neurons with the highest cross-brain connectivity, forming a bridge of visual information that lets the fly perceive the world as a seamless whole rather than two separate half-images.",
    group: "Brain-Wide Connectivity",
  },

  // ── The Mushroom Body ────────────────────────────────────────────────
  {
    filename: "1.10.b_MBON_cmap-type_central.view.view.cam_0000.png",
    title: "Mushroom Body Output Neurons, Colored by Type (Central)",
    caption:
      "Mushroom Body Output Neurons are where memories become actions. Color-coded by cell type, each class of MBON reads a different page of the Mushroom Body's stored experiences and translates them into approach or avoidance behavior. This central view shows how their axons fan out to influence circuits across the brain.",
    group: "The Mushroom Body",
  },
  {
    filename: "1.10.c_Kenyon_Cell_classdf_cmap-primary_type_nall_MB-left.view.view.cam.png",
    title: "Kenyon Cells Colored by Primary Type (Left Lobe)",
    caption:
      "The left Mushroom Body's roughly 2,000 Kenyon Cells are color-coded by class, revealing distinct populations that store different kinds of sensory memories. These are the fly's memory traces, each cell a potential record of a smell, a taste, or an experience that shaped the fly's future choices.",
    group: "The Mushroom Body",
  },
  {
    filename: "1.10.c_Kenyon_Cell_classdf_cmap-primary_type_nall_MB-right.view.view.cam.png",
    title: "Kenyon Cells Colored by Primary Type (Right Lobe)",
    caption:
      "The right Mushroom Body mirrors its counterpart in architecture but operates in parallel, with its own population of color-coded Kenyon Cells holding the fly's learned associations. The near-symmetry between the two lobes is a hallmark of the insect brain's elegant bilateral design.",
    group: "The Mushroom Body",
  },
  {
    filename: "1.10.c_Kenyon_cell_MBIN_glow_MB-left.view.view.cam_0000.png",
    title: "Kenyon Cells and Mushroom Body Input Neurons (Left Lobe)",
    caption:
      "In the left Mushroom Body, Kenyon Cells glow against a backdrop of their teachers, the Mushroom Body Input Neurons that deliver dopamine-tagged lessons about reward and punishment. This interplay between students and instructors is the cellular basis of associative learning in the fly.",
    group: "The Mushroom Body",
  },
  {
    filename: "1.10.c_Kenyon_cell_MBIN_glow_MB-right.view.view.cam_0000.png",
    title: "Kenyon Cells and Mushroom Body Input Neurons (Right Lobe)",
    caption:
      "The right Mushroom Body glows with the same learning circuitry as its twin, Kenyon Cells interwoven with input neurons that continuously update what the fly has learned. The visual drama here reflects the real biological drama of memory being written and rewritten at the synapse level.",
    group: "The Mushroom Body",
  },
  {
    filename: "1.10.c_Kenyon_cell_MBIN_glow_MB-whole.view.cam_0000.png",
    title: "Kenyon Cells and Mushroom Body Input Neurons (Whole)",
    caption:
      "Seen in full, both Mushroom Bodies together form a paired memory organ of extraordinary density and precision. The glowing input neurons converge on Kenyon Cells from across the brain, transforming the fly's sensory history into a compact, searchable record of what to seek and what to avoid.",
    group: "The Mushroom Body",
  },

  {
    filename: "1.10.c_keynyon_cmap_3600c.png",
    title: "3,600 Kenyon Cells, Colored by Type",
    caption:
      "Nearly 3,600 Kenyon Cells rendered in a full spectrum of colors, each hue marking a distinct cell identity within the Mushroom Body's memory architecture. At this scale, the Mushroom Body looks less like a brain region and more like a living stained-glass window, beautiful, precise, and teeming with encoded experience.",
    group: "The Mushroom Body",
  },
  {
    filename: "1.10.c_MBIN_MB-left.view.view.cam_0000.png",
    title: "Mushroom Body Input Neurons (Left Lobe)",
    caption:
      "Mushroom Body Input Neurons in the left lobe are the fly's teaching staff, delivering value signals like 'that smell meant food' or 'that light meant danger' directly onto Kenyon Cell dendrites. Each MBIN tiles a different compartment of the lobe, creating a modular memory-update system of elegant precision.",
    group: "The Mushroom Body",
  },
  {
    filename: "1.10.c_MBIN_MB-right.view.view.cam_0000.png",
    title: "Mushroom Body Input Neurons (Right Lobe)",
    caption:
      "The right Mushroom Body's input neurons mirror those on the left, tiling the lobe in overlapping domains of dopaminergic influence. This redundancy is by design, it makes the fly's learned associations robust, allowing the brain to update memories even when some channels are noisy or uncertain.",
    group: "The Mushroom Body",
  },
  {
    filename: "1.10.c_MBIN_MB-whole.view.cam_0000.png",
    title: "Mushroom Body Input Neurons (Whole)",
    caption:
      "Viewed across both hemispheres, the Mushroom Body Input Neurons reveal the full geography of the fly's teaching network. The paired lobes, each carved into compartments by distinct MBIN populations, represent one of the most thoroughly mapped learning circuits in all of neuroscience.",
    group: "The Mushroom Body",
  },

  // ── Sex & Courtship Circuits ─────────────────────────────────────────
  {
    filename: "2.1_Doublesex_central.view.view.cam_0000.png",
    title: "Doublesex Neurons (Central)",
    caption:
      "Neurons expressing the doublesex gene are among the brain's most intimate architects, shaping the circuits that determine sex-specific anatomy and courtship behavior in flies. This central view captures their sweeping reach across the brain, a reminder that biological sex is not a single switch but a distributed network of molecular and neural decisions.",
    group: "Sex & Courtship Circuits",
  },
  {
    filename: "2.1_Doublesex_left-lobe.view.cam_0000.png",
    title: "Doublesex Neurons (Left Lobe)",
    caption:
      "In the left lobe, Doublesex neurons reveal their local branching patterns, fine arbors that subtly but profoundly rewire the brain depending on whether the fly is male or female. These cells help explain why the same sensory stimulus can trigger completely different behaviors across sexes.",
    group: "Sex & Courtship Circuits",
  },
  {
    filename: "2.1_Doublesex_neuropil.view.cam_0000.png",
    title: "Doublesex Neurons with Neuropil Context",
    caption:
      "Overlaid on the full neuropil, Doublesex neurons are revealed as a sex-specific scaffold woven through the brain at large. Their broad distribution reflects how deeply sex-specific behavior is embedded in fly neurology, not as a single module but as a pervasive influence on circuits from sensory processing to motor output.",
    group: "Sex & Courtship Circuits",
  },
  {
    filename: "2.1_Fruitless-side_left-lobe.view.cam_0000.png",
    title: "Fruitless Neurons (Left Lobe)",
    caption:
      "Fruitless neurons are essential for male courtship behavior in flies, males without them fail to court at all, while females that gain them can display male-typical behaviors. This left-lobe view captures their delicate local architecture, part of a brain-wide circuit dedicated to the most fundamental of biological imperatives: finding a mate.",
    group: "Sex & Courtship Circuits",
  },
  {
    filename: "2.1_Fruitless-side_neuropil.view.cam_0000.png",
    title: "Fruitless Neurons with Neuropil Context",
    caption:
      "Seen against the full neuropil, Fruitless-expressing neurons trace the neural geography of courtship in the fly brain. Their reach across sensory, motor, and associative regions explains how courtship integrates so many cues, sight, sound, smell, and touch, into a single coordinated behavioral program.",
    group: "Sex & Courtship Circuits",
  },

  // ── Visual Feature Detectors ─────────────────────────────────────────
  {
    filename: "2.2.a_LPLC_central.view.view.cam.png",
    title: "Lobula Plate/Lobula Columnar Neurons (Central)",
    caption:
      "Lobula Plate/Lobula Columnar neurons are the fly's collision alarm system, they fire powerfully when a dark object rapidly expands in the visual field, signaling something is coming right at me. This central view shows how their axons converge on the escape circuits of the brain, poised to trigger the fly's lightning-fast evasive dive.",
    group: "Visual Feature Detectors",
  },
  {
    filename: "2.2.b_LPLC_cmap-type.png",
    title: "Lobula Plate/Lobula Columnar Neurons, Colored by Type",
    caption:
      "Color-coded by subtype, the LPLC population reveals itself as not one alarm but many, each tuned to slightly different looming trajectories and speeds. This diversity turns the visual system into a nuanced threat detector, able to distinguish a predator from a falling leaf, or a head-on approach from a glancing one.",
    group: "Visual Feature Detectors",
  },
  {
    filename: "2.2.c_LC_cmap-primary_type_n-1_.png",
    title: "Lobula Columnar Neurons, Colored by Primary Type",
    caption:
      "Lobula Columnar neurons are the visual system's feature detectors, each type responding to a specific shape, edge, or motion pattern in the fly's visual world. Mapped here by primary type, they form a rich lexicon of visual symbols that the brain reads to make sense of a complex, moving environment.",
    group: "Visual Feature Detectors",
  },
  {
    filename: "2.2.c_LC_visual_projection_neuropil.view.cam_0000.png",
    title: "Lobula Columnar Visual Projection Neurons with Neuropil",
    caption:
      "Overlaid on the full neuropil, LC neurons project their visual feature signals deep into the central brain, connecting the eye's complex computations to circuits for navigation, avoidance, and social behavior. This image shows just how far the visual system's reach extends, sight shapes nearly everything a fly does.",
    group: "Visual Feature Detectors",
  },
  {
    filename: "2.2.d_LC9_hd_left-lobe.view.cam_0000.png",
    title: "LC9 Lobula Columnar Neurons, High Definition (Left Lobe)",
    caption:
      "LC9 neurons in the left optic lobe are thought to respond to small moving objects, potentially other flies, making them candidates for social visual recognition. Their fine dendritic trees sample visual space at high resolution, like a specialized antenna tuned for detecting movement against a cluttered background.",
    group: "Visual Feature Detectors",
  },
  {
    filename: "2.2.d_LC9_LC16_hd_left-lobe.view.cam_0000.png",
    title: "LC9 and LC16 Lobula Columnar Neurons, High Definition (Left Lobe)",
    caption:
      "Together, LC9 and LC16 neurons cover complementary aspects of object detection in the left optic lobe, one type potentially tracking small targets, the other responding to different visual features. Their overlapping territories suggest a collaborative visual parsing strategy, where multiple feature detectors work in concert.",
    group: "Visual Feature Detectors",
  },
  {
    filename: "2.2.d_LC14_4k_left-lobe.png",
    title: "LC14 Lobula Columnar Neurons, 4K (Left Lobe)",
    caption:
      "LC14 neurons tile the left optic lobe with precise regularity, each cell sampling its own small patch of the visual field. This tiling strategy, one of nature's favorite solutions for efficient sensory coverage, means the fly has near-complete visual surveillance of its surroundings through this single cell type alone.",
    group: "Visual Feature Detectors",
  },
  {
    filename: "2.2.d_LC14_4k_neuropil-view.png",
    title: "LC14 Lobula Columnar Neurons, 4K with Neuropil",
    caption:
      "Seen from the full neuropil perspective, LC14 neurons reveal where their axons project in the central brain, downstream targets that will interpret whatever visual feature LC14 is specialized to detect. Tracing this path from retina to behavior is one of the great goals of connectomics.",
    group: "Visual Feature Detectors",
  },

  // ── Specialized Cell Types ───────────────────────────────────────────
  {
    filename: "2.3.a_Li33_4k_neuropil.view.cam_0000.png",
    title: "Lobula Intrinsic Neuron Type 33, 4K with Neuropil",
    caption:
      "Li33 neurons are local interneurons of the Lobula, the third visual neuropil, where they perform computations that refine and filter visual signals before they are passed on to the rest of the brain. Their intricate local wiring suggests a role in sculpting the visual code, perhaps sharpening contrast or suppressing noise.",
    group: "Specialized Cell Types",
  },
  {
    filename: "2.3.b_Oa-al2b2_neuropil.view.cam.png",
    title: "Octopaminergic AL2b2 Neurons with Neuropil Context",
    caption:
      "This neuron carries octopamine, the fly's equivalent of adrenaline, directly into the Antennal Lobe, where smells are first processed. By modulating olfactory circuits from within, it links the fly's arousal state to its sense of smell, potentially making certain odors more or less salient depending on the fly's internal condition.",
    group: "Specialized Cell Types",
  },
  {
    filename: "2.3.c_DM4_left-lobe.view.cam_0000.png",
    title: "DM4 Antennal Lobe Glomerulus (Left Lobe)",
    caption:
      "DM4 is a glomerulus in the fly's olfactory bulb, the Antennal Lobe, dedicated to processing a specific chemical channel from the world. In the left lobe, its neurons form a tight, spherical knot of dendrites, a beautifully organized unit where odor identity is first encoded with chemical specificity.",
    group: "Specialized Cell Types",
  },
  {
    filename: "2.3.c_DM4_neuropil.view.cam_0000.png",
    title: "DM4 Antennal Lobe Glomerulus with Neuropil Context",
    caption:
      "Seen against the full neuropil, DM4 is revealed as just one node in the fly's broad olfactory map, a single glomerulus among many, each tuned to different chemical compounds. Together they form a combinatorial code that lets the fly distinguish thousands of odors with just a few hundred receptor types.",
    group: "Specialized Cell Types",
  },
  {
    filename: "2.3.c_DM4_right-lobe.view.cam_0000.png",
    title: "DM4 Antennal Lobe Glomerulus (Right Lobe)",
    caption:
      "The right-lobe DM4 glomerulus is the mirror image of its left-side counterpart, receiving input from the other antenna. The near-perfect bilateral symmetry of olfactory glomeruli reflects evolutionary pressure for reliable, redundant odor detection, if one antenna loses a receptor neuron, the other can still report the smell.",
    group: "Specialized Cell Types",
  },
  {
    filename: "2.3.d_Cm15_4k_neuropil.view.cam_0000.png",
    title: "Centrifugal Medulla Cell Type 15, 4K with Neuropil",
    caption:
      "Cm15 neurons send feedback signals from the central brain back down into the Medulla, a top-down influence on visual processing that most people don't associate with insect brains. This centrifugal pathway suggests the fly can actively modulate what it sees based on its internal state, expectations, or behavioral context.",
    group: "Specialized Cell Types",
  },
  {
    filename: "2.3.e_Pc1a-e_neuropil.view.cam_0000.png",
    title: "Protocerebral Cell Types 1a–1e with Neuropil Context",
    caption:
      "Pc1 neurons are higher-order interneurons of the protocerebrum, the fly's forebrain, where sensory streams from vision, olfaction, and mechanosensation are woven together into unified percepts and decisions. Their complex branching patterns across the neuropil hint at a sophisticated integrative role that is still being unraveled.",
    group: "Specialized Cell Types",
  },

  // ── Mi1: A Cell Portrait ─────────────────────────────────────────────
  {
    filename: "3.1_Mi1_viridis_rotation_0090.png",
    title: "Medulla Intrinsic Neuron Type 1, Viridis Colormap (90°)",
    caption:
      "Mi1 neurons are central to the fly's ability to detect ON-motion, movement from dark to light, and their remarkably regular columnar arrangement in the Medulla is one of the most striking patterns in the entire connectome. Rendered here in a viridis color scale and rotated 90 degrees, Mi1's crystalline geometry is on full display, a testament to the mathematical precision of neural self-organization.",
    group: "Mi1: A Cell Portrait",
  },
  {
    filename: "3.1_Mi1_viridis_rotation_0180.png",
    title: "Medulla Intrinsic Neuron Type 1, Viridis Colormap (180°)",
    caption:
      "Flipped to the opposite view, Mi1's towering columns are revealed from the other side, each one a relay in the neural circuit that tells the fly something just got brighter over there. This motion-detection machinery, repeated hundreds of times across the eye's visual field, gives the fly its remarkable sensitivity to even the faintest movement.",
    group: "Mi1: A Cell Portrait",
  },
  {
    filename: "3.1_Mi1_viridis_rotation_0270.png",
    title: "Medulla Intrinsic Neuron Type 1, Viridis Colormap (270°)",
    caption:
      "A third perspective on Mi1's columnar architecture. As the view sweeps around the structure, the neuron's regularity becomes almost hypnotic, a living lattice that processes motion across the entire visual field with machine-like consistency.",
    group: "Mi1: A Cell Portrait",
  },
  {
    filename: "3.1_Mi1_viridis_rotation_0360.png",
    title: "Medulla Intrinsic Neuron Type 1, Viridis Colormap (360°)",
    caption:
      "Completing the full rotation, Mi1 returns to its starting face, a reminder that this structure looks equally ordered from any angle. The perfect rotational symmetry reflects a motion-detection circuit built for reliability across the fly's full visual field.",
    group: "Mi1: A Cell Portrait",
  },
  {
    filename: "3.1_optic_column.png",
    title: "A Single Optic Column",
    caption:
      "The optic column is the fundamental repeating unit of the fly visual system, a vertical stack containing one copy of every medullary neuron type, including Mi1. This single column is the pixel of the fly's eye: the irreducible computational unit that tiles the visual field hundreds of times over.",
    group: "Mi1: A Cell Portrait",
  },
  {
    filename: "3.1_optic_Mi1_cmap-column_default_0180.png",
    title: "Mi1 Neurons Colored by Optic Column (180°)",
    caption:
      "Each Mi1 neuron here is colored by the optic column it belongs to, revealing how rigidly each cell is assigned to its own territory. The result is a color mosaic as regular as a tiled floor, each tile containing one Mi1 cell's worth of ON-motion computation.",
    group: "Mi1: A Cell Portrait",
  },
  {
    filename: "3.1_optic_mi1_columns-flywire-cmap_rotation_0000.png",
    title: "Mi1 Optic Columns, FlyWire Colormap (Front)",
    caption:
      "The full Mi1 population rendered with FlyWire's signature colormap, the smooth gradient tracking column position across the visual field. At this angle, the columnar architecture of the visual system is unmistakable, hundreds of identical computational modules, each processing its own patch of the world.",
    group: "Mi1: A Cell Portrait",
  },
  {
    filename: "3.1_optic_mi1_columns-flywire-cmap_rotation_0090.png",
    title: "Mi1 Optic Columns, FlyWire Colormap (90°)",
    caption:
      "Rotated 90 degrees, the Mi1 column array reveals its depth, row upon row of neurons receding into the Medulla's laminar structure. The color gradient tracks position across the visual field, showing how spatial information is preserved all the way from the retina into the deepest visual neuropil.",
    group: "Mi1: A Cell Portrait",
  },

  // ── Visual Neuron Diversity ──────────────────────────────────────────
  {
    filename: "3.2.b_Visual_neuron_types_right_n100_left-lobe.view.cam.png",
    title: "Visual Neuron Types, Top 100 from Right Brain (Left Lobe)",
    caption:
      "A sample of 100 visual projection neuron types from the right hemisphere, shown in the left optic lobe. Each color is a different cell type, demonstrating the staggering diversity of specialized visual detectors packed into a region smaller than a sesame seed.",
    group: "Visual Neuron Diversity",
  },
  {
    filename: "3.2.b_Visual_neuron_types_right_n100_whole.view.cam.png",
    title: "Visual Neuron Types, Top 100 from Right Brain (Whole)",
    caption:
      "The same 100 visual neuron types seen from the whole-brain perspective, their axons projecting from the optic lobe deep into the central brain. Together they carry the full richness of visual information, edges, motion, color, looming, and more, to circuits that translate it into behavior.",
    group: "Visual Neuron Diversity",
  },
  {
    filename: "3.4_chiasms_cmap-type_4K.png",
    title: "Optic Chiasms, Colored by Type",
    caption:
      "The optic chiasms are the crossing points between successive visual neuropils, where the orderly map of the retina is inverted and re-inverted as signals pass from Lamina to Medulla to Lobula. Colored by cell type, this image makes visible the architectural crossing that preserves spatial information through the visual hierarchy.",
    group: "Visual Neuron Diversity",
  },

  // ── Serpentine Neurons ───────────────────────────────────────────────
  {
    filename: "3.2.c_serpentie_tab20_side.view.png",
    title: "Serpentine Neurons (Side View)",
    caption:
      "Serpentine neurons are a distinct class of medullary interneurons whose dendrites trace characteristic winding paths through multiple visual layers simultaneously. This side view reveals their unusual elongated geometry, processes that sample signals at different depths, integrating across the fly's visual processing cascade in ways simpler columnar neurons cannot.",
    group: "Serpentine Neurons",
  },
  {
    filename: "3.2.c_serpentie_tab20_straight.view.png",
    title: "Serpentine Neurons (Frontal View)",
    caption:
      "Viewed head-on, serpentine neurons reveal the dense regularity of their arrangement across the Medulla. Their characteristic meandering morphology, which gives them their name, allows each cell to bridge multiple computational layers, making them uniquely positioned to perform cross-layer integration.",
    group: "Serpentine Neurons",
  },
  {
    filename: "3.2.c_serpentine_cmap_3600c_4k-color.png",
    title: "3,600 Serpentine Neurons, Full Color",
    caption:
      "3,600 serpentine neurons rendered in vivid color, each individual cell distinguishable in the dense assembly. Like the Kenyon Cell portraits of the Mushroom Body, this image transforms a population of cells into a landscape of color, making the sheer number and diversity of visual interneurons viscerally apparent.",
    group: "Serpentine Neurons",
  },
  {
    filename: "3.2.c_serpentine_cmap_3600c_4k.png",
    title: "3,600 Serpentine Neurons, 4K",
    caption:
      "The full serpentine population at 4K resolution, a complete census of this cell type across the visual system. The regularity of the pattern confirms that serpentine neurons, like most visual interneurons, tile the eye's coverage in an orderly, non-overlapping mosaic.",
    group: "Serpentine Neurons",
  },

  // ── The Lobula Complex ───────────────────────────────────────────────
  {
    filename: "3.3.a_sub_class_transmedullary_cmap-primary_type_n-1_left-lobe.view.cam.png",
    title: "Transmedullary Neurons by Subclass (Left Lobe)",
    caption:
      "Transmedullary neurons (Tm cells) are the visual system's long-range couriers, carrying processed signals from the Medulla all the way to the Lobula. Color-coded here by subclass, their diversity reveals a rich vocabulary of visual features being forwarded deeper into the brain.",
    group: "The Lobula Complex",
  },
  {
    filename: "3.3.a_sub_class_transmedullary_cmap-primary_type_n-1_whole.view.cam.png",
    title: "Transmedullary Neurons by Subclass (Whole Brain)",
    caption:
      "The full-brain view shows just how far transmedullary axons reach, from the Medulla's dense layers, across the inner optic chiasm, and into the Lobula's retinotopic map. This long-range projection preserves the spatial organization of the visual world through multiple layers of processing.",
    group: "The Lobula Complex",
  },
  {
    filename: "3.3.b_Lobula_intrinsic_4k_0000.png",
    title: "Lobula Intrinsic Neurons, 4K",
    caption:
      "Lobula intrinsic neurons perform local computations within the Lobula, the third major visual neuropil, integrating transmedullary inputs and shaping what gets passed on to visual projection neurons. This 4K portrait captures the full population in striking detail, revealing the Lobula's layered organization.",
    group: "The Lobula Complex",
  },
  {
    filename: "3.3.b_Lobula_intrinsic_left-lobe.view.cam_hd.png",
    title: "Lobula Intrinsic Neurons, High Definition (Left Lobe)",
    caption:
      "At high definition, individual lobula intrinsic neurons reveal their characteristic arborization patterns, branching through the Lobula's layers in forms that reflect their computational roles. Each distinct morphology is a different algorithm for processing visual information.",
    group: "The Lobula Complex",
  },
  {
    filename: "3.3.c_Lobula_plate_intrinsic_4k_plys_0000.png",
    title: "Lobula Plate Intrinsic Neurons, 4K",
    caption:
      "The Lobula Plate is home to wide-field motion detection, T4, T5, and their downstream targets that respond to panoramic visual flow. These intrinsic neurons help refine and gate motion signals before they reach the flight control circuits that keep the fly airborne.",
    group: "The Lobula Complex",
  },
  {
    filename: "3.3.c_LPi_Lobula_plate_intrinsic_4k_0000.png",
    title: "Lobula Plate Intrinsic Neurons (LPi), 4K",
    caption:
      "Lobula Plate Intrinsic neurons (LPi) are inhibitory cells that create directional selectivity in the motion-detection circuit by suppressing responses to movement in the null direction. Their elegant inhibitory logic is why the fly's motion detectors are selective, not merely sensitive.",
    group: "The Lobula Complex",
  },

  // ── Infographics & Posters ───────────────────────────────────────────
  {
    filename: "inf_poster-2025.png",
    title: "FlyWire 2025 Official Poster",
    caption:
      "The official FlyWire project poster for 2025. A single image designed to communicate the scale and ambition of mapping an entire animal brain, 139,255 neurons, 50 million synapses, all in a brain the size of a poppy seed.",
    group: "Infographics & Posters",
    credit:
      "Designed by Amy Sterling, using her own renders alongside renders by Tyler Sloan",
  },
  {
    filename: "inf_poster-wide.png",
    title: "FlyWire Widescreen Poster",
    caption:
      "A widescreen format poster showcasing the complete FlyWire connectome. Designed for large-format display and projection, this piece captures the visual grandeur of the fly brain mapped in full, a scientific achievement rendered as a work of art.",
    group: "Infographics & Posters",
    credit:
      "Designed by Amy Sterling, using her own renders alongside renders by Tyler Sloan",
  },
  {
    filename: "inf_fly-neuron.png",
    title: "Fly Neuron Infographic",
    caption:
      "An illustrated guide to fly neuron anatomy and the FlyWire project, created for broad scientific communication. The infographic brings together key facts about the connectome, scale, method, and significance, in a format accessible to scientists and general audiences alike.",
    group: "Infographics & Posters",
    credit: "Created by Amy Sterling",
  },
  {
    filename: "inf_data-lens.jpg",
    title: "The FlyWire Data Lens",
    caption:
      "A print-format visualization exploring the FlyWire dataset through a scientific lens. Designed at 8×10 for publication and display, it contextualizes the connectome within the broader landscape of neuroscience data, positioning the fly brain map as a reference point for understanding neural circuit complexity.",
    group: "Infographics & Posters",
    credit: "Created by Amy Sterling",
  },
  {
    filename: "inf_fly-scifi.jpg",
    title: "Fly Brain: Science Fiction Aesthetic",
    caption:
      "A stylized interpretation of the fly connectome using a science-fiction visual language, dramatic lighting, deep space backgrounds, and the fly brain rendered as a glowing cosmic object. A reminder that real biological structures can be stranger and more beautiful than anything invented.",
    group: "Infographics & Posters",
    credit: "Created by Amy Sterling",
  },
  {
    filename: "inf_perception-concepts.png",
    title: "Perception Concepts",
    caption:
      "An illustrative breakdown of how the fly visual system encodes perception, from raw photoreceptor signals to the high-level feature detection performed by lobula columnar and visual projection neurons. A conceptual map of how a brain turns light into meaning.",
    group: "Infographics & Posters",
    credit:
      "Created by Perception Studios using renders by Tyler Sloan. Produced by Amy Sterling",
  },

  // ── The Whole Connectome ─────────────────────────────────────────────
  {
    filename: "50_largest_neurons.png",
    title: "Fifty Giants of the Fly Brain",
    caption:
      "The fifty largest cells in the FlyWire reconstruction, each rendered in its own color across the whole adult Drosophila brain. Most are wide-field tangential neurons of the optic lobes and central complex, descending neurons that carry motor commands from brain to nerve cord, and outliers like CT1, a single cell that tiles every column of the medulla and lobula and forms over 140,000 synapses. Out of 139,255 neurons, this handful occupies a disproportionate share of the brain's volume, a reminder that connectomes are not built from average cells.",
    group: "The Whole Connectome",
    credit: "Visualizations by Tyler Sloan and Amy Sterling for FlyWire",
  },
  {
    filename: "all_neurons.png",
    title: "Every Neuron in the Fly Brain",
    caption:
      "All 139,255 neurons of the adult Drosophila melanogaster brain rendered together at full resolution, each cell painted its own color. The 54.5 million synapses linking them are the first complete wiring diagram of a brain that can walk, fly, court, and learn. Reconstructed from electron microscopy by AI segmentation and seven years of human proofreading across more than 300 contributors, this single frame is the FlyWire connectome in its entirety.",
    group: "The Whole Connectome",
    credit: "Visualizations by Tyler Sloan and Amy Sterling for FlyWire",
  },

  // ── Featured Renderings ──────────────────────────────────────────────
  {
    filename: "flywire_sterling_gallery_apl.png",
    title: "APL: One Cell, the Whole Lobe",
    caption:
      "The Anterior Paired Lateral neuron is a single GABAergic giant, one per hemisphere, that infiltrates every lobe and the calyx of the mushroom body. Through Kenyon Cell feedback inhibition, APL enforces the sparse odor coding that makes olfactory memory possible. With a combined length of 13 cm across both cells, this is the longest neuron in the fly brain, 43 times the length of the fly itself.",
    group: "Featured Renderings",
  },
  {
    filename: "flywire_sterling_gallery_bolt.png",
    title: "Bolt: A Dedicated Circuit for Going Fast",
    caption:
      "Bolt Protocerebral Neurons sit in the higher brain and command one job, fast straight forward walking. Identified by Salil Bidaye's lab, BPN is recruited during long, high-velocity walking bouts and works in parallel to a separate pathway, P9, that handles object-directed turning. Two brain pathways, two walking programs.",
    group: "Featured Renderings",
  },
  {
    filename: "flywire_sterling_gallery_moonwalker.png",
    title: "Moonwalker: The Reverse Gear of the Fly Brain",
    caption:
      "MDN, the Moonwalker Descending Neuron, is a small bilateral pair that drops from the brain into the ventral nerve cord and triggers backward walking. When a fly hits an impassable barrier or sees a looming threat, MDN activity flips the locomotor program, simultaneously activating backward and inhibiting forward gait. Identified by Bidaye and Dickson in 2014, it is the canonical command neuron for retreat.",
    group: "Featured Renderings",
  },
  {
    filename: "flywire_sterling_gallery_keystone.png",
    title: "Keystone: A Pair That Reads the Whole Nose",
    caption:
      "Keystone, formally il3LN6, is a pair of broad antennal lobe local neurons whose somata sit far from the lobe in the lateral subesophageal zone, with arborizations that touch nearly every olfactory glomerulus. By integrating across the entire glomerular array, Keystone shapes how odor representations are normalized before they reach the rest of the brain.",
    group: "Featured Renderings",
  },
  {
    filename: "flywire_sterling_gallery_lpsp.png",
    title: "LPsP: Pillars in the Lateral Protocerebrum",
    caption:
      "LPsP cells project through the lateral protocerebrum, a higher-order region where visual, auditory, and olfactory streams converge before reaching descending pathways. Identified during FlyWire annotation by Claire McKellar and Dustin Garner from the Sung Soo Kim lab, these neurons sit in circuits that translate sensory landmarks into navigational signals.",
    group: "Featured Renderings",
  },
  {
    filename: "flywire_sterling_gallery_dm4.png",
    title: "DM4: A Glomerulus Tuned to the Smell of Fruit",
    caption:
      "DM4 is one of the broadly tuned olfactory glomeruli of the antennal lobe, receiving input from Or59b sensory neurons that respond to ethyl acetate and related esters, the volatile signature of ripening fruit. Silencing DM4 abolishes attraction to these odors. The image shows the receptor neurons, projection neurons, and local interneurons that collectively define the glomerular unit.",
    group: "Featured Renderings",
  },
  {
    filename: "flywire_sterling_gallery_avlp538.png",
    title: "AVLP538: A New Cell Type from a Complete Map",
    caption:
      "AVLP538 is one of more than four thousand cell types first defined in the FlyWire connectome, named for the anterior ventrolateral protocerebrum it occupies. The AVLP is a multisensory hub where auditory, visual, and mechanosensory streams meet en route to descending neurons. Cell types like this one, invisible to genetics alone, only become tractable once every neuron in the brain is reconstructed and compared.",
    group: "Featured Renderings",
  },
  {
    filename: "flywire_sterling_gallery_dpm.png",
    title: "DPM: Memory's Quiet Broadcaster",
    caption:
      "DPM, the Dorsal Paired Medial neuron, is a single large cell per hemisphere that infiltrates every lobe of the mushroom body. By co-releasing serotonin and the amnesiac peptide back onto Kenyon Cells, DPM consolidates labile short-term odor memories into stable, anesthesia-resistant long-term traces. Loss of amnesiac, or silencing of DPM, leaves the fly able to learn but unable to remember.",
    group: "Featured Renderings",
  },
  {
    filename: "flywire_sterling_gallery_ct1_1.png",
    title: "CT1: A Single Cell That Touches Every Visual Column",
    caption:
      "CT1 is one of the largest cells in the fly brain by reach. A single CT1 per optic lobe sends an independent neurite into every column of the medulla and lobula, contacting every T4 and T5 motion-detection cell. Each terminal acts as its own compartmentalized processor, so one giant neuron simultaneously contributes to ON and OFF motion computations across the entire visual field.",
    group: "Featured Renderings",
  },
  {
    filename: "flywire_sterling_gallery_oa_al2i1.png",
    title: "OA-AL2i1: An Octopamine Line into the Protocerebrum",
    caption:
      "OA-AL2i1 belongs to the AL2 cluster of octopaminergic neurons, the fly's analogue of noradrenergic modulation. Its soma sits ventromedial to the antennal lobe, sending a single neurite along the esophageal foramen and out into the posterior, lateral, and ventromedial protocerebra. Octopamine release from cells like this one shifts the brain into states of arousal, flight, and reward.",
    group: "Featured Renderings",
  },
  {
    filename: "holoflybrain-sterling.png",
    title: "The Whole Brain, Holographic",
    caption:
      "A volumetric, depth-aware render of the complete FlyWire connectome, the same 139,255 neurons seen elsewhere in the gallery, here treated like a hologram floating in space. The aesthetic foregrounds the brain as a three-dimensional object rather than a circuit diagram.",
    group: "Featured Renderings",
  },
];

// ── Interactive 3D Views ────────────────────────────────────────────────
// Each view either embeds a Three.js viewer (when `circuit` is set, with the
// segment meshes pre-extracted into public/meshes/circuits/<id>/) or falls
// back to a static thumbnail link-out to Codex.

export interface CircuitCellRef {
  segId: string;
  color: string;
}

export interface InteractiveView {
  thumbnail: string;
  title: string;
  description: string;
  codexUrl: string;
  // When present, the gallery renders an inline Three.js viewer instead of a
  // static thumbnail. Cells live in /public/meshes/circuits/<id>/<segId>.glb.
  circuit?: {
    id: string;
    cells: CircuitCellRef[];
  };
}

export const INTERACTIVE_VIEWS: InteractiveView[] = [
  {
    thumbnail: "thermo_pathway.png",
    title: "Thermosensory to DN",
    description:
      "A four-neuron pathway from a thermosensory cell on the right side of the head to the DNa01 descending neuron on the left, the circuit that turns noxious heat into a turn-away motor command.",
    codexUrl:
      "https://codex.flywire.ai/app/search?filter_string=720575940611720362,720575940627787609,720575940626433881,720575940631347011",
    circuit: {
      id: "thermo-pathway",
      cells: [
        { segId: "720575940611720362", color: "#ff7ee0" },
        { segId: "720575940627787609", color: "#7ee0ff" },
        { segId: "720575940626433881", color: "#ffd97e" },
        { segId: "720575940631347011", color: "#9af5d8" },
      ],
    },
  },
  {
    thumbnail: "photo_pathway.png",
    title: "Photoreceptor to DN",
    description:
      "An example pathway from an R1-6 photoreceptor through the optic lobe to a DNa01 descending neuron, one of the chains that converts light at the retina into a turning command for the legs.",
    codexUrl:
      "https://codex.flywire.ai/app/search?filter_string=720575940614783027,720575940619833723,720575940621627062,720575940629904940,720575940637416078,720575940623019544",
    circuit: {
      id: "photo-pathway",
      cells: [
        { segId: "720575940614783027", color: "#ff7ee0" },
        { segId: "720575940619833723", color: "#7ee0ff" },
        { segId: "720575940621627062", color: "#ffd97e" },
        { segId: "720575940629904940", color: "#9af5d8" },
        { segId: "720575940637416078", color: "#b78bff" },
        { segId: "720575940623019544", color: "#ffb87a" },
      ],
    },
  },
  {
    thumbnail: "orn_to_dm1.png",
    title: "ORN and DM1 Neurons",
    description:
      "Every olfactory receptor neuron innervating the DM1 glomerulus, plus the two projection neurons that carry DM1's signal forward to the mushroom body and the lateral horn.",
    codexUrl: "https://codex.flywire.ai/app/search?filter_string=ORN_DM1,DM1_lPN",
  },
  {
    thumbnail: "ring_neurons.png",
    title: "Ring Neurons",
    description:
      "Ring neurons of the central complex, arranged in a ring around the ellipsoid body, integrating sensory landmarks with the fly's internal heading estimate to drive navigation.",
    codexUrl:
      "https://codex.flywire.ai/app/search?filter_string=label+%3D%3D+ExR1",
  },
  {
    thumbnail: "ocellar.png",
    title: "Ocellar Neurons",
    description:
      "Every neuron with arbors in the ocellar ganglion, the small dorsal input from the three simple eyes (ocelli) that detect ambient light level and help stabilize flight.",
    codexUrl: "https://codex.flywire.ai/app/search?filter_string=ocellar",
  },
];

// ── Media picks ──────────────────────────────────────────────────────────
// Ordered list of filenames for the /flywire-media page.
export const FLYWIRE_MEDIA_PICKS = [
  "50_largest_4k.png",
  "3.4_chiasms_cmap-type_4K.png",
  "3.2.c_serpentine_cmap_3600c_4k-color.png",
  "1.9_Highest_cross-brain-connectivity_ME_L-ME_R_4k_neuropil.view.cam_0000.png",
  "1.10.c_keynyon_cmap_3600c.png",
  "3.1_optic_mi1_columns-flywire-cmap_rotation_0000.png",
  "3.3.b_Lobula_intrinsic_4k_0000.png",
  "1_ME_output_whole.view.cam_0000.png",
];
