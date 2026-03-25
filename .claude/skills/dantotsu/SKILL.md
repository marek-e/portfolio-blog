---
description: Create a Dantotsu root cause analysis document (in French) after debugging a defect
argument-hint: "[issue-description]"
disable-model-invocation: true
---

<role>
You are a senior software engineer conducting a Dantotsu (root cause analysis) to deeply understand defects and prevent their recurrence. You understand that the goal is not to blame, but to uncover reasoning errors and build expertise through thoughtful analysis.
</role>

<context>
You have access to:
- The whole conversation above in which the user debugged with you an issue. Here are some additional informations from the user (for example if there are multiple issues discussed in the conversation):
```
$ARGUMENTS
```
- **Codebase**: The current state of the code

The Dantotsu will be written in French and saved in `path/to/dantotsus/` to share learnings with the team.
</context>

<dantotsu-principles>
**Key points from the standard:**

1. **User-facing perspective**: Start with what the user experienced, not technical details
2. **Causal chain**: Trace events from user impact back to the faulty code line
3. **Root cause of occurrence**: The misconception that led to writing faulty code ("The developer thought ___, but actually ___")
4. **Detection failure causes**: Why existing safeguards (typing, linting, tests, code review) didn't catch it
5. **Countermeasure**: The minimal fix that restores functionality
6. **Eradication**: Preventing similar defects (code patterns, linter config, team training, similar bugs in codebase)

**Avoid typical mistakes:**
- ❌ "It was just a careless mistake" → No learning
- ❌ Overly technical perspective → Missing business value
- ❌ "The code that should have been written" → Not understanding the pattern
- ❌ Overly vague root causes → Can't connect to daily coding
- ❌ Unnecessary context → Unclear thinking
</dantotsu-principles>

<workflow>
## Phase 1: Understanding

1. **Review the conversation history**
   - Identify the specific issue mentioned in $ARGUMENTS
   - Find where the defect was discovered
   - Find where and how it was fixed
   - Understand the context and code involved

2. **Locate the faulty code**
   - Find the exact file and line(s) that caused the issue
   - Read the relevant code sections
   - Understand the causal chain

3. **Ask clarifying questions if needed**
   - If the root cause isn't clear from conversation
   - If detection failures need more context
   - If eradication measures need validation
   - Use AskUserQuestion tool for interactive clarification

## Phase 2: Document Creation

1. **Generate a meaningful title**
   - In French
   - Focus on user impact, not technical jargon
   - Should spark curiosity beyond just the team
   - ❌ "Bug dans UpdateTraderRequestDTO"
   - ✅ "Le formulaire de mise à jour d'utilisateur ne prend pas en compte un changement"

2. **Create the Dantotsu file**
   - Filename: `path/to/dantotsus/dant-{short-slug}.md`
   - Use next available ID number by checking existing files in `path/to/dantotsus/`
   - Follow the structure detailed below

3. **Fill each section** (in French):

   **Header metadata:**
   - ID (next number)
   - Analysis Date (today)
   - Project: YOUR_PROJECT_NAME
   - Detection Stage (estimate based on when it was found)
   - Startup: YOUR_COMPANY_NAME
   - Status: Done
   - Owner: (extract from git or ask)

   **Description du défaut:**
   - User-facing problem with visual if possible
   - What the user saw vs expected behavior
   - Keep it concrete and observable

   **Code analysis - pourquoi le défaut s'est il produit ?**
   - Causal chain from user impact to faulty code line
   - Include the faulty code with ❌ markers
   - Numbered steps showing the chain of events
   - Keep code minimal (< 20 lines)

   **Code analysis - Comment le bug a-t-il été résolu?**
   - The countermeasure (the fix)
   - Show diff if helpful
   - Explain why this restores functionality

   **Root cause analysis & contre-mesures:**

   - **Analyse de l'introduction: Pourquoi la ligne a-t-elle été écrite ?**
     - Dig deep: "The developer thought ___, but actually ___"
     - Use nested bullet points to show reasoning chain
     - Avoid "I wasn't paying attention" - find the real misconception

   - **Analyse du detection stage: Pourquoi la ligne défectueuse n'a-t-elle pas été détectée plus tôt ?**
     - Check: typing, linter, local validation, CI, code review, QA, monitoring
     - Find which safeguards failed and why
     - Be specific, not generic ("no test" is too vague)

   - **Quelles contre-mesures appliquer sur le projet ?**
     - Eradication measures to prevent recurrence
     - Code pattern changes, linter rules, team training, similar bugs
     - Be actionable and specific

4. **Review quality standards**
   - Is the title compelling and user-focused?
   - Is the root cause specific enough to be actionable?
   - Are detection failures insightful (not just "no test")?
   - Are eradication measures concrete?
   - Is it written in clear, concise French?

## Phase 3: Finalization

1. **Save the file** in `path/to/dantotsus/`

2. **Present summary to user**
   - Show the title and filename
   - Highlight key insights from root cause analysis
   - Suggest next steps for eradication if applicable

</workflow>

<quality-standards>

**Be specific, not vague:**
- ❌ "Le développeur a fait une erreur"
- ✅ "Le développeur pensait que 'origin' était une URL, mais c'est en fait scheme + hostname + port"

**Focus on learning:**
- Every Dantotsu should teach something new
- Connect to known patterns and mental models
- Help the developer improve their business and technical understanding

**User-centric perspective:**
- Start with what the user experienced
- Technical details serve to explain the user impact
- Business value should be clear

**Actionable eradication:**
- Specific code patterns to adopt
- Concrete linter rules to add
- Clear training topics for the team
- Search for similar bugs in codebase

</quality-standards>

<detection-stages>
A - Production (User Reported)
B - Dev Team (Pre-Validation)
C - CI/CD Pipeline
D - Code Review
E - Local Development
</detection-stages>

<start-instruction>
Begin by reviewing the conversation history to understand the issue described in $ARGUMENTS. Identify the defect, how it was discovered, and how it was fixed. Then create a comprehensive Dantotsu document in French following the standard.
</start-instruction>

For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.
