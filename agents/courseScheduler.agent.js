import { getEmbedding } from "../services/jina.js";
import { groqClient } from "../services/groq.js";
import { searchInQdrant } from "../services/qdrant.js";

export async function handleCourseScheduleQuery(message) {
  // 1. Logic for Schedule Generation / Conflict Check
  // Extract course codes from message (e.g., "CMPE 202", "CMPE 272")
  const courseCodes = [...new Set(message.match(/CMPE\s?\d{3}[A-Z]?/gi) || [])].map(c => c.replace(/\s+/g, ' ').toUpperCase());

  if (courseCodes.length > 1) {
    // If multiple courses are mentioned, strictly fetch their schedules
    console.log(`Detected courses for scheduling: ${courseCodes.join(", ")}`);
    
    let allSections = [];
    for (const code of courseCodes) {
        // Embed the code to search, but filter specifically for the code property if possible. 
        // Since our vector search is approximate, we'll search for the code and filter by exact payload match if "code" field exists.
        // Based on seed, "code" is in payload.
        const vector = await getEmbedding(`course schedule for ${code}`);
        const filter = {
            must: [
                {
                    key: "code",
                    match: { value: code }
                }
            ]
        };
        // Fetch up to 10 sections per course
        const results = await searchInQdrant("CourseSchedule", vector, filter, 10);
        allSections = allSections.concat(results.map(r => r.payload));
    }

    if (allSections.length > 0) {
        // If user asks to "generate" or "schedule" or "plan", try to build a schedule
        const isGenerationRequest = /generate|create|make|plan|schedule/i.test(message);
        
        if (isGenerationRequest) {
            // GENERATE SCHEDULES (e.g., pick 3 courses)
            // Default to matching ALL courses if not specified, but check for "take X courses"
            const matchLimit = message.match(/take (\d+) courses/i);
            const numCoursesToPick = matchLimit ? parseInt(matchLimit[1]) : courseCodes.length;

            const validSchedules = generateSchedules(allSections, courseCodes, numCoursesToPick);
            
            const scheduleContext = validSchedules.length > 0 
                ? `Here are ${validSchedules.length} valid schedule options:\n` + validSchedules.slice(0, 3).map((s, i) => 
                    `Option ${i+1}:\n${s.map(sec => `- ${sec.code} (Sec ${sec.section}): ${sec.days.join("/")} ${sec.time} (${sec.instructor})`).join("\n")}`
                  ).join("\n\n")
                : "No valid non-conflicting schedules found for the selected combination.";

            // Pass this pre-calculated info to LLM
             return await generateLLMResponse(message, scheduleContext);
        } else {
             // JUST CHECK CONFLICTS
             const conflicts = checkAllConflicts(allSections);
             const context = allSections.map(sec => `- ${sec.code} (Sec ${sec.section}): ${sec.days.join("/")} ${sec.time}`).join("\n");
             
             let conflictMsg = "No obvious conflicts found among all available sections.";
             if(conflicts.length > 0) {
                 conflictMsg = "⚠️ POTENTIAL CONFLICTS DETECTED:\n" + conflicts.join("\n");
             }
             
             return await generateLLMResponse(message, `Available Sections:\n${context}\n\nAnalysis:\n${conflictMsg}`);
        }
    }
  }

  // 2. Default Single Course / General Query Logic
  const vector = await getEmbedding(message);
  const results = await searchInQdrant("CourseSchedule", vector);

  const context = results
    .map((r) => `[${r.payload.term}] ${r.payload.code} Section ${r.payload.section}: ${r.payload.days.join("/")} ${r.payload.time} at ${r.payload.location}, Instructor: ${r.payload.instructor}`)
    .join("\n\n");

  return await generateLLMResponse(message, context);
}

// --- Helper Functions ---

async function generateLLMResponse(message, context) {
    const prompt = `
You are a helpful academic scheduling assistant named "courseScheduler".

Rules:
- You have access to class schedules and conflict analysis.
- If provided with specific schedule options or valid combinations, present them clearly to the user.
- If conflicts are detected, warn the user.
- Use the provided knowledge base/analysis to answer.

Knowledge Base / Analysis:
${context}

User Query: ${message}
`.trim();

  const response = await groqClient.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.3,
    max_tokens: 1000,
    stream: false,
  });

  return {
    answer: response.choices[0].message.content,
    from_knowledge_base: true,
    source: "courseScheduler",
  };
}


function parseTime(timeStr) {
    if(!timeStr || timeStr === "TBD") return null;
    const [start, end] = timeStr.split("-");
    const parse = (t) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
    };
    return { start: parse(start), end: parse(end) };
}

function hasTimeConflict(secA, secB) {
    // Check days overlap
    const commonDays = secA.days.filter(d => secB.days.includes(d));
    if (commonDays.length === 0) return false;
    
    // Check time overlap
    const timeA = parseTime(secA.time);
    const timeB = parseTime(secB.time);
    if (!timeA || !timeB) return false; // TBD or online async

    return Math.max(timeA.start, timeB.start) < Math.min(timeA.end, timeB.end);
}

function checkAllConflicts(sections) {
    const conflicts = [];
    for (let i = 0; i < sections.length; i++) {
        for (let j = i + 1; j < sections.length; j++) {
            if (sections[i].code !== sections[j].code && hasTimeConflict(sections[i], sections[j])) {
                conflicts.push(`Conflict between ${sections[i].code} (${sections[i].time}) and ${sections[j].code} (${sections[j].time}) on ${sections[i].days.filter(d => sections[j].days.includes(d)).join("/")}`);
            }
        }
    }
    return conflicts;
}

function generateSchedules(allSections, courseCodes, k) {
    // Group sections by course code
    const sectionsByCourse = {};
    courseCodes.forEach(code => {
        sectionsByCourse[code] = allSections.filter(s => s.code === code);
    });

    // We need to pick k distinct courses out of courseCodes.length
    // Then for each picked course, pick one section.
    // Simplifying assumption: User wants to take 'k' courses from the provided list. 
    // We will find all combinations of 'k' courses, and for each combo, find valid section permutations.

    const validSchedules = [];
    
    // Get all combinations of k courses
    const courseCombinations = getCombinations(courseCodes, k);
    
    for (const combo of courseCombinations) {
        // For this set of courses, generate section permutations
        // sectionsMap: { "CMPE 202": [sec1, sec2], "CMPE 272": [secA] }
        const courseSectionLists = combo.map(code => sectionsByCourse[code]);
        if (courseSectionLists.some(list => !list || list.length === 0)) continue; // Missing sections for a course

        const permutations = cartesianProduct(courseSectionLists);
        
        for (const perm of permutations) {
            if (!hasAnyConflict(perm)) {
                validSchedules.push(perm);
            }
        }
    }
    
    return validSchedules;
}

function hasAnyConflict(schedule) {
    for (let i = 0; i < schedule.length; i++) {
        for (let j = i + 1; j < schedule.length; j++) {
            if (hasTimeConflict(schedule[i], schedule[j])) return true;
        }
    }
    return false;
}

function getCombinations(arr, k) {
    if (k === 0) return [[]];
    if (arr.length === 0) return [];
    const [first, ...rest] = arr;
    const withFirst = getCombinations(rest, k - 1).map(c => [first, ...c]);
    const withoutFirst = getCombinations(rest, k);
    return [...withFirst, ...withoutFirst];
}

function cartesianProduct(arrays) {
    return arrays.reduce((acc, curr) => 
        acc.flatMap(a => curr.map(b => [a, b].flat())), [[]]);
}
