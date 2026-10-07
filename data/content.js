// Kept as a JS file instead of JSON so the site also works when opened straight from disk.
window.CONTENT = {
  captain: "Mitke",
  flight: "JE-2026",
  launchDate: "07 OCT 2026",
  captainMessage: "This amazing project started almost a year ago, and without each and every one of you it wouldn't look the same! Thank you for your help, for building a complex and smart engine, for the curiosity to ask hard questions that changed our path, and for the fun talks and the good vibes!",

  timeline: [
    {
      date: "DEC 2025",
      phase: "BOARDING",
      icon: "🎫",
      title: "A blank whiteboard",
      text: "One tech design, one bold idea: rebuild the suggestion engine from scratch so the medical team's rules drive it directly.",
      crew: ["amit"]
    },
    {
      date: "JAN 2026",
      phase: "TAKEOFF",
      icon: "🛫",
      title: "Wheels up",
      text: "Kickoff announced with one party parrot. First code lands: new rule boards, the first resolvers, hierarchy-based negation, and a sandbox to debug rules before they ever reach a patient chart.",
      crew: ["amit", "itay", "medical"]
    },
    {
      date: "FEB-MAR",
      phase: "CLIMB",
      icon: "📈",
      title: "Gaining altitude",
      text: "Criteria resolvers for exams, medications, vitals, questionnaires and documented diagnoses. 'Operators' almost became 'conditions' and finally landed as 'criteria'. Naming is hard.",
      crew: ["amit", "medical"]
    },
    {
      date: "APR-JUN",
      phase: "CRUISING",
      icon: "☁️",
      title: "Cruising altitude",
      text: "Filtering irrelevant rules, negate-by-rules, suggestion overrides, and a validation tool that compares every result to the old engine.",
      crew: ["amit", "medical"]
    },
    {
      date: "JUL 2026",
      phase: "SHADOW FLIGHT",
      icon: "👥",
      title: "Flying in formation",
      text: "The new engine flew silently next to the old one on real traffic, so every difference could be caught before anyone saw it.",
      crew: ["matan", "amit"]
    },
    {
      date: "AUG 2026",
      phase: "WIDER SKIES",
      icon: "🌍",
      title: "More clinics, more weather",
      text: "Shadow mode opened to a much wider mix of clinics. Lab parsing and edge cases were aligned one by one.",
      crew: ["amit", "matan", "itay", "raz"]
    },
    {
      date: "SEP 2026",
      phase: "TURBULENCE",
      icon: "⚡",
      title: "Seatbelts on",
      text: "Four validation iterations, diff after diff reviewed row by row, many hours in the LOLA room. Engineers, clinicians and analysts chased every lost diagnosis together until the numbers made sense.",
      crew: ["matan", "amit", "david", "medical", "analysts"],
      image: "assets/lola-room.jpg",
      caption: "POV: validation in the LOLA room. Meme by David."
    },
    {
      date: "07 OCT 2026",
      phase: "LANDING",
      icon: "🛬",
      title: "...and the next takeoff",
      text: "The first clinics go live on Jet Engine. More stages to come, and it all started with this crew.",
      crew: ["amit", "itay", "matan", "raz", "david", "yasmin", "erel", "emanuel", "moti", "sagi", "noa", "analysts"]
    }
  ],

  // `photo` is optional. Without it, a pixel avatar is generated from the initials.
  crew: [
    {
      id: "amit",
      name: "Amit Haim",
      seat: "0A",
      cabin: "COCKPIT",
      title: "Captain / Chief Rule Whisperer",
      group: "Engineering",
      photo: "assets/avatars/amit.jpg",
      stats: [
        ["Commits", "108"],
        ["Lines deleted", "148,884"],
        ["Active days", "39"],
        ["Peak hour", "17:00"]
      ],
      superlative: "Most likely to open yet another ticket at 9pm",
      gameLine: "The captain is on board.",
      note: "Thank you all for letting me fly this thing with you."
    },
    {
      id: "itay",
      name: "Itay Golan",
      seat: "1A",
      cabin: "ENGINEERING",
      title: "Negation Navigator",
      group: "Engineering",
      photo: "assets/avatars/itay.jpg",
      stats: [
        ["Commits", "9"],
        ["Lines added", "1,153"],
        ["Built", "Rules sandbox"],
        ["Peak hour", "12:00"]
      ],
      superlative: "Taught the engine when to say NO",
      gameLine: "Itay boarded with the negation map!",
      note: "Itay, hierarchy-based negation and the sandbox were the tools we leaned on every single day of validation. Thank you."
    },
    {
      id: "matan",
      name: "Matan Nachmias Grynbaum",
      seat: "1B",
      cabin: "ENGINEERING",
      title: "Shadow Ops Commander",
      group: "Engineering",
      photo: "assets/avatars/matan.jpg",
      stats: [
        ["Commits", "17"],
        ["Jira tickets", "13"],
        ["Latest commit", "22:00"],
        ["Flipped", "The live switch"]
      ],
      superlative: "Investigated more diff rows than anyone thought humanly possible",
      gameLine: "Matan boarded straight from the LOLA room!",
      note: "Matan, you built the shadow that made this rollout safe, and then chased every weird diff to the end. Thank you."
    },
    {
      id: "raz",
      name: "Raz Ramon",
      seat: "1C",
      cabin: "ENGINEERING",
      title: "Edge Case Hunter",
      group: "Engineering",
      photo: "assets/avatars/raz.jpg",
      stats: [
        ["Commits", "3"],
        ["Lines added", "503"],
        ["Tests", "Many"],
        ["Peak hour", "12:00"]
      ],
      superlative: "Small diffs, big saves",
      gameLine: "Raz boarded with a bag full of tests!",
      note: "Raz, thank you for jumping in when it counted."
    },
    {
      id: "david",
      name: "David Lavy",
      seat: "2A",
      cabin: "ENGINEERING",
      title: "Air Traffic Controller",
      group: "Engineering",
      photo: "assets/avatars/david.jpg",
      stats: [
        ["Tickets opened", "12"],
        ["Bugs spotted", "Before prod"],
        ["Radar", "Always on"],
        ["LOLA memes", "1 legendary"]
      ],
      superlative: "Official LOLA room paparazzo",
      gameLine: "David cleared us for takeoff!",
      note: "David, thank you for keeping the radar on and the priorities straight."
    },
    {
      id: "yasmin",
      name: "Yasmin Anderson",
      seat: "3A",
      cabin: "MEDICAL",
      title: "Clinical Flight Surgeon",
      group: "Medical",
      photo: "assets/avatars/yasmin.jpg",
      stats: [
        ["Rules created", "218"],
        ["Criteria written", "345"],
        ["Board edits", "7,452"],
        ["Late-night edits", "846"]
      ],
      superlative: "Night owl of the boards: 846 edits after 8pm",
      gameLine: "Yasmin boarded with the clinical playbook!",
      note: "Yasmin, 77 days on the boards and thousands of edits. The rules this engine runs on carry your fingerprints everywhere."
    },
    {
      id: "erel",
      name: "Erel Yaron",
      seat: "3B",
      cabin: "MEDICAL",
      title: "Rulebook Architect",
      group: "Medical",
      photo: "assets/avatars/erel.jpg",
      stats: [
        ["Rules created", "356"],
        ["Criteria written", "394"],
        ["Board edits", "4,979"],
        ["Active days", "30"]
      ],
      superlative: "Wrote more rules than anyone on the boards",
      gameLine: "Erel boarded with the rulebook!",
      note: "Erel, 356 rules and counting. Thank you for turning clinical knowledge into something an engine can run."
    },
    {
      id: "emanuel",
      name: "Emanuel Melaku",
      seat: "3C",
      cabin: "MEDICAL",
      title: "Diagnosis Detective",
      group: "Medical",
      photo: "assets/avatars/emanuel.jpg",
      stats: [
        ["Validation room", "Opened it"],
        ["Rules created", "4"],
        ["Board edits", "58"],
        ["Rollout plan", "Reviewed"]
      ],
      superlative: "Opened the validation war room and kept it running",
      gameLine: "Emanuel boarded with a magnifying glass!",
      note: "Emanuel, thank you for leading the medical validation and keeping every iteration moving."
    },
    {
      id: "moti",
      name: "Moti Arzuan",
      seat: "3D",
      cabin: "MEDICAL",
      title: "Chief Medical Navigator",
      group: "Medical",
      photo: "assets/avatars/moti.jpg",
      stats: [
        ["Hard questions", "The right ones"],
        ["Risk models", "Per patient"],
        ["Design changed", "Yes"],
        ["Heading", "Set"]
      ],
      superlative: "Asked the risk-model question that changed the design",
      gameLine: "Moti boarded and set the heading!",
      note: "Moti, your questions early on reshaped how the engine thinks about risk models. Thank you for steering."
    },
    {
      id: "sagi",
      name: "Sagi Klein",
      seat: "3E",
      cabin: "MEDICAL",
      title: "Criteria Craftsman",
      group: "Medical",
      photo: "assets/avatars/sagi.jpg",
      stats: [
        ["Rules created", "44"],
        ["Criteria written", "94"],
        ["Board edits", "510"],
        ["Active days", "14"]
      ],
      superlative: "Two criteria for every rule, on average",
      gameLine: "Sagi boarded with a stack of criteria!",
      note: "Sagi, thank you for every rule and criterion you added. The boards are sharper because of you."
    },
    {
      id: "noa",
      name: "Noa Elisha",
      seat: "3F",
      cabin: "MEDICAL",
      title: "Board Sync Specialist",
      group: "Medical",
      photo: "assets/avatars/noa.jpg",
      stats: [
        ["Rules created", "22"],
        ["Criteria written", "36"],
        ["Board edits", "337"],
        ["Tickets", "Opened"]
      ],
      superlative: "Made sure the boards and the engine never drifted apart",
      gameLine: "Noa boarded with the latest board export!",
      note: "Noa, thank you for the rules, the reviews and for keeping the boards in sync."
    },
    {
      id: "analysts",
      name: "The Analysts",
      seat: "ROW 4",
      cabin: "ANALYTICS",
      title: "Black Box Decoders",
      group: "Analysts",
      emoji: "📊",
      stats: [
        ["Boards", "14"],
        ["Rules in play", "735"],
        ["Diffs reviewed", "Countless"],
        ["Coffee", "Yes"]
      ],
      superlative: "Every row checked, every number explained",
      gameLine: "The analysts boarded with the black box!",
      note: "To all the analysts: thank you for reading the black box so the rest of us could fly."
    }
  ],

  funFacts: [
    "Validation iterations: 4",
    "Kickoff announced with exactly one party parrot",
    "Operators → conditions → criteria. Naming is hard.",
    "Most typed status update: 'Fixed ✅'",
    "Bottom lines (literally)"
  ],

  specialThanks: [
    "Everyone who answered a 'quick question' that wasn't quick",
    "The old engine, for years of faithful service",
    "The Inferred 3.0 boards: 14 boards, 735 rules"
  ]
};
