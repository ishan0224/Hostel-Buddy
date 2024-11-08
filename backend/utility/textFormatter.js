export const formatGeminiResponse = (content) => {
    if (!content) return '';

    return content
        .replace(/^##\s*(.*)$/gm, '<strong>$1</strong><br>')    // Titles and subtitles in bold, followed by line break
        .replace(/^\*\s+(.*)$/gm, '• $1<br>')                   // Replace bullet points with `•`
        .replace(/\n/g, '<br>')                                 // Replace all line breaks with `<br>` for HTML
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')       // Replace `**text**` with `<strong>`
        .replace(/\*(.*?)\*/g, '<i>$1</i>');                    // Replace `*text*` with `<i>`
};
