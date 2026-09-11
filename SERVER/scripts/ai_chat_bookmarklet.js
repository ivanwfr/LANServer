javascript:(js_tracker = function() { /* ai_chat_bookmarklet.js _TAG (260908:01h:16) */ /* eslint-disable-line no-unused-labels */ /* eslint-disable-line no-labels */ /* eslint-disable-line no-undef */
/* 1. "CONTEXT DEFINITION" {{{*/
const CONTEXT = `## Rules\n
1. **Mental Tracker State** (Hybrid):\n
   - **TASKS:**         One row per task. Append new rows (ID: \`T1\`, \`T2\`...). Update existing rows only if ID matches.\n
   - **Empty State:**   The \`—\` row is a **placeholder**. It is **not** a task. Ignore it when counting tasks.\n
   - **LOGS:**          Append a new row after every substantive turn. Never overwrite tasks.\n
2. **Log Entry Format:**\n
   - Format:            \`[L#]\` | \`Sender\` | \`Topic\` | \`Notes\`.\n
   - Sender:            \`You\` or \`AI\`.\n
   - Topic:             1-3 keywords (e.g., "rules", "tracker").\n
   - Notes:             1-3 keywords describing the summary (e.g., "accepted", "markdown").\n
   - **Status:**        Always \`—\` for logs.\n
3. **Commands:**\n
   - \`"Show tasks"\`     ⇒ Show **TASK table only**.\n
   - \`"Show logs"\`      ⇒ Show **LOG table only**.\n
   - \`"Show tracker"\`   ⇒ Show **BOTH tables**.\n
   - \`"Verbosity"\`      ⇒ Set both party levels (see table).\n
4. **Anchor Mode:**     End each reply with the last LOG row and a compact state line for **Task Status** changes only (e.g., \`[T1:D]\`).\n
5. **Status Keywords:** \`Done ✅\` / \`WIP 🔵\` / \`Pending ⚪\`.\n
\n
## Task tracker\n
| ID | @Tag | Pri | Status | Notes |\n
|----|------|-----|--------|-------|\n
| —  | —    | —   | —      | —     |\n
\n
## Exchange log\n
| # | Sender | Topic | Notes | Status |\n
|---|--------|-------|-------|--------|\n
| — | —      | —     | —     | —      |\n
\n
## Emoji legend\n
| Marker | Meaning        |\n
|--------|----------------|\n
| ⚪     | Pending        |\n
| 🔵     | WIP            |\n
| ✅     | Done           |\n
| 🔴     | Pri - High     |\n
| 🟡     | Pri - Med      |\n
| 🟢     | Pri - Low      |\n
\n
## Party Default Verbosity\n
| Party | Level |\n
|-------|-------|\n
| AI    | 1     |\n
| You   | 1     |\n
\n
## Tracker — verbosity\n
| Verbosity  | Level |\n
|------------|-------|\n
| Terse      | 1     |\n
| Gotchas    | 2     |\n
| Explain    | 3     |\n
| NiceToHave | 4     |\n
\n
> Note to self — https://github.github.com/gfm · session-scoped, re-seed per chat\n
\n
Starting at verbosity 1`;
/*}}}*/
let onload = function()
{
    /* 2. CHECK-SET BOOKMRAKLET CALL MARKER {{{*/
    window      .__ai_chat_injected
        = window.__ai_chat_injected || false;
    if(window   .__ai_chat_injected) { if( !confirm("⚠️ Already Injected\n\n…paste again ❓") ) return; } /* eslint-disable-line no-alert */
    window      .__ai_chat_injected  = true;

    /*}}}*/
    /* 3. LOCATE TEXTAREA {{{*/
    let ta = document.querySelector("textarea");
    if(!ta ) {
        alert("⚠️ textarea not found"); /* eslint-disable-line no-alert */
    }
    /*}}}*/
    /* 4. CHECK TEXTAREA "CHAT" PASS-PHRASE {{{*/
    if( !ta.value.toLowerCase().includes("chat") )
    {
        alert("⚠️ textarea found\n\n…but the 'chat' pass-phrase is missing"); /* eslint-disable-line no-alert */

        return;
    }
    /*}}}*/
    /* 5. SESSION CONTEXT FEED INTO CHAT INPUT {{{ */
    /* Call native setter + input event so the app state updates */
    Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")
        .set.call(ta, CONTEXT);

    ta.dispatchEvent(new Event("input", { bubbles: true }));
    /*}}}*/
    /* 6. ADJUST TEXTAREA LAYOUT {{{*/
    ta.style.display   = "block";
    ta.style.resize    = "both";

    ta.focus();
    /*}}}*/
};
return { onload };
});
js_tracker().onload(); /* eslint-disable-line no-undef */
