function formatPermissionError(method: string, name: string): string {
  return `You do not have permission to ${method} ${name.split('?')[0]}`;
}

export default formatPermissionError;
