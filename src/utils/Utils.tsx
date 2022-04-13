export function reformatString(formatString: string, values: string[]){
  
  return formatString.replace(/{([0-9]+)}/g, function (match, index) {
    // check if the argument is present
    return typeof values[index] == "undefined" ? match : values[index];
  });

}
