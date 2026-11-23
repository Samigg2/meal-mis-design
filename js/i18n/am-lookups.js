/*
 * Amharic for dropdown values and place names — copied as it is from
 * meal-mis-frontend/src/locales/am-lookups.ts (AM_LOOKUPS, AM_PLACES).
 * label(category, code) and t(place) use these when the language is Amharic.
 */
(function (App) {
  const AM_LOOKUPS = {
  "participants.education_level": {
    "unable_to_read_write": "ማንበብና መጻፍ የማይችል/የማትችል",
    "primary": "የመጀመሪያ ደረጃ",
    "secondary": "ሁለተኛ ደረጃ",
    "tvet": "ቴክኒክና ሙያ (TVET)",
    "university": "ኮሌጅ ወይም ዩኒቨርሲቲ"
  },
  "participants.marital_status": {
    "single": "ያላገባ/ች",
    "married": "ያገባ/ች",
    "divorced": "የተፋታ/ች",
    "separated": "ተለያይቶ/ታ የሚኖር/የምትኖር",
    "widowed": "የትዳር አጋሩን/ሯን በሞት ያጣ/ች"
  },
  "participants.disability_type": {
    "physical": "የአካል",
    "visual": "የማየት",
    "hearing": "የመስማት",
    "intellectual": "የአእምሮ",
    "other": "ሌላ"
  },
  "participants.field_of_study": {
    "agronomy": "አግሮኖሚ / የእፅዋት ሳይንስ",
    "animal_science": "የእንስሳት ሳይንስ",
    "agricultural_economics": "የግብርና ኢኮኖሚክስ",
    "natural_resources": "የተፈጥሮ ሀብት አስተዳደር",
    "accounting": "አካውንቲንግ / ፋይናንስ",
    "management": "ማኔጅመንት / ቢዝነስ",
    "ict": "አይሲቲ (ICT)",
    "construction": "ኮንስትራክሽን / ምህንድስና",
    "health": "ጤና",
    "education": "መምህርነት / ትምህርት",
    "other": "ሌላ"
  },
  "participants.priority_sector": {
    "poultry": "የዶሮ እርባታ",
    "sheep_goat_fattening": "በግ/ፍየል ማድለብ",
    "dairy": "የወተት ልማት",
    "horticulture": "አትክልትና ፍራፍሬ"
  },
  "participants.residence_type": {
    "rural": "ገጠር",
    "peri_urban": "ከፊል ከተማ",
    "urban": "ከተማ"
  },
  "participants.agri_experience": {
    "additional": "ተጨማሪ",
    "improved": "የተሻሻለ",
    "new": "አዲስ",
    "re_entry": "እንደገና የገባ/ች"
  },
  "enterprise.sector": {
    "agriculture": "ግብርና",
    "trade": "ንግድ",
    "service": "አገልግሎት",
    "manufacturing": "ማኑፋክቸሪንግ",
    "technology": "ቴክኖሎጂ",
    "other": "ሌላ"
  },
  "enterprise.agrifood_sector": {
    "agriculture": "ግብርና"
  },
  "enterprise_performance.data_source": {
    "field_visit": "የመስክ ጉብኝት",
    "phone_follow_up": "የስልክ ክትትል",
    "business_records": "የንግድ መዝገቦች",
    "survey": "ጥናት (ሰርቬይ)",
    "other": "ሌላ"
  },
  "enterprises.certificate_kind": {
    "acknowledgement_certificate": "የእውቅና ሰርተፍኬት",
    "business_licence": "የንግድ ፈቃድ"
  },
  "enterprises.contact_role": {
    "chair_person": "ሰብሳቢ",
    "secretary": "ፀሐፊ",
    "cashier": "ገንዘብ ያዥ",
    "member": "አባል"
  },
  "enterprises.employment_profile": {
    "re_entry": "እንደገና የገባ",
    "additional": "ተጨማሪ",
    "improved": "የተሻሻለ"
  },
  "enterprises.enterprise_size": {
    "micro": "ጥቃቅን (እስከ 5 አባላት፣ ካፒታል ከ50,000 ብር በታች)",
    "medium": "መካከለኛ (6-10 አባላት፣ ካፒታል ከ50,000 እስከ 100,000 ብር በታች)",
    "small": "አነስተኛ (11-30 አባላት፣ ካፒታል 100,000-500,000 ብር)",
    "large": "ከፍተኛ (ከ30 በላይ አባላት፣ ካፒታል ከ500,000 ብር በላይ)"
  },
  "enterprises.existing_business_type": {
    "poultry": "የዶሮ እርባታ",
    "dairy": "የወተት ልማት",
    "fattening": "ማድለብ",
    "horticulture": "አትክልትና ፍራፍሬ",
    "na": "የለም"
  },
  "enterprises.formation": {
    "own_resource": "በራስ ሀብት",
    "loan_access": "በብድር",
    "family_support": "በቤተሰብ ድጋፍ",
    "other": "ሌላ"
  },
  "enterprises.ownership_type": {
    "family": "የቤተሰብ",
    "hybrid": "ቅይጥ",
    "other": "ሌላ"
  },
  "enterprises.premises": {
    "own": "የራስ",
    "rental": "ኪራይ",
    "government_support": "የመንግሥት ድጋፍ",
    "other": "ሌላ"
  },
  "enterprises.rayee_pathway": {
    "pathway_1": "መስመር 1",
    "pathway_2": "መስመር 2 (A እና B)",
    "pathway_3": "መስመር 3"
  },
  "enterprises.registration_status": {
    "formal": "መደበኛ",
    "semi_formal": "ከፊል መደበኛ",
    "informal": "መደበኛ ያልሆነ"
  },
  "enterprises.sub_business_types": {
    "avocado_collection_supply": "አቮካዶ ማሰባሰብና ማቅረብ",
    "broiler_production": "የሥጋ ዶሮ ማምረት",
    "cabbage_production": "ጎመን ማምረት",
    "cattle_fattening": "ከብት ማድለብ",
    "day_old_chicks": "የአንድ ቀን ጫጩቶች",
    "egg_production": "እንቁላል ማምረት",
    "egg_retail": "እንቁላል ችርቻሮ",
    "egg_aggregation": "እንቁላል ማሰባሰብ",
    "enset_collection": "እንሰት ማሰባሰብ",
    "enset_processing": "እንሰት ማቀነባበር",
    "garlic_production": "ነጭ ሽንኩርት ማምረት",
    "juice_house": "ጭማቂ ቤት",
    "milk_aggregation": "ወተት ማሰባሰብ",
    "milk_processing": "ወተት ማቀነባበር",
    "milk_production": "ወተት ማምረት",
    "nursery_fruit_seedling": "የችግኝ ጣቢያ – የፍራፍሬ ችግኝ ማፍላት",
    "nursery_vegetable_seedling": "የችግኝ ጣቢያ – የአትክልት ችግኝ ማፍላት",
    "onion_production": "ቀይ ሽንኩርት ማምረት",
    "pepper_production": "በርበሬ ማምረት",
    "retail_micro_business": "ችርቻሮ/ጥቃቅን ንግድ (የአትክልትና ፍራፍሬ ኪዮስክ)",
    "sheep_goat_fattening": "በግና ፍየል ማድለብ",
    "sheep_goat_rearing": "በግና ፍየል እርባታ",
    "small_spice_processing": "አነስተኛ የቅመማ ቅመም ማቀነባበር",
    "tomato_production": "ቲማቲም ማምረት",
    "vegetable_production": "አትክልት ማምረት (ሽንኩርት፣ ድንች፣ ነጭ ሽንኩርት፣ ካሮት፣ ጎመን)"
  },
  "enterprises.supported_by": {
    "rayee_ii": "RAYEE II",
    "other": "ሌላ"
  },
  "enterprises.value_chain": {
    "poultry": "የዶሮ እርባታ",
    "dairy": "የወተት ልማት",
    "sheep_goat_fattening": "በግ-ፍየል ማድለብ",
    "horticulture": "አትክልትና ፍራፍሬ"
  },
  "enterprises.value_chain_function": {
    "collection_aggregation": "ማሰባሰብ",
    "input_supply": "ግብዓት አቅርቦት",
    "processing": "ማቀነባበር",
    "production": "ምርት",
    "trading": "ንግድ (ግብይት – ችርቻሮ፣ ጅምላና ወደ ውጭ መላክ)",
    "transportation": "ትራንስፖርት"
  },
  "enterprises.yiw_pathway": {
    "primary": "የመጀመሪያ ደረጃ",
    "secondary": "ሁለተኛ ደረጃ",
    "tertiary": "ሦስተኛ ደረጃ"
  },
  "institutions.institution_type": {
    "government_office": "የመንግሥት መሥሪያ ቤት",
    "cooperative": "ኅብረት ሥራ ማኅበር",
    "financial_institution": "የፋይናንስ ተቋም",
    "training_provider": "የሥልጠና ተቋም",
    "cso": "የሲቪል ማኅበረሰብ ድርጅት",
    "ngo": "መንግሥታዊ ያልሆነ ድርጅት",
    "womens_association": "የሴቶች ማኅበር",
    "private_sector": "የግል ዘርፍ",
    "media": "ሚዲያ",
    "research_consultancy": "ጥናትና ምርምር / አማካሪ ድርጅት",
    "other": "ሌላ",
    "lead_firm": "መሪ ድርጅት (Lead firm)"
  }
};
  const AM_PLACES = {
  "Addis Ababa": "አዲስ አበባ",
  "Afar": "አፋር",
  "Amhara": "አማራ",
  "Benishangul-Gumuz": "ቤንሻንጉል ጉሙዝ",
  "Central Ethiopia": "ማዕከላዊ ኢትዮጵያ",
  "Dire Dawa": "ድሬዳዋ",
  "Gambella": "ጋምቤላ",
  "Harari": "ሐረሪ",
  "Oromia": "ኦሮሚያ",
  "Sidama": "ሲዳማ",
  "Somali": "ሶማሌ",
  "South Ethiopia": "ደቡብ ኢትዮጵያ",
  "South West Ethiopia": "ደቡብ ምዕራብ ኢትዮጵያ",
  "Tigray": "ትግራይ",
  "Addis Ketema": "አዲስ ከተማ",
  "Afder": "አፍዴር",
  "Akaky Kaliti": "አቃቂ ቃሊቲ",
  "Anuak": "አኙዋክ",
  "Arada": "አራዳ",
  "Arsi": "አርሲ",
  "Asosa": "አሶሳ",
  "Awi": "አዊ",
  "Bale": "ባሌ",
  "Bench Sheko": "ቤንች ሸኮ",
  "Bole": "ቦሌ",
  "Borena": "ቦረና",
  "Buno Bedele": "ቡኖ በደሌ",
  "Central Tigray": "ማዕከላዊ ትግራይ",
  "Dawro": "ዳውሮ",
  "Degehabur": "ደገሐቡር",
  "East Gojjam": "ምሥራቅ ጎጃም",
  "East Hararghe": "ምሥራቅ ሐረርጌ",
  "East Shewa": "ምሥራቅ ሸዋ",
  "East Tigray": "ምሥራቅ ትግራይ",
  "East Welega": "ምሥራቅ ወለጋ",
  "Fiq": "ፊቅ",
  "Gamo": "ጋሞ",
  "Gedeo": "ጌዴኦ",
  "Gode": "ጎዴ",
  "Gofa": "ጎፋ",
  "Guji": "ጉጂ",
  "Gullele": "ጉለሌ",
  "Horo Guduru Welega": "ሆሮ ጉዱሩ ወለጋ",
  "Illubabor": "ኢሉባቦር",
  "Itang": "ኢታንግ",
  "Jijiga": "ጅጅጋ",
  "Jimma": "ጅማ",
  "Kamashi": "ካማሺ",
  "Keffa": "ከፋ",
  "Kelam Welega": "ቄለም ወለጋ",
  "Kirkos": "ቂርቆስ",
  "Kolfe Keranio": "ኮልፌ ቀራኒዮ",
  "Korahe": "ቆራሄ",
  "Liben": "ሊበን",
  "Lideta": "ልደታ",
  "Metekel": "መተከል",
  "Mezhenger": "መዠንገር",
  "Nifas Silk-Lafto": "ንፋስ ስልክ ላፍቶ",
  "North Gondar": "ሰሜን ጎንደር",
  "North Shewa": "ሰሜን ሸዋ",
  "North West Tigray": "ሰሜን ምዕራብ ትግራይ",
  "North Wollo": "ሰሜን ወሎ",
  "Nuer": "ኑዌር",
  "Sheka": "ሸካ",
  "Shinile": "ሽንሌ",
  "South East Tigray": "ደቡብ ምሥራቅ ትግራይ",
  "South Gondar": "ደቡብ ጎንደር",
  "South Omo": "ደቡብ ኦሞ",
  "South Tigray": "ደቡብ ትግራይ",
  "South West Shewa": "ደቡብ ምዕራብ ሸዋ",
  "South Wollo": "ደቡብ ወሎ",
  "Wag Hemra": "ዋግ ኽምራ",
  "Wardder": "ዋርዴር",
  "West Arsi": "ምዕራብ አርሲ",
  "West Gojjam": "ምዕራብ ጎጃም",
  "West Guji": "ምዕራብ ጉጂ",
  "West Hararghe": "ምዕራብ ሐረርጌ",
  "West Omo": "ምዕራብ ኦሞ",
  "West Shewa": "ምዕራብ ሸዋ",
  "West Tigray": "ምዕራብ ትግራይ",
  "West Welega": "ምዕራብ ወለጋ",
  "Wolayita": "ወላይታ",
  "Yeka": "የካ",
  "Zone 1": "ዞን 1",
  "Zone 2": "ዞን 2",
  "Zone 3": "ዞን 3",
  "Zone 4": "ዞን 4",
  "Zone 5": "ዞን 5",
  "Adama": "አዳማ",
  "Alamata": "አላማጣ",
  "Arba Minch": "አርባ ምንጭ",
  "Bahir Dar": "ባሕር ዳር",
  "Chiro": "ጭሮ",
  "Dessie": "ደሴ",
  "Gondar": "ጎንደር",
  "Gondar Zuria": "ጎንደር ዙሪያ",
  "Harar": "ሐረር",
  "Hawassa": "ሀዋሳ",
  "Injibara": "እንጅባራ",
  "Mekelle": "መቀሌ",
  "Negele Borena": "ነገሌ ቦረና",
  "Robe": "ሮቤ",
  "Semera": "ሰመራ",
  "Shashemene": "ሻሸመኔ",
  "Shire": "ሽሬ",
  "Sodo": "ሶዶ"
};
  Object.assign(App, { AM_LOOKUPS, AM_PLACES });
})((window.App = window.App || {}));
