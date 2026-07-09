export const translateTitleToEnglishPrompt = (title: string): string => {
  const t = title.toLowerCase();
  let component = "motosiklet mechanical spare parts";
  let description = "finely crafted steel and aluminum motorcycle spare parts";
  let surface = "clean dark carbon fiber backdrop with subtle red accent lighting";

  if (t.includes("fark") || t.includes("neden") || t.includes("nasıl anlaşılır") || t.includes("test")) {
    component = "motorcycle diagnostic scene";
    description = "a digital multimeter testing electronic components, glowing screen, copper wires, clean mechanical workspace";
    surface = "professional diagnostic station";
  } else if (t.includes("konjektör") || t.includes("regülatör") || t.includes("şarj") || t.includes("sarj")) {
    component = "voltage regulator rectifier unit";
    description = "a heavy-duty black anodized aluminum cooling heat sink body, copper pins, electrical connectors, sleek black alloy metal surface";
    surface = "clean dark slate tabletop";
  } else if (t.includes("statör") || t.includes("sargı")) {
    component = "engine stator magneto coil";
    description = "tightly coiled shiny copper magnetic wire wraps around a circular metal core, clean electrical harness, pristine industrial engineering";
    surface = "sleek black carbon surface";
  } else if (t.includes("akü")) {
    component = "motorcycle 12V battery block";
    description = "a brand new heavy-duty rectangular sealed lead-acid battery block with clear terminal covers, robust polypropylene housing";
    surface = "minimalist workshop table";
  } else if (t.includes("marş rölesi") || t.includes("mars")) {
    component = "starter solenoid relay switch";
    description = "copper terminals, golden metal brackets, black sealed body, professional electronics mounting";
    surface = "professional diagnostic station background";
  } else if (t.includes("varyatör")) {
    component = "scooter cvt variator assembly clutch pulleys";
    description = "polished steel variator plate, precision weighted copper roller weights, shining aluminum surfaces, pristine mechanical craftsmanship";
    surface = "clean anodized steel workspace backdrop";
  } else if (t.includes("kayış") || t.includes("kayiş")) {
    component = "scooter CVT drive belt";
    description = "a heavy-duty black reinforced rubber driving belt with clean fiber teeth, perfectly symmetrical, crisp rubber texture and brand markings";
    surface = "clean gray catalog studio backdrop";
  } else if (t.includes("silindir")) {
    component = "motosiklet engine cylinder block";
    description = "a flawless precision-machined heavy cast-iron outer cylinder body, gleaming honing crosshatch patterns inside the clean aluminum sleeves";
    surface = "matte black metallic surface";
  } else if (t.includes("piston") || t.includes("segman")) {
    component = "engine piston rings kit";
    description = "gleaming silver polished aluminum piston head, high-tech steel alloy compression rings, absolute circular precision, microscopic metal texture";
    surface = "clean micro-fiber studio sheet";
  } else if (t.includes("buji")) {
    component = "high performance spark plug";
    description = "white ceramic insulator body, shiny metallic threaded shell, iridium electrode tip, pristine copper core spark plug";
    surface = "clean engine block background";
  } else if (t.includes("karbüratör")) {
    component = "fuel-system carburetor assembly";
    description = "high quality cast alloy carburetor, brass fuel adjustment screws, precision slide valve pathways, sophisticated mechanical valves";
    surface = "industrial workbench top";
  } else if (t.includes("enjektör")) {
    component = "electronic fuel injector nozzle";
    description = "high-tech stainless steel injector nozzle with microscopic spray holes, black wiring connector port, perfect precision engineering";
    surface = "laboratory grade black plastic desk";
  } else if (t.includes("fren balatası") || t.includes("balata")) {
    component = "motorcycle disc brake pads set";
    description = "semi-metallic friction materials, copper-infused brake composite pads, clean steel backing plate with red/black high-temperature paint";
    surface = "textured steel workbench";
  } else if (t.includes("fren diski") || t.includes("disk")) {
    component = "ventilated steel brake disc rotor";
    description = "a perfect circular drilled steel disc rotor, pristine shiny metallic ground surface, precision ventilation slots, symmetrical industrial artwork";
    surface = "contrast slate surface";
  } else if (t.includes("fren pompası") || t.includes("pompa")) {
    component = "hydraulic brake master cylinder";
    description = "black anodized levers and hydraulic fluid reservoir tank, clean rubber seals, polished steel plungers";
    surface = "sleek presentation table";
  } else if (t.includes("kask") && t.includes("çene açılır")) {
    component = "modular motorcycle helmet";
    description = "premium matte black modular motorcycle helmet with open chin bar, clear visor, high-tech aerodynamic shell, premium padding, professional safety gear";
    surface = "clean dark studio podium";
  } else if (t.includes("kask") && t.includes("yarım")) {
    component = "open face urban motorcycle helmet";
    description = "premium matte gray half-face open motorcycle helmet, retro modern design, clear visor, sleek aerodynamic shell, safety gear";
    surface = "clean slate studio surface";
  } else if (t.includes("kask")) {
    component = "full face motorcycle helmet";
    description = "premium aggressive aerodynamic full face motorcycle helmet, dark tinted visor, carbon fiber details, professional safety gear";
    surface = "clean dark studio podium";
  } else if (t.includes("bakım seti") || t.includes("periyodik bakım") || t.includes("bakımı")) {
    component = "motorcycle maintenance parts kit";
    description = "a professional collection of brand new motorcycle maintenance parts including engine oil bottle, air filter, spark plug, and brake pads arranged neatly";
    surface = "clean professional workshop table";
  } else if (t.includes("zincir")) {
    component = "drive chain steel sprocket gear";
    description = "premium heavy-duty steel motorcycle drive chain and pristine golden alloy teeth sprocket wheel, perfectly oiled metal links";
    surface = "clean oil-repellent workbench mat";
  } else if (t.includes("debriyaj")) {
    component = "clutch pad plates kit";
    description = "circular friction clutch plate set, shiny cork wood composite pads, robust steel plates, perfectly clean stack";
    surface = "dark steel studio floor";
  } else if (t.includes("amortisör")) {
    component = "hydraulic rear shock absorber suspension";
    description = "metallic coil spring coilover, shiny chrome-plated central damper rod, premium red or yellow coil spring, perfect CNC machined joints";
    surface = "commercial presentation stand";
  } else if (t.includes("yağ eksiltme") || t.includes("yağ")) {
    component = "premium synthetic motorcycle engine oil bottle";
    description = "a high-performance black and gold synthetic engine oil plastic bottle next to a pristine metallic engine component";
    surface = "professional workshop table";
  } else if (t.includes("kaza") || t.includes("tamir")) {
    component = "motorcycle workshop diagnostic scene";
    description = "shiny metallic tools, polished wrenches, socket sets, and assorted engine parts laid out symmetrically";
    surface = "professional clean workshop table";
  }

  // Model mapping
  let model = "motosiklet";
  if (t.includes("apache") || t.includes("rtr 200")) model = "TVS Apache RTR 200";
  else if (t.includes("raider")) model = "TVS Raider 125";
  else if (t.includes("jupiter")) model = "TVS Jupiter 110";
  else if (t.includes("kuba")) model = "Kuba";
  else if (t.includes("mondial")) model = "Mondial";
  else if (t.includes("rks")) model = "RKS";
  else if (t.includes("tvs")) model = "TVS";
  else if (t.includes("falcon")) model = "Falcon";
  else if (t.includes("honda pcx")) model = "Honda PCX";

  const isTechnical = t.includes("arızası") || t.includes("kronik") || t.includes("sorunu") || t.includes("tamiri") || t.includes("ayar");
  const isScene = t.includes("kaza") || t.includes("tamir") || t.includes("bakım") || t.includes("test") || t.includes("fark") || t.includes("neden") || t.includes("nasıl");
  
  const textInstruction = "strictly no human hands, no text, no watermark, no logos, NO FANTASY, NO SCI-FI, highly realistic mechanical engineering photography, real motorcycle workshop setting";

  if (isScene) {
    return `commercial photography, highly realistic, a ${model} ${component}. Features ${description}. Shot on a ${surface}, high-end camera 85mm lens, f/8, sharp focus, epic studio lighting, 8k resolution, crisp details, hyper-realistic electronic and metal textures. ${textInstruction}`;
  }

  return `commercial product catalog photography, highly realistic, a brand new ${model} original spare part: ${component}. Features ${description}. Shot on a ${surface}, high-end camera 85mm lens, f/8, sharp focus, epic studio lighting, 8k resolution, crisp details, symmetrical composition, hyper-realistic metal and rubber textures, no distorted shapes. ${textInstruction}`;
};
