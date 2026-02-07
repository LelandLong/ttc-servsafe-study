// ============ CUL 104 SERVSAFE QUESTIONS DATABASE ============
// Sources: Quiz #1, Study Guide, PowerPoints, Class Notes from Chef Carmel
// examFocus: true = Professor emphasized for exam, false = basic knowledge
// chapter: Chapter number (1-15) for chapter-based study modes
//
// This file is loaded by both the study app (index.html) and the admin interface (admin.html)
// Questions can be edited via the admin interface and exported as an updated questions.js file

var questionsDB = [
  // ========== CHAPTER 1: KEEPING FOOD SAFE ==========
  {
    id: 1,
    question: "A foodhandler should be excluded from a foodservice establishment if diagnosed with which of the following?",
    options: ["Hepatitis B", "Tuberculosis", "Cancer", "Staphylococcal gastroenteritis"],
    correct: 3,
    hint: "Think about the Big Six pathogens. Which of these conditions can be transmitted through food handling?",
    explanation: "Staphylococcal gastroenteritis is caused by Staph aureus, a Big Six pathogen requiring exclusion.",
    category: "Foodborne Illness",
    chapter: 1,
    examFocus: true
  },
  {
    id: 2,
    question: "What does the 'A' in FAT TOM stand for?",
    options: ["Additives", "Alkalinity", "Acidity", "Activity"],
    correct: 2,
    hint: "This factor relates to the pH scale and how it affects bacterial growth.",
    explanation: "A = Acidity. Bacteria grow best in foods with pH between 4.6 and 7.5.",
    category: "Food Safety Basics",
    chapter: 1,
    examFocus: true
  },
  {
    id: 3,
    question: "FAT TOM is an acronym that stands for the...",
    options: [
      "conditions that favor the growth of most foodborne microorganisms",
      "cooking methods that can be used to make food more healthful",
      "process of reducing hazards in the flow of food",
      "six most common foodborne diseases"
    ],
    correct: 0,
    hint: "FAT TOM describes what bacteria NEED. Think: what makes microorganisms multiply?",
    explanation: "FAT TOM describes the six conditions bacteria need to grow: Food, Acidity, Time, Temperature, Oxygen, Moisture.",
    category: "Food Safety Basics",
    chapter: 1,
    examFocus: true
  },
  {
    id: 4,
    question: "Which one of the following is true of bacteria?",
    options: [
      "Bacteria always live in oxygen-poor environments",
      "Bacteria cannot survive in low temperatures",
      "Bacteria thrive in highly acidic food",
      "Bacteria are the microorganisms that pose the greatest threat to food safety"
    ],
    correct: 3,
    hint: "Consider: Can bacteria survive in freezers? Do all need oxygen? What's the BIGGEST concern in food safety?",
    explanation: "Bacteria pose the greatest threat to food safety. They CAN survive low temps and some thrive without oxygen.",
    category: "Foodborne Illness",
    chapter: 1,
    examFocus: true
  },
  {
    id: 5,
    question: "All of the following may cause chemical contamination of food, EXCEPT...",
    options: ["a zinc-coated pitcher", "an enamelware food-storage container", "a pewter soup bowl", "a stainless-steel mixing bowl"],
    correct: 3,
    hint: "Think about which metals can react with acidic foods. What material is considered food-safe in commercial kitchens?",
    explanation: "Stainless steel is safe. Zinc, enamelware, and pewter can leach chemicals into acidic foods.",
    category: "Foodborne Illness",
    chapter: 1,
    examFocus: true
  },
  {
    id: 6,
    question: "All of the following are methods to help prevent foodborne illness from seafood, EXCEPT...",
    options: [
      "using only a reputable supplier",
      "using the supplier that is closest to your establishment",
      "receiving fish at 41°F (5°C) or lower",
      "rejecting fish that has thawed and refrozen"
    ],
    correct: 1,
    hint: "What truly matters when choosing suppliers - location or certification/reputation?",
    explanation: "Proximity doesn't ensure safety. Use approved, reputable suppliers regardless of distance.",
    category: "Food Safety Basics",
    chapter: 1,
    examFocus: false
  },
  {
    id: 9,
    question: "The acidity or alkalinity of food is measured by its...",
    options: ["water activity", "level of aerobic microorganisms", "pH level", "temperature"],
    correct: 2,
    hint: "The 'A' in FAT TOM refers to this measurement on a scale from 0 to 14.",
    explanation: "pH measures acidity/alkalinity. Bacteria grow best between pH 4.6 and 7.5.",
    category: "Food Safety Basics",
    chapter: 1,
    examFocus: true
  },
  {
    id: 10,
    question: "Which statement about bacteria is INCORRECT?",
    options: [
      "They can be carried by food",
      "They can be carried by people",
      "They are one-celled organisms",
      "They always need oxygen to grow"
    ],
    correct: 3,
    hint: "Think about C. botulinum - does it need air? Consider what 'anaerobic' means.",
    explanation: "NOT all bacteria need oxygen. Anaerobic bacteria (like C. botulinum) grow without it.",
    category: "Foodborne Illness",
    chapter: 1,
    examFocus: true
  },
  {
    id: 12,
    question: "The 'flow of food' refers to the...",
    options: [
      "amount of time food is left in storage",
      "proper food-storage methods",
      "path that food travels through an establishment",
      "amount of time it takes to prepare a dish"
    ],
    correct: 2,
    hint: "Think about the word 'flow' - what does it suggest about movement and journey through the kitchen?",
    explanation: "Flow of food is the path food takes from receiving through serving and disposal.",
    category: "Food Safety Basics",
    chapter: 1,
    examFocus: false
  },
  {
    id: 18,
    question: "Pathogens are...",
    options: ["a thick-walled form of bacteria", "microorganisms that cause food to spoil", "microorganisms that cause disease", "a type of fungus"],
    correct: 2,
    hint: "Break down the word: 'patho-' relates to illness/suffering. What do pathogens cause?",
    explanation: "Pathogens are microorganisms that cause disease. Spoilage organisms are different.",
    category: "Food Safety Basics",
    chapter: 1,
    examFocus: false
  },
  {
    id: 20,
    question: "Food with mold that is not a natural part of the food should be...",
    options: ["frozen", "irradiated", "discarded", "used immediately"],
    correct: 2,
    hint: "Mold can spread beyond what's visible and produce toxins. What's the safest action?",
    explanation: "Discard food with unnatural mold. Mold roots and toxins spread beyond visible areas.",
    category: "Food Safety Basics",
    chapter: 1,
    examFocus: false
  },
  {
    id: 24,
    question: "The temperature danger zone is between...",
    options: ["0°F and 212°F", "32°F and 100°F", "41°F and 135°F", "70°F and 125°F"],
    correct: 2,
    hint: "Chef Carmel emphasized this range repeatedly. What are the upper and lower limits where bacteria thrive?",
    explanation: "Danger Zone: 41°F to 135°F (5°C to 57°C). Bacteria grow rapidly in this range.",
    category: "Temperature Control",
    chapter: 1,
    examFocus: true
  },
  {
    id: 25,
    question: "A different form of bacterial cells that can survive some cooking and freezing temperatures are called...",
    options: ["pathogens", "viruses", "spores", "parasites"],
    correct: 2,
    hint: "What form allows bacteria to survive extreme conditions like high heat and freezing?",
    explanation: "Spores are dormant bacterial cells that can survive cooking and freezing.",
    category: "Foodborne Illness",
    chapter: 1,
    examFocus: true
  },
  {
    id: 46,
    question: "When is a foodborne illness considered an OUTBREAK?",
    options: [
      "When one person gets sick from food",
      "When two or more people have the same symptoms after eating the same food",
      "When food is found to be contaminated",
      "When a restaurant fails an inspection"
    ],
    correct: 1,
    hint: "How many people must be affected before it's classified as an outbreak? More than just one.",
    explanation: "An outbreak occurs when two or more people have the same symptoms after eating the same food, confirmed by investigation.",
    category: "Food Safety Basics",
    chapter: 1,
    examFocus: true
  },
  {
    id: 48,
    question: "What is the 'O' in FAT TOM?",
    options: ["Odor", "Oxygen", "Organic matter", "Outbreak"],
    correct: 1,
    hint: "This FAT TOM factor relates to whether bacteria need air to survive.",
    explanation: "O = Oxygen. Some bacteria need it to grow, while others (anaerobic) grow without it.",
    category: "Food Safety Basics",
    chapter: 1,
    examFocus: true
  },
  {
    id: 49,
    question: "What is the 'M' in FAT TOM?",
    options: ["Microorganisms", "Moisture", "Minerals", "Movement"],
    correct: 1,
    hint: "This FAT TOM factor relates to water activity - bacteria need this to survive.",
    explanation: "M = Moisture. Bacteria grow well in food with high water activity (aw of 0.85+).",
    category: "Food Safety Basics",
    chapter: 1,
    examFocus: true
  },
  {
    id: 50,
    question: "Which populations are at HIGH RISK for foodborne illness?",
    options: [
      "Athletes and teenagers",
      "Preschool children, elderly, and immunocompromised people",
      "Adults aged 25-45",
      "People who eat organic food"
    ],
    correct: 1,
    hint: "Think about who has weaker immune systems - which age groups and conditions?",
    explanation: "High-risk populations: preschool-age children, elderly people, and those with compromised immune systems.",
    category: "Food Safety Basics",
    chapter: 1,
    examFocus: true
  },
  {
    id: 52,
    question: "What is cross-contamination?",
    options: [
      "When food is cooked at the wrong temperature",
      "When pathogens transfer from one surface or food to another",
      "When food is stored too long",
      "When chemicals mix with food"
    ],
    correct: 1,
    hint: "This occurs when harmful things move from one food or surface to another. Think drips, hands, cutting boards.",
    explanation: "Cross-contamination occurs when pathogens transfer from one surface or food to another.",
    category: "Food Safety Basics",
    chapter: 1,
    examFocus: true
  },
  {
    id: 53,
    question: "What is time-temperature abuse?",
    options: [
      "Cooking food too quickly",
      "When food stays too long at temperatures that allow pathogen growth",
      "Using a broken thermometer",
      "Serving food too hot"
    ],
    correct: 1,
    hint: "This term combines two factors: how long food sits and at what temperature.",
    explanation: "Time-temperature abuse occurs when food is left too long in the temperature danger zone (41°F-135°F).",
    category: "Temperature Control",
    chapter: 1,
    examFocus: true
  },
  {
    id: 54,
    question: "Bacteria grow MOST rapidly between which temperatures?",
    options: ["32°F - 41°F", "41°F - 70°F", "70°F - 125°F", "135°F - 165°F"],
    correct: 2,
    hint: "While bacteria grow in the full danger zone, there's a narrower range where growth is FASTEST.",
    explanation: "While the danger zone is 41-135°F, bacteria grow MOST rapidly between 70°F and 125°F.",
    category: "Temperature Control",
    chapter: 1,
    examFocus: true
  },
  {
    id: 63,
    question: "The five common risk factors for foodborne illness include all EXCEPT...",
    options: [
      "Purchasing from unsafe sources",
      "Holding food at incorrect temperatures",
      "Using expensive ingredients",
      "Poor personal hygiene"
    ],
    correct: 2,
    hint: "Four of these are actual food safety risks. Which one doesn't affect food safety at all?",
    explanation: "The five risk factors are: unsafe sources, failing to cook properly, incorrect temps, contaminated equipment, poor hygiene.",
    category: "Food Safety Basics",
    chapter: 1,
    examFocus: true
  },
  // ========== CHAPTER 2: FOODBORNE PATHOGENS ==========
  {
    id: 13,
    question: "Which toxin is found in predatory tropical reef fish and is NOT destroyed by cooking?",
    options: ["Anisakis simplex", "Ciguatera toxin", "Vibrio parahaemolyticus", "Rotavirus"],
    correct: 1,
    hint: "This is a seafood toxin associated with tropical reef predators. Is it a parasite, bacteria, virus, or toxin?",
    explanation: "Ciguatera toxin from reef fish CANNOT be destroyed by cooking or freezing.",
    category: "Foodborne Illness",
    chapter: 2,
    examFocus: false
  },
  {
    id: 14,
    question: "Which describes toxoplasmosis?",
    options: [
      "Caused by a parasite in contaminated water; linked to raw milk and marine fish",
      "Caused by a parasite that lives in cat feces; linked to undercooked or raw meat",
      "Caused by a virus in contaminated water; linked to shellfish, salads, cold cuts",
      "Caused by a virus in the intestinal tract; linked to raw and ready-to-eat food"
    ],
    correct: 1,
    hint: "The name 'toxoplasma' is associated with a common household pet. Think about what's risky for pregnant women.",
    explanation: "Toxoplasmosis is a parasite from cat feces, commonly linked to undercooked meat.",
    category: "Foodborne Illness",
    chapter: 2,
    examFocus: true
  },
  {
    id: 15,
    question: "Which type of food would be MOST likely to cause a foodborne illness?",
    options: ["Frozen corn", "Baked potatoes", "Sliced cucumbers", "Instant soup mixes"],
    correct: 1,
    hint: "Think about TCS foods and which of these requires careful temperature control. Which could harbor anaerobic bacteria?",
    explanation: "Baked potatoes are TCS foods that can harbor C. botulinum if temperature-abused.",
    category: "Temperature Control",
    chapter: 2,
    examFocus: true
  },
  {
    id: 16,
    question: "Which disease can be transmitted through food?",
    options: ["AIDS", "Tuberculosis", "Hepatitis A", "Hepatitis C"],
    correct: 2,
    hint: "Review the Big Six pathogens. Which type of Hepatitis is foodborne vs. bloodborne?",
    explanation: "Hepatitis A is foodborne (Big Six). AIDS, TB, and Hep C are NOT transmitted through food.",
    category: "Foodborne Illness",
    chapter: 2,
    examFocus: true
  },
  {
    id: 19,
    question: "Toxins are a natural part of all of the following plants, EXCEPT...",
    options: ["rhubarb leaves", "apricot kernels", "parsley", "fava beans"],
    correct: 2,
    hint: "Think about which of these is commonly used as a garnish with no safety concerns.",
    explanation: "Parsley is safe. Rhubarb leaves (oxalic acid), apricot kernels (cyanide), fava beans contain natural toxins.",
    category: "Foodborne Illness",
    chapter: 2,
    examFocus: false
  },
  {
    id: 22,
    question: "All of the following are types of food commonly associated with allergies, EXCEPT...",
    options: ["eggs and egg products", "soy and soy products", "melons", "peanuts"],
    correct: 2,
    hint: "Think about the Big 8 allergens. Which of these choices is NOT on that list?",
    explanation: "Melons are NOT a Big 8 allergen. The Big 8 are: milk, eggs, fish, shellfish, wheat, soy, peanuts, tree nuts.",
    category: "Foodborne Illness",
    chapter: 2,
    examFocus: true
  },
  {
    id: 23,
    question: "A foodborne illness often caused by contaminated chicken and eggs is...",
    options: ["Bacillus cereus gastroenteritis", "salmonellosis", "Norovirus gastroenteritis", "cyclosporiasis"],
    correct: 1,
    hint: "Think about which bacteria is strongly associated with poultry and eggs in food safety training.",
    explanation: "Salmonellosis is commonly linked to chicken and eggs. Always cook poultry to 165°F.",
    category: "Foodborne Illness",
    chapter: 2,
    examFocus: true
  },
  {
    id: 32,
    question: "Which symptom indicates a foodhandler should be EXCLUDED (sent home completely)?",
    options: ["Runny nose", "Sore throat", "Jaundice", "Headache"],
    correct: 2,
    hint: "Chef Carmel called one of these 'THE BIG ONE' for exclusion. Which affects eye/skin color?",
    explanation: "Jaundice (yellowing of skin/eyes) requires immediate exclusion and a doctor's note to return.",
    category: "Foodborne Illness",
    chapter: 2,
    examFocus: true
  },
  {
    id: 37,
    question: "How long must a foodhandler be symptom-free from vomiting or diarrhea before returning to work?",
    options: ["12 hours", "24 hours", "48 hours", "72 hours"],
    correct: 1,
    hint: "How long symptom-free is enough to return? Or what else could authorize return?",
    explanation: "Must be symptom-free for 24 hours minimum, or have a doctor's written release.",
    category: "Foodborne Illness",
    chapter: 2,
    examFocus: true
  },
  {
    id: 38,
    question: "Which of these is NOT one of the Big Eight allergens?",
    options: ["Peanuts", "Tree nuts", "Corn", "Shellfish"],
    correct: 2,
    hint: "The Big 8 allergens are specific. Which common food item here isn't on that list?",
    explanation: "Corn is NOT a Big 8 allergen. The Big 8 are: milk, eggs, fish, shellfish, wheat, soy, peanuts, tree nuts.",
    category: "Foodborne Illness",
    chapter: 2,
    examFocus: true
  },
  {
    id: 39,
    question: "Which pathogen is commonly found in cooked rice that has been time-temperature abused?",
    options: ["Salmonella", "E. coli", "Bacillus cereus", "Listeria"],
    correct: 2,
    hint: "Think about 'fried rice syndrome' - which bacteria is famous for growing in reheated rice?",
    explanation: "Bacillus cereus is commonly found in cooked rice, especially fried rice left at unsafe temps.",
    category: "Foodborne Illness",
    chapter: 2,
    examFocus: true
  },
  {
    id: 41,
    question: "Which bacteria produces toxins that CANNOT be destroyed by cooking?",
    options: ["Salmonella", "E. coli", "Staphylococcus aureus", "Listeria"],
    correct: 2,
    hint: "Which bacteria produces toxins that are 'heat-stable' - meaning cooking can't destroy them?",
    explanation: "Staph aureus toxins are heat-stable - they survive cooking. Prevention is key!",
    category: "Foodborne Illness",
    chapter: 2,
    examFocus: true
  },
  {
    id: 43,
    question: "What type of food does the term 'TCS' describe?",
    options: [
      "Foods that are thermally cooked and served",
      "Foods requiring time/temperature control for safety",
      "Foods that are tested, certified, and sealed",
      "Foods with total calorie standards"
    ],
    correct: 1,
    hint: "The letters TCS stand for something about controlling two factors to prevent bacterial growth.",
    explanation: "TCS foods require time and temperature control to prevent bacterial growth.",
    category: "Temperature Control",
    chapter: 2,
    examFocus: true
  },
  {
    id: 45,
    question: "What is a key symptom of Hepatitis A?",
    options: ["Rash on arms", "Jaundice (yellowing of eyes/skin)", "Muscle spasms", "Hair loss"],
    correct: 1,
    hint: "This virus attacks the liver. What visible symptom indicates liver problems?",
    explanation: "Hepatitis A causes jaundice (yellowing of eyes and skin), along with fever and weakness.",
    category: "Foodborne Illness",
    chapter: 2,
    examFocus: true
  },
  {
    id: 47,
    question: "Which of the following is NOT one of the Big Six pathogens?",
    options: ["Norovirus", "Hepatitis A", "Listeria monocytogenes", "Shigella spp."],
    correct: 2,
    hint: "Review the Big Six pathogens. Which of these bacteria is NOT on that high-alert list?",
    explanation: "Listeria is NOT a Big Six pathogen. The Big Six are highly infectious and require employee exclusion.",
    category: "Foodborne Illness",
    chapter: 2,
    examFocus: true
  },
  {
    id: 55,
    question: "Which of the following is a TCS food?",
    options: ["Bread", "Dried pasta", "Sliced melons", "Crackers"],
    correct: 2,
    hint: "Which of these has been processed in a way that exposes interior surfaces to bacteria?",
    explanation: "Sliced melons are TCS foods and require time/temperature control for safety.",
    category: "Temperature Control",
    chapter: 2,
    examFocus: true
  },
  {
    id: 56,
    question: "Garlic-and-oil mixtures are dangerous because they can support growth of...",
    options: ["Salmonella", "E. coli", "Clostridium botulinum", "Norovirus"],
    correct: 2,
    hint: "Oil creates an oxygen-free environment. What anaerobic bacteria thrives in such conditions?",
    explanation: "Garlic-and-oil mixtures can support Clostridium botulinum, which grows without oxygen.",
    category: "Temperature Control",
    chapter: 2,
    examFocus: true
  },
  {
    id: 58,
    question: "Foodhandlers diagnosed with a Big Six illness...",
    options: [
      "Can work if they wear gloves",
      "Can work in non-food areas only",
      "Cannot work in a foodservice operation while sick",
      "Can work after taking medication"
    ],
    correct: 2,
    hint: "The Big Six illnesses are highly infectious. Can these workers be in the building at all?",
    explanation: "Food handlers with Big Six illnesses cannot work in foodservice while they are sick.",
    category: "Foodborne Illness",
    chapter: 2,
    examFocus: true
  },
  {
    id: 59,
    question: "Which virus is the leading cause of foodborne illness?",
    options: ["Hepatitis A", "Norovirus", "Rotavirus", "HIV"],
    correct: 1,
    hint: "This virus is extremely contagious and is part of the Big Six. Which one causes the most outbreaks?",
    explanation: "Norovirus is the leading cause of foodborne illness outbreaks in the US.",
    category: "Foodborne Illness",
    chapter: 2,
    examFocus: true
  },
  {
    id: 62,
    question: "Toxins produced by bacteria...",
    options: [
      "Are always destroyed by cooking",
      "Cannot be destroyed by cooking",
      "Only form in cold temperatures",
      "Are visible to the naked eye"
    ],
    correct: 1,
    hint: "Chef Carmel emphasized that once toxins form, what options do you have? Think about heat resistance.",
    explanation: "Bacterial toxins CANNOT be destroyed by cooking. Prevention is the only solution.",
    category: "Foodborne Illness",
    chapter: 2,
    examFocus: true
  },
  {
    id: 64,
    question: "Which bacteria is commonly found in the nose of 30-50% of healthy adults?",
    options: ["Salmonella", "E. coli", "Staphylococcus aureus", "Listeria"],
    correct: 2,
    hint: "This bacteria lives on skin and can be found in many healthy people's noses.",
    explanation: "Staphylococcus aureus is carried in the nose of 30-50% of healthy adults and on skin of 20-35%.",
    category: "Foodborne Illness",
    chapter: 2,
    examFocus: true
  },
  {
    id: 65,
    question: "AIDS, Tuberculosis, and Hepatitis B...",
    options: [
      "Are foodborne illnesses",
      "Require employee exclusion",
      "Are NOT transmitted through food",
      "Are part of the Big Six"
    ],
    correct: 2,
    hint: "Consider how these diseases actually spread. Are any of them transmitted through food?",
    explanation: "AIDS, TB, and Hep B/C are NOT transmitted through food. Employees with these have ADA protections.",
    category: "Food Safety Basics",
    chapter: 2,
    examFocus: false
  },
  // ========== CHAPTER 3: PERSONAL HYGIENE ==========
  {
    id: 7,
    question: "Foodhandlers should wash their hands after which activities? 1. Smoking, 2. Chewing gum, 3. Touching hair",
    options: ["3 only", "1 and 2", "1 and 3", "1, 2, and 3"],
    correct: 3,
    hint: "Think about contamination sources. Does touching your face, mouth, or having things near your mouth spread germs?",
    explanation: "Wash hands after ALL these activities. Smoking, chewing gum, and touching hair all contaminate hands.",
    category: "Sanitation & Hygiene",
    chapter: 3,
    examFocus: true
  },
  {
    id: 8,
    question: "What is the most important reason for foodhandlers to wear clean clothes?",
    options: [
      "Other foodhandlers will enjoy working with them",
      "Dried stains are harder to get clean",
      "Dirty clothes may carry pathogens",
      "Clothes that are washed often last longer"
    ],
    correct: 2,
    hint: "This is a food safety course. What's the safety-related reason for clean uniforms?",
    explanation: "Dirty clothes can harbor and transfer pathogens to food, causing contamination.",
    category: "Sanitation & Hygiene",
    chapter: 3,
    examFocus: false
  },
  {
    id: 11,
    question: "When must a foodhandler remove their apron?",
    options: ["Before the end of the shift", "When leaving food-preparation areas", "When returning from the washroom", "After cutting meat"],
    correct: 1,
    hint: "Aprons can carry contaminants. When would wearing one outside the kitchen be a problem?",
    explanation: "Remove aprons when leaving prep areas to prevent cross-contamination.",
    category: "Sanitation & Hygiene",
    chapter: 3,
    examFocus: true
  },
  {
    id: 17,
    question: "Foodhandlers should wash their hands after which activities? Clearing tables, Taking out trash, Handling chemicals",
    options: ["Clearing tables only", "Taking out trash only", "Handling chemicals only", "All of the above"],
    correct: 3,
    hint: "Consider each activity - do any of them NOT involve touching potentially contaminated surfaces?",
    explanation: "Wash hands after ALL these activities - each involves potential contamination.",
    category: "Sanitation & Hygiene",
    chapter: 3,
    examFocus: true
  },
  {
    id: 21,
    question: "Which statement about hand sanitizers is CORRECT?",
    options: [
      "Hand sanitizers can be used in place of handwashing",
      "Disposable gloves can be used in place of handwashing",
      "Foodhandlers must wait for hand sanitizer to dry before touching food",
      "Foodhandlers can reuse gloves if they wash hands between tasks"
    ],
    correct: 2,
    hint: "Chef Carmel emphasized: sanitizers never replace handwashing. But when used, what's important about application?",
    explanation: "Sanitizer must dry before touching food. NEVER replaces handwashing or allows glove reuse.",
    category: "Sanitation & Hygiene",
    chapter: 3,
    examFocus: true
  },
  {
    id: 29,
    question: "How long should you scrub your hands and arms when washing?",
    options: ["5 seconds", "10-15 seconds", "20 seconds", "30 seconds"],
    correct: 1,
    hint: "Chef Carmel mentioned this directly in class. It's NOT the total time (20 sec) but the scrubbing portion.",
    explanation: "Scrub for 10-15 seconds. Total handwashing takes at least 20 seconds.",
    category: "Sanitation & Hygiene",
    chapter: 3,
    examFocus: true
  },
  {
    id: 30,
    question: "What temperature should water be at a hand sink?",
    options: ["70°F", "90°F", "110°F", "135°F"],
    correct: 2,
    hint: "Chef Carmel asked this directly in class - warm enough to be effective but not scalding hot.",
    explanation: "Hand sink water should be at least 110°F for effective handwashing.",
    category: "Sanitation & Hygiene",
    chapter: 3,
    examFocus: true
  },
  {
    id: 31,
    question: "How often should single-use gloves be changed during continuous use?",
    options: ["Every hour", "Every 2 hours", "Every 4 hours", "Every 8 hours"],
    correct: 2,
    hint: "This matches the time limit for several other food safety rules. Think about how long is too long.",
    explanation: "Change gloves at least every 4 hours during continuous use, or sooner if contaminated.",
    category: "Sanitation & Hygiene",
    chapter: 3,
    examFocus: true
  },
  {
    id: 40,
    question: "What jewelry is a foodhandler allowed to wear on hands and arms?",
    options: ["Watch only", "Medical bracelet only", "Plain wedding band only", "No jewelry at all"],
    correct: 2,
    hint: "Think minimal: what's the absolute simplest jewelry that could possibly be allowed?",
    explanation: "Only a plain wedding band is allowed. Remove watches, bracelets (including medical), and rings with stones.",
    category: "Sanitation & Hygiene",
    chapter: 3,
    examFocus: true
  },
  {
    id: 44,
    question: "When must you wash hands BEFORE starting a task?",
    options: [
      "Before handling raw meat",
      "Before putting on single-use gloves",
      "Before using the restroom",
      "Before taking out trash"
    ],
    correct: 1,
    hint: "Think about the sequence: what must happen BEFORE putting on protection?",
    explanation: "Always wash hands before putting on gloves. Gloves are NOT a substitute for handwashing.",
    category: "Sanitation & Hygiene",
    chapter: 3,
    examFocus: true
  },
  {
    id: 51,
    question: "How should a wound on a food handler's FINGER be covered?",
    options: [
      "Just a bandage",
      "An impermeable bandage AND a single-use glove",
      "Nothing - they should not work",
      "Tape only"
    ],
    correct: 1,
    hint: "Wounds in this location need extra protection. What two layers are required?",
    explanation: "Wounds on hand, finger, or wrist must be covered with an impermeable bandage AND a single-use glove.",
    category: "Sanitation & Hygiene",
    chapter: 3,
    examFocus: true
  },
  {
    id: 57,
    question: "Food handlers must wash hands in...",
    options: [
      "Any available sink",
      "A sink designated for handwashing only",
      "The dishwashing sink when not in use",
      "The prep sink"
    ],
    correct: 1,
    hint: "There's a specific type of sink that must be used - not dish, prep, or mop sinks.",
    explanation: "Hands must be washed in a sink designated ONLY for handwashing.",
    category: "Sanitation & Hygiene",
    chapter: 3,
    examFocus: true
  },
  {
    id: 60,
    question: "NEVER handle ready-to-eat food with bare hands when serving...",
    options: [
      "Adults only",
      "Takeout orders",
      "High-risk populations",
      "Catered events"
    ],
    correct: 2,
    hint: "For which group is bare-hand contact with ready-to-eat food absolutely prohibited?",
    explanation: "Never use bare hands on ready-to-eat food when serving high-risk populations.",
    category: "Sanitation & Hygiene",
    chapter: 3,
    examFocus: true
  },
  {
    id: 69,
    question: "What is the correct procedure for covering an infected wound on a food handler's finger?",
    options: [
      "Just a bandage",
      "Bandage and tape",
      "Impermeable cover and single-use glove",
      "Nothing - they cannot work"
    ],
    correct: 2,
    hint: "The key term here is 'impermeable' - what does that mean for wound coverage?",
    explanation: "Wounds on hand/finger/wrist need an impermeable (waterproof) cover plus a single-use glove.",
    category: "Sanitation & Hygiene",
    chapter: 3,
    examFocus: true
  },
  // ========== CHAPTER 4: FLOW OF FOOD - PURCHASING & RECEIVING ==========
  {
    id: 33,
    question: "What does ALERT stand for in food defense?",
    options: [
      "Always Look Every Restaurant Thoroughly",
      "Assure, Look, Employees, Reports, Threat",
      "Avoid Letting Everyone Run Through",
      "All Locations Expect Regular Testing"
    ],
    correct: 1,
    hint: "Each letter represents an action: monitoring sources, security, staff, documentation, and emergency plans.",
    explanation: "ALERT: Assure (safe sources), Look (monitor), Employees (know who), Reports (accessible), Threat (have a plan).",
    category: "Facilities & Operations",
    chapter: 4,
    examFocus: true
  },
  // ========== CHAPTER 5: THERMOMETERS & FLOW OF FOOD ==========
  {
    id: 70,
    question: "At what temperature is the Ice Point method used to calibrate thermometers?",
    options: ["0°F", "32°F", "41°F", "70°F"],
    correct: 1,
    hint: "This method uses the freezing point of water. What temperature is that?",
    explanation: "Ice Point calibration uses 32°F (ice water). Boiling Point calibration uses 212°F.",
    category: "Food Safety Basics",
    chapter: 5,
    examFocus: true
  },
  {
    id: 71,
    question: "Food thermometers must be accurate to within...",
    options: ["±1°F", "±2°F", "±3°F", "±5°F"],
    correct: 1,
    hint: "Food thermometers have stricter accuracy requirements than air thermometers.",
    explanation: "Food thermometers must be accurate within ±2°F (or ±1°C).",
    category: "Food Safety Basics",
    chapter: 5,
    examFocus: true
  },
  {
    id: 75,
    question: "Which thermometer should be used to check the temperature of vacuum-packed ground beef?",
    options: ["Bimetallic stem thermometer", "Thermocouple probe", "Infrared thermometer", "Candy thermometer"],
    correct: 2,
    hint: "Which thermometer can read temperature without breaking the seal on packaging?",
    explanation: "Infrared thermometers check surface temperature of packaged items without breaking the seal.",
    category: "Food Safety Basics",
    chapter: 5,
    examFocus: true
  },
  {
    id: 94,
    question: "When should a thermometer be calibrated?",
    options: [
      "Only when purchased new",
      "Once a month",
      "Before each shift, after being bumped, and after extreme temperature exposure",
      "Only when it gives an incorrect reading"
    ],
    correct: 2,
    hint: "Think about what events might cause a thermometer to become inaccurate.",
    explanation: "Calibrate thermometers before each shift, before deliveries, after being bumped/dropped, and after extreme temperature changes.",
    category: "Food Safety Basics",
    chapter: 5,
    examFocus: false
  },
  {
    id: 95,
    question: "How long should the sensing area of a thermometer be submerged during Ice Point calibration?",
    options: ["10 seconds", "20 seconds", "30 seconds", "60 seconds"],
    correct: 2,
    hint: "The thermometer needs enough time to get an accurate reading in the ice water.",
    explanation: "Submerge the thermometer sensing area for 30 seconds before reading during Ice Point calibration.",
    category: "Food Safety Basics",
    chapter: 5,
    examFocus: false
  },
  {
    id: 96,
    question: "Air/cooler thermometers must be accurate to within...",
    options: ["±1°F", "±2°F", "±3°F", "±5°F"],
    correct: 2,
    hint: "Air temperature thermometers have slightly less strict requirements than food thermometers.",
    explanation: "Storage unit/air thermometers must be accurate within ±3°F (or ±1.5°C).",
    category: "Food Safety Basics",
    chapter: 5,
    examFocus: false
  },
  {
    id: 97,
    question: "What is the sensing area of a bimetallic stemmed thermometer?",
    options: ["The entire stem", "Just the tip", "From the tip to the dimple mark", "The dial face"],
    correct: 2,
    hint: "Look for a small indentation on the stem - that marks where sensing stops.",
    explanation: "The sensing area runs from the tip to the dimple mark on the stem - about 2-3 inches.",
    category: "Food Safety Basics",
    chapter: 5,
    examFocus: false
  },
  {
    id: 98,
    question: "Why should glass thermometers NOT be used in foodservice?",
    options: [
      "They are too expensive",
      "They can break and contaminate food",
      "They are not accurate enough",
      "They take too long to read"
    ],
    correct: 1,
    hint: "Think about what could happen if a glass thermometer breaks while measuring food temperature.",
    explanation: "Glass thermometers can shatter and contaminate food with glass - a physical hazard. Only use if in shatterproof casing.",
    category: "Food Safety Basics",
    chapter: 5,
    examFocus: false
  },
  {
    id: 99,
    question: "When checking food temperature, you should take readings in...",
    options: [
      "Only one spot in the center",
      "Multiple spots, including the thickest part",
      "Only at the surface",
      "At the edges only"
    ],
    correct: 1,
    hint: "Food can have different temperatures in different areas. What ensures you find the coldest/hottest spot?",
    explanation: "Take multiple readings in different spots, especially the thickest part, to ensure accurate temperature assessment.",
    category: "Food Safety Basics",
    chapter: 5,
    examFocus: false
  },
  // ========== CHAPTER 6: RECEIVING FOOD SAFELY ==========
  {
    id: 66,
    question: "How long should shellfish identification tags be kept on file?",
    options: ["30 days", "60 days", "90 days", "120 days"],
    correct: 2,
    hint: "Shellfish tags help trace illness outbreaks. How long must they be retained?",
    explanation: "Shellfish tags must be kept for 90 days to track sources if someone gets sick.",
    category: "Food Safety Basics",
    chapter: 6,
    examFocus: true
  },
  {
    id: 67,
    question: "At what temperature should shellfish, milk, and eggs be received?",
    options: ["32°F or below", "41°F or below", "45°F or below", "50°F or below"],
    correct: 2,
    hint: "These items have a slightly higher receiving temperature but must cool down within 4 hours.",
    explanation: "Shellfish, milk, and eggs can be received at 45°F but must reach 41°F within 4 hours.",
    category: "Temperature Control",
    chapter: 6,
    examFocus: true
  },
  {
    id: 68,
    question: "Why should you REJECT frozen food with ice crystals on packaging?",
    options: [
      "The food is too cold",
      "It indicates the food has been thawed and refrozen",
      "Ice crystals are a sign of mold",
      "The packaging is damaged"
    ],
    correct: 1,
    hint: "What do ice crystals on frozen packaging indicate about the temperature history of the food?",
    explanation: "Ice crystals indicate temperature abuse - the food was thawed and refrozen, allowing bacteria to grow.",
    category: "Food Safety Basics",
    chapter: 6,
    examFocus: true
  },
  {
    id: 73,
    question: "When receiving a recalled food item, you should...",
    options: [
      "Throw it away immediately",
      "Use it quickly before it spoils",
      "Remove it, label 'Do Not Use,' and wait for vendor instructions",
      "Return it to the delivery driver"
    ],
    correct: 2,
    hint: "What's the proper procedure? Vendor may need the product for testing or credit.",
    explanation: "Remove recalled items, separate and label them 'Do Not Use,' then wait for vendor instructions.",
    category: "Food Safety Basics",
    chapter: 6,
    examFocus: true
  },
  {
    id: 74,
    question: "What does ROP stand for?",
    options: [
      "Rapid Oxygen Processing",
      "Reduced Oxygen Packaging",
      "Required Operating Procedure",
      "Restaurant Operations Protocol"
    ],
    correct: 1,
    hint: "This type of packaging removes air to extend shelf life - think vacuum-sealed products.",
    explanation: "ROP (Reduced Oxygen Packaging) removes air to extend shelf life, like vacuum-sealed/cryovac packaging.",
    category: "Food Safety Basics",
    chapter: 6,
    examFocus: false
  },
  {
    id: 100,
    question: "Fresh fish should be received at what internal temperature?",
    options: ["32°F (0°C) or lower", "41°F (5°C) or lower", "45°F (7°C) or lower", "50°F (10°C) or lower"],
    correct: 1,
    hint: "Fresh fish has the same receiving temperature as most cold TCS foods.",
    explanation: "Fresh fish must be received at 41°F (5°C) or lower, surrounded by crushed self-draining ice.",
    category: "Temperature Control",
    chapter: 6,
    examFocus: false
  },
  {
    id: 101,
    question: "Which is a sign that fresh fish should be REJECTED?",
    options: [
      "Bright red gills",
      "Firm flesh that springs back",
      "Dull gray gills and cloudy eyes",
      "Mild ocean smell"
    ],
    correct: 2,
    hint: "Fresh fish has bright features. What indicates spoilage?",
    explanation: "Reject fish with dull gray gills, cloudy or sunken eyes, soft flesh, or strong fishy/ammonia smell.",
    category: "Food Safety Basics",
    chapter: 6,
    examFocus: false
  },
  {
    id: 102,
    question: "Live shellfish should have an internal temperature no greater than...",
    options: ["41°F (5°C)", "45°F (7°C)", "50°F (10°C)", "55°F (13°C)"],
    correct: 2,
    hint: "Live shellfish have different requirements than shucked shellfish.",
    explanation: "Live shellfish: air temp 45°F (7°C), internal temp no greater than 50°F (10°C). Must cool to 41°F in 4 hours.",
    category: "Temperature Control",
    chapter: 6,
    examFocus: false
  },
  {
    id: 103,
    question: "When should you reject fresh meat?",
    options: [
      "When it has a firm texture",
      "When it has no odor",
      "When it is sticky, slimy, or has a sour odor",
      "When packaging is intact"
    ],
    correct: 2,
    hint: "What characteristics indicate meat has spoiled?",
    explanation: "Reject meat that is slimy, sticky, or dry; has sour odor; or has broken/dirty packaging.",
    category: "Food Safety Basics",
    chapter: 6,
    examFocus: false
  },
  {
    id: 104,
    question: "What color should fresh beef be when received?",
    options: ["Brown", "Gray", "Bright cherry red", "Green-tinted"],
    correct: 2,
    hint: "Fresh beef has a specific color before oxidation changes it.",
    explanation: "Fresh beef should be bright cherry red. Reject if brown or green.",
    category: "Food Safety Basics",
    chapter: 6,
    examFocus: false
  },
  {
    id: 105,
    question: "Which condition indicates canned food should be REJECTED?",
    options: [
      "Dented sides",
      "Swollen or bulging ends",
      "Missing price tag",
      "Dusty exterior"
    ],
    correct: 1,
    hint: "Bulging cans may indicate bacterial growth inside. What specific damage is dangerous?",
    explanation: "Reject cans with swollen/bulging ends, severe dents in seams, holes, leaks, or rust.",
    category: "Food Safety Basics",
    chapter: 6,
    examFocus: false
  },
  // ========== CHAPTER 7: STORING FOOD ==========
  {
    id: 34,
    question: "How long can TCS food be stored in the refrigerator before it must be discarded?",
    options: ["3 days", "5 days", "7 days", "10 days"],
    correct: 2,
    hint: "Think about the TCS storage rule. The day you make it counts as day one.",
    explanation: "TCS food can be stored for 7 days max at 41°F or below. Day made counts as Day 1.",
    category: "Food Storage",
    chapter: 7,
    examFocus: false
  },
  {
    id: 35,
    question: "What is the correct order for storing raw foods in a refrigerator (top to bottom)?",
    options: [
      "Poultry, ground meat, whole cuts, seafood, ready-to-eat",
      "Ready-to-eat, seafood, whole cuts, ground meat, poultry",
      "Ground meat, poultry, seafood, whole cuts, ready-to-eat",
      "Ready-to-eat, whole cuts, seafood, ground meat, poultry"
    ],
    correct: 1,
    hint: "Storage order matches cooking temperatures. Foods with highest cook temps go on the bottom. Why?",
    explanation: "Top to bottom by cooking temp: Ready-to-eat, seafood/whole cuts (145°F), ground meat (155°F), poultry (165°F).",
    category: "Food Storage",
    chapter: 7,
    examFocus: false
  },
  {
    id: 72,
    question: "What is the minimum height food must be stored off the floor?",
    options: ["2 inches", "4 inches", "6 inches", "12 inches"],
    correct: 2,
    hint: "This allows for cleaning access underneath and visibility for pests.",
    explanation: "Food storage must be at least 6 inches off the floor for cleaning access and pest visibility.",
    category: "Food Storage",
    chapter: 7,
    examFocus: true
  },
  {
    id: 76,
    question: "TCS foods must be used or discarded within how many days?",
    options: ["3 days", "5 days", "7 days", "10 days"],
    correct: 2,
    hint: "Remember the TCS storage rule - the day made counts as day one.",
    explanation: "TCS foods must be used or thrown out within 7 days. Count the day made as Day 1.",
    category: "Temperature Control",
    chapter: 7,
    examFocus: true
  },
  {
    id: 77,
    question: "When combining foods made on different dates, the discard date should be based on...",
    options: [
      "The newest ingredient",
      "The oldest ingredient",
      "The average of all dates",
      "The date of combining"
    ],
    correct: 1,
    hint: "When mixing ingredients, safety requires using which date for the discard deadline?",
    explanation: "Always use the OLDEST/EARLIEST ingredient date to determine the discard date.",
    category: "Temperature Control",
    chapter: 7,
    examFocus: true
  },
  {
    id: 78,
    question: "What does FIFO stand for?",
    options: ["First In, First Out", "Food Is For Others", "Frozen Items First Ordered", "Final Inspection For Operations"],
    correct: 0,
    hint: "This inventory system ensures older products get used before newer ones.",
    explanation: "FIFO = First In, First Out. Use oldest products first to prevent spoilage.",
    category: "Food Storage",
    chapter: 7,
    examFocus: true
  },
  {
    id: 79,
    question: "In a refrigerator, where should raw chicken be stored?",
    options: ["Top shelf", "Middle shelf", "Second from bottom", "Bottom shelf"],
    correct: 3,
    hint: "Raw poultry requires the highest cooking temperature. Where should it go to prevent drips?",
    explanation: "Raw poultry goes on the bottom shelf because it has the highest cooking temperature (165°F).",
    category: "Food Storage",
    chapter: 7,
    examFocus: true
  },
  {
    id: 93,
    question: "The proper refrigerator storage order from TOP to BOTTOM is...",
    options: [
      "Poultry, ground meat, fish, ready-to-eat",
      "Ready-to-eat, fish, whole meats, ground meats, poultry",
      "Ground meats, poultry, fish, ready-to-eat",
      "Fish, poultry, ground meats, ready-to-eat"
    ],
    correct: 1,
    hint: "Foods stored by cooking temperature - safest (ready-to-eat) on top, highest cook temp on bottom.",
    explanation: "Top to bottom: Ready-to-eat, seafood (145°F), whole meats, ground meats (155°F), poultry (165°F).",
    category: "Food Storage",
    chapter: 7,
    examFocus: true
  },
  {
    id: 106,
    question: "Ready-to-eat TCS food held at 41°F must have a date mark if it will be held longer than...",
    options: ["12 hours", "24 hours", "48 hours", "72 hours"],
    correct: 1,
    hint: "Date marking is required after how many hours of storage?",
    explanation: "Date marking is required if ready-to-eat TCS food will be held longer than 24 hours at 41°F.",
    category: "Food Storage",
    chapter: 7,
    examFocus: false
  },
  {
    id: 107,
    question: "Where should you NEVER store food?",
    options: [
      "In a walk-in cooler",
      "Under stairwells or sewer lines",
      "On wire shelving",
      "In dry storage rooms"
    ],
    correct: 1,
    hint: "Think about locations that pose contamination risks from above.",
    explanation: "Never store food in locker/dressing rooms, restrooms, garbage rooms, under sewer lines or stairwells.",
    category: "Food Storage",
    chapter: 7,
    examFocus: false
  },
  {
    id: 108,
    question: "What should you do to prevent temperature abuse in coolers?",
    options: [
      "Keep the door open for ventilation",
      "Stack items tightly to maximize space",
      "Avoid overloading coolers and use open shelving",
      "Store items against the walls"
    ],
    correct: 2,
    hint: "Air circulation is important in cold storage. What practices help maintain proper temperatures?",
    explanation: "Avoid overloading coolers, don't open doors frequently, use cold curtains, and use open shelving for air circulation.",
    category: "Food Storage",
    chapter: 7,
    examFocus: false
  },
  // ========== CHAPTER 8: FOOD PREPARATION ==========
  {
    id: 26,
    question: "At what internal temperature must poultry be cooked to ensure food safety?",
    options: ["145°F (63°C)", "155°F (68°C)", "165°F (74°C)", "175°F (79°C)"],
    correct: 2,
    hint: "Poultry requires the highest cooking temp. Is it closest to 145, 155, 165, or 175?",
    explanation: "Poultry must reach 165°F (74°C) to kill Salmonella and other harmful bacteria.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: true
  },
  {
    id: 27,
    question: "What is the minimum internal cooking temperature for ground beef?",
    options: ["135°F (57°C)", "145°F (63°C)", "155°F (68°C)", "165°F (74°C)"],
    correct: 2,
    hint: "Ground meats require higher temps than whole cuts because grinding spreads bacteria throughout.",
    explanation: "Ground beef requires 155°F (68°C) because grinding spreads bacteria throughout.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: true
  },
  {
    id: 28,
    question: "What is the minimum internal temperature for cooking fish?",
    options: ["125°F (52°C)", "135°F (57°C)", "145°F (63°C)", "155°F (68°C)"],
    correct: 2,
    hint: "Fish and whole cuts of beef share the same minimum temperature. It's less than ground meat.",
    explanation: "Fish must be cooked to 145°F (63°C) for 15 seconds.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: true
  },
  {
    id: 36,
    question: "Within what time frame should hot TCS food be cooled from 135°F to 70°F?",
    options: ["1 hour", "2 hours", "4 hours", "6 hours"],
    correct: 1,
    hint: "Two-stage cooling has different time limits. The first stage is shorter because it's more dangerous.",
    explanation: "Stage 1: 135°F to 70°F within 2 hours. Stage 2: 70°F to 41°F within 4 more hours. Total = 6 hours.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: false
  },
  {
    id: 42,
    question: "How often should food contact surfaces be cleaned and sanitized during continuous use?",
    options: ["Every hour", "Every 2 hours", "Every 4 hours", "Every 8 hours"],
    correct: 2,
    hint: "This matches the time limit for glove changes. What's the maximum time between cleanings?",
    explanation: "Clean and sanitize food contact surfaces every 4 hours during continuous use.",
    category: "Sanitation & Hygiene",
    chapter: 8,
    examFocus: false
  },
  {
    id: 61,
    question: "What temperature must reheated food reach?",
    options: ["135°F (57°C)", "145°F (63°C)", "155°F (68°C)", "165°F (74°C)"],
    correct: 3,
    hint: "Reheated food must reach the same temperature as poultry. What is that temp?",
    explanation: "Reheated food must reach 165°F (74°C) within 2 hours.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: true
  },
  {
    id: 80,
    question: "What temperature must running water be when thawing food?",
    options: ["32°F or below", "50°F or below", "70°F or below", "Any temperature"],
    correct: 2,
    hint: "Running water for thawing has a maximum temperature limit to prevent bacterial growth.",
    explanation: "Running water used for thawing must be 70°F or below to prevent bacterial growth.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: true
  },
  {
    id: 81,
    question: "After defrosting food in a microwave, you must...",
    options: [
      "Let it rest for 5 minutes",
      "Cook it immediately",
      "Refrigerate it",
      "Check the temperature"
    ],
    correct: 1,
    hint: "Microwave thawing can cause parts of the food to enter the danger zone. What must happen next?",
    explanation: "Food thawed in a microwave must be cooked immediately because parts may enter the danger zone.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: true
  },
  {
    id: 82,
    question: "Before vacuum-packaging (ROP) fresh fish, you must...",
    options: ["Cook it first", "Freeze it first", "Salt it first", "Wash it first"],
    correct: 1,
    hint: "Fish in ROP packaging can grow anaerobic bacteria. What step prevents this?",
    explanation: "Fish must be frozen before ROP to prevent growth of anaerobic bacteria (which don't need oxygen).",
    category: "Food Safety Basics",
    chapter: 8,
    examFocus: true
  },
  {
    id: 83,
    question: "What is the minimum internal cooking temperature for ratites (ostrich, emu)?",
    options: ["145°F", "155°F", "165°F", "175°F"],
    correct: 1,
    hint: "Ratites share a cooking temperature with another category of meat. Which category?",
    explanation: "Ratites (ostrich, emu) must be cooked to 155°F, the same as ground meats.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: true
  },
  {
    id: 84,
    question: "What should NOT be served to high-risk populations like preschool children?",
    options: ["Scrambled eggs", "Hard-boiled eggs", "Over easy eggs", "Egg salad"],
    correct: 2,
    hint: "Which egg preparation leaves the yolk runny and undercooked?",
    explanation: "Over easy eggs (runny yolks) should not be served to high-risk populations.",
    category: "Food Safety Basics",
    chapter: 8,
    examFocus: true
  },
  {
    id: 85,
    question: "In the 2-stage cooling process, food must cool from 135°F to 70°F within...",
    options: ["1 hour", "2 hours", "4 hours", "6 hours"],
    correct: 1,
    hint: "Stage 1 cooling is faster because the higher temperature range is more dangerous.",
    explanation: "Stage 1: 135°F→70°F in 2 hours. Stage 2: 70°F→41°F in 4 more hours.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: true
  },
  {
    id: 86,
    question: "What is the total time allowed to cool food from 135°F to 41°F?",
    options: ["2 hours", "4 hours", "6 hours", "8 hours"],
    correct: 2,
    hint: "Add up Stage 1 and Stage 2 time limits to get the total cooling time.",
    explanation: "Total cooling time from 135°F to 41°F is 6 hours maximum (2 hours + 4 hours).",
    category: "Temperature Control",
    chapter: 8,
    examFocus: true
  },
  {
    id: 109,
    question: "What is the correct method for thawing food in a refrigerator?",
    options: [
      "Place food on the top shelf",
      "Keep food in the danger zone for up to 4 hours",
      "Keep food at 41°F (5°C) or lower",
      "Unwrap food completely before thawing"
    ],
    correct: 2,
    hint: "Refrigerator thawing keeps food at what safe temperature?",
    explanation: "Thaw food in the cooler at 41°F (5°C) or lower. This is the safest thawing method.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: false
  },
  {
    id: 110,
    question: "When cooking food in a microwave, you must...",
    options: [
      "Cook to 145°F minimum",
      "Cook to 165°F, cover, rotate/stir, and let stand 2 minutes",
      "Cook until the outside is hot",
      "Check temperature once in the center"
    ],
    correct: 1,
    hint: "Microwave cooking has special requirements. What extra steps are needed?",
    explanation: "Microwave cooking: 165°F minimum, cover food, rotate/stir halfway, let stand 2 minutes, check temp in 2+ spots.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: false
  },
  {
    id: 111,
    question: "Shell eggs for immediate service must be cooked to...",
    options: ["135°F (57°C)", "145°F (63°C)", "155°F (68°C)", "165°F (74°C)"],
    correct: 1,
    hint: "Eggs for immediate service have a lower cooking requirement than eggs held for service.",
    explanation: "Shell eggs for immediate service: 145°F for 15 seconds. Shell eggs held for service: 155°F for 17 seconds.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: false
  },
  {
    id: 112,
    question: "What is the maximum time for initial cooking when partially cooking food?",
    options: ["30 minutes", "60 minutes", "90 minutes", "120 minutes"],
    correct: 1,
    hint: "Partial cooking has strict time limits. How long is allowed for the first cooking step?",
    explanation: "Initial cooking for partial cooking must NEVER exceed 60 minutes. Food must then be cooled and refrigerated immediately.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: false
  },
  {
    id: 113,
    question: "Which cooling method reduces food temperature fastest?",
    options: [
      "Leaving food uncovered on the counter",
      "Placing in a deep container in the cooler",
      "Using ice-water bath or blast chiller",
      "Putting in the freezer uncovered"
    ],
    correct: 2,
    hint: "Think about what professional kitchens use for rapid cooling.",
    explanation: "Ice-water bath and blast chillers cool food fastest. Other methods: ice paddle, shallow containers, ice as ingredient.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: false
  },
  {
    id: 114,
    question: "Roasts must be cooked to what minimum internal temperature?",
    options: ["130°F for 112 minutes", "145°F for 4 minutes", "155°F for 17 seconds", "165°F for 15 seconds"],
    correct: 1,
    hint: "Roasts have a unique time-temperature relationship. What's the standard?",
    explanation: "Roasts: 145°F (63°C) for 4 minutes OR 130°F (54°C) for 112 minutes - time and temperature work together.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: false
  },
  // ========== CHAPTER 9: HOLDING, DISPLAYING, AND SERVING ==========
  {
    id: 87,
    question: "How often should food temperatures be checked during service/holding?",
    options: ["Every 30 minutes", "Every hour", "Every 2 hours", "Every 4 hours"],
    correct: 2,
    hint: "How frequently should you verify food is staying at safe temperatures?",
    explanation: "Food temperatures should be checked every 2 hours during holding/service.",
    category: "Temperature Control",
    chapter: 9,
    examFocus: true
  },
  {
    id: 88,
    question: "Where should ice cream scoops be stored between uses?",
    options: ["On a clean towel", "In sanitizer solution", "In running water", "In the freezer"],
    correct: 2,
    hint: "Think about ice cream shops - what keeps the scoops clean between customers?",
    explanation: "Ice cream scoops should be stored in running water between uses to keep them clean.",
    category: "Sanitation & Hygiene",
    chapter: 9,
    examFocus: true
  },
  {
    id: 89,
    question: "At a buffet, can guests reuse their plates?",
    options: ["Yes, always", "Yes, if wiped clean", "No, they must get a new plate", "Only for dessert"],
    correct: 2,
    hint: "Think about cross-contamination. What touches food directly vs. what only touches drinks?",
    explanation: "Guests must get new plates and silverware at buffets. Only cups/glasses may be reused.",
    category: "Sanitation & Hygiene",
    chapter: 9,
    examFocus: true
  },
  {
    id: 91,
    question: "What is the minimum hot holding temperature for cooked vegetables?",
    options: ["125°F", "135°F", "145°F", "155°F"],
    correct: 1,
    hint: "All hot foods share the same minimum holding temperature - what is it?",
    explanation: "All hot foods, including vegetables, must be held at 135°F or above.",
    category: "Temperature Control",
    chapter: 9,
    examFocus: true
  },
  {
    id: 92,
    question: "Cold food can be held without temperature control for up to...",
    options: ["2 hours", "4 hours", "6 hours", "8 hours"],
    correct: 2,
    hint: "Cold food without temperature control has a maximum time limit with specific temperature requirements.",
    explanation: "Cold food can be held without temp control for 6 hours if it starts at 41°F and stays below 70°F.",
    category: "Temperature Control",
    chapter: 9,
    examFocus: true
  },
  {
    id: 115,
    question: "Hot food can be held without temperature control for up to...",
    options: ["2 hours", "4 hours", "6 hours", "8 hours"],
    correct: 1,
    hint: "Hot food without temperature control has a shorter limit than cold food.",
    explanation: "Hot food can be held without temp control for 4 hours max. Must start at 135°F. Requires written approval from regulatory authority.",
    category: "Temperature Control",
    chapter: 9,
    examFocus: false
  },
  {
    id: 116,
    question: "When checking held food temperatures with a thermometer, you should use...",
    options: [
      "The equipment's built-in gauge",
      "A separate food thermometer",
      "Your hand to feel the temperature",
      "A visual inspection only"
    ],
    correct: 1,
    hint: "Equipment gauges are not as accurate as what?",
    explanation: "Use a separate food thermometer, NOT the equipment gauge, to check food temperatures accurately.",
    category: "Temperature Control",
    chapter: 9,
    examFocus: false
  },
  {
    id: 117,
    question: "Serving utensils should be cleaned and sanitized during continuous use at least every...",
    options: ["1 hour", "2 hours", "4 hours", "8 hours"],
    correct: 2,
    hint: "This matches other continuous use cleaning intervals.",
    explanation: "Clean and sanitize serving utensils at least every 4 hours during continuous use.",
    category: "Sanitation & Hygiene",
    chapter: 9,
    examFocus: false
  },
  {
    id: 118,
    question: "Which item CAN be re-served to guests?",
    options: [
      "Bread from a bread basket",
      "Uncovered condiments",
      "Unused packets of crackers",
      "Uneaten plate garnishes"
    ],
    correct: 2,
    hint: "Only completely sealed/packaged items can be re-served.",
    explanation: "Only unopened, prepackaged food in good condition can be re-served. Never re-serve bread, uncovered condiments, or garnishes.",
    category: "Food Safety Basics",
    chapter: 9,
    examFocus: false
  },
  {
    id: 119,
    question: "When transporting food off-site, you must...",
    options: [
      "Keep all foods together to save space",
      "Use insulated containers and separate raw from ready-to-eat",
      "Transport at room temperature if trip is short",
      "Stack hot food on top of cold food"
    ],
    correct: 1,
    hint: "Think about maintaining temperatures and preventing cross-contamination during transport.",
    explanation: "Use insulated, food-grade containers. Keep raw meat/poultry/seafood separate from ready-to-eat. Label with use-by dates.",
    category: "Food Safety Basics",
    chapter: 9,
    examFocus: false
  },
  {
    id: 120,
    question: "Vending machines containing TCS food prepared on-site must discard product not sold within...",
    options: ["24 hours", "3 days", "7 days", "10 days"],
    correct: 2,
    hint: "This matches the standard TCS storage time limit.",
    explanation: "TCS food prepared on-site for vending machines must be discarded if not sold within 7 days.",
    category: "Temperature Control",
    chapter: 9,
    examFocus: false
  },
  // ========== CHAPTER 10: FOOD SAFETY MANAGEMENT & HACCP ==========
  {
    id: 90,
    question: "What does HACCP stand for?",
    options: [
      "Health And Cleanliness Control Program",
      "Hazard Analysis Critical Control Point",
      "Hot And Cold Cooking Procedures",
      "Handling And Controlling Contaminated Products"
    ],
    correct: 1,
    hint: "This food safety system focuses on identifying dangers and the points where they can be controlled.",
    explanation: "HACCP = Hazard Analysis Critical Control Point - a systematic approach to food safety.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 121,
    question: "How many principles are in the HACCP system?",
    options: ["5", "6", "7", "8"],
    correct: 2,
    hint: "HACCP has a specific number of guiding principles.",
    explanation: "HACCP has 7 principles: Hazard analysis, CCPs, critical limits, monitoring, corrective actions, verification, record keeping.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: false
  },
  {
    id: 122,
    question: "What is a Critical Control Point (CCP)?",
    options: [
      "Any point where food is handled",
      "A point where hazards can be prevented, eliminated, or reduced",
      "The final cooking step",
      "A food safety inspection checkpoint"
    ],
    correct: 1,
    hint: "CCPs are specific points in the food flow where you can control hazards.",
    explanation: "A CCP is a point where an identified hazard can be prevented, eliminated, or reduced to safe levels.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: false
  },
  {
    id: 123,
    question: "What is a critical limit in HACCP?",
    options: [
      "The maximum number of customers served",
      "The minimum or maximum value that must be met at a CCP",
      "The budget for food safety equipment",
      "The number of employees required"
    ],
    correct: 1,
    hint: "Think about temperature requirements - these are examples of what?",
    explanation: "A critical limit is the minimum or maximum value (like 165°F for poultry) that must be met at a CCP to prevent hazards.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: false
  },
  {
    id: 124,
    question: "During a power outage, TCS food held below 135°F for more than how long must be thrown out?",
    options: ["2 hours", "4 hours", "6 hours", "8 hours"],
    correct: 1,
    hint: "Hot-holding equipment failure has a time limit for safe food.",
    explanation: "Throw out TCS food held below 135°F for more than 4 hours during a power outage.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: false
  },
  {
    id: 125,
    question: "Which is an example of an imminent health hazard requiring immediate correction?",
    options: [
      "A dirty floor",
      "Missing date labels",
      "Sewage backup",
      "Employees not wearing hair nets"
    ],
    correct: 2,
    hint: "Imminent health hazards are significant threats requiring immediate closure or correction.",
    explanation: "Imminent health hazards include: sewage backup, fire, flood, power outage, pest infestation, contaminated water.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: false
  },
  {
    id: 126,
    question: "When responding to a foodborne illness complaint, you should...",
    options: [
      "Admit responsibility immediately",
      "Throw out any suspected food",
      "Take the complaint seriously and complete an incident report",
      "Ignore single complaints"
    ],
    correct: 2,
    hint: "What's the proper first step when someone reports getting sick from your food?",
    explanation: "Take complaints seriously, express concern (don't admit responsibility), get contact info, complete incident report. If similar complaints occur, contact regulatory authority.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: false
  },
  {
    id: 127,
    question: "The FDA's five public health interventions include all EXCEPT...",
    options: [
      "Demonstration of knowledge",
      "Time and temperature control",
      "Menu pricing strategies",
      "Consumer advisories"
    ],
    correct: 2,
    hint: "Public health interventions focus on food safety, not business operations.",
    explanation: "FDA's 5 interventions: demonstration of knowledge, staff health controls, controlling hands as contamination vehicle, time/temp control, consumer advisories.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: false
  },
  // ========== CHAPTER 11: FACILITIES AND EQUIPMENT ==========
  {
    id: 128,
    question: "Floor-mounted equipment must be on legs at least how high?",
    options: ["2 inches", "4 inches", "6 inches", "12 inches"],
    correct: 2,
    hint: "This height allows for cleaning beneath the equipment.",
    explanation: "Floor-mounted equipment must be on legs at least 6 inches (15 cm) high OR sealed to a masonry base.",
    category: "Facilities & Operations",
    chapter: 11,
    examFocus: false
  },
  {
    id: 129,
    question: "Tabletop equipment must be mounted on legs at least how high?",
    options: ["2 inches", "4 inches", "6 inches", "8 inches"],
    correct: 1,
    hint: "Tabletop equipment has a different height requirement than floor-mounted equipment.",
    explanation: "Tabletop equipment must be on legs at least 4 inches (10 cm) high OR sealed to the countertop.",
    category: "Facilities & Operations",
    chapter: 11,
    examFocus: false
  },
  {
    id: 130,
    question: "What is backflow?",
    options: [
      "Water flowing through pipes normally",
      "Contaminants flowing back into drinkable water supply",
      "Air flowing through ventilation",
      "Food waste going down the drain"
    ],
    correct: 1,
    hint: "This plumbing problem can contaminate clean water with dirty water.",
    explanation: "Backflow is the reverse flow of contaminants through a cross-connection into the drinkable water supply.",
    category: "Food Safety Basics",
    chapter: 11,
    examFocus: false
  },
  {
    id: 131,
    question: "Which certification mark indicates equipment is approved for foodservice?",
    options: [
      "FDA stamp only",
      "USDA grade mark",
      "NSF, UL EPH, or ETL sanitation mark",
      "Energy Star label"
    ],
    correct: 2,
    hint: "Equipment should have specific sanitation certification marks.",
    explanation: "Look for NSF mark, UL EPH classified mark, or ETL sanitation mark on foodservice equipment.",
    category: "Facilities & Operations",
    chapter: 11,
    examFocus: false
  },
  {
    id: 132,
    question: "What is coving?",
    options: [
      "A type of floor cleaning",
      "Curved junction where floors meet walls",
      "Ceiling ventilation system",
      "Equipment storage method"
    ],
    correct: 1,
    hint: "This construction feature eliminates hiding places at the floor-wall junction.",
    explanation: "Coving is the curved junction where floors meet walls - eliminates pest hiding places and reduces moisture damage.",
    category: "Food Safety Basics",
    chapter: 11,
    examFocus: false
  },
  {
    id: 133,
    question: "Handwashing stations must have all of the following EXCEPT...",
    options: [
      "Hot and cold running water",
      "Soap",
      "Paper towels or air dryer",
      "An automatic timer"
    ],
    correct: 3,
    hint: "What items must be present at every handwashing station?",
    explanation: "Handwashing stations must have: hot and cold water, soap, signage, and garbage container or dryer. No timer required.",
    category: "Facilities & Operations",
    chapter: 11,
    examFocus: false
  },
  {
    id: 134,
    question: "What should you do if there is a sewage backup?",
    options: [
      "Continue operations carefully",
      "Close affected area, correct problem, clean thoroughly",
      "Just clean it up and continue",
      "Wait for it to drain naturally"
    ],
    correct: 1,
    hint: "Sewage backup is a serious health hazard requiring specific response.",
    explanation: "Close affected area immediately, correct the problem, clean thoroughly. If significant risk to food safety: stop service and notify regulatory authority.",
    category: "Facilities & Operations",
    chapter: 11,
    examFocus: false
  },
  {
    id: 135,
    question: "Indoor garbage containers must be...",
    options: [
      "Made of any material available",
      "Leakproof, waterproof, pestproof, and easy to clean",
      "Open-topped for easy access",
      "Kept in food prep areas"
    ],
    correct: 1,
    hint: "Think about what properties prevent contamination and pest attraction.",
    explanation: "Indoor garbage containers must be: leakproof, waterproof, pestproof, easy to clean, and covered when not in use.",
    category: "Facilities & Operations",
    chapter: 11,
    examFocus: false
  },
  // ========== CHAPTER 12: CLEANING AND SANITIZING ==========
  {
    id: 136,
    question: "What is the minimum water temperature in the first compartment of a three-compartment sink?",
    options: ["70°F (21°C)", "90°F (32°C)", "110°F (43°C)", "130°F (54°C)"],
    correct: 2,
    hint: "The wash sink needs water hot enough to clean effectively.",
    explanation: "First sink (wash): detergent and water at least 110°F (43°C). Second sink: clean rinse water. Third sink: sanitizer solution.",
    category: "Sanitation & Hygiene",
    chapter: 12,
    examFocus: false
  },
  {
    id: 137,
    question: "For heat sanitization by immersion, items must be submerged at what temperature for how long?",
    options: ["150°F for 60 seconds", "165°F for 15 seconds", "171°F for 30 seconds", "180°F for 10 seconds"],
    correct: 2,
    hint: "Heat sanitization requires a specific temperature and contact time.",
    explanation: "Heat sanitization by immersion: at least 171°F (77°C) for at least 30 seconds.",
    category: "Sanitation & Hygiene",
    chapter: 12,
    examFocus: false
  },
  {
    id: 138,
    question: "What is the minimum final rinse temperature for high-temperature dishwashers?",
    options: ["165°F (74°C)", "171°F (77°C)", "180°F (82°C)", "200°F (93°C)"],
    correct: 2,
    hint: "High-temp dishwashers use hot water instead of chemicals for sanitizing.",
    explanation: "High-temperature dishwasher final sanitizing rinse must be at least 180°F (82°C).",
    category: "Sanitation & Hygiene",
    chapter: 12,
    examFocus: false
  },
  {
    id: 139,
    question: "What are the five steps for cleaning and sanitizing food-contact surfaces?",
    options: [
      "Wash, dry, sanitize, rinse, air-dry",
      "Scrape, wash, rinse, sanitize, air-dry",
      "Rinse, wash, sanitize, rinse, dry",
      "Soak, wash, rinse, dry, sanitize"
    ],
    correct: 1,
    hint: "Think about the logical order: remove debris first, then clean, then kill pathogens.",
    explanation: "5 steps: 1) Scrape/remove food bits, 2) Wash, 3) Rinse, 4) Sanitize, 5) Air-dry.",
    category: "Sanitation & Hygiene",
    chapter: 12,
    examFocus: false
  },
  {
    id: 140,
    question: "How should wet wiping cloths be stored between uses?",
    options: [
      "In a dry container",
      "In sanitizer solution",
      "In soapy water",
      "Hung up to air dry"
    ],
    correct: 1,
    hint: "Wet cloths need to be kept sanitary between uses.",
    explanation: "Wet wiping cloths must be stored in sanitizer solution between uses. Keep cloths for raw meat separate.",
    category: "Sanitation & Hygiene",
    chapter: 12,
    examFocus: false
  },
  {
    id: 141,
    question: "When should you check sanitizer concentration?",
    options: [
      "Only at the start of each day",
      "When the solution looks dirty or concentration is too low",
      "Once a week",
      "Only when a manager requests it"
    ],
    correct: 1,
    hint: "Sanitizer effectiveness depends on proper concentration.",
    explanation: "Change sanitizer solution when: it is dirty OR concentration is too low. Use test kits made for the specific sanitizer.",
    category: "Sanitation & Hygiene",
    chapter: 12,
    examFocus: false
  },
  {
    id: 142,
    question: "Where should cleaning chemicals be stored?",
    options: [
      "Above food items for easy access",
      "In a separate area away from food, BELOW food if in same room",
      "Mixed in with food supplies",
      "In food preparation areas"
    ],
    correct: 1,
    hint: "Chemical storage must prevent contamination of food.",
    explanation: "Store chemicals in separate area away from food. If in same room, ALWAYS store BELOW food, equipment, utensils, and linens.",
    category: "Sanitation & Hygiene",
    chapter: 12,
    examFocus: false
  },
  {
    id: 143,
    question: "Where should you NEVER clean mops and cleaning tools?",
    options: [
      "In a utility sink",
      "In a designated mop sink",
      "In handwashing, food prep, or dishwashing sinks",
      "Outside the building"
    ],
    correct: 2,
    hint: "Cleaning tools can contaminate certain sinks.",
    explanation: "NEVER clean tools in sinks used for handwashing, food prep, or dishwashing. Use utility/mop sinks only.",
    category: "Sanitation & Hygiene",
    chapter: 12,
    examFocus: false
  },
  {
    id: 144,
    question: "What four components should a master cleaning schedule include?",
    options: [
      "Who, what, when, and how",
      "Cost, time, labor, and supplies",
      "Morning, afternoon, evening, and night tasks",
      "Kitchen, dining, restroom, and storage"
    ],
    correct: 0,
    hint: "A complete cleaning schedule answers four basic questions.",
    explanation: "Master cleaning schedule includes: What should be cleaned, Who should clean it, When it should be cleaned, How it should be cleaned.",
    category: "Sanitation & Hygiene",
    chapter: 12,
    examFocus: false
  },
  // ========== CHAPTER 13: PEST MANAGEMENT ==========
  {
    id: 145,
    question: "What does IPM stand for?",
    options: [
      "Indoor Pest Management",
      "Integrated Pest Management",
      "Immediate Pest Mitigation",
      "Internal Pest Monitoring"
    ],
    correct: 1,
    hint: "This comprehensive approach combines prevention and control measures.",
    explanation: "IPM = Integrated Pest Management - uses prevention measures and control measures with a licensed PCO.",
    category: "Food Safety Basics",
    chapter: 13,
    examFocus: false
  },
  {
    id: 146,
    question: "What are the three basic rules of IPM?",
    options: [
      "Spray, trap, repeat",
      "Deny access, deny food/water/shelter, work with PCO",
      "Clean, sanitize, monitor",
      "Inspect, report, eliminate"
    ],
    correct: 1,
    hint: "IPM focuses on prevention first, then control.",
    explanation: "Three IPM rules: 1) Deny pests access, 2) Deny pests food, water, and shelter, 3) Work with a licensed PCO.",
    category: "Facilities & Operations",
    chapter: 13,
    examFocus: false
  },
  {
    id: 147,
    question: "What is a sign of a cockroach infestation?",
    options: [
      "Clear droppings and fresh smell",
      "Strong oily odor and pepper-like droppings",
      "White egg cases and sweet smell",
      "Visible insects only at night"
    ],
    correct: 1,
    hint: "Cockroaches leave distinctive signs even when not visible.",
    explanation: "Signs of cockroach infestation: strong oily odor, droppings that look like black pepper, capsule-shaped egg cases.",
    category: "Facilities & Operations",
    chapter: 13,
    examFocus: false
  },
  {
    id: 148,
    question: "Which is a sign of rodent infestation?",
    options: [
      "Clean nesting materials",
      "Only daytime sightings",
      "Gnaw marks, droppings, and dirt tracks along walls",
      "Sweet-smelling urine"
    ],
    correct: 2,
    hint: "Rodents leave multiple types of evidence in an operation.",
    explanation: "Signs of rodents: gnaw marks, droppings (shiny black when fresh, gray when old), urine stains, dirt tracks along walls, nests.",
    category: "Facilities & Operations",
    chapter: 13,
    examFocus: false
  },
  {
    id: 149,
    question: "When should pesticides be applied in a foodservice operation?",
    options: [
      "During regular business hours",
      "While staff are working in the area",
      "When the operation is closed and staff are not on-site",
      "Only by managers"
    ],
    correct: 2,
    hint: "Pesticide application has safety requirements for timing.",
    explanation: "Apply pesticides when closed and staff are not on-site. Remove or cover food and food-contact surfaces first.",
    category: "Facilities & Operations",
    chapter: 13,
    examFocus: false
  },
  {
    id: 150,
    question: "Why should foodservice operations NOT apply their own pesticides?",
    options: [
      "It's always more expensive",
      "Pesticides may not work or be harmful if applied incorrectly",
      "It's faster to hire a PCO",
      "There's no reason - they should apply their own"
    ],
    correct: 1,
    hint: "Professional pest control has advantages for safety and effectiveness.",
    explanation: "Don't apply your own pesticides: may not work/be harmful if incorrect, pests can develop resistance, some aren't approved for foodservice.",
    category: "Facilities & Operations",
    chapter: 13,
    examFocus: false
  },
  {
    id: 151,
    question: "Seeing cockroaches during daylight hours may indicate...",
    options: [
      "A minor problem",
      "Normal pest activity",
      "A major infestation",
      "Proper pest control is working"
    ],
    correct: 2,
    hint: "Cockroaches are normally nocturnal. What does daytime activity suggest?",
    explanation: "Cockroaches seen in daylight may indicate a major infestation - they're being pushed out of hiding by overcrowding.",
    category: "Facilities & Operations",
    chapter: 13,
    examFocus: false
  },
  // ========== CHAPTER 14: REGULATORY COMPLIANCE ==========
  {
    id: 152,
    question: "How often should foodservice operations be inspected?",
    options: [
      "Once a year",
      "At least once every six months",
      "Only when there's a complaint",
      "Every two years"
    ],
    correct: 1,
    hint: "Regular inspections ensure ongoing food safety compliance.",
    explanation: "Operations should be inspected at least once every six months. May be less frequent with approved HACCP plan or risk-based schedule.",
    category: "Facilities & Operations",
    chapter: 14,
    examFocus: false
  },
  {
    id: 153,
    question: "Which agency inspects all food EXCEPT meat, poultry, and eggs?",
    options: ["USDA", "CDC", "FDA", "EPA"],
    correct: 2,
    hint: "Different agencies have different jurisdictions over food types.",
    explanation: "FDA inspects all food EXCEPT meat, poultry, and eggs (which are USDA). FDA also issues the Food Code.",
    category: "Facilities & Operations",
    chapter: 14,
    examFocus: false
  },
  {
    id: 154,
    question: "Which agency regulates and inspects meat, poultry, and eggs?",
    options: ["FDA", "CDC", "USDA", "EPA"],
    correct: 2,
    hint: "This agency puts inspection stamps on meat products.",
    explanation: "USDA regulates and inspects meat, poultry, and eggs. They also regulate food crossing state boundaries.",
    category: "Facilities & Operations",
    chapter: 14,
    examFocus: false
  },
  {
    id: 155,
    question: "What are priority items in an inspection?",
    options: [
      "Items that cost the most to fix",
      "Items that directly prevent, eliminate, or reduce hazards",
      "Items related to building maintenance",
      "Items that affect customer comfort"
    ],
    correct: 1,
    hint: "Priority items are the most critical food safety violations.",
    explanation: "Priority items directly prevent, eliminate, or reduce hazards (e.g., handwashing, cooking temps). Require immediate correction.",
    category: "Facilities & Operations",
    chapter: 14,
    examFocus: false
  },
  {
    id: 156,
    question: "Which situation may cause an operation to be closed by inspectors?",
    options: [
      "Missing date labels on some items",
      "Employees not wearing hair nets",
      "Sewage backup or significant pest infestation",
      "Dusty light fixtures"
    ],
    correct: 2,
    hint: "Only the most serious hazards result in closure.",
    explanation: "Operations may close for: significant refrigeration failure, sewage backup, fire/flood, major pest infestation, long utility interruption, evidence of foodborne illness outbreak.",
    category: "Facilities & Operations",
    chapter: 14,
    examFocus: false
  },
  {
    id: 157,
    question: "During an inspection, you should...",
    options: [
      "Refuse entry if you're busy",
      "Ask for ID, cooperate, and take notes",
      "Hide any problems quickly",
      "Have employees leave the area"
    ],
    correct: 1,
    hint: "Professionalism and cooperation help during inspections.",
    explanation: "During inspection: ask for ID, cooperate, take notes, keep relationship professional, provide requested records. NEVER refuse entry.",
    category: "Facilities & Operations",
    chapter: 14,
    examFocus: false
  },
  // ========== CHAPTER 15: STAFF TRAINING ==========
  {
    id: 158,
    question: "What is a training gap?",
    options: [
      "The time between training sessions",
      "The difference between what staff needs to know and what they actually know",
      "The physical space used for training",
      "The cost of training programs"
    ],
    correct: 1,
    hint: "This term describes what's missing in employee knowledge.",
    explanation: "Training gap: the difference between what staff needs to know to do their job and what they actually know.",
    category: "Training",
    chapter: 15,
    examFocus: false
  },
  {
    id: 159,
    question: "What is the Tell-Show-Practice training method?",
    options: [
      "Tell employees once, then test them",
      "Show a video, then have employees practice",
      "Explain how and why, demonstrate, let learner perform",
      "Tell employees to read a manual, then observe them"
    ],
    correct: 2,
    hint: "This method combines verbal instruction, visual demonstration, and hands-on experience.",
    explanation: "Tell-Show-Practice: 1) TELL - explain how and why, 2) SHOW - demonstrate the task, 3) PRACTICE - let learner perform the task.",
    category: "Training",
    chapter: 15,
    examFocus: false
  },
  {
    id: 160,
    question: "Which training method is best for staff in different locations who need self-paced learning?",
    options: [
      "On-the-job training",
      "Classroom lectures",
      "Technology-based training",
      "Group discussions"
    ],
    correct: 2,
    hint: "What training type allows flexibility in location and pace?",
    explanation: "Technology-based training is best when staff are in different locations, expensive to gather, need retraining, have different knowledge levels, or need self-paced learning.",
    category: "Training",
    chapter: 15,
    examFocus: false
  },
  {
    id: 161,
    question: "Training records should document...",
    options: [
      "Only failed training attempts",
      "When staff members complete any food safety training",
      "Only initial hire training",
      "Training costs only"
    ],
    correct: 1,
    hint: "Complete records help during inspections and demonstrate compliance.",
    explanation: "Keep records of ALL food safety training, including when each staff member completed each training. These records may be inspected.",
    category: "Training",
    chapter: 15,
    examFocus: false
  },
  {
    id: 162,
    question: "Which topic should ALL food handlers be trained on?",
    options: [
      "Menu pricing strategies",
      "How and when to wash hands",
      "Restaurant marketing",
      "Inventory ordering"
    ],
    correct: 1,
    hint: "What's the most fundamental food safety skill for all employees?",
    explanation: "All food handlers must be trained on: handwashing, hand care, work attire, reporting illness, time-temp control, cross-contamination prevention, cleaning/sanitizing.",
    category: "Training",
    chapter: 15,
    examFocus: false
  },
  {
    id: 163,
    question: "On-the-job training is best for...",
    options: [
      "Large groups learning theory",
      "Individual or small groups learning skills requiring feedback",
      "Teaching written policies",
      "Initial food safety certification"
    ],
    correct: 1,
    hint: "OJT involves hands-on practice with direct supervision.",
    explanation: "On-the-job training: learners perform tasks while trainers give feedback. Good for individuals/small groups and skills requiring feedback.",
    category: "Training",
    chapter: 15,
    examFocus: false
  }
];

// Get unique categories from questions
var categories = [];
questionsDB.forEach(function(q) {
  if (categories.indexOf(q.category) === -1) {
    categories.push(q.category);
  }
});
categories.sort();

// Get unique chapters from questions
var chapters = [];
questionsDB.forEach(function(q) {
  if (chapters.indexOf(q.chapter) === -1) {
    chapters.push(q.chapter);
  }
});
chapters.sort(function(a, b) { return a - b; });
