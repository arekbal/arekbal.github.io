var input = document.getElementById('input');
var output = document.getElementById('output');
var mode = document.getElementById('mode');
var ns = document.getElementById('ns');
var parser = new Gherkin.Parser();
parser.stopAtFirstError = false;

function generate_code(ast)
{
  var result = JSON.stringify(ast, null, 2);
  
  var usingsText = "using GherkinSpec.Core;\n"
 
  if(mode.value == "MsTest")
    usingsText += 
    "using GherkinSpec.MsTest;\n" + 
    "using Microsoft.VisualStudio.TestTools.UnitTesting;\n\n"
        
  var namespaceBeginText = "namespace " + ns.value + "\n" +
    "{\n"
    
  var namespaceEndText = "}"

  return usingsText + namespaceBeginText + namespaceEndText
}

function parse() {
  var result;
  try {
    var ast = parser.parse(input.value);
    result = generate_code(ast)
  } catch (e) {
    result = e.stack;
  }
  output.innerHTML = result;
}

var timeoutHandle = 0

input.onkeyup = function () {
  clearTimeout(timeoutHandle)
  timeoutHandle = setTimeout(parse, 250)
};

parse();