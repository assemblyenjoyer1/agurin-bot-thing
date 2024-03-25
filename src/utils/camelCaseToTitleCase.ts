function camelCaseToTitleCase(text: string) {
    return text
        // Insert a space before all caps
        .replace(/([A-Z])/g, ' $1')
        // Uppercase the first character of each word
        .replace(/^./, str => str.toUpperCase());
}

export default camelCaseToTitleCase;