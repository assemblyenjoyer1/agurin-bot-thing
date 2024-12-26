function camelCaseToTitleCase(text: string) {
  return text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

export default camelCaseToTitleCase;
