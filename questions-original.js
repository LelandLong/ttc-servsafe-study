// ============ CUL 104 SERVSAFE QUESTIONS DATABASE ============
// Sources: Quiz #1, Study Guide, PowerPoints, Class Notes from Chef Carmel
// examFocus: true = Professor emphasized for exam, false = basic knowledge
// chapter: Chapter number (1-15) for chapter-based study modes
//
// This file is loaded by both the study app (index.html) and the admin interface (admin.html)
// Questions can be edited via the admin interface and exported as an updated questions.js file

var originalQuestionsDB = [
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
  },

  // ========== NEW QUESTIONS FROM QUIZ #2 (CHAPTERS 5-7) ==========

  {
    id: 164,
    question: "What is the calibration nut on a bimetallic stemmed thermometer used for?",
    options: [
      "Measuring temperature through glass",
      "Making it a sensing area",
      "Keeping it accurate",
      "Measuring air temperature"
    ],
    correct: 2,
    hint: "Think about why you'd need to adjust a thermometer after calibration.",
    explanation: "The calibration nut is used to adjust the thermometer to keep it accurate. You turn it during calibration to match the correct reference temperature.",
    category: "Food Safety Basics",
    chapter: 5,
    examFocus: true
  },
  {
    id: 165,
    question: "Which item should be rejected during receiving?",
    options: [
      "Live oysters with an internal temperature of 50°F (10°C)",
      "Single-use cups in original packaging",
      "Bags of organic cookies in torn packaging",
      "Bottled milk at 41°F (5°C)"
    ],
    correct: 2,
    hint: "Damaged packaging is a serious concern regardless of what's inside.",
    explanation: "Torn packaging should always be rejected because it may have been contaminated. Live oysters at 50°F are acceptable (max is 50°F), and milk at 41°F is fine.",
    category: "Food Storage",
    chapter: 6,
    examFocus: true
  },
  {
    id: 166,
    question: "What should be done with a shipment of fresh clams that have a slight seaweed smell?",
    options: [
      "Accept the clams",
      "Accept any clams that do not smell like seaweed",
      "Recall the clams",
      "Reject the clams"
    ],
    correct: 0,
    hint: "Think about what's normal for fresh shellfish straight from the ocean.",
    explanation: "A slight seaweed or ocean smell is NORMAL for fresh shellfish. They should smell like the sea. Reject only if they have a strong fishy or ammonia odor.",
    category: "Food Storage",
    chapter: 6,
    examFocus: true
  },
  {
    id: 167,
    question: "What is the first thing that should be done when a food delivery arrives?",
    options: [
      "Inspect the vehicle for signs of contamination",
      "Check temperatures of TCS food items",
      "Inspect packaging for signs of damage or pests",
      "Inspect and store the delivery"
    ],
    correct: 0,
    hint: "Before you even look at the food itself, what should you check?",
    explanation: "The FIRST step is to inspect the delivery vehicle for signs of contamination, pests, or improper conditions. Then inspect the food itself.",
    category: "Food Storage",
    chapter: 6,
    examFocus: true
  },
  {
    id: 168,
    question: "What must documentation received with fish that will be eaten raw or undercooked state?",
    options: [
      "How the fish was caught",
      "The credentials of the fisherman who caught the fish",
      "Where the fish was harvested",
      "That the fish was correctly frozen"
    ],
    correct: 3,
    hint: "Raw fish must go through a specific process to kill parasites before serving.",
    explanation: "Fish served raw or undercooked must have documentation stating it was correctly frozen to destroy parasites. This is a food safety requirement.",
    category: "Food Storage",
    chapter: 6,
    examFocus: true
  },
  {
    id: 169,
    question: "What must be included on the label of food that has not been stored in its original container?",
    options: [
      "Preservatives in the food",
      "Major allergens",
      "The food's common name",
      "A list of ingredients"
    ],
    correct: 2,
    hint: "If you transfer food to a new container, what's the minimum labeling needed?",
    explanation: "When food is removed from its original container, the new container must be labeled with the food's common name so it can be properly identified.",
    category: "Food Storage",
    chapter: 7,
    examFocus: true
  },
  {
    id: 170,
    question: "What must be done after receiving a key drop delivery?",
    options: [
      "The delivery must be inspected",
      "The temperatures must be checked immediately",
      "Products must be removed from original packaging",
      "The delivery must be stored correctly"
    ],
    correct: 0,
    hint: "Key drop means food is delivered when the operation is closed. What's the first priority?",
    explanation: "After a key drop delivery (delivered when no one is present), the delivery must be inspected as soon as possible to verify quality and safety.",
    category: "Food Storage",
    chapter: 6,
    examFocus: true
  },
  {
    id: 171,
    question: "A shipment of whole chickens has been received with dark wing tips and a purple color around the neck. What should be done?",
    options: [
      "Recall the chicken",
      "Accept the chicken",
      "Reject the chicken",
      "Reject any chicken with these traits and keep the rest"
    ],
    correct: 2,
    hint: "Discoloration in poultry is a sign of poor quality or mishandling.",
    explanation: "Dark wing tips and purple discoloration around the neck indicate the poultry has been improperly handled or is past quality. Reject the entire shipment.",
    category: "Food Storage",
    chapter: 6,
    examFocus: true
  },
  {
    id: 172,
    question: "What is the most important factor in choosing an approved food supplier?",
    options: [
      "It has a warehouse close to the operation, reducing shipping time",
      "It has been inspected and complies with local, state, and federal laws",
      "It has a HACCP program or other food safety system",
      "It has documented manufacturing and packaging practices"
    ],
    correct: 1,
    hint: "What's the baseline legal requirement that matters most?",
    explanation: "The most important factor is that the supplier has been inspected and complies with all applicable laws. Proximity, HACCP programs, and documentation are valuable but secondary.",
    category: "Food Storage",
    chapter: 6,
    examFocus: true
  },
  {
    id: 173,
    question: "When receiving a delivery of food for an operation, it is important to...",
    options: [
      "Store it immediately and inspect it later",
      "Inspect only the TCS food",
      "Stack the delivery neatly and inspect it within 12 hours",
      "Inspect all food immediately before storing it"
    ],
    correct: 3,
    hint: "Don't put anything away until you've verified it meets your standards.",
    explanation: "ALL food deliveries must be inspected immediately before being stored. Don't store first and inspect later — problems must be caught right away.",
    category: "Food Storage",
    chapter: 6,
    examFocus: true
  },
  {
    id: 174,
    question: "Fish that will be farm-raised must meet the standards of what agency?",
    options: [
      "Homeland Security",
      "CDC",
      "USDA",
      "FDA"
    ],
    correct: 3,
    hint: "This agency oversees food safety standards for seafood and most food products.",
    explanation: "The FDA (Food and Drug Administration) sets and enforces standards for farm-raised fish, including aquaculture operations.",
    category: "Food Storage",
    chapter: 6,
    examFocus: true
  },
  {
    id: 175,
    question: "What should be done if pests are spotted in a delivery vehicle?",
    options: [
      "Accept the delivery if the products look safe",
      "Reject the entire delivery",
      "Reject any products close to where the pests were found",
      "Accept the delivery, depending on the type of pest found"
    ],
    correct: 1,
    hint: "Pests in the vehicle mean the entire load is potentially compromised.",
    explanation: "If pests are spotted in a delivery vehicle, reject the ENTIRE delivery. There is no way to know which products may have been contaminated.",
    category: "Food Storage",
    chapter: 6,
    examFocus: true
  },
  {
    id: 176,
    question: "How can the risk of cross-contamination be reduced when prepping different types of food on the same prep table?",
    options: [
      "Clean and sanitize the table after you are done using it",
      "Prep ready-to-eat food after raw food",
      "Prep raw and ready-to-eat food at the same time",
      "Prep raw and ready-to-eat food at different times"
    ],
    correct: 3,
    hint: "Separating by TIME is key when you can't separate by space.",
    explanation: "When using the same prep table, prep raw and ready-to-eat foods at DIFFERENT times, cleaning and sanitizing between each type.",
    category: "Sanitation & Hygiene",
    chapter: 7,
    examFocus: true
  },
  {
    id: 177,
    question: "A food item that is received with an expired use-by date should be...",
    options: [
      "Rejected",
      "Accepted but labeled differently",
      "Accepted but kept separate from other items",
      "Used immediately"
    ],
    correct: 0,
    hint: "Expired dates mean the food is past its guaranteed safe period.",
    explanation: "Any food received with an expired use-by date must be rejected. It cannot be accepted regardless of its appearance.",
    category: "Food Storage",
    chapter: 6,
    examFocus: true
  },
  {
    id: 178,
    question: "At what minimum temperature must hot TCS food be received?",
    options: [
      "125°F (52°C)",
      "135°F (57°C)",
      "110°F (43°C)",
      "140°F (60°C)"
    ],
    correct: 1,
    hint: "This is the same as the hot holding minimum temperature.",
    explanation: "Hot TCS food must be received at 135°F (57°C) or higher — the same minimum required for hot holding.",
    category: "Food Storage",
    chapter: 6,
    examFocus: true
  },
  {
    id: 179,
    question: "What must be done after completing each prep task to reduce the risk of cross-contamination?",
    options: [
      "Surfaces must be cleaned and sanitized",
      "Aprons must be replaced with clean ones",
      "Food temperatures must be checked with a clean thermometer",
      "Food must be put away as quickly as possible"
    ],
    correct: 0,
    hint: "What prevents pathogens from one task from transferring to the next?",
    explanation: "After each prep task, all food-contact surfaces must be cleaned and sanitized before starting the next task to prevent cross-contamination.",
    category: "Sanitation & Hygiene",
    chapter: 7,
    examFocus: true
  },
  {
    id: 180,
    question: "Pathogens grow most rapidly at temperatures between...",
    options: [
      "120°F and 135°F (49°C to 57°C)",
      "45°F and 60°F (7°C to 16°C)",
      "70°F and 125°F (21°C to 52°C)",
      "41°F and 45°F (5°C to 7°C)"
    ],
    correct: 2,
    hint: "It's a range WITHIN the danger zone where growth is fastest, not the full danger zone itself.",
    explanation: "While the danger zone is 41-135°F, pathogens grow MOST rapidly between 70°F and 125°F. This is why cooling through this range quickly is critical.",
    category: "Food Safety Basics",
    chapter: 5,
    examFocus: true
  },
  {
    id: 181,
    question: "A chef was preparing a dish that included beef (use-by Sept. 1) and pork (use-by Sept. 15). What is the discard date of the dish?",
    options: [
      "Sept. 15",
      "Sept. 22",
      "Sept. 8",
      "Sept. 1"
    ],
    correct: 3,
    hint: "When combining ingredients, the clock is set by the ingredient that expires first.",
    explanation: "When combining foods with different use-by dates, the discard date is based on the EARLIEST use-by date — in this case, September 1.",
    category: "Food Storage",
    chapter: 7,
    examFocus: true
  },

  // ========== NEW QUESTIONS FROM CHAPTER 10 LECTURE ==========

  {
    id: 182,
    question: "What is a corrective action in HACCP?",
    options: [
      "Creating a new HACCP plan from scratch",
      "Steps taken by a manager when a critical limit is not met",
      "Filing a report with the Board of Health",
      "Discarding all food in the operation"
    ],
    correct: 1,
    hint: "Think about what a manager does when they find a burger only cooked to 130°F.",
    explanation: "A corrective action is when a manager identifies that a critical limit was not met (e.g., food undercooked) and takes steps to fix it and retrain the employee.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 183,
    question: "What is a variance in food safety?",
    options: [
      "A type of foodborne illness",
      "Permission from the regulatory authority to do specialized food preparation requiring a HACCP plan",
      "A difference in temperature readings between two thermometers",
      "An exception to handwashing requirements"
    ],
    correct: 1,
    hint: "This is needed when your operation does something beyond standard cooking like smoking or curing.",
    explanation: "A variance is permission from the Board of Health/regulatory authority to perform specialized food preparation (smoking, curing, sous vide, etc.) that requires a HACCP plan.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 184,
    question: "Which of the following activities requires a variance and a HACCP plan?",
    options: [
      "Grilling steaks to order",
      "Making a fresh salad",
      "Smoking meats in a smoker",
      "Baking bread in a conventional oven"
    ],
    correct: 2,
    hint: "Think about cooking methods that involve low temperatures or modified atmospheres.",
    explanation: "Smoking meats requires a variance and HACCP plan because it involves low-temperature cooking. Other activities requiring variances include curing, sous vide, canning, sprouting seeds, and live shellfish tanks.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 185,
    question: "How long must HACCP records be maintained and kept on file?",
    options: [
      "30 days",
      "8 weeks",
      "16 weeks",
      "1 year"
    ],
    correct: 2,
    hint: "It's measured in weeks, not months or years.",
    explanation: "HACCP records must be maintained for 16 weeks. These include temperature logs, corrective actions, calibration records, and training sign-offs.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 186,
    question: "What are the three phases of a crisis management program?",
    options: [
      "Identify, Correct, Document",
      "Prepare, Respond, Recover",
      "Plan, Execute, Review",
      "Prevent, Detect, Report"
    ],
    correct: 1,
    hint: "Think about what you do BEFORE, DURING, and AFTER a crisis like a hurricane.",
    explanation: "The three phases are: (1) Prepare for the crisis, (2) Respond to the crisis, and (3) Recover from the crisis.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 187,
    question: "What pathogen is associated with improperly cooled rice and grains?",
    options: [
      "Salmonella",
      "E. coli",
      "Bacillus cereus",
      "Listeria monocytogenes"
    ],
    correct: 2,
    hint: "This pathogen causes severe stomach cramps and is specifically linked to starchy foods.",
    explanation: "Bacillus cereus is associated with improperly cooled rice and grains. If not cooled below 41°F within 6 hours, it can cause severe stomach cramps.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 188,
    question: "Why is cantaloupe rind a food safety concern?",
    options: [
      "It contains natural toxins that can cause illness",
      "It can harbor Salmonella from manure or feces in the field",
      "It causes allergic reactions in most people",
      "It must be cooked before the melon can be eaten"
    ],
    correct: 1,
    hint: "Think about where melons grow and what they might contact in the field.",
    explanation: "Cantaloupe rind can harbor Salmonella from manure/feces in the growing field. Always wash, scrub, and dry melons before cutting, and sanitize the cutting board after removing rind.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 189,
    question: "What is carryover cooking?",
    options: [
      "Cooking food in batches to maintain efficiency",
      "Food continuing to cook and rise in temperature after being removed from heat",
      "Reheating leftover food to 165°F",
      "Cooking food on multiple stations at once"
    ],
    correct: 1,
    hint: "This is why experienced chefs pull meat from the oven BEFORE it reaches target temperature.",
    explanation: "Carryover cooking means food continues to cook after removal from heat, rising 5-15°F depending on size. A roast pulled at 125°F will reach 135°F (medium rare).",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 190,
    question: "Your sewer just backed up and you had to close the restaurant. What is the FIRST thing you should do?",
    options: [
      "Call the Board of Health to report the issue",
      "Throw away all the food in the kitchen",
      "Get a certified plumber to fix the problem",
      "Post a notice for customers explaining the closure"
    ],
    correct: 2,
    hint: "The regulatory authority won't come fix your plumbing for you.",
    explanation: "The first step is to get a certified plumber to fix the problem. The Board of Health will not fix it for you — they'll tell you to get a plumber.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 191,
    question: "Ways to achieve Active Managerial Control include all of the following EXCEPT...",
    options: [
      "Training programs for employees",
      "Manager supervision of food handling",
      "Purchasing the most expensive equipment available",
      "Standard Operating Procedures (SOPs)"
    ],
    correct: 2,
    hint: "AMC is about people, processes, and systems — not about spending money on equipment.",
    explanation: "Active Managerial Control is achieved through training programs, manager supervision, SOPs, and HACCP plans. Equipment cost is not a factor in AMC.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 192,
    question: "What is the MOST common source of pathogen transfer to food in a foodservice operation?",
    options: [
      "Contaminated equipment",
      "Pests in the facility",
      "Humans (food handlers)",
      "Unsafe food from suppliers"
    ],
    correct: 2,
    hint: "The professor stressed this on the first day of class — think about who handles food the most.",
    explanation: "Humans are the #1 cause of pathogen transfer. Poor personal hygiene, improper handwashing, and bare-hand contact with ready-to-eat food are the biggest risks.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 193,
    question: "HACCP identifies which three types of hazards?",
    options: [
      "Bacterial, viral, and parasitic",
      "Biological, chemical, and physical",
      "Temperature, time, and moisture",
      "Cross-contamination, allergens, and toxins"
    ],
    correct: 1,
    hint: "These are broad categories — one covers living organisms, one covers substances, one covers objects.",
    explanation: "HACCP identifies three types of hazards: Biological (bacteria, viruses, parasites), Chemical (cleaning agents, pesticides), and Physical (glass, metal, hair).",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 194,
    question: "Which of the following requires a variance from the regulatory authority?",
    options: [
      "Baking cookies for retail sale",
      "Offering a daily soup special",
      "Operating a live shellfish tank with lobsters",
      "Serving a pre-packaged dessert"
    ],
    correct: 2,
    hint: "Think about operations that involve keeping live animals or processing food in non-standard ways.",
    explanation: "Operating live shellfish tanks requires a variance. Other activities requiring variances include smoking/curing, sous vide, canning, sprouting seeds, and using food additives.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 195,
    question: "After cutting cantaloupe, what must be done before cutting the fruit on the same board?",
    options: [
      "Rinse the cutting board with water",
      "Flip the cutting board over",
      "Clean and sanitize the cutting board",
      "Wipe it down with a dry towel"
    ],
    correct: 2,
    hint: "The rind may have contaminated the board. Simply rinsing isn't enough.",
    explanation: "After removing cantaloupe rind, the cutting board must be cleaned AND sanitized before cutting the clean fruit. The rind may harbor Salmonella that can transfer to the fruit.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  }
,
  // ========== CLASS 8 & 9 ADDITIONS (Week 5 Lectures) ==========
  // Chapter 10: HACCP & Food Safety Management (from Class 8)
  {
    id: 196,
    question: "Which pathogen is specifically associated with improperly cooled rice and grains?",
    options: ["E. coli", "Salmonella", "Bacillus cereus", "Listeria"],
    correct: 2,
    hint: "Chef Carmel mentioned this causes severe stomach cramps from starchy foods.",
    explanation: "Bacillus cereus causes severe stomach cramps and is specifically associated with rice, grains, and starchy foods not cooled properly.",
    category: "Foodborne Illness",
    chapter: 10,
    examFocus: true
  },
  {
    id: 197,
    question: "According to HACCP, what are the three types of hazards in food preparation?",
    options: ["Physical, chemical, biological", "Temperature, time, contamination", "Internal, external, environmental", "Acute, chronic, dormant"],
    correct: 0,
    hint: "Think about things that could end up in food: living organisms, substances, and objects.",
    explanation: "The three hazard types are: Biological (bacteria, viruses, parasites), Chemical (cleaning agents, pesticides), and Physical (glass, metal, hair).",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 198,
    question: "Which HACCP principle involves setting minimum and maximum standards such as temperatures and times?",
    options: ["Conduct hazard analysis", "Determine critical control points", "Establish critical limits", "Establish monitoring procedures"],
    correct: 2,
    hint: "This principle defines the boundaries — the numbers that must be met at each CCP.",
    explanation: "Principle 3, Establish Critical Limits, sets the minimum/maximum standards (like temperatures and times) that must be met at each critical control point.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  // Chapter 11: Cleaning & Sanitizing (from Class 9)
  {
    id: 199,
    question: "In South Carolina, who now handles food safety regulation that was formerly under DHEC?",
    options: ["The FDA", "The USDA", "The SC Department of Agriculture", "The CDC"],
    correct: 2,
    hint: "This is a state-level change — the responsibilities moved to a different SC department.",
    explanation: "In South Carolina, the Department of Agriculture absorbed the former DHEC (Department of Health and Environmental Control) food safety responsibilities.",
    category: "Facilities & Operations",
    chapter: 14,
    examFocus: false
  },
  {
    id: 200,
    question: "What is the correct order for cleaning and sanitizing food contact surfaces?",
    options: ["Wash, rinse, sanitize, scrape, air dry", "Scrape, wash, rinse, sanitize, air dry", "Rinse, wash, scrape, sanitize, air dry", "Sanitize, wash, rinse, scrape, air dry"],
    correct: 1,
    hint: "You need to remove food debris first before you can effectively wash.",
    explanation: "The correct order is: 1) Scrape food off, 2) Wash, 3) Rinse, 4) Sanitize, 5) Air dry. Know this order — the exam asks what comes first, third, fourth, etc.",
    category: "Sanitation & Hygiene",
    chapter: 11,
    examFocus: true
  },
  {
    id: 201,
    question: "What removes mineral deposits from dishwashers and equipment?",
    options: ["Degreasers", "Detergent", "D-Limer", "Abrasive cleaners"],
    correct: 2,
    hint: "The name of this product literally references what it removes — lime.",
    explanation: "A D-Limer (de-limer) specifically removes mineral deposits (lime scale) from dishwashers and other equipment.",
    category: "Sanitation & Hygiene",
    chapter: 11,
    examFocus: true
  },
  {
    id: 202,
    question: "How is sanitizer concentration measured?",
    options: ["Degrees Fahrenheit", "Percentage by volume", "Parts per million (PPM)", "Fluid ounces per gallon"],
    correct: 2,
    hint: "This measurement uses test strips or tape kept near the dishwasher and 3-compartment sink.",
    explanation: "Sanitizer concentration is measured in PPM (parts per million) using pH test strips or tape.",
    category: "Sanitation & Hygiene",
    chapter: 11,
    examFocus: true
  },
  {
    id: 203,
    question: "What should you do if hard water is reducing sanitizer effectiveness?",
    options: ["Use hotter water instead", "Add more sanitizer", "Switch to soap", "Reduce the rinse cycle time"],
    correct: 1,
    hint: "Hard water dilutes the sanitizer\'s power, so you need to compensate.",
    explanation: "Hard water reduces sanitizer effectiveness. The solution is to add more sanitizer to compensate for the mineral content in the water.",
    category: "Sanitation & Hygiene",
    chapter: 11,
    examFocus: true
  },
  {
    id: 204,
    question: "How often must food contact surfaces be cleaned and sanitized?",
    options: ["Every 2 hours", "Every 4 hours", "Every 6 hours", "Once per shift"],
    correct: 1,
    hint: "Think about the time limit before bacteria can reach dangerous levels.",
    explanation: "Food contact surfaces must be cleaned and sanitized every 4 hours to prevent bacterial buildup.",
    category: "Sanitation & Hygiene",
    chapter: 11,
    examFocus: true
  },
  {
    id: 205,
    question: "What are the three types of chemical sanitizers approved for food service?",
    options: ["Bleach, ammonia, and vinegar", "Chlorine, iodine, and quaternary ammonium", "Hydrogen peroxide, alcohol, and chlorine", "Soap, detergent, and bleach"],
    correct: 1,
    hint: "One is in bleach, one is brown-colored, and the third is often called \'quat.\'",
    explanation: "The three approved chemical sanitizers are chlorine, iodine, and quaternary ammonium (quat). Their concentrations are measured in PPM.",
    category: "Sanitation & Hygiene",
    chapter: 11,
    examFocus: true
  },
  {
    id: 206,
    question: "Why should hot water NOT be used in the sanitizer compartment of a three-compartment sink?",
    options: ["It wastes energy", "Hot water kills or limits sanitizer effectiveness", "It causes dangerous chemical fumes", "It damages the sink basin"],
    correct: 1,
    hint: "Heat and chemical sanitizers don\'t work well together.",
    explanation: "Hot water kills or limits the effectiveness of chemical sanitizers. The sanitizer water should be cold or lukewarm for maximum effectiveness.",
    category: "Sanitation & Hygiene",
    chapter: 11,
    examFocus: true
  },
  {
    id: 207,
    question: "Why should sanitizer buckets NEVER be placed on food prep tables?",
    options: ["They take up workspace", "Risk of chemical contamination of food", "They attract pests", "Health code requires floor placement"],
    correct: 1,
    hint: "Think about what could happen if the bucket tips over near food.",
    explanation: "Sanitizer buckets on work tables risk chemical contamination if they spill into food. Always keep buckets below or beside the table.",
    category: "Sanitation & Hygiene",
    chapter: 11,
    examFocus: true
  },
  {
    id: 208,
    question: "What is required on ALL chemical spray bottles in a kitchen?",
    options: ["Date of purchase", "The original product label", "Manager\'s initials", "Expiration date only"],
    correct: 1,
    hint: "This ensures anyone can identify what chemical is in the bottle.",
    explanation: "All chemical spray bottles MUST have the original product label so anyone can identify the contents and proper usage. This will be on the exam.",
    category: "Sanitation & Hygiene",
    chapter: 11,
    examFocus: true
  },
  {
    id: 209,
    question: "What type of cleaner removes carbon buildup from kitchen equipment?",
    options: ["D-Limer", "Detergent", "Degreaser", "Abrasive cleaner"],
    correct: 2,
    hint: "Carbon buildup is essentially baked-on grease and oil residue.",
    explanation: "Degreasers (grease cutters) remove carbon buildup from equipment. Dip tanks with degreasing solution can soak items for 24 hours to dissolve carbon.",
    category: "Sanitation & Hygiene",
    chapter: 11,
    examFocus: false
  },
  // Chapter 12: Pest Management (from Class 9)
  {
    id: 210,
    question: "Who should you call when you have a pest problem in a food establishment?",
    options: ["The USDA", "The FDA", "A Pest Control Operator (PCO)", "The Board of Health"],
    correct: 2,
    hint: "This is a licensed professional — not a government agency.",
    explanation: "Call a Pest Control Operator (PCO). PCOs are licensed to use chemicals not available to the public and develop integrated pest management plans. Only the PCO can use pesticides in the kitchen.",
    category: "Facilities & Operations",
    chapter: 12,
    examFocus: true
  },
  {
    id: 211,
    question: "What do damaged or ripped packages in a food delivery indicate?",
    options: ["Normal shipping wear", "Possible pest infestation", "The food is past expiration", "Improper temperature during transport"],
    correct: 1,
    hint: "Something had to cause the damage — and it might still be inside.",
    explanation: "Damaged or ripped packaging indicates possible pest activity (bugs or rodents). Always inspect deliveries and refuse damaged shipments.",
    category: "Facilities & Operations",
    chapter: 12,
    examFocus: true
  },
  {
    id: 212,
    question: "What can be installed at doorways to keep flying insects out of a kitchen?",
    options: ["Screen doors only", "Air curtains (wind curtains)", "UV light traps", "Hanging pest strips"],
    correct: 1,
    hint: "This creates a barrier of moving air that insects cannot fly through.",
    explanation: "Air curtains (wind curtains) create a stream of air at doorways that prevents flying insects from entering the kitchen.",
    category: "Facilities & Operations",
    chapter: 12,
    examFocus: false
  },
  // Chapters 13-14: Regulatory Agencies & Inspections (from Class 9)
  {
    id: 213,
    question: "The FDA inspects and regulates all food EXCEPT which of the following?",
    options: ["Seafood", "Produce", "Meat, poultry, and eggs", "Canned goods"],
    correct: 2,
    hint: "A different federal agency handles these specific animal products.",
    explanation: "The FDA inspects all food EXCEPT meat, poultry, and eggs — those are regulated and inspected by the USDA.",
    category: "Facilities & Operations",
    chapter: 13,
    examFocus: true
  },
  {
    id: 214,
    question: "Which federal agency is responsible for inspecting meat, poultry, and eggs?",
    options: ["FDA", "USDA", "CDC", "EPA"],
    correct: 1,
    hint: "This department has \'Agriculture\' in its name.",
    explanation: "The USDA (United States Department of Agriculture) regulates and inspects meat, poultry, and eggs. A USDA stamp means the meat is healthy and safe to eat.",
    category: "Facilities & Operations",
    chapter: 13,
    examFocus: true
  },
  {
    id: 215,
    question: "Which agency investigates outbreaks of foodborne illness?",
    options: ["FDA", "USDA", "CDC", "Local Board of Health"],
    correct: 2,
    hint: "This agency is headquartered in Atlanta and tracks diseases nationwide.",
    explanation: "The CDC (Centers for Disease Control and Prevention) investigates outbreaks of foodborne illness, working with FDA, USDA, and local authorities.",
    category: "Facilities & Operations",
    chapter: 13,
    examFocus: true
  },
  {
    id: 216,
    question: "Who enforces food safety regulations at local restaurants?",
    options: ["The FDA", "The USDA", "The local regulatory authority", "The CDC"],
    correct: 2,
    hint: "Enforcement starts at the local level, not federal.",
    explanation: "Local regulatory authorities (like SC Dept. of Agriculture) enforce regulations at local restaurants. Federal agencies handle interstate and national issues.",
    category: "Facilities & Operations",
    chapter: 14,
    examFocus: true
  },
  {
    id: 217,
    question: "What does a USDA stamp on meat indicate?",
    options: ["The meat is graded as prime quality", "The meat is organic", "The meat is healthy and safe to eat", "The meat was raised locally"],
    correct: 2,
    hint: "The stamp is about safety inspection, not quality grading — grading is a separate paid service.",
    explanation: "A USDA stamp indicates the meat has been inspected and is healthy and safe to eat. USDA does NOT grade meat (prime, choice, etc.) — that is a separate paid service.",
    category: "Facilities & Operations",
    chapter: 13,
    examFocus: true
  },
  {
    id: 218,
    question: "When a food safety issue spreads from local to multiple states, what happens?",
    options: ["The local authority continues handling it alone", "Federal agencies like FDA and USDA get involved", "The restaurant is permanently closed", "Each state handles its own cases separately"],
    correct: 1,
    hint: "Think about how the response escalates as the problem grows beyond one location.",
    explanation: "Food safety issues start with local authorities but escalate to federal agencies (FDA, USDA, Dept. of Health) when they spread across state lines.",
    category: "Facilities & Operations",
    chapter: 13,
    examFocus: false
  },
  {
    id: 219,
    question: "What should a food establishment always have posted and visible for inspectors?",
    options: ["Menu prices", "Employee schedule", "Food safety certifications", "Supplier contracts"],
    correct: 2,
    hint: "Inspectors check for these credentials when they visit.",
    explanation: "Food safety certifications should always be posted and visible. Inspectors also check proper food labeling, dating, and overall sanitation.",
    category: "Facilities & Operations",
    chapter: 14,
    examFocus: false
  }
,
  // ========== QUIZ #3 & #4 ADDITIONS (Chapters 8-14) ==========
  {
    id: 220,
    question: "What is the purpose of a sneeze guard?",
    options: ["To keep allergens off the food", "To direct sneezes away from the customer", "To protect food from contaminants", "To prevent chemicals from contaminating food"],
    correct: 2,
    hint: "Think about its location — usually over a buffet or salad bar.",
    explanation: "Sneeze guards protect food from contaminants by creating a physical barrier between customers and displayed food items.",
    category: "Food Safety Basics",
    chapter: 8,
    examFocus: true
  },
  {
    id: 221,
    question: "When handling ice to keep it safe, which guideline should be followed?",
    options: ["Use a glass ice scoop", "Store ice scoops in the ice machine", "Only handle ice with bare hands after handwashing", "Never use ice as an ingredient if it was used to cool food"],
    correct: 3,
    hint: "Once ice has been used for one purpose, it may be contaminated.",
    explanation: "Never use ice as an ingredient if it was used to cool food. Ice used for cooling may contain contaminants from the food it was cooling.",
    category: "Food Safety Basics",
    chapter: 8,
    examFocus: true
  },
  {
    id: 222,
    question: "When preparing protein salads such as tuna or egg salad, never use leftover TCS ingredients held longer than how many days?",
    options: ["3 days", "2 days", "5 days", "7 days"],
    correct: 3,
    hint: "This is the maximum cold storage time for TCS foods.",
    explanation: "Never use leftover TCS ingredients that have been held longer than 7 days when preparing protein salads like tuna or egg salad.",
    category: "Food Storage",
    chapter: 8,
    examFocus: true
  },
  {
    id: 223,
    question: "What guideline should be followed when using additives during food preparation?",
    options: ["Colored overwraps should enhance food appearance", "Sulfites should only be added to raw produce", "Additives should only alter food appearance", "Additives must be approved by the regulatory authority"],
    correct: 3,
    hint: "There is an official approval process for anything added to food.",
    explanation: "Food additives must be approved by the regulatory authority before use. They cannot be used solely to alter appearance or hide spoilage.",
    category: "Food Safety Basics",
    chapter: 8,
    examFocus: true
  },
  {
    id: 224,
    question: "Food that has become unsafe should be thrown out unless what?",
    options: ["A foodborne illness is unlikely", "It has been approved by a regulatory authority", "There are no visible signs of spoilage", "It can be safely reconditioned"],
    correct: 3,
    hint: "There is a process to make some foods safe again after they become unsafe.",
    explanation: "Unsafe food should be discarded unless it can be safely reconditioned — a process that makes the food safe for consumption again.",
    category: "Food Safety Basics",
    chapter: 8,
    examFocus: true
  },
  {
    id: 225,
    question: "What is the required minimum internal cooking temperature for a pork roast?",
    options: ["145°F (63°C) for 4 minutes", "165°F (74°C) for less than 1 second", "155°F (68°C) for 17 seconds", "135°F (57°C) for 15 seconds"],
    correct: 0,
    hint: "Roasts require a longer hold time at their minimum temperature than other cuts.",
    explanation: "Pork roasts must reach a minimum internal temperature of 145°F (63°C) and be held there for 4 minutes.",
    category: "Temperature Control",
    chapter: 9,
    examFocus: true
  },
  {
    id: 226,
    question: "If the regulatory authority confirms your operation caused a foodborne illness outbreak, what should you do?",
    options: ["Throw out all suspected product", "Provide the regulatory authority with all appropriate documentation", "Deny accountability and seek legal counsel", "Hire a third-party laboratory for your own investigation"],
    correct: 1,
    hint: "Cooperation and transparency are key in this situation.",
    explanation: "You should provide the regulatory authority with all appropriate documentation. Cooperating fully is required when an outbreak is confirmed.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 227,
    question: "In the event of an imminent health hazard, such as a water supply interruption, what must the operation do?",
    options: ["Notify the regulatory authority", "Maintain normal operating procedures", "Reduce hours of operation", "Execute a HACCP plan"],
    correct: 0,
    hint: "You need to alert the authorities about the emergency situation.",
    explanation: "During an imminent health hazard like a water supply interruption, the operation must notify the regulatory authority immediately.",
    category: "Facilities & Operations",
    chapter: 10,
    examFocus: true
  },
  {
    id: 228,
    question: "How can you determine if a HACCP plan is working?",
    options: ["Fewer products rejected during receiving", "Higher guest check averages", "Monitoring charts indicate hazards are being prevented", "Improvement in health inspection scores"],
    correct: 2,
    hint: "HACCP is all about monitoring and preventing hazards at critical control points.",
    explanation: "A HACCP plan is working when monitoring charts indicate that hazards are being prevented at critical control points.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 229,
    question: "When partially cooking food, the initial cooking phase should not last longer than how long?",
    options: ["15 minutes", "30 minutes", "60 minutes", "5 minutes"],
    correct: 2,
    hint: "This is measured in minutes, not hours, and is longer than you might think.",
    explanation: "When partially cooking food (par-cooking), the initial cooking phase must not exceed 60 minutes to minimize time in the temperature danger zone.",
    category: "Temperature Control",
    chapter: 9,
    examFocus: true
  },
  {
    id: 230,
    question: "If the menu includes TCS items that are raw or undercooked, what should be done?",
    options: ["Post signs throughout the establishment", "List it on the company website", "Note it on the menu", "Have service staff point it out to guests"],
    correct: 2,
    hint: "Think about where customers would see this information before ordering.",
    explanation: "Raw or undercooked TCS items must be noted on the menu with a consumer advisory so customers can make informed decisions.",
    category: "Food Safety Basics",
    chapter: 9,
    examFocus: true
  },
  {
    id: 231,
    question: "A catering employee removed a 135°F tray of lasagna from hot-holding at 11:00 AM. By what time must it be discarded?",
    options: ["4:00 PM", "2:00 PM", "3:00 PM", "12:00 PM"],
    correct: 2,
    hint: "Food can only be held without temperature control for a limited number of hours.",
    explanation: "Food removed from hot-holding can be held for up to 4 hours. 11:00 AM + 4 hours = 3:00 PM discard time.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: true
  },
  {
    id: 232,
    question: "A pest control program is an example of what type of program?",
    options: ["Active managerial control program", "Workplace safety program", "HACCP program", "Food safety program"],
    correct: 3,
    hint: "Pest control is part of the overall system for keeping food safe.",
    explanation: "A pest control program is an example of a food safety program — one of the components of a complete food safety management system.",
    category: "Facilities & Operations",
    chapter: 10,
    examFocus: true
  },
  {
    id: 233,
    question: "What should be done after pesticides have been applied in a food establishment?",
    options: ["Stay out for 48 hours", "Wash, rinse, and sanitize all food contact surfaces", "Cover all equipment for 12 hours", "Have staff wear respirators near sprayed areas"],
    correct: 1,
    hint: "Think about preventing chemical contamination of food preparation areas.",
    explanation: "After pesticides are applied, all food contact surfaces must be washed, rinsed, and sanitized before use to prevent chemical contamination.",
    category: "Facilities & Operations",
    chapter: 12,
    examFocus: true
  },
  {
    id: 234,
    question: "Which risk designation used during a health inspection relates to general sanitation?",
    options: ["Priority foundation item", "Core item", "Priority item", "Basis item"],
    correct: 1,
    hint: "This is the lowest-risk designation of the three official categories.",
    explanation: "Core items relate to general sanitation, operational controls, and facility/equipment maintenance. They are the lowest risk designation.",
    category: "Facilities & Operations",
    chapter: 14,
    examFocus: true
  },
  {
    id: 235,
    question: "What information is important to gather about pests spotted in an operation to help the PCO?",
    options: ["Color, girth, gender", "Size, type, number", "Species, frequency, number", "Date, time, location"],
    correct: 3,
    hint: "The PCO needs to know when and where the pests were seen to plan treatment.",
    explanation: "When reporting pests to a PCO, record the date, time, and location of sightings. This helps the PCO develop an effective treatment program.",
    category: "Facilities & Operations",
    chapter: 12,
    examFocus: true
  },
  {
    id: 236,
    question: "When selecting a Pest Control Operator, which factor should NOT be a consideration?",
    options: ["Whether the person is licensed", "Whether the person has references", "Whether the person is expensive", "Whether the person is up to date on latest practices"],
    correct: 2,
    hint: "Qualifications and competence matter more than one particular factor.",
    explanation: "Cost should not be the deciding factor when selecting a PCO. Focus on licensing, references, and whether they use current best practices.",
    category: "Facilities & Operations",
    chapter: 12,
    examFocus: true
  },
  {
    id: 237,
    question: "How should pesticides be stored within a food establishment?",
    options: ["In dry storage areas only", "In new clearly marked containers", "In their original containers", "With equipment but not with food"],
    correct: 2,
    hint: "Transferring chemicals to different containers can cause confusion and safety hazards.",
    explanation: "Pesticides must be stored in their original containers to ensure proper identification, usage instructions, and safety information are available.",
    category: "Facilities & Operations",
    chapter: 12,
    examFocus: true
  },
  {
    id: 238,
    question: "Pepper-like specks found near an electrical motor in a refrigerator unit indicate what type of pest?",
    options: ["Rats", "Roaches", "Ants", "Mice"],
    correct: 1,
    hint: "These pests leave droppings that look like ground pepper and are attracted to warm motors.",
    explanation: "Pepper-like specks near electrical motors indicate roach droppings. Roaches are attracted to the warmth of electrical equipment.",
    category: "Facilities & Operations",
    chapter: 12,
    examFocus: true
  },
  {
    id: 239,
    question: "Which government agency is responsible for issuing the Food Code?",
    options: ["FDA", "State and local regulatory agencies", "USDA", "CDC"],
    correct: 0,
    hint: "This federal agency creates the model code that states adopt.",
    explanation: "The FDA issues the Food Code, which serves as a model for state and local jurisdictions to adopt for their own food safety regulations.",
    category: "Facilities & Operations",
    chapter: 13,
    examFocus: true
  },
  {
    id: 240,
    question: "What is the minimum interval for foodservice establishment inspections by a regulatory agency?",
    options: ["At least once every six months", "At least once every five years", "At least once per year", "At least once every two years"],
    correct: 0,
    hint: "Inspections should happen fairly frequently — more than once a year.",
    explanation: "Foodservice establishments should be inspected at least once every six months, though actual frequency may vary due to inspector workload.",
    category: "Facilities & Operations",
    chapter: 14,
    examFocus: true
  },
  {
    id: 241,
    question: "What scenario can lead to pest infestation?",
    options: ["Rotating products using FIFO", "Storing food at least 6 inches off the floor", "Installing air curtains above doors", "Storing recyclables in plastic bags"],
    correct: 3,
    hint: "Three of these options are prevention methods. Which one creates a problem?",
    explanation: "Storing recyclables in plastic bags can attract pests. FIFO rotation, elevated storage, and air curtains all help prevent pest issues.",
    category: "Facilities & Operations",
    chapter: 12,
    examFocus: true
  },
  {
    id: 242,
    question: "What training approach is most effective for classroom food safety demonstrations?",
    options: ["Tell learners how and then show them", "Let learners identify steps first", "Let learners practice then point out errors", "Follow a tell, show, do approach"],
    correct: 3,
    hint: "This three-step method covers instruction, demonstration, and hands-on practice.",
    explanation: "The tell, show, do approach is most effective: tell the learner what to do, show them how, then let them do it themselves.",
    category: "Training",
    chapter: 14,
    examFocus: true
  },
  {
    id: 243,
    question: "What is an example of an imminent health hazard that could result in closure of an operation?",
    options: ["Evidence of pests", "A foodborne illness complaint", "Significant lack of refrigeration", "Power outage for two hours or less"],
    correct: 2,
    hint: "This would make it impossible to safely store TCS foods.",
    explanation: "A significant lack of refrigeration is an imminent health hazard that could result in closure because TCS foods cannot be held safely.",
    category: "Facilities & Operations",
    chapter: 14,
    examFocus: true
  },
  {
    id: 244,
    question: "How often should staff training on food safety take place?",
    options: ["Periodically", "Weekly", "Annually", "Monthly"],
    correct: 0,
    hint: "Training should be ongoing and happen as needed, not on a rigid schedule.",
    explanation: "Food safety training should take place periodically — on an ongoing basis as needed, not limited to a fixed schedule.",
    category: "Training",
    chapter: 14,
    examFocus: true
  },
  {
    id: 245,
    question: "Which staff members need general food safety knowledge?",
    options: ["All staff members", "Back-of-house staff only", "Part-time staff only", "Front-of-house staff only"],
    correct: 0,
    hint: "Everyone who works in a food establishment handles or serves food.",
    explanation: "ALL staff members need general food safety knowledge, regardless of whether they work front-of-house or back-of-house.",
    category: "Training",
    chapter: 14,
    examFocus: true
  },
  {
    id: 246,
    question: "The three basic rules to keep an operation pest-free are deny access, deny food and shelter, and what?",
    options: ["Use pesticides", "Destroy pests on sight", "Set traps", "Work with a pest control operator"],
    correct: 3,
    hint: "You need a professional partner in your pest prevention strategy.",
    explanation: "The three rules are: deny pests access, deny them food and shelter, and work with a licensed pest control operator (PCO).",
    category: "Facilities & Operations",
    chapter: 12,
    examFocus: true
  },
  {
    id: 247,
    question: "When should staff receive food safety training?",
    options: ["Immediately after being hired", "After a few weeks on the job", "After the first year", "After the first six months"],
    correct: 0,
    hint: "Food safety knowledge is needed from day one.",
    explanation: "Staff should receive food safety training immediately after being hired so they can handle food safely from their very first day.",
    category: "Training",
    chapter: 14,
    examFocus: true
  },
  {
    id: 248,
    question: "How can you identify training needs in a new hire?",
    options: ["By talking to their coworkers", "By asking them", "By observing their job performance", "By talking to their previous employer"],
    correct: 2,
    hint: "Actions speak louder than words when assessing skills.",
    explanation: "The best way to identify training needs is by observing the new hire's job performance. This shows what they actually know versus what they say they know.",
    category: "Training",
    chapter: 14,
    examFocus: true
  },
  {
    id: 249,
    question: "Having soap at a handwashing sink has which risk designation during a health inspection?",
    options: ["Priority item", "Priority foundation item", "Basis item", "Core item"],
    correct: 0,
    hint: "Handwashing is critical for preventing foodborne illness — it's the highest risk level.",
    explanation: "Soap at a handwashing sink is a priority item — the highest risk designation. Priority items directly relate to preventing foodborne illness.",
    category: "Facilities & Operations",
    chapter: 14,
    examFocus: true
  },
  {
    id: 250,
    question: "After a health inspection, how quickly must violations of priority items be corrected?",
    options: ["Within 72 hours", "Within 48 hours", "Within 12 hours", "Within 24 hours"],
    correct: 0,
    hint: "Priority items are urgent but you get a few days to make corrections.",
    explanation: "Priority item violations must be corrected within 72 hours of the inspection. These are the most critical items related to food safety.",
    category: "Facilities & Operations",
    chapter: 14,
    examFocus: true
  },
  {
    id: 251,
    question: "What is the primary purpose of a regulatory inspection?",
    options: ["To ensure the quality of food served", "To produce a grade for public rating", "To ensure an operation is meeting minimum standards", "To correct deficiencies"],
    correct: 2,
    hint: "Inspections are about compliance with established standards, not quality or grading.",
    explanation: "The primary purpose of a regulatory inspection is to ensure that an operation is meeting minimum food safety standards established by law.",
    category: "Facilities & Operations",
    chapter: 14,
    examFocus: true
  },
{
    id: 252,
    question: "What is coving?",
    options: ["A method of storing food in walk-in coolers", "Curved floor tiles or molding where the wall meets the floor", "A type of ventilation system for kitchens", "A technique for sealing food containers"],
    correct: 1,
    hint: "Think about the junction where two surfaces meet and what might try to get through gaps there.",
    explanation: "Coving refers to curved floor tiles or molding installed where the wall meets the floor. It prevents bugs, insects, and pests from entering through the gap between the floor and wall, and makes cleaning easier.",
    category: "Facilities & Operations",
    chapter: 11,
    examFocus: true
  },
  {
    id: 253,
    question: "What is the primary purpose of coving in a food service operation?",
    options: ["To improve the appearance of the kitchen", "To prevent pests from entering through the gap between the floor and wall", "To reduce noise in the kitchen", "To provide traction on wet floors"],
    correct: 1,
    hint: "Consider what could hide or enter through cracks where different surfaces meet.",
    explanation: "Coving prevents bugs, insects, and varmints from entering the building through the gap between the floor and wall. It creates a smooth, sealed junction that is also easier to clean.",
    category: "Facilities & Operations",
    chapter: 11,
    examFocus: true
  },
  {
    id: 254,
    question: "What is the most important way to prevent bacterial foodborne illness?",
    options: ["Controlling time and temperature", "Practicing good personal hygiene", "Cleaning and sanitizing surfaces", "Purchasing from approved suppliers"],
    correct: 1,
    hint: "Think about the #1 source of contamination in a kitchen.",
    explanation: "Practicing good personal hygiene is the most important way to prevent bacterial foodborne illness because people (food handlers) are the primary source of pathogen transfer through dirty hands, sneezing, coughing, and bodily contact.",
    category: "Sanitation & Hygiene",
    chapter: 3,
    examFocus: true
  },
  {
    id: 255,
    question: "What is the most important method for preventing viral foodborne illness?",
    options: ["Practicing good personal hygiene", "Controlling time and temperature", "Using chemical sanitizers", "Purchasing from approved suppliers"],
    correct: 1,
    hint: "Viral prevention differs from bacterial prevention in what matters most.",
    explanation: "Controlling time and temperature is the most important method for preventing viral foodborne illness. While personal hygiene is also important, viruses are primarily controlled through proper time and temperature management.",
    category: "Foodborne Illness",
    chapter: 2,
    examFocus: true
  },
  {
    id: 256,
    question: "Parasites are most commonly linked with which type of food?",
    options: ["Dairy products", "Grains and cereals", "Seafood, especially raw seafood", "Fresh vegetables"],
    correct: 2,
    hint: "Think about foods that may be consumed with minimal cooking.",
    explanation: "Parasites are most commonly linked with seafood, especially raw seafood. This is why proper freezing and cooking procedures are critical for fish and shellfish preparation.",
    category: "Foodborne Illness",
    chapter: 2,
    examFocus: true
  },
  {
    id: 257,
    question: "What is the most important step to prevent allergen transfer to food?",
    options: ["Cook food to proper temperatures", "Store food at proper temperatures", "Use clean and sanitized utensils", "Label all food containers properly"],
    correct: 2,
    hint: "Think about what physically touches the food during preparation.",
    explanation: "Using clean and sanitized utensils is the most important step to prevent allergen transfer. While proper cooking, storage, and labeling are all important, clean utensils prevent direct cross-contact between allergens and food.",
    category: "Food Safety Basics",
    chapter: 1,
    examFocus: true
  },
  {
    id: 258,
    question: "Which of the following is NOT a ready-to-eat food?",
    options: ["Chicken salad", "Prepared greens", "Unwashed green beans", "Sliced cheese"],
    correct: 2,
    hint: "Think about which food still needs processing before it can be safely eaten.",
    explanation: "Unwashed green beans are NOT ready-to-eat because they may contain chemical fertilizer, manure, or bacteria and require washing and cooking before consumption.",
    category: "Food Safety Basics",
    chapter: 1,
    examFocus: true
  },
  {
    id: 259,
    question: "A food handler has an infected wound on their hand. What should they do?",
    options: ["Apply ointment and continue working", "Wash the wound, cover with an impermeable bandage, and wear a single-use glove", "Call in sick and go home", "Wrap the hand in a side towel"],
    correct: 1,
    hint: "Think about a three-step protection process: clean, cover, barrier.",
    explanation: "A food handler with an infected hand wound must wash the wound, cover it with an impermeable cover (bandage that prevents leakage), and then wear a single-use glove over the bandage. All three steps are required.",
    category: "Sanitation & Hygiene",
    chapter: 3,
    examFocus: true
  },
  {
    id: 260,
    question: "When should a food handler be excluded from the operation?",
    options: ["When they have a minor headache", "When they report diarrhea diagnosed as a foodborne illness", "When they have a small cut on their finger", "When they are feeling tired"],
    correct: 1,
    hint: "Think about symptoms that could spread illness to customers.",
    explanation: "A food handler must be excluded from the operation when they report diarrhea diagnosed as a foodborne illness. The manager must send them home to protect public health, even during busy service.",
    category: "Sanitation & Hygiene",
    chapter: 3,
    examFocus: true
  },
  {
    id: 261,
    question: "Which food can be handled with bare hands?",
    options: ["Parsley for garnish", "Chopped carrots that will be added to stew and cooked", "A fruit salad that will be served immediately", "Bread rolls being placed in a basket for service"],
    correct: 1,
    hint: "Think about whether the food will undergo further cooking after handling.",
    explanation: "Chopped carrots that will be added to stew and cooked can be handled with bare hands because the cooking process will eliminate potential contamination. Foods that won't be cooked (garnishes, salads, bread for service) require gloves.",
    category: "Sanitation & Hygiene",
    chapter: 3,
    examFocus: true
  },
  {
    id: 262,
    question: "Which items can be reused at a self-service food bar?",
    options: ["Customer plates", "Unopened condiment packets", "Beverage cups", "Used serving utensils"],
    correct: 1,
    hint: "Think about which items have not been exposed to potential contamination.",
    explanation: "Unopened condiment packets can be reused at a self-service area because they haven't been contaminated by customer contact. Plates, cups, and used utensils may have been contaminated and cannot be reused.",
    category: "Food Safety Basics",
    chapter: 9,
    examFocus: true
  },
  {
    id: 263,
    question: "What information must be included on labels for food packaged for off-site service?",
    options: ["Price and store location", "Reheating instructions, service instructions, and list of ingredients", "Only the date of preparation", "Just the restaurant name and address"],
    correct: 1,
    hint: "Think about what a customer would need to safely handle and consume the food, especially regarding allergies.",
    explanation: "Food packaged for off-site service must include reheating instructions, service instructions, and a list of ingredients. The ingredients list is especially critical due to allergen concerns for consumers.",
    category: "Food Safety Basics",
    chapter: 9,
    examFocus: true
  },
  {
    id: 264,
    question: "What does TCS stand for in food safety?",
    options: ["Time and Cooking Standards", "Temperature Control for Safety", "Time/Temperature Control for Safety", "Thermal Cooking Standards"],
    correct: 2,
    hint: "It involves both time AND temperature working together for one purpose.",
    explanation: "TCS stands for Time/Temperature Control for Safety. TCS foods require proper time and temperature control to prevent the growth of harmful microorganisms.",
    category: "Temperature Control",
    chapter: 1,
    examFocus: true
  },
  {
    id: 265,
    question: "Ready-to-eat TCS food must be date marked if held for longer than how many hours?",
    options: ["12 hours", "24 hours", "48 hours", "4 hours"],
    correct: 1,
    hint: "Think about when food transitions from short-term to longer-term storage.",
    explanation: "Ready-to-eat TCS food must be date marked if it will be stored for longer than 24 hours. This helps ensure the food is used or discarded within the required 7-day storage limit.",
    category: "Food Storage",
    chapter: 7,
    examFocus: true
  },
  {
    id: 266,
    question: "What is the most important factor when selecting an approved food supplier?",
    options: ["The supplier offers the lowest prices", "The supplier has been inspected and complies with local, state, and federal laws", "The supplier delivers at convenient times", "The supplier provides free samples"],
    correct: 1,
    hint: "Think about what ensures the food you receive is safe and legal.",
    explanation: "The most important factor when choosing a food supplier is that they have been inspected and comply with local, state, and federal laws. This ensures the food meets safety standards.",
    category: "Food Storage",
    chapter: 6,
    examFocus: true
  },
  {
    id: 267,
    question: "What do large ice crystals on frozen food in a delivery indicate?",
    options: ["The food was flash frozen for quality", "The food may have been thawed and refrozen", "The freezer is working properly", "The food is fresh"],
    correct: 1,
    hint: "Think about what would cause ice to form in unusual large crystals.",
    explanation: "Large ice crystals on frozen food indicate the product may have been thawed and refrozen, suggesting improper temperature control during transport or storage and potential pathogen growth.",
    category: "Food Storage",
    chapter: 6,
    examFocus: true
  },
  {
    id: 268,
    question: "When a food item is recalled, what should the manager do?",
    options: ["Immediately throw it in the trash", "Continue using it until the current supply runs out", "Store it separately and wait for instructions from the regulatory authority", "Return it to the supplier without documentation"],
    correct: 2,
    hint: "Think about the proper chain of documentation and disposal.",
    explanation: "When a food item is recalled, the manager must store it separately from other food. Do not use, serve, or discard it immediately. Determine proper disposal procedures with the regulatory authority and document the recall.",
    category: "Food Safety Basics",
    chapter: 6,
    examFocus: true
  },
  {
    id: 269,
    question: "What is the correct storage order in a cooler from top to bottom?",
    options: ["Raw poultry on top, ready-to-eat foods on bottom", "Ready-to-eat foods on top, raw poultry on bottom", "All foods mixed together at the same level", "Raw ground meats on top, vegetables on bottom"],
    correct: 1,
    hint: "Think about which foods drip and which foods are most vulnerable to contamination.",
    explanation: "Ready-to-eat foods go on the top shelf and raw poultry goes on the bottom shelf. This prevents blood and juices from raw poultry from dripping onto and contaminating other foods.",
    category: "Food Storage",
    chapter: 7,
    examFocus: true
  },
  {
    id: 270,
    question: "What type of thermometer probe should be used to check the internal temperature of a pork roast?",
    options: ["Immersion probe", "Surface probe", "Penetration probe", "Air probe"],
    correct: 2,
    hint: "Think about what kind of probe goes through solid food to reach the center.",
    explanation: "A penetration probe should be used to check the internal temperature of solid foods like pork roast or chicken breast. It penetrates through the food to measure the temperature at the center (thickest part).",
    category: "Temperature Control",
    chapter: 5,
    examFocus: true
  },
  {
    id: 271,
    question: "What is the purpose of calibrating a thermometer?",
    options: ["To make it read higher temperatures", "To keep it accurate", "To extend its battery life", "To make it waterproof"],
    correct: 1,
    hint: "Calibration is about ensuring the readings you get are trustworthy.",
    explanation: "The purpose of calibrating a thermometer is to keep it accurate. Calibration using the ice point method (adjusting to 32°F in an ice bath) or boiling water method ensures reliable temperature readings.",
    category: "Temperature Control",
    chapter: 5,
    examFocus: true
  },
  {
    id: 272,
    question: "What is the purpose of time-temperature indicators on food shipments?",
    options: ["To measure cooking time in the kitchen", "To check for cross-contamination", "To show if food has been time-temperature abused during shipment", "To indicate the food's expiration date"],
    correct: 2,
    hint: "These indicators are about what happened to the food BEFORE it arrived at your operation.",
    explanation: "Time-temperature indicators show if food has been time-temperature abused during shipment. They provide a permanent record of whether the food was exposed to unsafe temperatures during transport.",
    category: "Temperature Control",
    chapter: 6,
    examFocus: true
  },
  {
    id: 273,
    question: "What is the worst method for thawing food?",
    options: ["Under refrigeration at 41°F", "Under cold running water", "At room temperature", "In a microwave if cooked immediately after"],
    correct: 2,
    hint: "Think about which method allows food to sit in the temperature danger zone the longest.",
    explanation: "Thawing food at room temperature is the worst method because it allows the outer portions of food to remain in the temperature danger zone (41°F–135°F) for extended periods, promoting pathogen growth.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: true
  },
  {
    id: 274,
    question: "When reheating food for hot holding, what minimum temperature must it reach?",
    options: ["135°F", "145°F", "155°F", "165°F"],
    correct: 3,
    hint: "Reheating requires a higher temperature than just hot holding to ensure safety.",
    explanation: "When reheating food for hot holding, it must reach a minimum internal temperature of 165°F within 2 hours. This is higher than the 135°F hot holding temperature to ensure all pathogens are eliminated.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: true
  },
  {
    id: 275,
    question: "A consumer advisory is required on the menu for which type of food?",
    options: ["Foods that contain common allergens", "TCS foods that are served raw or undercooked", "Foods that have been frozen", "Foods prepared for children"],
    correct: 1,
    hint: "Think about foods that haven't been fully cooked to safe temperatures, like certain seafood preparations.",
    explanation: "A consumer advisory is required for TCS foods that are served raw or undercooked, such as oysters, ceviche, or rare meat preparations. The advisory informs customers of the health risks associated with consuming these items.",
    category: "Food Safety Basics",
    chapter: 8,
    examFocus: true
  },
  {
    id: 276,
    question: "What should a manager know to be prepared for deliberate food contamination?",
    options: ["How to contact the EPA", "Where to find OSHA safety data sheets", "Whom to contact about suspicious activity (local police/sheriff)", "How to test food for chemicals"],
    correct: 2,
    hint: "Deliberate contamination is a security and criminal matter, not an environmental one.",
    explanation: "A manager should know whom to contact about suspicious activity, which is the local police or sheriff. Deliberate food contamination is a security and criminal matter, not an EPA or OSHA issue.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 277,
    question: "What are the most important features of floors, walls, and ceilings in a food service operation?",
    options: ["Decorative and colorful", "Smooth and durable", "Textured and absorbent", "Cheap and replaceable"],
    correct: 1,
    hint: "Think about what makes surfaces easy to keep clean and long-lasting.",
    explanation: "Floors, walls, and ceilings in food service operations should be smooth and durable. These features allow for easy cleaning, prevent pest entry, and resist damage from daily operations.",
    category: "Facilities & Operations",
    chapter: 11,
    examFocus: true
  },
  {
    id: 278,
    question: "What is an air gap in plumbing?",
    options: ["A vent in the ceiling for air circulation", "The space between the faucet and the flood rim of a sink that prevents backflow", "A gap in the air conditioning system", "The distance between exhaust fans"],
    correct: 1,
    hint: "Think about what prevents dirty water from flowing backward into clean water lines.",
    explanation: "An air gap is the space under the sink (between the faucet and the flood rim) that prevents backflow of dirty water into the clean water supply and drain system.",
    category: "Facilities & Operations",
    chapter: 11,
    examFocus: true
  },
  {
    id: 279,
    question: "If glasses from the dishwasher are not drying properly and grease is accumulating, what is likely the problem?",
    options: ["The water is too hot", "The sanitizer is too strong", "The ventilation system is not working properly", "The glasses need to be hand-washed"],
    correct: 2,
    hint: "Think about what system controls moisture and grease buildup in a kitchen.",
    explanation: "If glasses are not drying properly and grease is accumulating, the ventilation system is likely not working properly. Ventilation prevents grease and condensation buildup on surfaces and equipment.",
    category: "Facilities & Operations",
    chapter: 11,
    examFocus: true
  },
  {
    id: 280,
    question: "Where must garbage cans be cleaned?",
    options: ["In the kitchen near the prep area", "Away from food prep areas, cold storage, and food storage", "In the walk-in cooler area", "At the front of the restaurant"],
    correct: 1,
    hint: "Think about keeping waste as far from food as possible.",
    explanation: "Garbage cans must be cleaned away from food prep areas, cold storage, and food storage to prevent contamination. Garbage should never be placed on food prep surfaces.",
    category: "Facilities & Operations",
    chapter: 11,
    examFocus: true
  },
  {
    id: 281,
    question: "In the event of an imminent health hazard such as a water supply interruption, what must the manager do?",
    options: ["Continue operations and inform customers", "Close the operation and notify the regulatory authority", "Switch to bottled water and continue service", "Wait for the problem to resolve on its own"],
    correct: 1,
    hint: "Think about the most protective action for public safety when basic utilities fail.",
    explanation: "When an imminent health hazard occurs (water supply interruption, sewage backup), the manager must notify the regulatory authority immediately. The operation may be closed and cannot reopen until the problem is certified as remedied.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 282,
    question: "What is the first step in cleaning a food prep table?",
    options: ["Spray sanitizer on the surface", "Rinse with clean water", "Remove food from the surface", "Wipe with a damp cloth"],
    correct: 2,
    hint: "You need to clear the surface before you can properly clean it.",
    explanation: "The first step in cleaning a food prep table is to remove food from the surface. Then clean with hot soapy water, rinse, sanitize, and air dry. Removing debris first ensures the cleaning solution can work effectively.",
    category: "Sanitation & Hygiene",
    chapter: 12,
    examFocus: true
  },
  {
    id: 283,
    question: "If a busser transfers cleaning chemical from its original container to a smaller working container, what must they do?",
    options: ["Nothing, it's ready to use", "Label the smaller container with the chemical name", "Dilute the chemical with water first", "Get manager approval before using it"],
    correct: 1,
    hint: "Think about how someone would know what's in an unlabeled container.",
    explanation: "When transferring cleaning chemicals from the original container to a smaller working container, the working container must be labeled with the chemical name. This prevents accidental misuse or confusion about the container's contents.",
    category: "Sanitation & Hygiene",
    chapter: 12,
    examFocus: true
  },
  {
    id: 284,
    question: "What are the four steps of Active Managerial Control?",
    options: ["Plan, Execute, Review, Report", "Monitoring, Identifying risks, Corrective action, Re-evaluation", "Train, Supervise, Document, Inspect", "Observe, Record, Correct, Certify"],
    correct: 1,
    hint: "Think about a cycle: watch for problems, find them, fix them, then verify the fix worked.",
    explanation: "The four steps of Active Managerial Control are: Monitoring (checking procedures), Identifying risks (finding deviations), Corrective action (fixing problems), and Re-evaluation (verifying fixes worked).",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 285,
    question: "A manager notices the dishwasher rinse cycle is not working properly. After identifying the problem and adding soap to rerun the trays, what step of Active Managerial Control is the manager performing?",
    options: ["Monitoring", "Identifying risks", "Corrective action", "Re-evaluation"],
    correct: 2,
    hint: "The manager has already found the problem and is now fixing it.",
    explanation: "Adding soap and rerunning the trays is a corrective action — the manager is taking steps to fix the identified problem. This is the third step of Active Managerial Control.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 286,
    question: "One way a manager can demonstrate food safety knowledge is to:",
    options: ["Hire experienced staff", "Become certified in food safety", "Purchase expensive equipment", "Delegate all food safety tasks"],
    correct: 1,
    hint: "Think about a personal credential that shows competence.",
    explanation: "One way a manager demonstrates food safety knowledge is by becoming certified in food safety (such as earning ServSafe certification). This shows commitment to safe practices and is required or expected in many operations.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 287,
    question: "Which activities require a variance from the local regulatory authority?",
    options: ["Grilling steaks and baking bread", "Smoking meats, curing foods, and canning/preserving", "Washing produce and making salads", "Baking desserts and making soups"],
    correct: 1,
    hint: "Think about specialized food preparation processes that carry higher risks.",
    explanation: "Activities like smoking meats, curing foods, canning/preserving, cryovac/vacuum sealing, sous vide cooking, and fermentation require a variance because they involve specialized processes with higher food safety risks that need a documented HACCP plan.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 288,
    question: "What temperature must a heat-sanitizing dishwasher reach for its final rinse?",
    options: ["135°F", "155°F", "165°F", "180°F"],
    correct: 3,
    hint: "This temperature is higher than any cooking temperature requirement.",
    explanation: "A heat-sanitizing dishwasher must reach a minimum of 180°F for its final rinse to properly sanitize dishes. Chemical sanitizer dishwashers use lower temperatures but rely on chemical agents instead.",
    category: "Sanitation & Hygiene",
    chapter: 12,
    examFocus: true
  },
  {
    id: 289,
    question: "Frozen shellfish tags show exact longitude and latitude. What is the purpose of this information?",
    options: ["To determine the price of the shellfish", "To allow tracking of the harvest location for pollution and safety monitoring", "To verify the species of shellfish", "To calculate shipping distance"],
    correct: 1,
    hint: "Think about what would happen if pollution affected a specific body of water.",
    explanation: "Shellfish tags showing exact longitude and latitude allow DNR (Department of Natural Resources) to track the harvest location. This is critical for identifying areas affected by pollution, hurricanes, or sewage events.",
    category: "Food Storage",
    chapter: 6,
    examFocus: true
  },
  {
    id: 290,
    question: "Where should the thermometer be inserted to get an accurate temperature reading of food?",
    options: ["Near the surface of the food", "In the thinnest part of the food", "In the thickest part of the food", "On the side of the food container"],
    correct: 2,
    hint: "The last part to reach a safe temperature is the area with the most mass.",
    explanation: "The thermometer must be inserted in the thickest part of the food for an accurate reading. The thickest part takes the longest to cook and represents the coldest internal temperature.",
    category: "Temperature Control",
    chapter: 5,
    examFocus: true
  },
  {
    id: 291,
    question: "After handling raw meat and before handling produce, a food handler must:",
    options: ["Simply change their gloves", "Wash hands and change gloves", "Wipe hands on their apron", "Rinse hands with cold water"],
    correct: 1,
    hint: "Changing gloves alone is not sufficient — think about what's underneath the gloves.",
    explanation: "After handling raw meat and before handling produce, a food handler must both wash their hands AND change their gloves. Simply changing gloves is insufficient because hands may have been contaminated through the gloves.",
    category: "Sanitation & Hygiene",
    chapter: 3,
    examFocus: true
  },
  {
    id: 292,
    question: "What must a hand washing station include?",
    options: ["Soap, hot and cold water, signage, drying method, and garbage container", "Just soap and water", "Soap, water, and paper towels only", "Soap, cold water, and hand sanitizer"],
    correct: 0,
    hint: "A complete hand washing station has five components.",
    explanation: "A proper hand washing station must include soap, hot and cold water, signage (reminding employees to wash hands), a drying method (paper towels or air dryer), and a garbage container for used towels.",
    category: "Sanitation & Hygiene",
    chapter: 3,
    examFocus: true
  },
  {
    id: 293,
    question: "If food does NOT reach 70°F within the first 2 hours of the cooling process, what must happen?",
    options: ["Continue cooling for an additional 2 hours", "Move it to a blast chiller", "The entire batch must be discarded", "Reheat it to 165°F and start cooling again"],
    correct: 2,
    hint: "Failing to meet the first stage cooling deadline is a critical failure.",
    explanation: "If food does not reach 70°F within 2 hours (Stage 1 of the two-stage cooling process), the entire batch must be discarded. This is a food safety failure that cannot be corrected by additional cooling time.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: true
  },
  {
    id: 294,
    question: "A catering lasagna is removed from hot holding at 135°F at 11:00 AM. By what time must it be at or below 41°F?",
    options: ["1:00 PM (2 hours)", "3:00 PM (4 hours)", "5:00 PM (6 hours)", "It must be discarded immediately"],
    correct: 1,
    hint: "Think about the total time allowed from hot holding temperature to safe cold temperature.",
    explanation: "Food removed from 135°F hot holding has 4 hours total to reach below 41°F when using the time as a public health control method. So lasagna removed at 11:00 AM must be below 41°F by 3:00 PM, or it must be discarded.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: true
  },
  {
    id: 295,
    question: "What is the minimum cooking temperature for vegetables?",
    options: ["135°F", "145°F", "155°F", "165°F"],
    correct: 0,
    hint: "Vegetables require the lowest minimum cooking temperature of all foods.",
    explanation: "Vegetables must be cooked to a minimum internal temperature of 135°F. This is the lowest minimum cooking temperature compared to other food types like fish (145°F), ground meat (155°F), and poultry (165°F).",
    category: "Temperature Control",
    chapter: 8,
    examFocus: true
  },
  {
    id: 296,
    question: "Milk, eggs, and shellfish may be received at temperatures up to what degree before they must be brought down to proper holding temperature?",
    options: ["41°F", "45°F", "50°F", "55°F"],
    correct: 1,
    hint: "These items have a slightly higher acceptable receiving temperature than standard cold foods.",
    explanation: "Milk, eggs, and shellfish may be received at temperatures up to 45°F, but they must be brought down to 41°F or below promptly for proper cold holding. A temperature of 45°F is acceptable for receiving but not for holding.",
    category: "Temperature Control",
    chapter: 6,
    examFocus: true
  },
  {
    id: 297,
    question: "How should mops be stored after use?",
    options: ["Soaking in a bucket of water", "Lying flat on the floor to dry", "Rinsed and hung upright to air dry", "In the food prep area for quick access"],
    correct: 2,
    hint: "Think about how to prevent mold and mildew growth between uses.",
    explanation: "Mops should be rinsed and hung upright to air dry between uses. This prevents mold and mildew growth. Storing mops in buckets or lying flat keeps them damp and promotes bacterial growth.",
    category: "Sanitation & Hygiene",
    chapter: 12,
    examFocus: true
  },
  {
    id: 298,
    question: "Which of the following is NOT a proper thawing method?",
    options: ["Under refrigeration at 41°F", "Under cold running water", "In a microwave if cooked immediately after", "On the counter at room temperature"],
    correct: 3,
    hint: "Think about which method allows food to sit in the danger zone.",
    explanation: "Thawing on the counter at room temperature is NOT a proper thawing method because the outer portions of the food enter the temperature danger zone while the interior is still frozen, allowing pathogen growth.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: true
  },
  {
    id: 299,
    question: "A food handler has been slicing roast beef continuously. After 4 hours, what is the most serious food safety risk?",
    options: ["The slicer needs to be replaced", "The beef needs to be sanitized", "Time-temperature abuse of the meat", "The roast beef is overcooked"],
    correct: 2,
    hint: "Think about how long the meat has been sitting at unsafe temperatures during a long slicing operation.",
    explanation: "The most serious risk is time-temperature abuse. During a long slicing operation (e.g., 6 hours), the meat sits out at room temperature in the danger zone (41°F–135°F), allowing rapid pathogen growth.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: true
  },
  {
    id: 300,
    question: "A food handler diagnosed with norovirus should do what?",
    options: ["Show up for their shift and wear extra gloves", "Report the diagnosis to the manager immediately", "Stay home for just one day", "Continue working but avoid touching food"],
    correct: 1,
    hint: "Norovirus is highly contagious — the manager needs to know right away.",
    explanation: "A food handler diagnosed with norovirus must report the diagnosis to the food manager immediately and stay home from work. Norovirus is extremely contagious and can spread rapidly through a food operation.",
    category: "Sanitation & Hygiene",
    chapter: 3,
    examFocus: true
  },
  {
    id: 301,
    question: "If a customer with a food allergy accidentally receives a dish containing the allergen, what should the food handler do?",
    options: ["Pick off the allergen-contaminated items and re-serve", "Discard the dish and notify the person in charge (PIC)", "Make a new dish using the same equipment", "Apologize and offer a discount"],
    correct: 1,
    hint: "This is a potentially life-threatening situation — think about who needs to know and what must happen to the food.",
    explanation: "The food handler must discard the dish and notify the PIC (person in charge) immediately. A new dish must be prepared using only sanitized equipment. Food allergies can cause anaphylactic shock, which is life-threatening.",
    category: "Food Safety Basics",
    chapter: 1,
    examFocus: true
  },
  {
    id: 302,
    question: "The person in charge (PIC) is notified that the operation is being investigated as a possible source of a hepatitis outbreak. What should the PIC do?",
    options: ["Wait for the investigation to conclude before acting", "Notify staff, grant access to authorities, and exclude sick employees", "Close the operation permanently", "Only exclude the employee who reported the illness"],
    correct: 1,
    hint: "A hepatitis outbreak investigation requires multiple immediate actions.",
    explanation: "When notified of a hepatitis outbreak investigation, the PIC must immediately notify all staff, grant access to investigating authorities, and exclude any sick employees. All of these actions must be taken.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 303,
    question: "Which type of contamination can utensils made of copper, pewter, or zinc cause?",
    options: ["Biological contamination", "Chemical contamination", "Physical contamination", "No contamination if properly cleaned"],
    correct: 1,
    hint: "These metals can react with food, releasing harmful substances.",
    explanation: "Utensils made of copper, pewter, or zinc can cause chemical contamination. These metals can leach into food through chemical reactions, especially with acidic foods, making the food unsafe to consume.",
    category: "Food Safety Basics",
    chapter: 1,
    examFocus: true
  },
  {
    id: 304,
    question: "What is the primary risk of transporting ice in containers that were previously used to store chemicals?",
    options: ["The containers may leak", "Cross-contamination from chemical residue", "The ice will melt faster", "The containers may smell bad"],
    correct: 1,
    hint: "Think about what invisible residue could remain in the container.",
    explanation: "The primary risk is cross-contamination. Chemical residue remaining in the container can contaminate the ice, which then comes into contact with food or beverages, causing chemical contamination.",
    category: "Food Safety Basics",
    chapter: 1,
    examFocus: true
  },
  {
    id: 305,
    question: "Reviewing video surveillance is part of which step of the ALERT Food Defense Awareness system?",
    options: ["Assure", "Look", "Employees", "Report"],
    correct: 1,
    hint: "This step is about observation and watching for potential threats.",
    explanation: "Reviewing video surveillance falls under the 'Look' step of the ALERT Food Defense Awareness system. The 'Look' step involves monitoring the operation for signs of tampering or suspicious activity.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 306,
    question: "To honestly present food on a menu means to:",
    options: ["List all ingredients on the menu", "Not mislead customers about the food", "Serve only organic products", "Serve well-presented food"],
    correct: 1,
    hint: "Think about truthfulness in how food is described and sourced.",
    explanation: "Honestly presenting food means not misleading customers about ingredients, sourcing, or preparation methods. Claiming food is 'local' when sourced elsewhere, or misrepresenting ingredients, is a violation that can result in fines.",
    category: "Food Safety Basics",
    chapter: 14,
    examFocus: true
  },
  {
    id: 307,
    question: "Where should mop water be disposed of?",
    options: ["Hand sink", "Three-compartment sink", "Two-compartment sink", "Utility sink (service sink)"],
    correct: 3,
    hint: "Think about a sink specifically designated for cleaning tasks, not food or hand washing.",
    explanation: "Mop water must be disposed of in a utility sink (also called a service sink or mop sink). Never dispose of mop water in hand sinks, food prep sinks, or dishwashing sinks to prevent contamination.",
    category: "Sanitation & Hygiene",
    chapter: 12,
    examFocus: true
  },
  {
    id: 308,
    question: "Which of the following is an example of a physical contaminant?",
    options: ["Bleach residue on a cutting board", "Norovirus on lettuce", "A fingernail in a salad", "Pesticide on fruit"],
    correct: 2,
    hint: "Physical contaminants are made of actual physical material you can see or feel.",
    explanation: "A fingernail is a physical contaminant — it is a foreign object that physically does not belong in food. Bleach and pesticides are chemical contaminants, and norovirus is a biological contaminant.",
    category: "Food Safety Basics",
    chapter: 1,
    examFocus: true
  },
  {
    id: 309,
    question: "What is the difference between a restriction and an exclusion for a food handler?",
    options: ["There is no difference", "Restriction means cannot work with food; exclusion means cannot be at work at all", "Restriction means sent home; exclusion means limited duties", "Restriction applies to managers; exclusion applies to line cooks"],
    correct: 1,
    hint: "One keeps you away from food, the other keeps you away from the building entirely.",
    explanation: "A restriction means the food handler cannot work with food but can perform other duties (handling money, moving boxes). An exclusion means the food handler cannot be at work at all and must stay home.",
    category: "Sanitation & Hygiene",
    chapter: 3,
    examFocus: true
  },
  {
    id: 310,
    question: "A food handler with a sore throat and fever is told not to work around food or food contact surfaces. This is an example of:",
    options: ["Contamination", "Exclusion", "Restriction", "Isolation"],
    correct: 2,
    hint: "The food handler is still at work, just kept away from food.",
    explanation: "This is an example of restriction. The food handler is not allowed to work with food or food contact surfaces but may still perform other duties at the operation. Exclusion would mean they cannot be at work at all.",
    category: "Sanitation & Hygiene",
    chapter: 3,
    examFocus: true
  },
  {
    id: 311,
    question: "Staphylococcus aureus bacteria are commonly found in which areas of the human body?",
    options: ["The stomach and intestines", "The hair, nose, throat, and infected cuts", "The feet and hands only", "The blood and lymph nodes"],
    correct: 1,
    hint: "Think about the areas of the body that food handlers frequently touch during work.",
    explanation: "Staphylococcus aureus is commonly found in the hair, nose, throat, and infected cuts of even healthy people. This is why proper personal hygiene and wound care are critical for food handlers.",
    category: "Foodborne Illness",
    chapter: 2,
    examFocus: true
  },
  {
    id: 312,
    question: "What is the minimum internal cooking temperature for pork chops?",
    options: ["135°F for 15 seconds", "145°F for 15 seconds", "155°F for 15 seconds", "165°F for 15 seconds"],
    correct: 1,
    hint: "Pork chops fall in the same temperature category as fish and steaks.",
    explanation: "Pork chops must be cooked to a minimum internal temperature of 145°F for 15 seconds. This is the same temperature required for fish, steaks, and other whole cuts of meat.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: true
  },
  {
    id: 313,
    question: "An operation closed due to a foodborne illness outbreak can reopen with:",
    options: ["Management approval only", "Approval from the regulatory authority", "Rewriting operation manuals", "Throwing out all contaminated food"],
    correct: 1,
    hint: "An outside authority must verify the operation is safe before it can serve food again.",
    explanation: "An operation closed due to a foodborne illness outbreak can only reopen with approval from the regulatory authority. The operation must demonstrate that the source of the outbreak has been identified and corrected.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 314,
    question: "The internal temperature of a hamburger patty is best measured with which type of thermometer?",
    options: ["Bimetallic stemmed thermometer", "Infrared thermometer", "Thermocouple thermometer", "Digital oven thermometer"],
    correct: 2,
    hint: "Thin items like patties need a thermometer with a thin probe that won't hit the cooking surface.",
    explanation: "A thermocouple thermometer is best for measuring thin items like hamburger patties. A bimetallic stem thermometer could hit the grill and give a false reading, and infrared only measures surface temperature.",
    category: "Temperature Control",
    chapter: 5,
    examFocus: true
  },
  {
    id: 315,
    question: "Food probe thermometers must be accurate to within:",
    options: ["±0.9°F (±0.5°C)", "±1.8°F (±1.0°C)", "±2.7°F (±1.5°C)", "±3.6°F (±2.0°C)"],
    correct: 2,
    hint: "The accuracy standard is roughly 3 degrees Fahrenheit.",
    explanation: "Food probe thermometers must be accurate to within ±2.7°F (±1.5°C). This is the standard accuracy requirement for thermometers used to verify food temperatures in food service operations.",
    category: "Temperature Control",
    chapter: 5,
    examFocus: true
  },
  {
    id: 316,
    question: "Soft, porous wood is considered an unacceptable material for which kitchen item?",
    options: ["Shelving units", "Cutting boards", "Serving trays", "Storage containers"],
    correct: 1,
    hint: "Think about which item makes direct contact with food during preparation.",
    explanation: "Soft, porous wood is unacceptable for cutting boards because it absorbs moisture, food particles, and bacteria, making it impossible to properly clean and sanitize. Hard wood, high-density plastic, or rubber are acceptable alternatives.",
    category: "Facilities & Operations",
    chapter: 11,
    examFocus: true
  },
  {
    id: 317,
    question: "A food handler finds a container of cubed ham in the cooler with no date mark. What should the handler do?",
    options: ["Add today's date and keep it", "Throw it out", "Taste it to check if it's still good", "Ask the manager to smell it"],
    correct: 1,
    hint: "Without a date mark, you have no way to know if the food is still safe.",
    explanation: "If a ready-to-eat TCS food in the cooler has no date mark, it must be thrown out. Without a date mark, there is no way to verify when the food was prepared or how long it has been stored.",
    category: "Food Storage",
    chapter: 7,
    examFocus: true
  },
  {
    id: 318,
    question: "Which plant food must be transported at 41°F or below to a catering site?",
    options: ["Shredded carrots", "Sliced cucumbers", "Chopped celery", "Sliced tomatoes"],
    correct: 3,
    hint: "Think about which cut produce is associated with a specific pathogen risk.",
    explanation: "Sliced tomatoes must be transported at 41°F or below because they can carry Salmonella once sliced. Cutting the tomato exposes the interior to surface bacteria and creates a moist environment for pathogen growth.",
    category: "Temperature Control",
    chapter: 9,
    examFocus: true
  },
  {
    id: 319,
    question: "When holding food without temperature control, what must the food be marked with?",
    options: ["The ingredients and recipe", "The way it must be displayed", "The time it was prepared and when to discard it", "The name of the food handler who prepared it"],
    correct: 2,
    hint: "Think about what information is needed to track the 4-hour time limit.",
    explanation: "Food held without temperature control must be marked with the time it was prepared (or removed from temperature control) and when it must be discarded. This tracks the 4-hour time limit for safe service.",
    category: "Temperature Control",
    chapter: 9,
    examFocus: true
  },
  {
    id: 320,
    question: "The most common symptom associated with norovirus gastroenteritis is:",
    options: ["Hives", "Fever", "Jaundice", "Vomiting"],
    correct: 3,
    hint: "This symptom is sudden and severe — norovirus is sometimes called the 'stomach bug.'",
    explanation: "Vomiting is the most common symptom associated with norovirus gastroenteritis. Norovirus causes sudden onset of vomiting and diarrhea and is the leading cause of foodborne illness outbreaks.",
    category: "Foodborne Illness",
    chapter: 2,
    examFocus: true
  },
  {
    id: 321,
    question: "Tuna salad prepared on October 1st and stored at 41°F or below must be discarded by the end of:",
    options: ["October 4th", "October 6th", "October 7th", "October 8th"],
    correct: 2,
    hint: "Count 7 days from the preparation date, including the prep day.",
    explanation: "Using the 7-day rule, tuna salad prepared on October 1st must be discarded by the end of October 7th. Day 1 is October 1st (prep day), so day 7 is October 7th.",
    category: "Food Storage",
    chapter: 7,
    examFocus: true
  },
  {
    id: 322,
    question: "To effectively heat-sanitize utensils in a three-compartment sink, the hot water temperature must be at least:",
    options: ["120°F", "151°F", "160°F", "171°F"],
    correct: 3,
    hint: "This is different from the dishwasher temperature (180°F) and lower than you might expect. Think about submerging items by hand.",
    explanation: "The hot water in a three-compartment sink for heat sanitizing must be at least 171°F with items submerged for 30 seconds. This is different from automatic dishwashers which require 180°F. Note: 120°F is just the wash water temperature.",
    category: "Sanitation & Hygiene",
    chapter: 12,
    examFocus: true
  },
  {
    id: 323,
    question: "During a 12-hour power outage, the freezer temperature reached 55°F and all products thawed. What should the manager do?",
    options: ["Refreeze the food", "Cook the food and serve it to staff", "Throw the food out", "Refrigerate the food for later use"],
    correct: 2,
    hint: "Food that has been in the danger zone for an unknown period of time cannot be saved.",
    explanation: "All food must be thrown out. At 55°F, the food has been in the temperature danger zone (above 41°F) for an unknown duration during the outage. It cannot be safely refrozen, cooked, or refrigerated.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: true
  },
  {
    id: 324,
    question: "What level of involvement should food workers have in executing a master cleaning schedule?",
    options: ["Rare — managers handle cleaning", "Voluntary — only if they want to", "Planning and execution — it's mandatory", "Minimal — just follow orders"],
    correct: 2,
    hint: "All employees should be actively involved in the cleaning program.",
    explanation: "Food worker involvement in the master cleaning schedule is mandatory. All employees should be involved in both planning and executing the schedule, which increases buy-in and ensures compliance with cleaning procedures.",
    category: "Sanitation & Hygiene",
    chapter: 12,
    examFocus: true
  },
  {
    id: 325,
    question: "Sanitized pots and pans should be stored inverted (upside down) because this:",
    options: ["Makes them easier to stack", "Lets the sanitizer dry faster", "Prevents possible contamination from dust, food particles, and bugs", "Saves storage space"],
    correct: 2,
    hint: "Think about what could fall into an open container sitting on a shelf.",
    explanation: "Storing sanitized pots and pans upside down prevents contamination from dust, food particles, and bugs getting inside. It also allows any remaining sanitizer solution to drain and dry.",
    category: "Sanitation & Hygiene",
    chapter: 12,
    examFocus: true
  },
  {
    id: 326,
    question: "Food contact surfaces may NOT be cleaned and sanitized with:",
    options: ["Chlorine-based solutions", "Quaternary ammonium compounds", "Iodine solutions", "Abrasive powders"],
    correct: 3,
    hint: "Think about which product is designed for scrubbing, not sanitizing.",
    explanation: "Abrasive powders cannot be used to clean and sanitize food contact surfaces. They are meant for heavy scrubbing and can damage surfaces. Chlorine, iodine, and quaternary ammonium compounds are all approved chemical sanitizers.",
    category: "Sanitation & Hygiene",
    chapter: 12,
    examFocus: true
  },
  {
    id: 327,
    question: "A food handler monitors self-service food bars primarily because customers may:",
    options: ["Take too much food", "Reuse their cups", "Contaminate the food while moving through the line", "Complain about the selection"],
    correct: 2,
    hint: "Think about the biggest food safety risk at a self-service station.",
    explanation: "The primary reason to monitor self-service food bars is that customers may contaminate the food while moving through the line — through sneezing, touching food, using dirty utensils, or other unsafe practices.",
    category: "Food Safety Basics",
    chapter: 9,
    examFocus: true
  },
  {
    id: 328,
    question: "The group responsible for grading meat is the:",
    options: ["FDA (Food and Drug Administration)", "CDC (Centers for Disease Control)", "DOJ (Department of Justice)", "USDA (United States Department of Agriculture)"],
    correct: 3,
    hint: "This agency handles meat, poultry, and eggs specifically.",
    explanation: "The USDA (United States Department of Agriculture) is responsible for grading and inspecting meat, poultry, and eggs. The FDA handles all other food regulation.",
    category: "Facilities & Operations",
    chapter: 14,
    examFocus: true
  },
  {
    id: 329,
    question: "Which illness is most often associated with deli meats?",
    options: ["Botulism", "Listeria", "Salmonella", "Hepatitis A"],
    correct: 1,
    hint: "This pathogen thrives in cold, refrigerated environments — unlike most bacteria.",
    explanation: "Listeria (Listeria monocytogenes) is most often associated with deli meats. Unlike most bacteria, Listeria can grow at refrigeration temperatures, making ready-to-eat deli meats a particular risk.",
    category: "Foodborne Illness",
    chapter: 2,
    examFocus: true
  },
  {
    id: 330,
    question: "Which food is safe to eat if cooked to 145°F for 15 seconds?",
    options: ["Baked fish", "Ground beef", "Roast poultry", "Stuffed pasta"],
    correct: 0,
    hint: "145°F is for whole cuts of meat and seafood — not ground or stuffed items.",
    explanation: "Baked fish is safe at 145°F for 15 seconds. Ground beef requires 155°F, poultry requires 165°F, and stuffed items require 165°F. The 145°F standard applies to fish, whole steaks, pork chops, and seafood.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: true
  },
  {
    id: 331,
    question: "A backflow prevention device added directly to the water line is called a:",
    options: ["Cross-connection hose", "Air gap", "Vacuum breaker", "Carbonator"],
    correct: 2,
    hint: "This is a physical device installed on the water line, not a structural gap.",
    explanation: "A vacuum breaker is a backflow prevention device that is added to the water line. An air gap is a structural separation (not a device) between the drain and the water supply, typically found on three-compartment sinks.",
    category: "Facilities & Operations",
    chapter: 11,
    examFocus: true
  },
  {
    id: 332,
    question: "When wastewater backs up into the kitchen, who should be contacted after the regulatory authority suspends the permit?",
    options: ["Department of Agriculture", "Operations manager", "A licensed plumber", "Water and sewer department"],
    correct: 2,
    hint: "A certified professional is needed to fix the plumbing issue before the operation can reopen.",
    explanation: "After the regulatory authority suspends the permit, a licensed (certified) plumber must be contacted to fix the wastewater backup. The plumber must sign off on the repair, and the regulatory authority must reinspect before the operation can reopen.",
    category: "Facilities & Operations",
    chapter: 11,
    examFocus: true
  },
  {
    id: 333,
    question: "Outside garbage containers must be:",
    options: ["Leak-proof and placed on cement", "Sealed with a tight-fitting lid", "Free of recyclables", "Made of lightweight plastic"],
    correct: 1,
    hint: "Think about what prevents pests from getting into outdoor waste.",
    explanation: "Outside garbage containers must be sealed with a tight-fitting lid to prevent pest access, odor release, and contamination. Loose plastic flaps are not acceptable as lids for outdoor garbage containers.",
    category: "Facilities & Operations",
    chapter: 11,
    examFocus: true
  },
  {
    id: 334,
    question: "A seafood operation harvests fresh oysters from the local river each morning for customers. Is this practice legal?",
    options: ["Yes, because the owner harvests them personally", "Yes, because the oysters are local", "No, because oysters must come from an approved, licensed supplier", "No, because oysters cannot be served raw"],
    correct: 2,
    hint: "Think about the requirement for all food to come from approved sources.",
    explanation: "Oysters must come from an approved, licensed supplier regardless of proximity. Harvesting and selling without proper licensing violates food safety regulations. All shellfish must be traceable through proper documentation.",
    category: "Food Safety Basics",
    chapter: 6,
    examFocus: true
  },
  {
    id: 335,
    question: "Chemicals that can only be applied by licensed pest control operators (PCOs) are considered:",
    options: ["Food safe chemicals", "Restricted-use chemicals", "Limited-use chemicals", "Illegal chemicals"],
    correct: 1,
    hint: "These chemicals require special licensing due to their potential danger.",
    explanation: "Chemicals that can only be applied by licensed PCOs are classified as restricted-use chemicals. They are restricted because of health and safety concerns and require specialized training and certification to apply.",
    category: "Facilities & Operations",
    chapter: 13,
    examFocus: true
  },
  {
    id: 336,
    question: "A preschool cafeteria manager should protect young children's health by serving:",
    options: ["Rare hamburgers", "Sunny-side-up eggs", "Regular scrambled eggs", "Pasteurized eggs"],
    correct: 3,
    hint: "Young children are a high-risk population — think about the safest egg option.",
    explanation: "Pasteurized eggs are the safest choice for preschool children, who are a susceptible population. Rare burgers and sunny-side-up eggs are undercooked and pose a foodborne illness risk. Pasteurized eggs eliminate the Salmonella risk.",
    category: "Food Safety Basics",
    chapter: 1,
    examFocus: true
  },
  {
    id: 337,
    question: "Sesame is classified as which of the following?",
    options: ["A TCS food", "A major food allergen", "A biological contaminant", "A restricted ingredient"],
    correct: 1,
    hint: "Think about the list of top allergens that must be disclosed to customers.",
    explanation: "Sesame is one of the major food allergens (part of the top allergens list). Food operations must disclose sesame as an ingredient to customers, and food handlers must take precautions to prevent cross-contact.",
    category: "Food Safety Basics",
    chapter: 1,
    examFocus: true
  },
  {
    id: 338,
    question: "What is the difference between cleaning and sanitizing?",
    options: ["They are the same process", "Cleaning removes dirt with soap and water; sanitizing reduces pathogens with chemicals or heat", "Cleaning uses bleach; sanitizing uses soap", "Sanitizing always comes before cleaning"],
    correct: 1,
    hint: "These are two distinct steps in the cleaning process — one removes visible debris, the other targets invisible threats.",
    explanation: "Cleaning is the physical removal of dirt and food residue using soap and water. Sanitizing is a separate process that reduces pathogens to safe levels using chemicals (like bleach) or heat. Both steps are required — cleaning first, then sanitizing.",
    category: "Sanitation & Hygiene",
    chapter: 12,
    examFocus: true
  },
  {
    id: 339,
    question: "Food handlers should keep their hands and exposed portions of their arms:",
    options: ["Covered with long sleeves at all times", "Clean and jewelry-free (only a plain band ring allowed)", "Wrapped in plastic wrap", "Moisturized with lotion before handling food"],
    correct: 1,
    hint: "Think about what jewelry policy applies and the basic hygiene expectation.",
    explanation: "Food handlers must keep their hands and exposed arm portions clean and jewelry-free. The only jewelry allowed is a plain band ring. This reduces the risk of physical contamination and bacterial transfer.",
    category: "Sanitation & Hygiene",
    chapter: 3,
    examFocus: true
  },
  {
    id: 340,
    question: "An off-site caterer serving food without temperature controls must ensure the food is served within:",
    options: ["2 hours", "4 hours", "6 hours", "8 hours"],
    correct: 1,
    hint: "This is the same time limit as the general rule for food without temperature control.",
    explanation: "When serving food without temperature controls, the food must be served and consumed within 4 hours. After 4 hours, any remaining food must be discarded regardless of its starting temperature.",
    category: "Temperature Control",
    chapter: 9,
    examFocus: true
  },
  {
    id: 341,
    question: "When a critical control point (CCP) is not met, the food handler must first:",
    options: ["Throw out the food immediately", "Take corrective action", "Fire the responsible employee", "Speak to the manager"],
    correct: 1,
    hint: "Think about the HACCP principle that addresses what to do when standards aren't met.",
    explanation: "When a CCP is not met, the food handler must first take corrective action. For example, if chicken hasn't reached the proper internal temperature, it must be reheated. The goal is to bring the food back into compliance.",
    category: "Food Safety Basics",
    chapter: 10,
    examFocus: true
  },
  {
    id: 342,
    question: "Pork sausage is safe to eat if cooked to a minimum internal temperature of:",
    options: ["135°F for 15 seconds", "145°F for 15 seconds", "155°F for 15 seconds", "165°F for 15 seconds"],
    correct: 1,
    hint: "Sausage that is a whole muscle product (not ground) follows the same rule as pork chops.",
    explanation: "Pork sausage is safe at 145°F for 15 seconds minimum internal temperature. This is the standard for whole-muscle pork products. Ground pork would require 155°F.",
    category: "Temperature Control",
    chapter: 8,
    examFocus: true
  }

];

// Note: categories and chapters are derived from questionsDB in questions.js
